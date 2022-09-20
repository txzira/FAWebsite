// pages/categories/[slug].js
import React, { useState } from "react";
import commerce from "../../lib/commerce";
import ProductList from "../../components/ProductList";
import { GetStaticProps, GetStaticPaths } from "next";

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug: string = params.slug.toString();

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
};
// pages/categories/[slug].js
export const getStaticPaths: GetStaticPaths = async () => {
  const { data: categoryList } = await commerce.categories.list();
  const allCategories = [];

  async function getNthSubcategories(SubcategoryId) {
    //retrieve category details using their "id"
    const nthSubcategory: any = await commerce.categories.retrieve(SubcategoryId);
    console.log(nthSubcategory);
    if (nthSubcategory.children.length) {
      //if subcategories exist within the category details return them
      return nthSubcategory.children;
    }
    // else base case
    return 0;
  }

  async function getSubcategories(categories) {
    if (categories.length !== 0) {
      const data = categories.map(async (subcategories) => {
        allCategories.push(subcategories.slug);
        const result = await getNthSubcategories(subcategories.id);
        if (result && result.length !== 0) {
          //recursive function call
          return getSubcategories(result);
        }
        //base case
        return 0;
      });
      await Promise.all(data);
    } else {
      //base case
      return 0;
    }
  }
  await getSubcategories(categoryList);

  return {
    paths: allCategories.map((category) => ({
      params: {
        slug: category,
      },
    })),
    fallback: false,
  };
};
// pages/categories/[slug].js
export default function CategoryPage({ category, products }) {
  return (
    <React.Fragment>
      <h1>{category.name}</h1>
      <ProductList products={products} />
    </React.Fragment>
  );
}
