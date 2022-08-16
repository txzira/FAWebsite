// pages/categories/[slug].js
import React, { useState } from "react";
import commerce from "../../lib/commerce";
import ProductList from "../../components/ProductList";

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
  const { data: categories } = await commerce.categories.list();

  const allCategories = [];

  async function getNthSubcategories(SubcategoryId) {
    const nthSubcategory = await commerce.categories.retrieve(SubcategoryId);

    if (nthSubcategory.children.length) {
      return await nthSubcategory.children;
    }
    return 0;
  }

  async function getSubcategories(parent) {
    if (parent.length !== 0) {
      const data = parent.map(async (child) => {
        allCategories.push(child.slug);
        const result = await getNthSubcategories(child.id);
        if (result && result.length !== 0) {
          return getSubcategories(result);
        }
        return 0;
      });
      await Promise.all(data);
    } else {
      return 0;
    }
  }
  await getSubcategories(categories);

  // async function fetchCategories() {
  //   const response = await fetch(`${server}/api/commercejs/categories`);

  //   const cats = await response.json();
  //   return cats.categories;
  // }
  // const allCategories = await fetchCategories();
  // // console.log(allCategories);

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
