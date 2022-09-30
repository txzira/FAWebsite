import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Session } from "next-auth";
import { CgProfile } from "react-icons/cg";
import { AiOutlineShopping } from "react-icons/ai";

export const NavContainer = ({ children }: { children: React.ReactNode }) => <div className="sticky top-0 z-10 w-full">{children}</div>;

export const NavHead = ({ children }: { children: React.ReactNode }) => (
  <div className="text-center w-full p-2.5 bg-black text-white ">{children}</div>
);

export const NavList = ({ children }: { children: React.ReactNode }) => (
  <ul className="flex bg-custom-100 grow-0 h-14 justify-between list-none m-0 p-0">{children}</ul>
);

export const NavLogo = ({ logoSrc }: { logoSrc: string }) => (
  <Link href="/">
    <a>
      <Image alt="logo" width={120} height={60} src={logoSrc} />
    </a>
  </Link>
);

export const NavItem = ({ children, key, id, title = "" }: { children: React.ReactNode; key: string; id: string; title?: string }) => (
  <li key={key} id={id} title={title} className="hover:bg-black hover:text-white list-none">
    {children}
  </li>
);

export const NavDropdown = ({ children, dropdownState }: { children: React.ReactNode; dropdownState: boolean }) => (
  <ul className={`flex-col bg-custom-100 text-black absolute z-10 list-none  ${dropdownState ? "flex" : "hidden"}`}>{children}</ul>
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
  <ul className="flex items-center h-14 flex-row">
    {!session && !loading && (
      <li>
        <Link href="/auth">
          <a>Login</a>
        </Link>
      </li>
    )}
    {session && (
      <li className="h-full">
        <button
          onClick={() => setActive((prev) => !prev)}
          className="h-14 bg-transparent border-none block w-full"
          aria-expanded={isActive ? "true" : "false"}
        >
          <div className="flex flex-row pr-3">
            <CgProfile size={20} />
            {session.user.email}
          </div>
        </button>

        <NavDropdown dropdownState={isActive}>
          {session.user.role === "admin" && (
            <li className="category w-full h-14 hover:bg-black hover:text-white">
              <Link href="/admin">
                <a className="w-full text-center p-2">Admin</a>
              </Link>
            </li>
          )}
          <li className=" h-14 hover:bg-black hover:text-white">
            <Link href="/account">
              <a className="flex items-center h-14 p-2">My Account</a>
            </Link>
          </li>
          <li className="h-14 hover:bg-black hover:text-white">
            <button className="flex items-center h-full w-full p-2" onClick={logoutFn}>
              Logout
            </button>
          </li>
        </NavDropdown>
      </li>
    )}
    <li>
      <button type="button" className="cart-icon" onClick={() => setShowCart(true)}>
        <AiOutlineShopping size={20} />
        <span className="flex items-center bg-red-600 rounded-full text-white h-5 w-5 p-1 font-semibold text-xs absolute">
          {total_items}
        </span>
      </button>
    </li>
  </ul>
);
