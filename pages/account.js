import { useSession, getSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import OrderHistory from "../components/OrderHistory";
import { getToken } from "next-auth/jwt";

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  // console.log(session);
  if (session) {
    console.log(session);
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      encryption: true,
    });
    const url = new URL(`https://api.chec.io/v1/customers/${token.customer_id}/orders`);
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
    orders = orders.data;

    return {
      props: {
        orders,
      },
    };
  } else {
    return {
      props: {
        orders: null,
      },
    };
  }
}

export default function AccountPage({ orders }) {
  const { data: session, status } = useSession();

  return <div>{session && <OrderHistory orders={orders} />}</div>;
}
