"use client";
import React, { use } from "react";
import { HorizontalNavList, NavItem } from "./NavComponents";
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
  console.log(segment);

  return (
    <Link id={aId} href={href} className="flex items-center text-sm md:text-base h-full w-full md:p-3">
      {aTag}
    </Link>
  );
}

export function CategoryList({ categories }: { categories: Category[] }) {
  if (!categories) return null;

  return (
    <HorizontalNavList isLinks={true} listId="links">
      {categories.map((category) => {
        return (
          <NavItem key={category.id} id={category.slug}>
            <Category {...category} />
          </NavItem>
        );
      })}
    </HorizontalNavList>
  );
}
