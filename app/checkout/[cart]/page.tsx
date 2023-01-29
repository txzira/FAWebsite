import React from "react";

import commerce from "../../../lib/commerce";
import getStripe from "../../../lib/getStripe";
import { StripeCheckout } from "./Checkout";

const stripePromise = getStripe();

async function CheckoutPage({ params }) {
  const { cart } = params;
  const initCheckoutToken = await commerce.checkout.generateTokenFrom("cart", cart);

  return (
    <>
      <StripeCheckout initCheckoutToken={initCheckoutToken} />
    </>
  );
}

export default CheckoutPage;
