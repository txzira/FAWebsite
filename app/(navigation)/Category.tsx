"use client";
import React, { use } from "react";
import Dropdown from "../../components/Dropdown";
import { Category } from "@chec/commerce.js/types/category";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";

export function Category({ name, children, slug }: { name: any; children?: any; slug: any }) {
  return (
    <>
      {children.length > 0 ? (
        <Dropdown dropdownName={name} dropdownSlug={slug} submenuItems={children} path={"/categories"} />
      ) : (
        <CategoryLink aId={name} aTag={name} href={`/categories/${slug}`} />
      )}
    </>
  );
}
export function CategoryLink({ href, aId, aTag }: { href: string; aId: string; aTag: string }) {
  const segment = useSelectedLayoutSegments();
  const active = href.split("/")[2] === segment[1];
  return (
    <Link
      id={aId}
      href={href}
      className={`flex items-center text-sm md:text-base h-full w-full md:p-3 ${
        active ? "bg-black text-custom-100" : "hover:bg-black hover:text-custom-100"
      }`}
    >
      {aTag}
    </Link>
  );
}

export function CategoryList({ categories }: { categories: Category[] }) {
  if (!categories) return null;

  return (
    <div className="flex md:flex-row bg-custom-100 grow-0 h-8 md:h-14 m-0 p-0">
      {categories.map((category) => {
        return <Category key={category.id} {...category} />;
      })}
    </div>
  );
}
