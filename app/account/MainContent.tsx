"use client";
import React, { useState } from "react";
import { useSession, getSession } from "next-auth/react";
import Link from "next/link";

import AccountDetails from "../../components/account/AccountDetails";
import OrderHistory from "../../components/account/OrderHistory";

const { data: session, status } = useSession();
const [viewState, setViewState] = useState("account-details");

export default function Main() {
  if (session) {
    return (
      <div>
        <h1 className="text-4xl font-medium mb-10">My Account</h1>
        <h1 className="text-xl font-medium">Welcome {session.user.email}</h1>

        <ul className="flex list-none">
          <li>
            <button className="bg-transparent mr-2.5" onClick={() => setViewState("account-details")}>
              Account Details
            </button>
          </li>
          <li>
            <button className="bg-transparent mr-2.5" onClick={() => setViewState("my-orders")}>
              My Orders
            </button>
          </li>
        </ul>

        {viewState === "account-details" && <AccountDetails />}
        {viewState === "my-orders" && <OrderHistory />}
      </div>
    );
  } else {
    return (
      <div>
        <span>Unauthorized User. Please </span>
        <button className="bg-transparent border-none">
          <Link href="/auth">
            <a className="underline">login</a>
          </Link>
        </button>
      </div>
    );
  }
}
