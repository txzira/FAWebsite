import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);
const calculateOrderAmount = (items) => {
  let total = 0;
  items.map((item) => {
    total += (item.quantity * item.price.raw);
  })
  return total * 100;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const items = req.body[0];
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          commerce_checkout_id: req.body[1].id,
        },
      });
      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}