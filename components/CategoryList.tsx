import React, { useEffect } from "react";
import { useStateContext } from "../context/StateContext";

import { HorizontalNavList, NavItem } from "./Nav";
import Category from "./Category";

export default function CategoryList() {
  const { categories } = useStateContext();
  if (!categories) return null;

  return (
    <HorizontalNavList isLinks={true} listId="links">
      {categories.map((category) => (
        <NavItem key={category.id} id={category.slug}>
          <Category {...category} />
        </NavItem>
      ))}
    </HorizontalNavList>
  );
}
