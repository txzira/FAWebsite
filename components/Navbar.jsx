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
      linksElement.forEach((link) => {
        link.style.backgroundColor = "rgb(240, 240, 240)";
        link.style.color = "black";
      });
    } else {
      const linksElement = document.getElementById("links").childNodes;
      linksElement.forEach((link) => {
        link.style.backgroundColor = "rgb(240, 240, 240)";
        link.style.color = "black";
        // console.log(link.getElementById);
      });
      // console.log(linksElement);
      const pathSlug = path.split("/")[2];
      let navBtn = document.getElementById(pathSlug);
      // console.log(navBtn.name);
      if (navBtn) {
        if (navBtn.getAttribute("name")) {
          navBtn = document.getElementById(navBtn.getAttribute("name"));
        }
        console.log(navBtn);
        navBtn.style.backgroundColor = "black";
        navBtn.style.color = "white";
      }
    }
  });

  return (
    <div>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarHeader}>1-800-JESTER</div>
        <ul className={styles.navbarLinks}>
          <li className={styles.navbarLogo}>
            <Link href="/">
              <a>
                <Image alt="logo" width="120" height="60" src="/images/logo_size.png" />
              </a>
            </Link>
          </li>
          <div className={styles.links} id="links">
            {categories && <CategoryList />}
          </div>

          <div className={styles.navbarButtons} onMouseLeave={() => setDropdownIsActive(false)}>
            {!session && !loading && (
              <li>
                <Link href="/auth">
                  <a>Login</a>
                </Link>
              </li>
            )}
            {session && (
              <li>
                <button
                  onClick={() => setDropdownIsActive((prev) => !prev)}
                  className={styles.login}
                  aria-expanded={dropdownIsActive ? "true" : "false"}
                >
                  <CgProfile />
                  {session.user.email}
                </button>
                <div>
                  <ul className={`dropdown ${dropdownIsActive ? "show" : ""}`}>
                    {session.user.role === "admin" && (
                      <li className="category">
                        <Link href="/admin">
                          <a>Admin</a>
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link href="/account">
                        <a>My Account</a>
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
        </ul>
      </div>
      {showCart && <CartModal />}
    </div>
  );
};

export default Navbar;
