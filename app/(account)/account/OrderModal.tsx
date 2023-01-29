"use client";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import { CSSTransition } from "react-transition-group";

const OrderModal = ({ show, setShow, orderDetails, setOrderDetails }) => {
  function closeOrderDetails() {
    setOrderDetails(null);
    setShow(false);
  }
  function closeOnEscKeyDown(e) {
    if ((e.charCode || e.keyCode) === 27) {
      closeOrderDetails();
    }
  }
  useEffect(() => {
    document.body.addEventListener("keydown", closeOnEscKeyDown);
    return function cleanup() {
      document.body.removeEventListener("keydown", closeOnEscKeyDown);
    };
  }, []);

  return (
    <CSSTransition in={show} unmountOnExit timeout={{ enter: 0, exit: 300 }}>
      <div className="modal" onClick={() => closeOrderDetails()}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {orderDetails && (
            <>
              <div className="modal-header">
                <div className="flex justify-between items-center">
                  <span className="modal-title">Order - {orderDetails.customer_reference}</span>{" "}
                  <span>
                    <Image alt="logo" width="120" height="60" src="/images/logo_size.png" />
                  </span>
                </div>
                <div className="pb-2.5">
                  <p>Order Placed:</p>
                  <p>{new Date(orderDetails.created * 1000).toLocaleDateString()}</p>
                </div>
                <div className="addresses">
                  <div className="billing">
                    <h4>Billed To:</h4>
                    <p>{orderDetails.billing.name}</p>
                    <p>
                      {orderDetails.billing.street} {orderDetails.billing.street_2 ? orderDetails.billing.street_2 : ""}
                    </p>
                    <p>
                      {orderDetails.billing.town_city}, {orderDetails.billing.county_state} {orderDetails.billing.postal_zip_code}
                    </p>
                  </div>
                  <div className="shipping">
                    <h4>Shipped To:</h4>
                    <p>{orderDetails.shipping.name}</p>
                    <p>
                      {orderDetails.shipping.street} {orderDetails.shipping.street_2 ? orderDetails.shipping.street_2 : ""}
                    </p>
                    <p>
                      {orderDetails.shipping.town_city}, {orderDetails.shipping.county_state} {orderDetails.shipping.postal_zip_code}
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-body">
                <h1>Summary</h1>
                <div>
                  <table>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails.order.line_items.map((line_item) => {
                        return (
                          <tr key={line_item.id}>
                            <td>
                              {" "}
                              <Image
                                className="bg-custom-200 rounded-lg cursor-pointer"
                                src={line_item.image.url}
                                height={70}
                                width={70}
                                alt="Product Image"
                              />
                            </td>
                            <td>
                              {" "}
                              <h1>{line_item.product_name} </h1>
                              {line_item.selected_options.map((option) => {
                                return (
                                  <p key={option.option_id}>
                                    {option.group_name} : {option.option_name}
                                  </p>
                                );
                              })}
                            </td>
                            <td>x{line_item.quantity}</td>
                            <td>{line_item.price.formatted_with_symbol}</td>
                            <td>{line_item.line_total.formatted_with_symbol}</td>
                          </tr>
                        );
                      })}
                      <tr className="totals">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Sub-Total</td>
                        <td>{orderDetails.order.subtotal.formatted_with_symbol}</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Tax</td>
                        <td>{orderDetails.tax.amount.formatted_with_symbol}</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Shipping</td>
                        <td>{orderDetails.order.shipping.price.formatted_with_symbol}</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Total</td>
                        <td>{orderDetails.order.total_with_tax.formatted_with_symbol}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button className="button" onClick={() => closeOrderDetails()}>
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </CSSTransition>
  );
};

export default OrderModal;
