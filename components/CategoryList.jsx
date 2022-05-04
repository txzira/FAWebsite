// components/CategoryList.js
import Link from "next/link";
import React from "react";

import { useStateContext } from "../context/StateContext";

import Category from "./Category";


export default function CategoryList() {
  const { categories } = useStateContext();
  

  if (!categories) return null;

  return (
    <React.Fragment> 
      {categories.map((category) => (
        <div className='navbar-item' key={category.slug}>
          <Link href={`/categories/${category.slug}`}>
            <a>
              <Category {...category} />
            </a>
          </Link>
        </div>
      ))}
    </React.Fragment>
  );
}