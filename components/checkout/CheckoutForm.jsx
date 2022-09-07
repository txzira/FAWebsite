import React, { useState, useEffect } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";

import { ShippingDetails, BillingDetails, ShippingMethod, ProgressView } from "./ShippingBillingForms";

import commerce from "../../lib/commerce";

import styles from "../../styles/CheckoutForm.module.css";

export default function CheckoutForm({ checkoutTokenId }) {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);

  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
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
  }));

  const fetchShippingCountry = async (checkoutId) => {
    const { countries } = await commerce.services.localeListShippingCountries(checkoutId);
    setShippingCountries(countries);
    shippingFormValues.country = Object.keys(countries)[0];
    setShippingFormValues(shippingFormValues);
  };

  const fetchSubdivision = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListShippingSubdivisions(checkoutTokenId, countryCode);
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
    fetchShippingCountry(checkoutTokenId);
  }, []);

  useEffect(() => {
    if (shippingFormValues.country) fetchSubdivision(shippingFormValues.country);
  }, [shippingFormValues.country]);

  useEffect(() => {
    if (shippingFormValues.subdivision) fetchShippingOptions(checkoutTokenId, shippingFormValues.country, shippingFormValues.subdivision);
  }, [shippingFormValues.subdivision]);

  return (
    <div>
      {/* <pre>{JSON.stringify(shippingFormValues)}</pre>
      <pre>{JSON.stringify(billingFormValues)}</pre> */}
      {step > 0 && (
        <ProgressView step={step} setStep={setStep} shippingFormValues={shippingFormValues} shippingOptionLabel={shippingOptionLabel} />
      )}

      <div className={styles["form-container"]}>
        <form className={styles["checkout-form"]} id="payment-form">
          {step === 0 && (
            <ShippingDetails
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
              options={options}
              setStep={setStep}
              setShippingOption={setShippingOption}
              setShippingOptionLabel={setShippingOptionLabel}
            />
          )}
          {step === 2 && (
            <BillingDetails
              stripe={stripe}
              elements={elements}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              checkoutTokenId={checkoutTokenId}
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
