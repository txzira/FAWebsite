import React, { useState, useEffect } from "react";
import { useCartState } from "../../context/cart";
import CheckoutForm from "../../components/checkout/CheckoutForm";

import commerce from "../../lib/commerce";

import { Elements } from "@stripe/react-stripe-js";
import getStripe from "../../lib/getStripe";
import CartReview from "../../components/CartReview";

export async function getServerSideProps({ params }) {
  const { cart } = params;
  const initCheckoutToken = await commerce.checkout.generateTokenFrom("cart", cart);

  return {
    props: {
      initCheckoutToken,
    },
  };
}
const stripePromise = getStripe();

function CheckoutPage({ initCheckoutToken }) {
  const { line_items, subtotal } = useCartState();
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [checkoutToken, setCheckoutToken] = useState(initCheckoutToken);

  useEffect(() => {
    if (!checkoutToken) return;

    if (line_items.length === 0) return;
    fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([line_items, checkoutToken]),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
      });
  }, [line_items]);
  const appearance: { theme: "stripe" | "night" | "flat" | "none" } = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <React.Fragment>
      {clientSecret && (
        <div className="flex flex-row mt-8">
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm checkoutToken={checkoutToken} setCheckoutToken={setCheckoutToken} />
          </Elements>
          <div className="border-l-2 border-black"></div>
          <CartReview checkoutToken={checkoutToken} />
        </div>
      )}
    </React.Fragment>
  );
}

export default CheckoutPage;
