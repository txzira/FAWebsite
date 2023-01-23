import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import React, { useEffect } from "react";

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
      <div className="flex md:flex-col bg-custom-100 grow-0 h-8 md:h-screen m-0 p-0">
        <NavLink href="/admin" aId="admin" aTag="Admin Home" />
        <NavLink href="/admin/orders" aId="orders" aTag="Orders" />
        <NavLink href="/admin/products" aId="products" aTag="Products" />
        <NavLink href="/admin/shipping" aId="shipping" aTag="Shipping" />
      </div>
      <>{children}</>
    </div>
  );
};
function NavLink({ href, aId, aTag }: { href: string; aId: string; aTag: string }) {
  const segment = useSelectedLayoutSegment();
  console.log(segment);
  console.log("hello");
  return (
    <Link id={aId} href={href} className="text-center p-2 hover:!bg-black hover:!text-white ">
      {aTag}
    </Link>
  );
}

export default AccountLayout;
