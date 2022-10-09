import React, { useEffect } from "react";
import { NavLink, VerticalNavList } from "./Nav";

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const linksElement = document.getElementById("adminLinks").childNodes;

    linksElement.forEach((link: HTMLElement) => {
      link.style.backgroundColor = "#f3f3f3";
      link.style.color = "black";
    });

    let path: string;
    if (window.location.pathname == "/admin") {
      path = "admin";
    } else {
      path = window.location.pathname.split("/")[2];
    }

    let navBtn = document.getElementById(path);
    if (navBtn) {
      navBtn.style.backgroundColor = "black";
      navBtn.style.color = "white";
    }
  });

  return (
    <div className="flex flex-row">
      <VerticalNavList isLinks={true} listId="adminLinks">
        <NavLink href="/admin" aId="admin" aTag="Admin Home" />
        <NavLink href="/admin/orders" aId="orders" aTag="Orders" />
        <NavLink href="/admin/products" aId="products" aTag="Products" />
        <NavLink href="/admin/shipping" aId="shipping" aTag="Shipping" />
      </VerticalNavList>
      <>{children}</>
    </div>
  );
};

export default AccountLayout;
