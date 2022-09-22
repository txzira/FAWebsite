import React from "react";
import Image from "next/image";
import Link from "next/link";

export const NavContainer = ({ children }: { children: React.ReactNode }) => <div className="sticky top-0 z-10 w-full">{children}</div>;

export const NavHead = ({ children }: { children: React.ReactNode }) => (
  <div className="text-center w-full p-2.5 bg-black text-white ">{children}</div>
);

export const NavList = ({ children }: { children: React.ReactNode }) => (
  <ul className="flex bg-custom grow-0 h-14 justify-between list-none m-0 p-0">{children}</ul>
);

export const NavLogo = ({ logoSrc }: { logoSrc: string }) => (
  <li className="" style={{ marginLeft: "1vw" }}>
    <Link href="/">
      <a>
        <Image alt="logo" width={120} height={60} src={logoSrc} />
      </a>
    </Link>
  </li>
);

export const NavItem = ({ children, key, id }: { children: React.ReactNode; key: string; id: string }) => (
  <li key={key} id={id} className="flex">
    {children}
  </li>
);
