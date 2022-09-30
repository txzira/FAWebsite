import React, { useState, useEffect } from "react";
import { displayFormErrors, validateContactForm } from "../../lib/formvalidation";
import commerce from "../../lib/commerce";
import { FormCol33, FormCol50, FormTitle, Input, Row, Select } from "../FormComponents";

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
        <Input
          id="shippingEmail"
          name="email"
          placeholder="abc123@example.com"
          value={shippingFormValues.email}
          onChange={handleChange}
          labelText="Email"
        />
        {formErrors && <p className="text-red-600">{formErrors.email}</p>}
      </div>
      <FormTitle>Shipping Address</FormTitle>
      <div>
        <Select
          id="shippingCountry"
          name="country"
          value={shippingFormValues.country}
          onChange={handleChange}
          options={countries}
          labelText="Country"
        />
      </div>
      <Row>
        <FormCol50>
          <Input
            id="shippingFirstName"
            name="firstName"
            placeholder="John"
            value={shippingFormValues.firstName}
            onChange={handleChange}
            labelText="First Name"
          />
          {formErrors && <p className="text-red-600">{formErrors.firstName}</p>}
        </FormCol50>
        <FormCol50>
          <Input
            id="shippingLastName"
            name="lastName"
            placeholder="Doe"
            onChange={handleChange}
            labelText="Last Name"
            value={shippingFormValues.lastName}
          />
          {formErrors && <p className="text-red-600">{formErrors.lastName}</p>}
        </FormCol50>
      </Row>
      <Row>
        <FormCol33>
          <Input
            id="shippingCity"
            name="city"
            placeholder="Trention"
            value={shippingFormValues.city}
            onChange={handleChange}
            labelText="City"
          />
          {formErrors && <p className="text-red-600">{formErrors.city}</p>}
        </FormCol33>
        <FormCol33>
          <Select
            id="shippingState"
            name="subdivision"
            value={shippingFormValues.subdivision}
            labelText="State/Province"
            options={subdivisions}
            onChange={handleChange}
          />
        </FormCol33>
        <FormCol33>
          <Input
            id="shippingZip"
            name="postalCode"
            placeholder="08608"
            value={shippingFormValues.postalCode}
            onChange={handleChange}
            labelText="Postal Code"
          />
          {formErrors && <p className="text-red-600">{formErrors.postalCode}</p>}
        </FormCol33>
      </Row>
      <div>
        <Input
          id="shippingLine1"
          name="street"
          placeholder="20 S Montgomery St."
          value={shippingFormValues.street}
          labelText="Address"
          onChange={handleChange}
        />
        {formErrors && <p className="text-red-600">{formErrors.street}</p>}
      </div>
      <div>
        <Input
          id="shippingLine2"
          name="street_2"
          placeholder="Apt. 1"
          value={shippingFormValues.street_2}
          onChange={handleChange}
          labelText="Apartment, suite, etc.. (optional)"
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
          <label className="text-black text-xl mb-2 w-full" htmlFor={option.id}>
            {option.label}
          </label>
        </div>
      ))}
      <div className="flex justify-between w-full">
        <button onClick={() => setStep(0)}>{"<- Contact"}</button>
        <button onClick={() => setStep(2)}>{"Billing ->"}</button>
      </div>
    </div>
  );
}
