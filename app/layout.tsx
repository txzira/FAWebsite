"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "../context/cart";
import { StateContext } from "../context/StateContext";
import { usePathname } from "next/navigation";

import { MainBox } from "../components/GeneralComponents";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <SessionProvider>
          <StateContext>
            <CartProvider>
              <header>
                <Navbar />
              </header>
              <main>
                <Toaster />
                {usePathname()?.startsWith("/admin") ? <>{children}</> : <MainBox>{children}</MainBox>}
              </main>
              <Footer />
            </CartProvider>
          </StateContext>
        </SessionProvider>
      </body>
    </html>
  );
}
