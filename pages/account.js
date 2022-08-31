import React, { useState, useEffect } from "react";
import { useSession, getSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import Link from "next/link";

import AccountDetails from "../components/account/AccountDetails";
import OrderHistory from "../components/account/OrderHistory";

import styles from "../styles/Account.module.css";

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  if (session) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      encryption: true,
    });
    const url = new URL(`https://api.chec.io/v1/customers/${token.customer_id}/orders`);
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
        orders: orders.data,
      },
    };
  } else {
    return {
      props: {
        orders: null,
      },
    };
  }
}

export default function AccountPage({ orders }) {
  const { data: session, status } = useSession();
  const [viewState, setViewState] = useState("account-details");
  if (session) {
    return (
      <div>
        <h1 className={styles["title"]}>My Account</h1>
        <h1 className={styles["subtitle"]}>Welcome {session.user.email}</h1>

        <ul className={styles.navigation}>
          <li>
            <button onClick={() => setViewState("account-details")}>Account Details</button>
          </li>
          <li>
            <button onClick={() => setViewState("my-orders")}>My Orders</button>
          </li>
        </ul>

        {viewState === "account-details" && <AccountDetails />}
        {viewState === "my-orders" && <OrderHistory orders={orders} />}
      </div>
    );
  } else {
    return (
      <div>
        <span>Unauthorized User. Please </span>
        <button style={{ border: "0px", background: "none" }}>
          <Link href="/auth">
            <a style={{ textDecoration: "underline" }}>login</a>
          </Link>
        </button>
      </div>
    );
  }
}
