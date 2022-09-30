import React, { useEffect } from "react";
import { useStateContext } from "../context/StateContext";

import { NavList, NavItem } from "./Nav";
import Category from "./Category";

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
