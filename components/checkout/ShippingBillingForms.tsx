import React, { useState, useEffect } from "react";
import { CardElement } from "@stripe/react-stripe-js";
import styles from "../../styles/CheckoutForm.module.css";
import { displayFormErrors, validateContactForm } from "../../lib/formvalidation";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import commerce from "../../lib/commerce";
import { useRouter } from "next/router";

export function ShippingDetails({ shippingFormValues, setShippingFormValues, countries, subdivisions, step, setStep }) {
  const [formErrors, setFormErrors] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingFormValues({ ...shippingFormValues, [name]: value });
    if (formErrors !== null) {
      if (name in formErrors) {
        delete formErrors[name];
        setFormErrors(formErrors);
      }
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setFormErrors(validateContactForm(shippingFormValues, "shipping"));
  };

  useEffect(() => {
    if (!formErrors) return;

    if (Object.keys(formErrors).length > 0 && step === 0) {
      displayFormErrors(formErrors);
    } else {
      setStep(1);
    }
  }, [formErrors]);

  return (
    <div>
      <h1 className={styles["form-title"]}>Contact Information</h1>
      <div className={styles["input-line"]}>
        <label htmlFor="shippingEmail">Email</label>
        <input
          required
          id="shippingEmail"
          name="email"
          type="text"
          placeholder="abc123@example.com"
          value={shippingFormValues.email}
          onChange={handleChange}
        />
        {formErrors && <p className={styles["form-error"]}>{formErrors.email}</p>}
      </div>

      <h1 className={styles["form-title"]}>Shipping Address</h1>
      <label htmlFor="shippingCountry">Country</label>
      <select id="shippingCountry" name="country" value={shippingFormValues.country} onChange={handleChange}>
        {countries.map((country) => (
          <option value={country.id} key={country.id}>
            {country.label}
          </option>
        ))}
      </select>
      <div className={styles["row"]}>
        <div className={styles["col-50"]}>
          <label htmlFor="shippingFirstName">First Name</label>
          <input
            required
            id="shippingFirstName"
            name="firstName"
            type="text"
            placeholder="John"
            value={shippingFormValues.firstName}
            onChange={handleChange}
          />
          {formErrors && <p className={styles["form-error"]}>{formErrors.firstName}</p>}
        </div>
        <div className={styles["col-50"]}>
          <label htmlFor="shippingLastName">Last Name</label>
          <input
            required
            id="shippingLastName"
            name="lastName"
            type="text"
            placeholder="Doe"
            value={shippingFormValues.lastName}
            onChange={handleChange}
          />
          {formErrors && <p className={styles["form-error"]}>{formErrors.lastName}</p>}
        </div>
      </div>
      <div className={styles["row"]}>
        <div className={styles["col-25"]}>
          <label htmlFor="shippingCity">City</label>
          <input
            required
            id="shippingCity"
            name="city"
            type="text"
            placeholder="Trenton"
            value={shippingFormValues.city}
            onChange={handleChange}
          />
          {formErrors && <p className={styles["form-error"]}>{formErrors.city}</p>}
        </div>
        <div className={styles["col-25"]}>
          <label htmlFor="shippingState">State/Province</label>
          <select id="shippingState" name="subdivision" value={shippingFormValues.subdivision} onChange={handleChange}>
            {subdivisions.map((subdivision) => (
              <option value={subdivision.id} key={subdivision.id}>
                {subdivision.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles["col-25"]}>
          <label htmlFor="shippingZip">Postal Code</label>
          <input
            required
            id="shippingZip"
            name="postalCode"
            type="text"
            placeholder="08608"
            value={shippingFormValues.postalCode}
            onChange={handleChange}
          />
          {formErrors && <p className={styles["form-error"]}>{formErrors.postalCode}</p>}
        </div>
      </div>
      <div className={styles["input-line"]}>
        <label htmlFor="shippingLine1">Address</label>
        <input
          required
          id="shippingLine1"
          name="street"
          type="text"
          placeholder="20 S Montgomery St"
          value={shippingFormValues.street}
          onChange={handleChange}
        />
        {formErrors && <p className={styles["form-error"]}>{formErrors.street}</p>}
      </div>
      <div className={styles["input-line"]}>
        <label htmlFor="shippingLine2">Apartment, suite, etc.. (optional)</label>
        <input
          id="shippingLine2"
          name="street_2"
          type="text"
          placeholder="Apt. 1"
          value={shippingFormValues.street_2}
          onChange={handleChange}
        />
      </div>
      <div className={styles["test"]}>
        <span>{"<- back to cart"}</span>
        <span onClick={handleNextStep}>{"Shipping ->"}</span>
      </div>
    </div>
  );
}

export function ShippingMethod({ options, setStep, setShippingOption, setShippingOptionLabel }) {
  function handleShippingOption(event, label) {
    setShippingOptionLabel(label);
    setShippingOption(event.target.value);
  }
  function defaultOption() {
    if (document.getElementById("option0")) {
      document.getElementById("option0").click();
    }
  }
  useEffect(() => {
    defaultOption();
  }, []);
  return (
    <div style={{ width: "100%" }}>
      <h1 className={styles["form-title"]}>Shipping Method</h1>
      {options.map((option, index) => (
        <div className={styles["group"]} key={option.id}>
          <input
            type="radio"
            value={option.id}
            name="shippingOption"
            id={`option${index}`}
            onClick={(e) => handleShippingOption(e, option.label)}
          />
          <label htmlFor={option.id}>{option.label}</label>
        </div>
      ))}
      <div className={styles["test"]}>
        <span onClick={() => setStep(0)}>{"<- Contact"}</span>
        <span onClick={() => setStep(2)}>{"Billing ->"}</span>
      </div>
    </div>
  );
}

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
      <h1 className={styles["form-title"]}>Payment</h1>
      <div className={styles["form-control"]}>
        <div className={styles["col-75"]}>
          <CardElement onChange={handleCard} id="card-element" options={cardStyle} />
        </div>
      </div>
      {formErrors && <p className={styles["form-error"]}>{formErrors.payment}</p>}
      <div className="">
        <h1 className={styles["form-title"]}>Billing Address</h1>
        <div className={styles["group"]} style={{ width: "100%", display: "block" }} onChange={handleShowBilling}>
          <div className={styles["group"]}>
            <input type="radio" name="shipAsBill" value="yes" defaultChecked />
            <label>Same as shipping address</label>
          </div>
          <div className={styles["group"]}>
            <input type="radio" name="shipAsBill" value="no" />
            <label>Use a different billing address</label>
          </div>
        </div>
        {!shippingAsBillingAddress && billingFormValues !== null && (
          <>
            <div className={styles["input-line"]}>
              <label>Email*</label>
              <input
                required
                name="email"
                type="text"
                placeholder="abc123@example.com"
                value={billingFormValues.email}
                onChange={handleChange}
              />
              {formErrors && <p className={styles["form-error"]}>{formErrors.email}</p>}
            </div>
            <div className={styles["row"]}>
              <div className={styles["col-50"]}>
                <label>First Name*</label>
                <input
                  required
                  name="firstName"
                  type="text"
                  placeholder="John"
                  value={billingFormValues.firstName}
                  onChange={handleChange}
                />
                {formErrors && <p className={styles["form-error"]}>{formErrors.firstName}</p>}
              </div>
              <div className={styles["col-50"]}>
                <label>Last Name*</label>
                <input required name="lastName" type="text" placeholder="Doe" value={billingFormValues.lastName} onChange={handleChange} />
                {formErrors && <p className={styles["form-error"]}>{formErrors.lastName}</p>}
              </div>
            </div>
            <label>Country*</label>
            <select name="country" value={billingFormValues.country} onChange={handleChange}>
              {countries.map((country) => (
                <option value={country.id} key={country.id}>
                  {country.label}
                </option>
              ))}
            </select>
            <div className={styles["row"]}>
              <div className={styles["col-25"]}>
                <label>City*</label>
                <input required name="city" type="text" placeholder="Trenton" value={billingFormValues.city} onChange={handleChange} />
                {formErrors && <p className={styles["form-error"]}>{formErrors.city}</p>}
              </div>
              <div className={styles["col-25"]}>
                <label>State*</label>
                <input
                  required
                  name="subdivision"
                  type="text"
                  placeholder="New Jersey"
                  value={billingFormValues.subdivision}
                  onChange={handleChange}
                />
                {formErrors && <p className={styles["form-error"]}>{formErrors.subdivision}</p>}
              </div>
              <div className={styles["col-25"]}>
                <label>Postal Code*</label>
                <input
                  required
                  name="postalCode"
                  type="text"
                  placeholder="08608"
                  value={billingFormValues.postalCode}
                  onChange={handleChange}
                />
                {formErrors && <p className={styles["form-error"]}>{formErrors.postalCode}</p>}
              </div>
            </div>
            <div className={styles["input-line"]}>
              <label>Street Address*</label>
              <input
                required
                name="street"
                type="text"
                placeholder="20 S Montgomery St"
                value={billingFormValues.street}
                onChange={handleChange}
              />
              {formErrors && <p className={styles["form-error"]}>{formErrors.street}</p>}
            </div>
            <div className={styles["input-line"]}>
              <label>Apartment, suite, etc...</label>
              <input
                name="street_2"
                type="text"
                placeholder="Apt. 1 (optional)"
                value={billingFormValues.street_2}
                onChange={handleChange}
              />
            </div>
          </>
        )}
      </div>
      <div className={styles["test"]} style={{ width: "100%" }}>
        <span onClick={() => setStep(1)}>{"<- Shipping"}</span>
        <div>
          <button disabled={!stripe || !elements} id="submit" onClick={handleSubmit}>
            <span id="button-text">{isLoading ? <div className="spinner" id="spinner"></div> : "Pay now ->"}</span>
          </button>
        </div>
      </div>
    </>
  );
}

export function ProgressView({ shippingFormValues, step, setStep, shippingOptionLabel }) {
  const shipAddressHtml = (
    <span>
      {`${shippingFormValues.street}, `}
      {shippingFormValues.street_2 ? `${shippingFormValues.street_2}, ` : ""}
      {`${shippingFormValues.city} ${shippingFormValues.subdivision} ${shippingFormValues.postalCode}, ${shippingFormValues.country}`}
    </span>
  );

  return (
    <div className={styles["progress-view-container"]}>
      <div className={styles["col-75"]}>
        {step >= 1 && (
          <>
            <div className={styles["test"]}>
              <div>
                <label>Contact&nbsp;</label>
                <span>{shippingFormValues.email}</span>
              </div>
              <span onClick={() => setStep(0)}>change</span>
            </div>
            <hr />
            <div className={styles["test"]}>
              <div>
                <label>Ship To&nbsp;</label>
                {shipAddressHtml}
              </div>
              <span onClick={() => setStep(0)}>change</span>
            </div>
          </>
        )}
        {step >= 2 && (
          <>
            <hr />
            <div className={styles["test"]}>
              <div>
                <label>Shipping&nbsp;</label>
                <span>{shippingOptionLabel}</span>
              </div>
              <span onClick={() => setStep(1)}>change</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
