import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const shippingMethod = req.body.shippingOption;
      const paymentIntentId = req.body.paymentIntentId;
      const paymentIntent = await stripe.paymentIntents.update(paymentIntentId, { metadata: { shipping_method_id: shippingMethod } });
      console.log(paymentIntent);
      res.status(200);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
