import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ShippingDetails, BillingDetails, ShippingMethod, ProgressView } from "./ShippingBillingForms";

import commerce from "../../lib/commerce";

import styles from "../../styles/CheckoutForm.module.css";
import toast from "react-hot-toast";

export default function CheckoutForm({ checkoutTokenId, paymentIntentId, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);

  const [shippingAsBillingAddress, setShippingAsBillingAddress] = useState(true);

  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState("");
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [shippingSubdivision, setShippingSubdivision] = useState("");
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState("");
  const [shippingOptionLabel, setShippingOptionLabel] = useState("");

  const [shippingEmail, setShippingEmail] = useState("");
  const [shippingFirstName, setShippingFirstName] = useState("");
  const [shippingLastName, setShippingLastName] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [shippingLine1, setShippingLine1] = useState("");
  const [shippingLine2, setShippingLine2] = useState("");

  const [billingEmail, setBillingEmail] = useState("");
  const [billingFirstName, setBillingFirstName] = useState();
  const [billingLastName, setBillingLastName] = useState("");
  const [billingCountry, setBillingCountry] = useState("");
  const [billingSubdivision, setBillingSubdivision] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingPostalCode, setBillingPostalCode] = useState("");
  const [billingLine1, setBillingLine1] = useState("");
  const [billingLine2, setBillingLine2] = useState("");

  const countries = Object.entries(shippingCountries).map(([code, name]) => ({
    id: code,
    label: name,
  }));
  const subdivisions = Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name }));
  const options = shippingOptions.map((sO) => ({
    id: sO.id,
    label: `${sO.description} - (${sO.price.formatted_with_symbol})`,
  }));

  const fetchShippingCountry = async (checkoutId) => {
    const { countries } = await commerce.services.localeListShippingCountries(checkoutId);
    setShippingCountries(countries);
    setShippingCountry(Object.keys(countries)[0]);
  };

  const fetchSubdivision = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListShippingSubdivisions(checkoutTokenId, countryCode);
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

  useEffect(() => {
    fetchShippingCountry(checkoutTokenId);
  }, []);

  useEffect(() => {
    if (shippingCountry) fetchSubdivision(shippingCountry);
  }, [shippingCountry]);

  useEffect(() => {
    if (shippingSubdivision) fetchShippingOptions(checkoutTokenId, shippingCountry, shippingSubdivision);
  }, [shippingSubdivision]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);
    toast.loading("Payment Processing...");
    const shipping = {
      name: shippingFirstName + " " + shippingLastName,
      street: shippingLine1,
      street_2: shippingLine2 ? shippingLine2 : null,
      town_city: shippingCity,
      county_state: shippingSubdivision,
      postal_zip_code: shippingPostalCode,
      country: shippingCountry,
    };
    let billing;
    if (shippingAsBillingAddress) {
      billing = { ...shipping, email: shippingEmail };
    } else {
      billing = {
        name: billingFirstName + " " + billingLastName,
        email: billingEmail,
        street: billingLine1,
        street_2: billingLine2 ? billingLine2 : null,
        town_city: billingCity,
        county_state: billingSubdivision,
        postal_zip_code: billingPostalCode,
        country: billingCountry,
      };
    }
    const card = elements.getElement(CardElement);
    const paymentMethodResponse = await stripe.createPaymentMethod({
      type: "card",
      card,
      billing_details: {
        email: billing.email,
        name: billing.name,
        address: {
          city: billing.town_city,
          country: billing.country,
          line1: billing.street,
          line2: billing.street2 ? billing.street2 : null,
          postal_code: billing.postal_zip_code,
          state: billing.county_state,
        },
      },
    });
    if (paymentMethodResponse.error) {
      console.log(paymentMethodResponse.error.message);
      toast.dismiss();
      return;
    }
    const customer = session.user.customer_id ? { id: session.user.customer_id } : { email: shippingEmail };
    try {
      const order = await commerce.checkout.capture(checkoutTokenId, {
        customer: customer,
        shipping: shipping,
        billing: billing,
        fulfillment: {
          shipping_method: shippingOption,
        },
        payment: {
          gateway: "stripe",
          stripe: {
            payment_method_id: paymentMethodResponse.paymentMethod.id,
          },
        },
      });
      toast.dismiss();
      order.status_payment === "paid" ? toast.success("Payment Successful") : toast.error("Payment Failed");
      await commerce.cart.refresh();
      router.replace("/");
      return;
    } catch (response) {
      if (response.statusCode !== 402 || response.data.error.type !== "requires_verification") {
        console.log(response);
        toast.dismiss();
        return;
      }
      const cardActionResult = await stripe.handleCardAction(response.data.error.param);
      if (cardActionResult.error) {
        alert(cardActionResult.error.message);
        toast.dismiss();
        return;
      }
      try {
        const order = await commerce.checkout.capture(checkoutTokenId, {
          customer: {
            email: customer,
          },
          shipping: shipping,
          billing: billing,
          fulfillment: {
            shipping_method: shippingOption,
          },
          payment: {
            gateway: "stripe",
            stripe: {
              payment_intent_id: cardActionResult.paymentIntent.id,
            },
          },
        });

        toast.dismiss();
        order.status_payment === "paid" ? toast.success("Payment Successful") : toast.error("Payment Failed");
        await commerce.cart.refresh();
        router.replace("/");
        return;
      } catch (response) {
        alert(response.message);
        toast.dismiss();
      }
    }
    setIsLoading(false);
  };

  return (
    <div>
      {step > 0 && (
        <ProgressView
          step={step}
          setStep={setStep}
          email={shippingEmail}
          line1={shippingLine1}
          line2={shippingLine2}
          city={shippingCity}
          subdivision={shippingSubdivision}
          postalCode={shippingPostalCode}
          country={shippingCountry}
          shippingOptionLabel={shippingOptionLabel}
        />
      )}

      <div className={styles["form-container"]}>
        <form className={styles["checkout-form"]} id="payment-form" onSubmit={handleSubmit}>
          {step === 0 && (
            <ShippingDetails
              countries={countries}
              setShippingCountry={setShippingCountry}
              shippingCountry={shippingCountry}
              subdivisions={subdivisions}
              shippingSubdivision={shippingSubdivision}
              setShippingSubdivision={setShippingSubdivision}
              step={step}
              setStep={setStep}
              email={shippingEmail}
              setEmail={setShippingEmail}
              firstName={shippingFirstName}
              setFirstName={setShippingFirstName}
              lastName={shippingLastName}
              setLastName={setShippingLastName}
              city={shippingCity}
              setCity={setShippingCity}
              postalCode={shippingPostalCode}
              setPostalCode={setShippingPostalCode}
              shippingLine1={shippingLine1}
              setShippingLine1={setShippingLine1}
              shippingLine2={shippingLine2}
              setShippingLine2={setShippingLine2}
            />
          )}
          {step === 1 && (
            <ShippingMethod
              options={options}
              setStep={setStep}
              setShippingOption={setShippingOption}
              setShippingOptionLabel={setShippingOptionLabel}
            />
          )}
          {step === 2 && (
            <>
              <BillingDetails
                email={billingEmail}
                setEmail={setBillingEmail}
                firstName={billingFirstName}
                setFirstName={setBillingFirstName}
                lastName={billingLastName}
                setLastName={setBillingLastName}
                country={billingCountry}
                setCountry={setBillingCountry}
                subdivision={billingSubdivision}
                setSubdivision={setBillingSubdivision}
                city={billingCity}
                setCity={setBillingCity}
                postalCode={billingPostalCode}
                setPostalCode={setBillingPostalCode}
                billingLine1={billingLine1}
                setBillingLine1={setBillingLine1}
                billingLine2={billingLine2}
                setBillingLine2={setBillingLine2}
                countries={countries}
                setStep={setStep}
                stripe={stripe}
                elements={elements}
                isLoading={isLoading}
                shippingAsBillingAddress={shippingAsBillingAddress}
                setShippingAsBillingAddress={setShippingAsBillingAddress}
              />
            </>
          )}
        </form>
      </div>
    </div>
  );
}
