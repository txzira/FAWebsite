import React, { useState, useEffect } from "react";
import { displayFormErrors, validateContactForm } from "../../lib/formvalidation";
import commerce from "../../lib/commerce";
import { FormCol33, FormCol50, FormTitle, Row } from "../FormComponents";

export function ShippingDetails({
  checkoutTokenId,
  setCheckoutToken,
  shippingFormValues,
  setShippingFormValues,
  countries,
  subdivisions,
  step,
  setStep,
}) {
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
      commerce.checkout.setTaxZone(checkoutTokenId, {
        country: shippingFormValues.country,
        region: shippingFormValues.subdivision,
        postal_zip_code: shippingFormValues.postalCode,
      });
      commerce.checkout.getToken(checkoutTokenId).then((refreshCheckoutToken) => setCheckoutToken(refreshCheckoutToken));

      setStep(1);
    }
  }, [formErrors]);

  return (
    <div>
      <FormTitle>Contact Information</FormTitle>
      <div>
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
        {formErrors && <p className="text-red-600">{formErrors.email}</p>}
      </div>
      <FormTitle>Shipping Address</FormTitle>
      <div>
        <label htmlFor="shippingCountry">Country</label>
        <select id="shippingCountry" name="country" value={shippingFormValues.country} onChange={handleChange}>
          {countries.map((country) => (
            <option value={country.id} key={country.id}>
              {country.label}
            </option>
          ))}
        </select>
      </div>
      <Row>
        <FormCol50>
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
          {formErrors && <p className="text-red-600">{formErrors.firstName}</p>}
        </FormCol50>
        <FormCol50>
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
          {formErrors && <p className="text-red-600">{formErrors.lastName}</p>}
        </FormCol50>
      </Row>
      <Row>
        <FormCol33>
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
          {formErrors && <p className="text-red-600">{formErrors.city}</p>}
        </FormCol33>
        <FormCol33>
          <label htmlFor="shippingState">State/Province</label>
          <select id="shippingState" name="subdivision" value={shippingFormValues.subdivision} onChange={handleChange}>
            {subdivisions.map((subdivision) => (
              <option value={subdivision.id} key={subdivision.id}>
                {subdivision.label}
              </option>
            ))}
          </select>
        </FormCol33>
        <FormCol33>
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
          {formErrors && <p className="text-red-600">{formErrors.postalCode}</p>}
        </FormCol33>
      </Row>
      <div>
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
        {formErrors && <p className="text-red-600">{formErrors.street}</p>}
      </div>
      <div>
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
      <div className="flex justify-between w-full">
        <button>{"<- back to cart"}</button>
        <button onClick={handleNextStep}>{"Shipping ->"}</button>
      </div>
    </div>
  );
}

export function ShippingMethod({ country, options, setStep, setShippingOption, setShippingOptionLabel, checkoutToken, setCheckoutToken }) {
  const addShippingToChec = async (id) => {
    await commerce.checkout.checkShippingOption(checkoutToken.id, {
      shipping_option_id: id,
      country: country,
    });
    const refreshCheckoutToken = await commerce.checkout.getToken(checkoutToken.id);
    setCheckoutToken(refreshCheckoutToken);
  };

  function handleShippingOption(event, label) {
    setShippingOptionLabel(label);
    setShippingOption(event.target.value);
    addShippingToChec(event.target.value);
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
    <div className="w-full">
      <FormTitle>Shipping Method</FormTitle>
      {options.map((option, index) => (
        <div className="flex" key={option.id}>
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
      <div className="flex justify-between w-full">
        <button onClick={() => setStep(0)}>{"<- Contact"}</button>
        <button onClick={() => setStep(2)}>{"Billing ->"}</button>
      </div>
    </div>
  );
}
