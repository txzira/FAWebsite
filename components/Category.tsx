import React from "react";
import Dropdown from "./Dropdown";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
export default function Category({ name, children, slug }) {
  const segement = useSelectedLayoutSegment();
  console.log(segement);
  return (
    <>
      {children.length > 0 ? (
        <Dropdown dropdownName={name} dropdownSlug={slug} submenuItems={children} path={"/categories"} />
      ) : (
        <Link className="flex items-center text-sm md:text-base h-full w-full md:p-3" href={`/categories/${slug}`}>
          {name}
        </Link>
      )}
    </>
  );
}
