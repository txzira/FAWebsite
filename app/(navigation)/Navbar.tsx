"use client";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useStateContext } from "../../context/StateContext";
import { useCartState } from "../../context/cart";
import { CategoryList } from "./Category";
import CartModal from "../CartModal";
import { Category } from "@chec/commerce.js/types/category";
import Link from "next/link";
import Image from "next/image";
import { Session } from "next-auth";
import { CgProfile } from "react-icons/cg";
import { AiOutlineShopping } from "react-icons/ai";

export default function Navbar({ categories }: { categories: Category[] }) {
  const { showCart, setShowCart } = useStateContext();
  const { total_items } = useCartState();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [dropdownIsActive, setDropdownIsActive] = useState(false);
  const logoutHandler = () => {
    signOut();
  };

  return (
    <div className="sticky top-0 z-10 w-full">
      <div className="text-center w-screen md:p-2.5 bg-black text-white">1-800-JESTER</div>
      <div className="flex md:flex-row bg-custom-100 grow-0 h-8 md:h-14 m-0 p-0">
        <div className="mr-3 md:ml-5 md:mr-0 w-3/5 flex flex-col md:flex-row md:justify-between">
          <div className="w-14 h-8 md:w-28 md:h-14 relative">
            <Link href="/">
              <Image
                alt="logo"
                className="object-cover"
                fill={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src="/images/logo_size.png"
              />
            </Link>
          </div>
          <CategoryList categories={categories} />
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
      </div>
      {showCart && <CartModal />}
    </div>
  );
}

export function NavButtons({
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
}) {
  return (
    <ul className="flex items-center h-8 md:h-14 flex-row">
      {!session && !loading && (
        <li>
          <Link href="/auth/login">Login</Link>
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
          <ul className={`flex-col w-full left-3/4 bg-custom-100 text-black absolute z-10 list-none ${isActive ? "flex" : "hidden"}`}>
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
          </ul>
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
}
