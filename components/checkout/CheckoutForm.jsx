import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { ShippingDetails, BillingDetails } from "./ShippingBillingForms";

import commerce from "../../lib/commerce";

import styles from "../../styles/CheckoutForm.module.css";
import toast from "react-hot-toast";

export default function CheckoutForm({
  checkoutTokenId,
  paymentIntentId,
  clientSecret,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [shippingAsBillingAddress, setShippingAsBillingAddress] =
    useState(true);

  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState("");
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [shippingSubdivision, setShippingSubdivision] = useState("");
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState("");

  const countries = Object.entries(shippingCountries).map(([code, name]) => ({
    id: code,
    label: name,
  }));
  const subdivisions = Object.entries(shippingSubdivisions).map(
    ([code, name]) => ({ id: code, label: name })
  );
  const options = shippingOptions.map((sO) => ({
    id: sO.id,
    label: `${sO.description} - (${sO.price.formatted_with_symbol})`,
  }));

  const fetchShippingCountry = async (checkoutId) => {
    const { countries } = await commerce.services.localeListShippingCountries(
      checkoutId
    );
    setShippingCountries(countries);
    setShippingCountry(Object.keys(countries)[0]);
  };

  const fetchSubdivision = async (countryCode) => {
    const { subdivisions } =
      await commerce.services.localeListShippingSubdivisions(
        checkoutTokenId,
        countryCode
      );
    setShippingSubdivisions(subdivisions);
    setShippingSubdivision(Object.keys(subdivisions)[0]);
  };

  const fetchShippingOptions = async (checkoutId, country, region = null) => {
    const options = await commerce.checkout.getShippingOptions(checkoutId, {
      country,
      region,
    });
    setShippingOptions(options);
    setShippingOption(options[0].id);
  };

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        fontFamily: "Arial, sans-serif",
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  useEffect(() => {
    fetchShippingCountry(checkoutTokenId);
  }, []);

  useEffect(() => {
    if (shippingCountry) fetchSubdivision(shippingCountry);
  }, [shippingCountry]);

  useEffect(() => {
    if (shippingSubdivision)
      fetchShippingOptions(
        checkoutTokenId,
        shippingCountry,
        shippingSubdivision
      );
  }, [shippingSubdivision]);

  useEffect(() => {
    if (!shippingOption) return;
    fetch("/api/stripe/update-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shippingOption, paymentIntentId }),
    });
  }, [shippingOption]);

  const handleShowBilling = () => {
    setShippingAsBillingAddress(!shippingAsBillingAddress);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    setProcessing(true);
    toast.loading("Payment Processing...");
    const card = elements.getElement(CardElement);
    const paymentMethodResponse = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
    const shipping = {
      name: e.target.shippingName.value,
      street: e.target.shippingLine1.value,
      street_2: e.target.shippingLine2.value
        ? e.target.shippingLine2.value
        : null,
      town_city: e.target.shippingCity.value,
      county_state: e.target.shippingState.value,
      postal_zip_code: e.target.shippingZip.value,
      country: e.target.shippingCountry.value,
    };
    let billing;
    if (shippingAsBillingAddress) {
      billing = { ...shipping, email: e.target.shippingEmail.value };
    } else {
      billing = {
        name: e.target.billingName.value,
        email: e.target.billingEmail.value,
        street: e.target.billingLine1.value,
        street_2: e.target.billingLine2.value
          ? e.target.billingLine2.value
          : null,
        town_city: e.target.billingCity.value,
        county_state: e.target.billingState.value,
        postal_zip_code: e.target.billingZip.value,
        country: e.target.billingCountry.value,
      };
    }

    if (paymentMethodResponse.error) {
      alert(paymentMethodResponse.error.message);
      toast.dismiss();
      return;
    }

    try {
      const order = await commerce.checkout.capture(checkoutTokenId, {
        customer: {
          email: e.target.shippingEmail.value,
        },
        shipping: shipping,
        billing: billing,
        fulfillment: {
          shipping_method: e.target.shippingOption.value,
        },
        payment: {
          gateway: "stripe",
          stripe: {
            payment_method_id: paymentMethodResponse.paymentMethod.id,
          },
        },
      });
      console.log("1");
      console.log(order);
      toast.dismiss();
      return;
    } catch (response) {
      if (
        response.statusCode !== 402 ||
        response.data.error.type !== "requires_verification"
      ) {
        console.log(response);
        toast.dismiss();
        return;
      }

      const cardActionResult = await stripe.handleCardAction(
        response.data.error.param
      );

      if (cardActionResult.error) {
        alert(cardActionResult.error.message);
        toast.dismiss();
        return;
      }

      try {
        const order = await commerce.checkout.capture(checkoutTokenId, {
          customer: {
            email: e.target.shippingEmail.value,
          },
          shipping: shipping,
          billing: billing,
          fulfillment: {
            shipping_method: e.target.shippingOption.value,
          },
          payment: {
            gateway: "stripe",
            stripe: {
              payment_intent_id: cardActionResult.paymentIntent.id,
            },
          },
        });
        console.log("2");
        console.log(order);
        toast.dismiss();
        return;
      } catch (response) {
        console.log(response);
        alert(response.message);
        toast.dismiss();
      }
    }
    setIsLoading(true);
    setIsLoading(false);
  };

  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit}>
        <ShippingDetails
          countries={countries}
          setShippingCountry={setShippingCountry}
          options={options}
          shippingCountry={shippingCountry}
          shippingSubdivision={shippingSubdivision}
          subdivisions={subdivisions}
        />
        <input type="checkbox" onChange={handleShowBilling} />
        {!shippingAsBillingAddress && <BillingDetails />}
        <CardElement id="card-element" options={cardStyle} />
        <button disabled={isLoading || !stripe || !elements} id="submit">
          <span id="button-text">
            {isLoading ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              "Pay now"
            )}
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
    </>
  );
}
