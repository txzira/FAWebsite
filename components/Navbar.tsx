import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

import { AiOutlineShopping } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { useStateContext } from "../context/StateContext";
import CartModal from "./CartModal";
import CategoryList from "./CategoryList";
import { useCartState } from "../context/cart";
import { NavContainer, NavHead, NavList, NavLogo } from "./Nav";

import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const { categories, showCart, setShowCart } = useStateContext();
  const { total_items } = useCartState();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [dropdownIsActive, setDropdownIsActive] = useState(false);
  function logoutHandler() {
    signOut();
  }

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
        <NavLogo logoSrc="/images/logo_size.png" />
        <div className={styles.links} id="links">
          {categories && <CategoryList />}
        </div>

        <div className={styles.navbarButtons} onMouseLeave={() => setDropdownIsActive(false)} style={{ marginRight: "1vw" }}>
          {!session && !loading && (
            <li>
              <Link href="/auth">
                <a>Login</a>
              </Link>
            </li>
          )}
          {session && (
            <li style={{ height: "100%" }}>
              <button
                onClick={() => setDropdownIsActive((prev) => !prev)}
                className={styles.login}
                aria-expanded={dropdownIsActive ? "true" : "false"}
                style={{ height: "100%" }}
              >
                <CgProfile />
                {session.user.email}
              </button>
              <div style={{ display: "flex" }}>
                <ul className={`dropdown ${dropdownIsActive ? "show" : ""}`}>
                  {session.user.role === "admin" && (
                    <li className="category" style={{ height: "60px", width: "100%" }}>
                      <Link href="/admin">
                        <a style={{ width: "100%", textAlign: "center" }}>Admin</a>
                      </Link>
                    </li>
                  )}
                  <li style={{ height: "60px" }}>
                    <Link href="/account">
                      <a style={{ height: "60px" }}>My Account</a>
                    </Link>
                  </li>
                  <li>
                    <button onClick={logoutHandler}>Logout</button>
                  </li>
                </ul>
              </div>
            </li>
          )}
          <li>
            <button type="button" className="cart-icon" onClick={() => setShowCart(true)}>
              <AiOutlineShopping />
              <span className={styles.navbarCartItemQty}>{total_items}</span>
            </button>
          </li>
        </div>
      </NavList>

      {showCart && <CartModal />}
    </NavContainer>
  );
};

export default Navbar;
