"use client";
import React from "react";
import { Toaster } from "react-hot-toast";

export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="w-full max-w-1400 m-auto">
        <Toaster />
        {children}
      </main>
    </>
  );
}
