import React from "react";
import Head from "next/head";
import Footer from "./Footer";

import Navbar from "./Navbar";
import { useStateContext } from "../context/StateContext";

const Layout = ({ children }) => {
  const { setShowCart } = useStateContext();

  return (
    <div className="layout">
      <Head>
        <title>Cool Skate Shop</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <header>
        <Navbar />
      </header>
      <main className="main-container">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
