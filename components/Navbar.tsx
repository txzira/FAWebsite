import React, { useEffect, useState } from "react";

import { useSession, signOut } from "next-auth/react";

import { useStateContext } from "../context/StateContext";
import CartModal from "./CartModal";
import CategoryList from "./CategoryList";
import { useCartState } from "../context/cart";
import { NavButtons, NavContainer, NavHead, NavList, NavLogo } from "./Nav";

import styles from "../styles/Navbar.module.css";

const Navbar = () => {
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
      //reset nav link colors
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
        // console.log(link.getElementById);
      });
      // console.log(linksElement);
      const pathSlug = path.split("/")[2];
      let navBtn = document.getElementById(pathSlug);
      // console.log(navBtn.name);
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
      <NavList>
        <li className="ml-5">
          <NavLogo logoSrc="/images/logo_size.png" />
        </li>
        <li id="links">{categories && <CategoryList />}</li>

        <li className="mr-5" onMouseLeave={() => setDropdownIsActive(false)}>
          <NavButtons
            session={session}
            setActive={setDropdownIsActive}
            isActive={dropdownIsActive}
            loading={loading}
            logoutFn={logoutHandler}
            total_items={total_items}
            setShowCart={setShowCart}
          />
        </li>
      </NavList>

      {showCart && <CartModal />}
    </NavContainer>
  );
};

export default Navbar;
