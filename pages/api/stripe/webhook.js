export const config = {
  api: {
    bodyParser: false,
  },
};

import { buffer } from 'micro';
import Stripe from 'stripe';
import commerce from '../../../lib/commerce';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);
const endpointSecret = process.env.NEXT_PUBLIC_STRIPE_ENDPOINT_SECURE;
export default async function handler(req, res) {
  if (req.method === 'POST') {
    let event;
    if (endpointSecret){
      const signature = req.headers['stripe-signature'];
      const buf = await buffer(req);
      try{
        event = stripe.webhooks.constructEvent(
          buf,
          signature,
          endpointSecret
        );
      } catch(err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.status(400);
      }
    }
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(paymentIntent.shipping)
        try{
          const order = await commerce.checkout.capture(paymentIntent.metadata.commerce_checkout_id, {
            customer: {
              email: paymentIntent.receipt_email
            },
            shipping: {
              name: paymentIntent.shipping.name,
              street: paymentIntent.shipping.address.line1,
              town_city: paymentIntent.shipping.address.city,
              country: paymentIntent.shipping.address.country,           
            },
            fulfillment:{
              shipping_method: paymentIntent.metadata.shipping_method_id
            },
            payment: {
              gateway: 'stripe',
              stripe: {
                payment_intent_id: paymentIntent.id,
              },
            }
          });         
          console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
          break;
        } catch(err){
          console.log(err);
          break;
        }
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({received: true});
    
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}