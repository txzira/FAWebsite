import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useStateContext } from "../context/StateContext";
import { useCartState } from "../context/cart";
import CategoryList from "./CategoryList";
import { NavButtons, NavContainer, NavHead, NavList, NavLogo } from "./Nav";
import CartModal from "./CartModal";

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
      <NavList>
        <div className="mr-3 md:ml-5 md:mr-0 w-2/3 flex flex-col md:flex-row md:justify-between">
          <NavLogo logoSrc="/images/logo_size.png" />
          <div id="links">{categories && <CategoryList />}</div>
        </div>
        <div className="flex justify-end w-1/3 ml-3 md:ml-0 md:mr-5">
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
      </NavList>
      {showCart && <CartModal />}
    </NavContainer>
  );
};

export default Navbar;
