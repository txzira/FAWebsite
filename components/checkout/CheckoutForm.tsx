import React, { useState, useEffect } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";

import { ShippingDetails, ShippingMethod } from "./ShippingForms";
import { BillingDetails } from "./BillingForm";
import { ProgressView } from "./ProgressView";

import commerce from "../../lib/commerce";
import styles from "../../styles/CheckoutForm.module.css";

export default function CheckoutForm({ checkoutToken, setCheckoutToken }) {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);

  const [shippingCountries, setShippingCountries] = useState({});
  const [shippingSubdivisions, setShippingSubdivisions] = useState({});
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState("");
  const [shippingOptionLabel, setShippingOptionLabel] = useState("");
  const [shippingAsBillingAddress, setShippingAsBillingAddress] = useState(true);

  const initialValues = {
    email: "",
    firstName: "",
    lastName: "",
    subdivision: "",
    city: "",
    postalCode: "",
    street: "",
    street_2: "",
    country: "",
  };
  const [shippingFormValues, setShippingFormValues] = useState(initialValues);
  const [billingFormValues, setBillingFormValues] = useState(initialValues);

  const countries = Object.entries(shippingCountries).map(([code, name]) => ({
    id: code,
    label: name,
  }));
  const subdivisions = Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name }));
  const options = shippingOptions.map((sO) => ({
    id: sO.id,
    label: `${sO.description} - (${sO.price.formatted_with_symbol})`,
    price: sO.price.raw,
  }));

  const fetchShippingCountry = async (checkoutId) => {
    const { countries } = await commerce.services.localeListShippingCountries(checkoutId);
    setShippingCountries(countries);
    shippingFormValues.country = Object.keys(countries)[0];
    setShippingFormValues(shippingFormValues);
  };

  const fetchSubdivision = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListShippingSubdivisions(checkoutToken.id, countryCode);
    setShippingSubdivisions(subdivisions);
    shippingFormValues.subdivision = Object.keys(subdivisions)[0];
    setShippingFormValues(shippingFormValues);
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
    fetchShippingCountry(checkoutToken.id);
  }, []);

  useEffect(() => {
    if (shippingFormValues.country) fetchSubdivision(shippingFormValues.country);
  }, [shippingFormValues.country]);

  useEffect(() => {
    if (shippingFormValues.subdivision) fetchShippingOptions(checkoutToken.id, shippingFormValues.country, shippingFormValues.subdivision);
  }, [shippingFormValues.subdivision]);

  return (
    <div className="m-0 w-1/2 pl-4 pr-4">
      {step > 0 && (
        <ProgressView step={step} setStep={setStep} shippingFormValues={shippingFormValues} shippingOptionLabel={shippingOptionLabel} />
      )}
      {/* align-items: flex-start;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 10px;
  width: 100%; */}
      <div className="w-full p-2.5">
        <form className="w-full" id="payment-form">
          {step === 0 && (
            <ShippingDetails
              checkoutTokenId={checkoutToken.id}
              setCheckoutToken={setCheckoutToken}
              shippingFormValues={shippingFormValues}
              setShippingFormValues={setShippingFormValues}
              countries={countries}
              subdivisions={subdivisions}
              step={step}
              setStep={setStep}
            />
          )}
          {step === 1 && (
            <ShippingMethod
              country={shippingFormValues.country}
              options={options}
              setStep={setStep}
              setShippingOption={setShippingOption}
              setShippingOptionLabel={setShippingOptionLabel}
              checkoutToken={checkoutToken}
              setCheckoutToken={setCheckoutToken}
            />
          )}
          {step === 2 && (
            <BillingDetails
              stripe={stripe}
              elements={elements}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              checkoutTokenId={checkoutToken.id}
              shippingFormValues={shippingFormValues}
              billingFormValues={billingFormValues}
              setBillingFormValues={setBillingFormValues}
              countries={countries}
              shippingOption={shippingOption}
              step={step}
              setStep={setStep}
              shippingAsBillingAddress={shippingAsBillingAddress}
              setShippingAsBillingAddress={setShippingAsBillingAddress}
            />
          )}
        </form>
      </div>
    </div>
  );
}
