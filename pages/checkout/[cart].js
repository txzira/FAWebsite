import React, { useState, useEffect } from 'react';
import { useCartState } from '../../context/cart';
import commerce from "../../lib/commerce";
import CheckoutForm from '../../components/CheckoutForm';

import { Elements } from '@stripe/react-stripe-js';
import getStripe from '../../lib/getStripe';

export async function getServerSideProps({ params }) {
    const { cart } = params;
    const checkoutId = await commerce.checkout.generateTokenFrom('cart', cart);

    return {
      props: {
        checkoutId,
      },
    };
}
const stripePromise = getStripe();

// const card = elements.create('card')
  
function checkoutPage({checkoutId}) {
    const {line_items} = useCartState();
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
      if(line_items.length===0) return;
      fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(line_items)
      })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
    
    }, [line_items]);
    const appearance = {
      theme: 'stripe',
    };
    const options = {
      clientSecret,
      appearance,
    };
    
    // console.log(checkoutId)
    return (
        <React.Fragment>
          {clientSecret && (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
          </Elements>
          )}
        </React.Fragment>
    )

}
  
export default checkoutPage;