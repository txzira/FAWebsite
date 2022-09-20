// components/CategoryList.js
import Link from "next/link";
import React, { useEffect } from "react";

import { useStateContext } from "../context/StateContext";

import Category from "./Category";
import styles from "../styles/Navbar.module.css";

export default function CategoryList() {
  const { categories } = useStateContext();
  if (!categories) return null;

  return (
    <React.Fragment>
      {categories.map((category) => (
        <li key={category.id} className="category" id={category.slug}>
          <Category {...category} />
        </li>
      ))}
    </React.Fragment>
  );
}
