// components/CategoryList.js
import Link from "next/link";
import React from "react";

import { useStateContext } from "../context/StateContext";

import Category from "./Category";
import styles from '../styles/Navbar.module.css'

export default function CategoryList() {
  const { categories } = useStateContext();


  if (!categories) return null;

  return (
    <React.Fragment>
      {categories.map((category) => (
        <li>  
          <Link href={`/categories/${category.slug}`}>
            <a>
              <Category {...category} />
            </a>
          </Link>       
        </li>
      ))}
    </React.Fragment>
  );
}