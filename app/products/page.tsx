// pages/index.js
import commerce from "../../lib/commerce";
import ProductList from "../ProductList";
import React from "react";

async function IndexPage() {
  const merchant = await commerce.merchants.about();
  const { data: categories } = await commerce.categories.list();
  const { data: products } = await commerce.products.list();

  return (
    <>
      <ProductList products={products} />
    </>
  );
}

export default IndexPage;
