import React from "react";
import Dropdown from "./Dropdown";
import Link from "next/link";
export default function Category({ name, children, slug }) {
  return (
    <>
      {children.length > 0 ? (
        <Dropdown dropdownName={name} dropdownSlug={slug} submenuItems={children} path={"/categories"} />
      ) : (
        <Link href={`/categories/${slug}`}>
          <a className="flex items-center text-sm md:text-base h-full w-full md:p-3">{name}</a>
        </Link>
      )}
    </>
  );
}
