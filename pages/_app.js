import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

import Layout from "../components/Layout";
import { StateContext } from "../context/StateContext";
import { CartProvider } from "../context/cart";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <StateContext>
        <CartProvider>
          <Layout>
            <Toaster />
            <Component {...pageProps} />
          </Layout>
        </CartProvider>
      </StateContext>
    </SessionProvider>
  );
}

export default MyApp;
