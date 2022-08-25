import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import commerce from "../lib/commerce";
import { getToken } from "next-auth/jwt";

export default function OrderHistory() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);

  async function getOrders() {
    if (session) {
      fetch("/api/auth/get-token").then((response) =>
        response
          .json()
          .then((customer) =>
            commerce.customer.getOrders(customer.customer_id, customer.accessToken).then((orders) => setOrders(orders.data))
          )
      );
    }
  }

  useEffect(() => {
    getOrders();
  }, [session]);

  if (orders) {
    return (
      <>
        {
          <div>
            <table>
              <thead>
                <tr>
                  <th>Order No.</th>
                  <th>Order Placed</th>
                  <th>Total Amount</th>
                  <th>Shipping Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody id="orderTable">
                {orders &&
                  orders.map((order) => {
                    return (
                      <tr key={order.id}>
                        <td>{order.customer_reference}</td>
                        <td>{new Date(order.created * 1000).toLocaleDateString()}</td>
                        <td>{order.order_value.formatted_with_symbol}</td>
                        <td>View Details</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        }
      </>
    );
  } else {
    return <div>Loading...</div>;
  }
}
