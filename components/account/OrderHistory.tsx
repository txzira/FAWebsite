"use client";
import React, { useEffect, useState } from "react";
import OrderModal from "./OrderModal";
import { BiDetail } from "react-icons/bi";
import { ImArrowRight, ImArrowLeft } from "react-icons/im";
import styles from "../../styles/Orders.module.css";
import useSWR from "swr";

export default function OrderHistory() {
  const [showModal, setShowModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [previousBtn, setPreviousBtn] = useState("");
  const [orders, setOrders] = useState(null);
  const [limit, setLimit] = useState(10);
  const [pageNum, setPageNum] = useState(1);

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error } = useSWR(`/api/commercejs/getorders?page=${pageNum}&limit=${limit}`, fetcher);
  useEffect(() => {
    if (data) setOrders(data);
  }, [data]);

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
  const handleNextPage = () => {
    setPageNum(pageNum + 1);
  };
  const handlePreviousPage = () => {
    setPageNum(pageNum - 1);
  };
  const changeLimit = (e) => {
    e.preventDefault();
    const lmt = e.target.value;
    setPageNum(1);
    setLimit(lmt);
  };

  const sortTable = (event, n, btnId, sortType = "") => {
    console.log(event.target);
    const content = event.target.innerHTML;
    event.target.innerHTML = content + "&#129045;";

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
      prevBtn.style.backgroundColor = "#f3f3f3";
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
            if (Number(x.textContent.replace(/\D/g, "")) > Number(y.textContent.replace(/\D/g, ""))) {
              shouldSwitch = true;
              break;
            }
          } else if (sortType === "date") {
            if (Number(new Date(x.textContent)) > Number(new Date(y.textContent))) {
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
            if (Number(x.textContent.replace(/\D/g, "")) < Number(y.textContent.replace(/\D/g, ""))) {
              shouldSwitch = true;
              break;
            }
          } else if (sortType === "date") {
            if (Number(new Date(x.textContent)) < Number(new Date(y.textContent))) {
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
          event.target.innerHTML = content + "&#129047;";
          switching = true;
        }
      }
    }
  };

  return (
    <>
      {
        <div className={styles["orders"]}>
          {/* <OrderModal show={showModal} setShow={setShowModal} orderDetails={orderDetails} setOrderDetails={setOrderDetails} /> */}
          <table id="orderTable">
            <thead>
              <tr>
                <th id="orderNo" onClick={(event) => sortTable(event, 0, "orderNo", "number")}>
                  Order No.
                </th>
                <th id="orderDate" onClick={(event) => sortTable(event, 1, "orderDate", "date")}>
                  Order Placed
                </th>
                <th id="shipTo" onClick={(event) => sortTable(event, 2, "shipTo")}>
                  ShipTo
                </th>
                <th id="orderTotal" onClick={(event) => sortTable(event, 3, "orderTotal", "number")}>
                  Total Amount
                </th>
                <th id="orderStatus" onClick={(event) => sortTable(event, 4, "orderStatus")}>
                  Shipping Status
                </th>
                <th>Actions</th>
              </tr>
            </thead>

            {orders ? (
              <tbody id="orderTable">
                {orders.data.map((order) => {
                  return (
                    <tr key={order.id}>
                      <td>{order.customer_reference}</td>
                      <td>{new Date(order.created * 1000).toLocaleDateString()}</td>
                      <td>{order.shipping.name}</td>
                      <td>{order.order_value.formatted_with_symbol}</td>
                      <td>{getShippingStatus(order.status_payment, order.status_fulfillment)}</td>
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
                      <button onClick={() => handlePreviousPage()} style={{ display: "flex", alignItems: "center", padding: "3px" }}>
                        <ImArrowLeft />
                        prev
                      </button>
                    )}
                  </td>
                  <td></td>
                  <td></td>
                  <td>
                    <label htmlFor="changeLimit">Orders Per Page</label>
                    <select id="changeLimit" onChange={changeLimit}>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </td>
                  <td></td>
                  <td>
                    {orders.meta.pagination.links.next && (
                      <button onClick={() => handleNextPage()} style={{ display: "flex", alignItems: "center", padding: "3px" }}>
                        next
                        <ImArrowRight />
                      </button>
                    )}
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td>Loading...</td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      }
    </>
  );
}
