import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import OrderHistory from "../components/OrderHistory";
import commerce from "../lib/commerce";

export default function AccountPage() {
  return (
    <div>
      <OrderHistory />
    </div>
  );
}
