import React from "react";
import Head from "next/head";

import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <title>Jester Shop</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <header>
        <Navbar />
      </header>
      <main className="w-full max-w-1400 m-auto">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
