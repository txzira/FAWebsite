import React, { useState, useEffect } from 'react';
import { useStripe } from '@stripe/react-stripe-js';

const PaymentStatus = ({clientSecret}) => {
  const [message, setMessage] = useState(null);
  const stripe = useStripe();
  useEffect(() => {
    if (!stripe) {
      return;
    }
    if (!clientSecret) {
      return;
    } 
    console.log(clientSecret)
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {

      switch (paymentIntent.status) {
        case "succeeded":
          
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);
  

  return (message);
  //   <div>
  //     <div>success</div>
  //     {message && <div id="payment-message">{message}</div>}
  //   </div>
  // )
}

export default PaymentStatus