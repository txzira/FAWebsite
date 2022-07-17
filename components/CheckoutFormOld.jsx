import React, { useState, useEffect } from "react";
import { PaymentElement, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

import commerce from '../lib/commerce';
import DOMPurify from "dompurify";
import styles from '../styles/CheckoutForm.module.css';



export default function CheckoutForm({ checkoutTokenId, paymentIntentId }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shippingAsBillingAddress, setShippingAsBillingAddress] = useState(true);
  
  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [shippingSubdivision, setShippingSubdivision] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState('');

  const countries = Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name}));
  const subdivisions = Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name}));
  const options = shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})`}))

  const fetchShippingCountry= async (checkoutId) => {
    const { countries } = await commerce.services.localeListShippingCountries(checkoutId);
    setShippingCountries(countries);
    setShippingCountry(Object.keys(countries)[0]);
  }

  const fetchSubdivision = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListShippingSubdivisions(checkoutTokenId, countryCode);
    setShippingSubdivisions(subdivisions);
    setShippingSubdivision(Object.keys(subdivisions)[0]);
  }  
  
  const fetchShippingOptions = async (checkoutId, country, region=null) => {
    const options = await commerce.checkout.getShippingOptions(checkoutId, {country, region});
    setShippingOptions(options);
    setShippingOption(options[0].id);

  }
  useEffect(()=>{
    fetchShippingCountry(checkoutTokenId);
  },[])

  useEffect(()=>{
    if(shippingCountry) fetchSubdivision(shippingCountry);
  },[shippingCountry]);

  useEffect(() => {
    if(shippingSubdivision) fetchShippingOptions(checkoutTokenId, shippingCountry, shippingSubdivision);
  },[shippingSubdivision]);

  useEffect(()=> {
    if(!shippingOption) return;
    fetch('/api/stripe/update-payment-intent',{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({shippingOption,paymentIntentId})
    });
  },[shippingOption])

  function ShippingDetails() {
    return (
      <div className={styles.customerInfoContainer}>
        <h1>Shipping Address</h1>
        <label>Email<input required name='shippingEmail' type='text' placeholder='abc123@example.com' /></label>
        <label>Name<input required name='shippingName' type='text' placeholder='John Doe' /></label>
        <label>Country
          <select value={shippingCountry} name='shippingCountry' onChange={(e) => setShippingCountry(e.target.value)}>
            {countries.map((country) => (
              <option value={country.id} key={country.id}>{country.label}</option>
            ))}
          </select>
        </label>
    
        <label>State
          <select value={shippingSubdivision} name='shippingState' onChange={(e) => setShippingSubdivision(e.target.value)}>
            {subdivisions.map((subdivision) => (
              <option value={subdivision.id} key={subdivision.id}>{subdivision.label}</option>
            ))}
          </select>
        </label>    
        <label>City<input required name='shippingCity' type='text' placeholder='Trenton' /></label>
        <label>Postal Code<input required name='shippingZip' type='text' placeholder="08608"/></label>
        <label>Address<input required name='shippingLine1' type='text' placeholder='20 S Montgomery St' /></label>
        <label>Apartment, Suite, etc.. (Optional)<input name='shippingLine2' type='text' placeholder='Apt. 1' /></label>
        <label>Shipping Option
          <select value={shippingOption} name='shippingOption' onChange={(e) => setShippingOption(e.target.value)}>
          {options.map((option) => (
              <option value={option.id} key={option.id}>{option.label}</option>
            ))}
          </select>
        </label>

      </div>
    )
  }
  
  function BillingDetails() {
    return (
      <div className={styles.customerInfoContainer}>
        <h1>Billing Address</h1>
        <label>Email<input required name='billingEmail' type='text' placeholder='abc123@example.com' /></label>
        <label>Name<input required name='billingName' type='text' placeholder='John Doe' /></label>
        <label>Country<input required name='billingCountry' type='text' placeholder='United States' /></label>
        <label>State<input required name='billingState' type='text' placeholder='New Jersey' /></label>
        <label>City<input required name='billingCity' type='text' placeholder='Trenton' /></label>
        <label>Postal Code<input required name='billingZip' type='text' placeholder="08608"/></label>
        <label>Address<input required name='billingLine1' type='text' placeholder='20 S Montgomery St' /></label>
        <label>Apartment, Suite, etc.. (Optional)<input name='billingLine2' type='text' placeholder='Apt. 1' /></label>
      </div>
    )
  }


  const handleShowBilling = () => {
    setShippingAsBillingAddress(!shippingAsBillingAddress);
  };
  

  const paymentElementOptions={
    fields:{
      billingDetails: {
        address: {
          country: 'never',
          postalCode: 'never'
        }
      }
    },
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const shippingDetails = {
      name: e.target.shippingName.value,
      address: {
        country: e.target.shippingCountry.value,
        state: e.target.shippingState.value,
        city: e.target.shippingCity.value,
        line1: e.target.shippingLine1.value,
        line2: e.target.shippingLine2.value? e.target.shippingLine2.value : null,
        postal_code: e.target.shippingZip.value
      }
    };

    let billingDetails;
    if(shippingAsBillingAddress){
      billingDetails={...shippingDetails, email: e.target.shippingEmail.value };
    } else {
      billingDetails = {
        name: e.target.billingName.value,
        email: e.target.billingEmail.value,
        address: {
          country: e.target.billingCountry.value,          
          state: e.target.billingState.value,
          city: e.target.billingCity.value,
          line1: e.target.billingLine1.value,
          line2: e.target.billingLine2.value? e.target.billingLine2.value : null,
          postal_code: e.target.billingZip.value
        }
      };
    }
    

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);
    console.log(elements)
    // const { error } = await stripe.confirmPayment({
    //   elements,
    //   confirmParams: {
    //     // Make sure to change this to your payment completion page
    //     return_url: "http://localhost:3000/success",
    //     receipt_email: e.target.shippingEmail.value,
    //     shipping: shippingDetails,
    //     payment_method_data: {
    //       billing_details: billingDetails
    //     }
    //   },
    // });

    // // This point will only be reached if there is an immediate error when
    // // confirming the payment. Otherwise, your customer will be redirected to
    // // your `return_url`. For some payment methods like iDEAL, your customer will
    // // be redirected to an intermediate site first to authorize the payment, then
    // // redirected to the `return_url`.
    // if (error.type === "card_error" || error.type === "validation_error") {
    //   setMessage(error.message);
    // } else {
    //   setMessage("An unexpected error occured.");
    // }
    setIsLoading(false);
  };
  console.log(elements)
  
  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit}>
        <ShippingDetails />
        <input type='checkbox' onChange={handleShowBilling} />
        {!shippingAsBillingAddress && <BillingDetails />}
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <button disabled={isLoading || !stripe || !elements} id="submit">
          <span id="button-text">
            {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
    </>
  );
}