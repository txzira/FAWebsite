import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

import Layout from "../components/Layout";
import { StateContext } from "../context/StateContext";
import { CartProvider } from "../context/cart";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}

export default MyApp;
