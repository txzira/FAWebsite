import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import OrderHistory from "../components/account/OrderHistory";

export async function getServerSideProps() {
  const url = new URL("https://api.chec.io/v1/orders");

  const params = {
    limit: "100",
  };
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

  const headers = {
    "X-Authorization": `${process.env.NEXT_PUBLIC_CHEC_SECRET_API_KEY}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const orders = await fetch(url.toString(), {
    method: "GET",
    headers: headers,
  });
  const ordersData = await orders.json();

  return {
    props: {
      orders: ordersData.data,
    },
  };
}

export default function Admin({ orders }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (session && session.user.role == "admin") {
    console.log(orders);
    return (
      <div>
        <h1>Welcome {session.user.email}</h1>
        <OrderHistory />
      </div>
    );
  } else {
    return <div>Unauthorized User</div>;
  }
}

// router.replace("/");
