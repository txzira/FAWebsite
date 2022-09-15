import commerce from "../../../lib/commerce";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  page: number;
  limit: number;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (session) {
    // const token = await getToken({
    //   req,
    //   secret: process.env.NEXTAUTH_SECRET,
    //   encryption: true,
    // });
    const query: object = req.query;
    const url = new URL(`https://api.chec.io/v1/customers/${session.user.customer_id}/orders`);
    Object.keys(query).forEach((key) => url.searchParams.append(key, query[key]));
    const headers = {
      "X-Authorization": `${process.env.NEXT_PUBLIC_CHEC_SECRET_API_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    let orders = await fetch(url.toString(), {
      method: "GET",
      headers: headers,
    });
    orders = await orders.json();
    res.status(200).json(orders);
  }
};
