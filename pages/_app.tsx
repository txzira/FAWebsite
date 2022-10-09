import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

import Layout from "../components/Layout";
import { StateContext } from "../context/StateContext";
import { CartProvider } from "../context/cart";

import "../styles/globals.css";
import AccountLayout from "../components/AccountLayout";
import { MainBox } from "../components/GeneralComponents";

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <React.Fragment>
      <SessionProvider session={pageProps.session}>
        <StateContext>
          <CartProvider>
            <Layout>
              <Toaster />
              {router.pathname.startsWith("/admin") ? (
                <AccountLayout>
                  <Component {...pageProps} />
                </AccountLayout>
              ) : (
                <MainBox>
                  <Component {...pageProps} />
                </MainBox>
              )}
            </Layout>
          </CartProvider>
        </StateContext>
      </SessionProvider>
    </React.Fragment>
  );
}

export default MyApp;
