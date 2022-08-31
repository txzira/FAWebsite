import React, { useEffect, useState } from "react";
import Modal from "./Modal";

import styles from "../../styles/Orders.module.css";

export default function OrderHistory({ orders }) {
  const [showModal, setShowModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  function getShippingStatus(paymentStatus, fulfillStatus) {
    if (paymentStatus === "paid" && fulfillStatus === "fulfilled") {
      return "Shipped";
    } else if (paymentStatus === "paid") {
      return "Pending";
    } else return "Error";
  }
  function showOrderDetails(orderDetails) {
    setOrderDetails(orderDetails);
    setShowModal(true);
  }

  if (orders) {
    return (
      <>
        {
          <div className={styles["orders"]}>
            <Modal show={showModal} setShow={setShowModal} orderDetails={orderDetails} setOrderDetails={setOrderDetails} />
            <table>
              <thead>
                <tr>
                  <th>Order No.</th>
                  <th>Order Placed</th>
                  <th>Total Amount</th>
                  <th>Shipping Status</th>
                  <th>Details</th>
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
                        <td>
                          <button onClick={() => showOrderDetails(order)}>View</button>
                        </td>
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
