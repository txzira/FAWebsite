import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
        const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            billing_address_collection: 'auto',
            shipping_options: [
                { shipping_rate: 'shr_1KuNftIZK4v7qkytxNSYEfpW'},
                { shipping_rate: 'shr_1KuNgWIZK4v7qkytSGYSiOf0'},
            ],
            line_items: req.body.map((item) => {
                let desc=''; 
                item.selected_options.map((option,i) => {
                    if(i===0) {
                        desc += option.group_name.toString()+ ': ' +  option.option_name.toString() + ' - '
                    }
                    else if (option.length > 2 && i != option.length) {
                        desc += option.group_name.toString()+ ': ' +  option.option_name.toString() + ' - '
                    }
                    else {
                        desc += option.group_name.toString()+ ': ' +  option.option_name.toString() 
                    }           
                } )
                const img = encodeURI(item.image.url);

                return {
                    price_data: {
                        currency: 'usd',
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
                    quantity: item.quantity                       
                }
            }),
            success_url: `${req.headers.origin}/success`,
            cancel_url: `${req.headers.origin}/canceled`,
        }
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);
      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}