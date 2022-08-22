// components/Category.js
import React from "react";
import Dropdown from "./Dropdown";
import Link from "next/link";
export default function Category({ name, children, slug }) {
  return (
    <div>
      {children.length > 0 ? (
        <Dropdown dropdownName={name} submenuItems={children} />
      ) : (
        <Link href={`/categories/${slug}`}>
          <a>{name}</a>
        </Link>
      )}
    </div>
  );
}
