import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  customer_id: string;
};
export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method === "POST") {
    const url = new URL("https://api.chec.io/v1/customers");

    const headers = {
      "X-Authorization": `${process.env.NEXT_PUBLIC_CHEC_SECRET_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    try {
      const createCustomer = await fetch(url.toString(), {
        method: "POST",
        headers: headers,
        body: JSON.stringify(req.body),
      });
      let customer = await createCustomer.json();
      customer = await Promise.resolve(customer);
      res.status(201).json({ customer_id: customer.id });
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
