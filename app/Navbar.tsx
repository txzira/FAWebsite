"use client";
import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useStateContext } from "../context/StateContext";
import { useCartState } from "../context/cart";
import CategoryList from "./CategoryList";
import CartModal from "./CartModal";
import Image from "next/image";
import Link from "next/link";

import { useSelectedLayoutSegment } from "next/navigation";
import { Session } from "next-auth";
import { CgProfile } from "react-icons/cg";
import { AiOutlineShopping } from "react-icons/ai";

export const NavContainer = ({ children }: { children: React.ReactNode }) => <div className="sticky top-0 z-10 w-full">{children}</div>;

export const NavHead = ({ children }: { children: React.ReactNode }) => (
  <div className="text-center w-screen md:p-2.5 bg-black text-white ">{children}</div>
);

export const HorizontalNavList = ({
  children,
  isLinks = false,
  listId = "",
}: {
  children: React.ReactNode;
  isLinks?: boolean;
  listId?: string;
}) => {
  if (isLinks)
    return (
      <div id={listId} className="flex md:flex-row bg-custom-100 grow-0 h-8 md:h-14 m-0 p-0">
        {children}
      </div>
    );
  else return <div className="flex md:flex-row bg-custom-100 grow-0 h-8 md:h-14 m-0 p-0">{children}</div>;
};
export const VerticalNavList = ({
  children,
  isLinks = false,
  listId = "",
}: {
  children: React.ReactNode;
  isLinks?: boolean;
  listId?: string;
}) => {
  if (isLinks)
    return (
      <div id={listId} className="flex md:flex-col bg-custom-100 grow-0 h-8 md:h-screen m-0 p-0">
        {children}
      </div>
    );
  else return <div className="flex md:flex-col bg-custom-100 grow-0 h-8 md:h-screen m-0 p-0">{children}</div>;
};

export const NavLogo = ({ logoSrc }: { logoSrc: string }) => (
  <div className="w-14 h-8 md:w-28 md:h-14 relative">
    <Link href="/">
      <Image alt="logo" className="object-cover" fill={true} src={logoSrc} />
    </Link>
  </div>
);

export const NavItem = ({ children, id, title = "" }: { children: React.ReactNode; id: string; title?: string }) => (
  <div id={id} title={title} className="hover:bg-black hover:text-white">
    {children}
  </div>
);

export const NavLink = ({ href, aId, aTag }: { href: string; aId: string; aTag: string }) => {
  // const segment = useSelectedLayoutSegment();
  // console.log(segment);

  return (
    <Link id={aId} href={href} className="text-center p-2 hover:!bg-black hover:!text-white ">
      {aTag}
    </Link>
  );
};

export const NavDropdown = ({ children, dropdownState }: { children: React.ReactNode; dropdownState: boolean }) => (
  <ul className={`flex-col w-full left-3/4 bg-custom-100 text-black absolute z-10 list-none ${dropdownState ? "flex" : "hidden"}`}>
    {children}
  </ul>
);

export const NavButtons = ({
  session,
  setActive,
  isActive,
  loading,
  logoutFn,
  total_items,
  setShowCart,
}: {
  session: Session;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  isActive: boolean;
  loading: boolean;
  logoutFn: () => void;
  total_items: any;
  setShowCart: any;
}) => (
  <ul className="flex items-center h-8 md:h-14 flex-row">
    {!session && !loading && (
      <li>
        <Link href="/auth">Login</Link>
      </li>
    )}
    {session && (
      <li className="h-full">
        <button
          onClick={() => setActive((prev) => !prev)}
          className="h-8 md:h-14 bg-transparent border-none block w-full"
          aria-expanded={isActive ? "true" : "false"}
        >
          <div className="flex flex-row pr-3 md:text-xl">
            <CgProfile className="md:text-xl" />
          </div>
        </button>

        <NavDropdown dropdownState={isActive}>
          {session.user.role === "admin" && (
            <li className=" w-full h-8 md:h-14 hover:bg-black hover:text-white">
              <Link className="w-full text-center md:p-2" href="/admin">
                Admin
              </Link>
            </li>
          )}
          <li className="h-8 md:h-14 hover:bg-black hover:text-white">
            <Link className="flex items-center h-8 md:h-14 md:p-2" href="/account">
              {session.user.email.toUpperCase()}&apos;s Account
            </Link>
          </li>
          <li className="h-8 md:h-14 hover:bg-black hover:text-white">
            <button className="flex items-center h-full w-full md:p-2" onClick={logoutFn}>
              Logout
            </button>
          </li>
        </NavDropdown>
      </li>
    )}
    <li>
      <button
        type="button"
        className="bg-transparent border-none text-2xl relative transition-transform duration-300  hover:ease-in hover:scale-110"
        onClick={() => setShowCart(true)}
      >
        <AiOutlineShopping size={20} />
        <span className="flex items-center bg-red-600 rounded-full text-white h-5 w-5 p-1 font-semibold text-xs absolute">
          {total_items}
        </span>
      </button>
    </li>
  </ul>
);

export default function Navbar() {
  const { categories, showCart, setShowCart } = useStateContext();
  const { total_items } = useCartState();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [dropdownIsActive, setDropdownIsActive] = useState(false);
  const logoutHandler = () => {
    signOut();
  };

  useEffect(() => {
    const path = window.location.pathname;
    if (path == "/") {
      const linksElement = document.getElementById("links").childNodes;
      linksElement.forEach((link: HTMLElement) => {
        link.style.backgroundColor = "#f3f3f3";
        link.style.color = "black";
      });
    } else {
      const linksElement = document.getElementById("links").childNodes;

      linksElement.forEach((link: HTMLElement) => {
        link.style.backgroundColor = "#f3f3f3";
        link.style.color = "black";
      });
      const pathSlug = path.split("/")[2];
      let navBtn = document.getElementById(pathSlug);
      if (navBtn) {
        if (navBtn.getAttribute("title")) {
          navBtn = document.getElementById(navBtn.getAttribute("title"));
        }
        navBtn.style.backgroundColor = "black";
        navBtn.style.color = "white";
      }
    }
  });

  return (
    <NavContainer>
      <NavHead>1-800-JESTER</NavHead>
      <HorizontalNavList>
        <div className="mr-3 md:ml-5 md:mr-0 w-3/5 flex flex-col md:flex-row md:justify-between">
          <NavLogo logoSrc="/images/logo_size.png" />
          <div>{categories && <CategoryList />}</div>
        </div>
        <div className="flex justify-end w-2/5 ml-3 md:ml-0 md:mr-5">
          <div className="" onMouseLeave={() => setDropdownIsActive(false)}>
            <NavButtons
              session={session}
              setActive={setDropdownIsActive}
              isActive={dropdownIsActive}
              loading={loading}
              logoutFn={logoutHandler}
              total_items={total_items}
              setShowCart={setShowCart}
            />
          </div>
        </div>
      </HorizontalNavList>
      {showCart && <CartModal />}
    </NavContainer>
  );
}