import Stripe from "stripe";
import type { NextApiRequest, NextApiResponse } from "next";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const params: any = {
        submit_type: "pay",
        mode: "payment",
        payment_method_types: ["card"],
        shipping_options: [{ shipping_rate: "shr_1KuNftIZK4v7qkytxNSYEfpW" }, { shipping_rate: "shr_1KuNgWIZK4v7qkytSGYSiOf0" }],
        cancel_url: "",
        success_url: "",
        line_items: req.body.map((item) => {
          let desc = "";
          item.selected_options.map((option, i) => {
            if (i === 0) {
              desc += option.group_name.toString() + ": " + option.option_name.toString() + " - ";
            } else if (option.length > 2 && i != option.length) {
              desc += option.group_name.toString() + ": " + option.option_name.toString() + " - ";
            } else {
              desc += option.group_name.toString() + ": " + option.option_name.toString();
            }
          });
          const img = encodeURI(item.image.url);
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: item.product_name,
                images: [img],
                description: desc,
              },
              unit_amount: item.price.raw * 100,
            },
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
            },
            quantity: item.quantity,
          };
        }),
      };
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);
      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
