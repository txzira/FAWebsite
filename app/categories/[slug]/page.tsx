// pages/categories/[slug].js
import React from "react";
import commerce from "../../../lib/commerce";
import ProductList from "../../../components/ProductList";

export async function generateStaticParams() {
  const { data: categoryList } = await commerce.categories.list();
  const allCategories = [];

  async function getNthSubcategories(SubcategoryId) {
    //retrieve category details using their "id"
    const nthSubcategory: any = await commerce.categories.retrieve(SubcategoryId);
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
  return allCategories.map((category) => ({
    slug: category,
  }));
}

// pages/categories/[slug].js
export default async function CategoryPage({ params }) {
  console.log(params);
  const slug: string = params.slug.toString();

  const category = await commerce.categories.retrieve(slug, {
    type: "slug",
  });

  const { data: products } = await Promise.resolve(
    commerce.products.list({
      category_slug: [slug],
    })
  );

  return (
    <React.Fragment>
      <h1>{category.name}</h1>
      <ProductList products={products} />
    </React.Fragment>
  );
}
