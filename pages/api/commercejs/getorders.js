import commerce from "../../../lib/commerce";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  console.log(req.query);
  if (session) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      encryption: true,
    });
    const url = new URL(
      `https://api.chec.io/v1/customers/${token.customer_id}/orders`
    );
    Object.keys(req.query).forEach((key) =>
      url.searchParams.append(key, req.query[key])
    );
    const headers = {
      "X-Authorization": `${process.env.NEXT_PUBLIC_CHEC_SECRET_API_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    let orders = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    orders = await orders.json();
    res.status(200).json(orders);
    // console.log(orders.meta);
  }
}
