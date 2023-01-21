"use client";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useStateContext } from "../../context/StateContext";
import { useCartState } from "../../context/cart";
import { CategoryList } from "./Category";
import CartModal from "../CartModal";
import { HorizontalNavList, NavButtons, NavContainer, NavHead, NavLogo } from "./NavComponents";
import { Category } from "@chec/commerce.js/types/category";

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
    <NavContainer>
      <NavHead>1-800-JESTER</NavHead>
      <HorizontalNavList>
        <div className="mr-3 md:ml-5 md:mr-0 w-3/5 flex flex-col md:flex-row md:justify-between">
          <NavLogo logoSrc="/images/logo_size.png" />
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
      </HorizontalNavList>
      {showCart && <CartModal />}
    </NavContainer>
  );
}
