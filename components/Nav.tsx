import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Session } from "next-auth";
import { CgProfile } from "react-icons/cg";
import { AiOutlineShopping } from "react-icons/ai";

export const NavContainer = ({ children }: { children: React.ReactNode }) => <div className="sticky top-0 z-10 w-full">{children}</div>;

export const NavHead = ({ children }: { children: React.ReactNode }) => (
  <div className="text-center w-screen md:p-2.5 bg-black text-white ">{children}</div>
);

export const NavList = ({ children }: { children: React.ReactNode }) => (
  <div className="flex  md:flex-row bg-custom-100 grow-0 h-8 md:h-14  m-0 p-0">{children}</div>
);

export const NavLogo = ({ logoSrc }: { logoSrc: string }) => (
  <div className="w-14 h-8 md:w-28 md:h-14 relative">
    <Link href="/">
      <a>
        <Image alt="logo" objectFit="cover" layout="fill" src={logoSrc} />
      </a>
    </Link>
  </div>
);

export const NavItem = ({ children, key, id, title = "" }: { children: React.ReactNode; key: string; id: string; title?: string }) => (
  <div key={key} id={id} title={title} className="hover:bg-black hover:text-white">
    {children}
  </div>
);

export const NavDropdown = ({ children, dropdownState }: { children: React.ReactNode; dropdownState: boolean }) => (
  <ul className={`flex-col w-full left-3/4 bg-custom-100 text-black absolute z-10 list-none  ${dropdownState ? "flex" : "hidden"}`}>
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
        <Link href="/auth">
          <a>Login</a>
        </Link>
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
              <Link href="/admin">
                <a className="w-full text-center md:p-2">Admin</a>
              </Link>
            </li>
          )}
          <li className="h-8 md:h-14 hover:bg-black hover:text-white">
            <Link href="/account">
              <a className="flex items-center h-8 md:h-14 md:p-2">{session.user.email.toUpperCase()}'s Account</a>
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
