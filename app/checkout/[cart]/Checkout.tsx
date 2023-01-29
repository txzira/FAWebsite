"use client";
import { useState, useEffect } from "react";
import { useCartState } from "../../../context/cart";
import { AddressElement, Elements, PaymentElement } from "@stripe/react-stripe-js";
import getStripe from "../../../lib/getStripe";
import CheckoutForm from "../../../components/checkout/CheckoutForm";
import { VerticalDivider } from "../../../components/GeneralComponents";
import CartSummary from "../../../components/checkout/CartSummary";

const stripePromise = getStripe();

export function StripeCheckout({ initCheckoutToken }) {
  const { line_items } = useCartState();
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [checkoutToken, setCheckoutToken] = useState(initCheckoutToken);

  const appearance: any = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

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
  return (
    <>
      {clientSecret && (
        <div className="flex flex-row mt-8">
          {/* <Elements stripe={stripePromise} options={options}>
            <AddressElement options={{ mode: "shipping" }} />
          </Elements> */}
          <Elements stripe={stripePromise} options={options}>
            {/* <AddressElement
              options={{
                mode: "billing",
                // fields: {
                //   phone: "always",
                // },
                display: { name: "split" },
              }}
            />

            <PaymentElement /> */}
            <CheckoutForm checkoutToken={checkoutToken} setCheckoutToken={setCheckoutToken} />
          </Elements>
          <VerticalDivider tailwindClass="border-black" />
          <CartSummary checkoutToken={checkoutToken} />
        </div>
      )}
    </>
  );
}
