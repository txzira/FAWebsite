import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import React from "react";
import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (session) {
    const url = new URL(`https://api.chec.io/v1/orders`);

    const params = {
      limit: "10",
      page: "1",
      query: "skcm-245",
      //customer reference
    };
    Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

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

    return {
      props: {
        initOrders: orders,
      },
    };
  } else {
    return {
      props: {
        initOrders: null,
      },
    };
  }
};

const orders = ({ initOrders }) => {
  console.log(initOrders);
  return <div>orders</div>;
};

export default orders;
