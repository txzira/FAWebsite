import React, { useState, useEffect } from 'react';
import getStripe from '../lib/getStripe';
import { Elements, useStripe } from '@stripe/react-stripe-js';

import PaymentStatus from '../components/PaymentStatus';


const stripePromise = getStripe();

const success = () => {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(()=>{
    setClientSecret(new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    ));
    if(!clientSecret) return;
    
    
  },[stripePromise]);
  const options = {
    clientSecret : clientSecret
  };
  

  return (
    <div>
      {console.log(clientSecret)}
      {clientSecret && <Elements stripe={stripePromise} options={options} >
        <PaymentStatus clientSecret={clientSecret} />
      </Elements>}
    </div>
  )
}

export default success