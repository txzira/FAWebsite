import React from "react";
import OrderHistory from "../../components/account/OrderHistory";

export default async function Admin() {
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

  const orders = await fetch(url, {
    method: "GET",
    headers: headers,
  });
  const ordersData = await orders.json();
  console.log(orders);
  return (
    <div>
      <OrderHistory />
    </div>
  );
}
