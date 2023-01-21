"use client";
import { SessionProvider } from "next-auth/react";
import { StateContext } from "../context/StateContext";
import { CartProvider } from "../context/cart";
import React from "react";

export default function ContextProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider>
        <StateContext>
          <CartProvider>{children}</CartProvider>
        </StateContext>
      </SessionProvider>
    </>
  );
}
