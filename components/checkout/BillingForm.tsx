import { CardElement } from "@stripe/react-stripe-js";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import commerce from "../../lib/commerce";
import { validateContactForm, displayFormErrors } from "../../lib/formvalidation";
import { FormCol33, FormCol50, FormCol75, FormTitle, Input, Row, Select } from "../FormComponents";

export function BillingDetails({
  stripe,
  elements,
  isLoading,
  setIsLoading,
  checkoutTokenId,
  shippingFormValues,
  billingFormValues,
  setBillingFormValues,
  countries,
  shippingOption,
  step,
  setStep,
  shippingAsBillingAddress,
  setShippingAsBillingAddress,
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Courier New",
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
  const [formErrors, setFormErrors] = useState(null);
  const commerceJsFormValues = (firstName, lastName, street, street_2, city, county_state, postal_zip_code, country, email = "") => {
    return {
      name: firstName + " " + lastName,
      street: street,
      street_2: street_2 ? street_2 : null,
      town_city: city,
      county_state: county_state,
      postal_zip_code: postal_zip_code,
      country: country,
      ...(email !== "" && { email: email }),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    const shipping = commerceJsFormValues(
      shippingFormValues.firstName,
      shippingFormValues.lastName,
      shippingFormValues.street,
      shippingFormValues.street_2,
      shippingFormValues.city,
      shippingFormValues.subdivision,
      shippingFormValues.postalCode,
      shippingFormValues.country
    );
    let billing;
    if (shippingAsBillingAddress) {
      billing = { ...shipping, email: shippingFormValues.email };
    } else {
      billing = commerceJsFormValues(
        billingFormValues.firstName,
        billingFormValues.lastName,
        billingFormValues.street,
        billingFormValues.street_2,
        billingFormValues.city,
        billingFormValues.subdivision,
        billingFormValues.postalCode,
        billingFormValues.country,
        billingFormValues.email
      );
    }
    const card = elements.getElement(CardElement);
    //handle input validation errors
    let errors = {};

    if (!card._implementation._complete) {
      errors = { payment: "\u2022Invalid payment information" };
    }
    if (!shippingAsBillingAddress) {
      errors = { ...errors, ...validateContactForm(billingFormValues, "billing") };
    }
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    //no input validation errors, proceed to accept payment
    setIsLoading(true);
    toast.loading("Payment Processing...");
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
          line2: billing.street_2 ? billing.street_2 : null,
          postal_code: billing.postal_zip_code,
          state: billing.county_state,
        },
      },
    });
    if (paymentMethodResponse.error) {
      toast.dismiss();
      toast.error(paymentMethodResponse.error.message);
      return;
    }
    const orderDetails = {
      customer: session ? { id: session.user.customer_id, email: shippingFormValues.email } : { email: shippingFormValues.email },
      shipping: shipping,
      billing: billing,
      fulfillment: {
        shipping_method: shippingOption,
      },
    };
    try {
      const order = await commerce.checkout.capture(checkoutTokenId, {
        ...orderDetails,
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
        toast.dismiss();
        console.log(response);
        toast.error(response.message);
        return;
      }
      const cardActionResult = await stripe.handleCardAction(response.data.error.param);
      if (cardActionResult.error) {
        toast.dismiss();
        toast.error(cardActionResult.error.message);
        return;
      }
      try {
        const order = await commerce.checkout.capture(checkoutTokenId, {
          ...orderDetails,
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
        toast.dismiss();
        toast.error(response.message);
      }
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillingFormValues({ ...billingFormValues, [name]: value });
    if (formErrors !== null) {
      if (name in formErrors) {
        delete formErrors[name];
        setFormErrors(formErrors);
      }
    }
  };
  const handleShowBilling = (e) => {
    if (e.target.value === "yes") {
      setShippingAsBillingAddress(true);
    } else {
      setShippingAsBillingAddress(false);
    }
  };

  const handleCard = (event) => {
    if (event.error && event.error != undefined) {
      setFormErrors({ ...formErrors, payment: event.error.message });
    }
    return;
  };
  useEffect(() => {
    if (!formErrors) return;
    if (Object.keys(formErrors).length > 0 && step === 2) {
      displayFormErrors(formErrors);
    }
  }, [formErrors]);

  return (
    <>
      <FormTitle>Payment</FormTitle>
      <div className="w-full p-2.5 border border-black rounded-lg">
        <FormCol75>
          <CardElement onChange={handleCard} id="card-element" options={cardStyle} />
        </FormCol75>
      </div>
      {formErrors && <p className="text-red-600">{formErrors.payment}</p>}
      <div>
        <FormTitle>Billing Address</FormTitle>
        <div className="block" onChange={handleShowBilling}>
          <div className="flex">
            <input type="radio" name="shipAsBill" value="yes" defaultChecked />
            <label>Same as shipping address</label>
          </div>
          <div className="flex">
            <input type="radio" name="shipAsBill" value="no" />
            <label>Use a different billing address</label>
          </div>
        </div>
        {!shippingAsBillingAddress && billingFormValues !== null && (
          <>
            <div>
              <Input
                id="billingEmail"
                name="email"
                placeholder="abc123@example.com"
                value={billingFormValues.email}
                onChange={handleChange}
                labelText="Email*"
              />
              {formErrors && <p className="text-red-600">{formErrors.email}</p>}
            </div>
            <Row>
              <FormCol50>
                <Input
                  id="billingFirstName"
                  name="firstName"
                  placeholder="John"
                  value={billingFormValues.firstName}
                  onChange={handleChange}
                  labelText="First Name*"
                />
                {formErrors && <p className="text-red-600">{formErrors.firstName}</p>}
              </FormCol50>
              <FormCol50>
                <Input
                  id="billingLastName"
                  name="lastName"
                  placeholder="Doe"
                  value={billingFormValues.lastName}
                  onChange={handleChange}
                  labelText="Last Name*"
                />
                {formErrors && <p className="text-red-600">{formErrors.lastName}</p>}
              </FormCol50>
            </Row>
            <Select
              id="billingCountry"
              name="country"
              value={billingFormValues.country}
              onChange={handleChange}
              options={countries}
              labelText="Country*"
            />
            <Row>
              <FormCol33>
                <Input
                  id="billingCity"
                  name="city"
                  placeholder="Trenton"
                  value={billingFormValues.city}
                  onChange={handleChange}
                  labelText="City*"
                />
                {formErrors && <p className="text-red-600">{formErrors.city}</p>}
              </FormCol33>
              <FormCol33>
                <Input
                  id="billingState"
                  name="subdivision"
                  placeholder="New Jersey"
                  value={billingFormValues.subdivision}
                  onChange={handleChange}
                  labelText="State*"
                />
                {formErrors && <p className="text-red-600">{formErrors.subdivision}</p>}
              </FormCol33>
              <FormCol33>
                <Input
                  id="billingZip"
                  name="postalCode"
                  placeholder="08608"
                  value={billingFormValues.postalCode}
                  onChange={handleChange}
                  labelText="Postal Code*"
                />
                {formErrors && <p className="text-red-600">{formErrors.postalCode}</p>}
              </FormCol33>
            </Row>
            <div>
              <Input
                id="billingStreet"
                name="street"
                placeholder="20 S Montgomery St"
                value={billingFormValues.street}
                onChange={handleChange}
                labelText="Street Address*"
              />
              {formErrors && <p className="text-red-600">{formErrors.street}</p>}
            </div>
            <div>
              <Input
                id="billingStreet2"
                name="street_2"
                placeholder="Apt. 1 (optional)"
                value={billingFormValues.street_2}
                onChange={handleChange}
                labelText="Apartment, suite, etc..."
              />
            </div>
          </>
        )}
      </div>
      <div className="flex justify-between w-full">
        <button onClick={() => setStep(1)}>{"<- Shipping"}</button>
        <button disabled={!stripe || !elements} id="submit" onClick={handleSubmit}>
          <span id="button-text">{isLoading ? <div className="spinner" id="spinner"></div> : "Pay now ->"}</span>
        </button>
      </div>
    </>
  );
}
