// components/CategoryList.js
import Link from "next/link";
import React, { useEffect } from "react";

import { useStateContext } from "../context/StateContext";

import Category from "./Category";
import styles from "../styles/Navbar.module.css";
import { NavList, NavItem } from "./Nav";

export default function CategoryList() {
  const { categories } = useStateContext();
  if (!categories) return null;

  return (
    <NavList>
      {categories.map((category) => (
        <NavItem key={category.id} id={category.slug}>
          <Category {...category} />
        </NavItem>
      ))}
    </NavList>
  );
}
