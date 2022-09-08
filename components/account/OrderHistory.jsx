import React, { useEffect, useState } from "react";
import OrderModal from "./OrderModal";
import { BiDetail } from "react-icons/bi";
import styles from "../../styles/Orders.module.css";
import next from "next";

export default function OrderHistory() {
  const [showModal, setShowModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [previousBtn, setPreviousBtn] = useState("");
  const [orders, setOrders] = useState(null);
  const [nextOrder, setNextOrder] = useState({ state: false });
  const [previousOrder, setPreviousOrder] = useState({ state: false });
  const [limit, setLimit] = useState(10);
  const [pageNum, setPageNum] = useState(1);

  useEffect(() => {
    fetch(`/api/commercejs/getorders?page=${pageNum}&limit=${limit}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((orders) => setOrders(orders));
  }, []);
  useEffect(() => {
    if (orders) {
      console.log(orders);
      // if(previousOrder.state){

      // }
    }
  }, [orders]);

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
  const handleNextOrder = () => {
    fetch(`/api/commercejs/getorders?page=${pageNum + 1}&limit=${limit}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((orders) => setOrders(orders));
    setPageNum(pageNum + 1);
  };
  const handlePreviousOrder = () => {
    fetch(`/api/commercejs/getorders?page=${pageNum - 1}&limit=${limit}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((orders) => setOrders(orders));
    setPageNum(pageNum - 1);
  };

  const sortTable = (n, btnId, sortType = "") => {
    var table,
      rows,
      switching,
      i,
      x,
      y,
      shouldSwitch,
      dir,
      btn,
      prevBtn,
      switchcount = 0;
    table = document.getElementById("orderTable");
    btn = document.getElementById(btnId);
    prevBtn = document.getElementById(previousBtn);
    if (prevBtn) {
      prevBtn.style.backgroundColor = "rgb(160, 160, 160)";
      prevBtn.style.color = "black";
    }
    setPreviousBtn(btnId);
    btn.style.backgroundColor = "black";
    btn.style.color = "white";
    switching = true;

    dir = "asc";

    while (switching) {
      switching = false;

      rows = table.rows;
      for (i = 1; i < rows.length - 2; i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        if (dir == "asc") {
          if (sortType === "number") {
            if (
              Number(x.textContent.replace("$", "")) >
              Number(y.textContent.replace("$", ""))
            ) {
              shouldSwitch = true;
              break;
            }
          } else if (sortType === "date") {
            if (
              Number(new Date(x.textContent)) > Number(new Date(y.textContent))
            ) {
              shouldSwitch = true;
              break;
            }
          } else {
            if (x.textContent.toLowerCase() > y.textContent.toLowerCase()) {
              shouldSwitch = true;
              break;
            }
          }
        } else if (dir == "desc") {
          if (sortType === "number") {
            if (
              Number(x.textContent.replace("$", "")) <
              Number(y.textContent.replace("$", ""))
            ) {
              shouldSwitch = true;
              break;
            }
          } else if (sortType === "date") {
            if (
              Number(new Date(x.textContent)) < Number(new Date(y.textContent))
            ) {
              shouldSwitch = true;
              break;
            }
          } else {
            if (x.textContent.toLowerCase() < y.textContent.toLowerCase()) {
              shouldSwitch = true;
              break;
            }
          }
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount++;
      } else {
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  };
  if (orders) {
    return (
      <>
        {
          <div className={styles["orders"]}>
            <OrderModal
              show={showModal}
              setShow={setShowModal}
              orderDetails={orderDetails}
              setOrderDetails={setOrderDetails}
            />
            <table id="orderTable">
              <thead>
                <tr>
                  <th id="orderNo" onClick={() => sortTable(0, "orderNo")}>
                    Order No.
                  </th>
                  <th
                    id="orderDate"
                    onClick={() => sortTable(1, "orderDate", "date")}
                  >
                    Order Placed
                  </th>
                  <th id="shipTo" onClick={() => sortTable(2, "shipTo")}>
                    ShipTo
                  </th>
                  <th
                    id="orderTotal"
                    onClick={() => sortTable(3, "orderTotal", "number")}
                  >
                    Total Amount
                  </th>
                  <th
                    id="orderStatus"
                    onClick={() => sortTable(4, "orderStatus")}
                  >
                    Shipping Status
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody id="orderTable">
                {orders &&
                  orders.data.map((order) => {
                    return (
                      <tr key={order.id}>
                        <td>{order.customer_reference}</td>
                        <td>
                          {new Date(order.created * 1000).toLocaleDateString()}
                        </td>
                        <td>{order.shipping.name}</td>
                        <td>{order.order_value.formatted_with_symbol}</td>
                        <td>
                          {getShippingStatus(
                            order.status_payment,
                            order.status_fulfillment
                          )}
                        </td>
                        <td>
                          <button onClick={() => showOrderDetails(order)}>
                            <BiDetail size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                <tr>
                  <td>
                    {orders.meta.pagination.links.previous && (
                      <button onClick={() => handlePreviousOrder()}>
                        prev
                      </button>
                    )}
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    {orders.meta.pagination.links.next && (
                      <button onClick={() => handleNextOrder()}>next</button>
                    )}
                  </td>
                </tr>
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
