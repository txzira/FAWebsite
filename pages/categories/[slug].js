// pages/categories/[slug].js
import React, { useState } from "react";
import commerce from "../../lib/commerce";
import ProductList from "../../components/ProductList";

const dev = process.env.SERVER_ENV !== "production";

const server = dev
  ? "http://localhost:3000"
  : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
console.log(dev);
export async function getStaticProps({ params }) {
  const { slug } = params;

  const category = await commerce.categories.retrieve(slug, {
    type: "slug",
  });

  const { data: products } = await commerce.products.list({
    category_slug: [slug],
  });

  return {
    props: {
      category,
      products,
    },
  };
}
// pages/categories/[slug].js
export async function getStaticPaths() {
  // const { data: categories } = await commerce.categories.list();

  async function fetchCategories() {
    const response = await fetch(`${server}/api/commercejs/categories`);

    const cats = await response.json();
    return cats.categories;
  }
  const allCategories = await fetchCategories();
  // console.log(allCategories);

  return {
    paths: allCategories.map((category) => ({
      params: {
        slug: category,
      },
    })),
    fallback: false,
  };
}
// pages/categories/[slug].js
export default function CategoryPage({ category, products }) {
  return (
    <React.Fragment>
      <h1>{category.name}</h1>
      <ProductList products={products} />
    </React.Fragment>
  );
}
