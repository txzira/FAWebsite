"use client";
import { useSession } from "next-auth/react";
import { useSelectedLayoutSegments } from "next/navigation";
import Link from "next/link";

function NavLink({ href, aId, aTag }: { href: string; aId: string; aTag: string }) {
  const segment = useSelectedLayoutSegments();
  // const isActive = href===
  console.log(segment);

  return (
    <Link id={aId} href={href} className="text-center p-2 hover:!bg-black hover:!text-white ">
      {aTag}
    </Link>
  );
}

export default function AdminNavbar() {
  const { data: session, status } = useSession();
  console.log(session);
  if (session && session.user.role == "admin") {
    return (
      <div className="flex md:flex-col bg-custom-100 grow-0 h-8 md:h-screen m-0 p-0">
        <NavLink href="/admin" aId="admin" aTag="Admin Home" />
        <NavLink href="/admin/orders" aId="orders" aTag="Orders" />
        <NavLink href="/admin/products" aId="products" aTag="Products" />
        <NavLink href="/admin/shipping" aId="shipping" aTag="Shipping" />
      </div>
    );
  } else {
    return <div>Unauthorized User</div>;
  }
}
