import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import commerce from "../lib/commerce";

export default function OrderHistory() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);

  async function getOrders() {
    if (session) {
      const orders = await commerce.customer.getOrders(
        session.customer_id,
        session.accessToken
      );
      setOrders(orders.data);
      console.log(orders);
    }
  }

  useEffect(() => {
    getOrders();
  }, [session]);

  console.log(session);
  console.log(orders);
  if (orders) {
    return (
      <>
        {orders && (
          <div>
            <table>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Order Placed</th>
                  <th>Total Amount</th>
                  <th>Shipping Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody id="orderTable">
                {orders.map((order) => {
                  return (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>
                        {new Date(order.created * 1000).toLocaleDateString()}
                      </td>
                      <td>{order.order_value.formatted_with_symbol}</td>
                      <td>View Details</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  } else {
    return <div>Loading...</div>;
  }
}
