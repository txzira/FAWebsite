import React, { useState, useEffect } from "react";
import { useSession, getSession } from "next-auth/react";
import Link from "next/link";

import AccountDetails from "../components/account/AccountDetails";
import OrderHistory from "../components/account/OrderHistory";

// export async function getServerSideProps({ req }) {
//   const session = await getSession({ req });
//   if (session) {
//     const token = await getToken({
//       req,
//       secret: process.env.NEXTAUTH_SECRET,
//       encryption: true,
//     });
//     const url = new URL(
//       `https://api.chec.io/v1/customers/${token.customer_id}/orders`
//     );
//     const headers = {
//       "X-Authorization": `${process.env.NEXT_PUBLIC_CHEC_SECRET_API_KEY}`,
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     };
//     let orders = await fetch(url, {
//       method: "GET",
//       headers: headers,
//     });
//     orders = await orders.json();

//     return {
//       props: {
//         orders: orders.data,
//       },
//     };
//   } else {
//     return {
//       props: {
//         orders: null,
//       },
//     };
//   }
// }

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [viewState, setViewState] = useState("account-details");
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
