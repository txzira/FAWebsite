import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { unstable_getServerSession } from "next-auth";
import { cookies } from "next/headers";
import React from "react";

async function Orders(context) {
  const nxtCookies = cookies().getAll();
  console.log(context.res);
  // const session = await unstable_getServerSession(req, res);
  // if (session) {
  //   const url = new URL(`https://api.chec.io/v1/orders`);

  //   const params = {
  //     limit: "10",
  //     page: "1",
  //     query: "skcm-245",
  //     //customer reference
  //   };
  //   Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

  //   const headers = {
  //     "X-Authorization": `${process.env.NEXT_PUBLIC_CHEC_SECRET_API_KEY}`,
  //     Accept: "application/json",
  //     "Content-Type": "application/json",
  //   };
  //   let orders = await fetch(url, {
  //     method: "GET",
  //     headers: headers,
  //   });
  //   orders = await orders.json();
  // console.log(orders);
  // }
  return <div>orders</div>;
}

export default Orders;
