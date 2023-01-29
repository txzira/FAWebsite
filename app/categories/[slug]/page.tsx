// pages/categories/[slug].js
import React from "react";
import commerce from "../../../lib/commerce";
import ProductList from "../../ProductList";

export async function generateStaticParams() {
  const { data: categoryList } = await commerce.categories.list();
  console.log(categoryList);
  const allCategories = [];

  async function getNthSubcategories(SubcategoryId) {
    //retrieve category details using their "id"
    const { children: nthSubcategory } = await commerce.categories.retrieve(SubcategoryId);
    if (nthSubcategory.length) {
      //if subcategories exist within the category details return them
      return nthSubcategory;
    }
    // else base case
    return 0;
  }

  async function getSubcategories(categories) {
    if (categories.length !== 0) {
      let index = 0;
      categories.map(async (subcategories) => {
        console.log(subcategories.slug, ++index);
        allCategories.push(subcategories.slug);
        const result = await getNthSubcategories(subcategories.id);
        if (result && result.length !== 0) {
          //recursive function call
          return getSubcategories(result);
        }
        //base case
        return;
      });
    } else {
      //base case
      return;
    }
  }
  await getSubcategories(categoryList);
  return allCategories.map((category) => ({
    slug: category,
  }));
}

// domain/categories/[slug].js
export default async function CategoryPage({ params }) {
  const slug: string = params.slug.toString();

  const category = await commerce.categories.retrieve(slug, {
    type: "slug",
  });

  const { data: products } = await commerce.products.list({
    category_slug: [slug],
  });
  return (
    <>
      <h1>{category.name}</h1>
      <ProductList products={products} />
    </>
  );
}
