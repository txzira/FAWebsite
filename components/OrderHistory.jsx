import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import styles from "../styles/Orders.module.css";

function Order() {}

export default function OrderHistory({ orders }) {
  const { data: session, status } = useSession();
  // const [orders, setOrders] = useState([]);
  console.log(orders);
  // async function getOrders() {
  //   if (session) {
  //     fetch("/api/auth/get-token")
  //       .then((response) => response.json())
  //       .then((orders) => setOrders(orders.data));
  //   }
  // }
  function getShippingStatus(paymentStatus, fulfillStatus) {
    if (paymentStatus === "paid" && fulfillStatus === "fulfilled") {
      return "Shipped";
    } else if (paymentStatus === "paid") {
      return "Pending";
    } else return "Error";
  }

  // useEffect(() => {
  //   getOrders();
  // }, [session]);

  if (orders) {
    // console.log(orders);
    return (
      <>
        {
          <div className={styles["orders"]}>
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
                        <td>{getShippingStatus(order.status_payment, order.status_fulfillment)}</td>
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
