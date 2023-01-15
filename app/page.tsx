import commerce from "../lib/commerce";
import ProductList from "../components/ProductList";
import React from "react";

async function IndexPage() {
  // const merchant = await commerce.merchants.about();
  // const { data: categories } = await commerce.categories.list();
  const { data: products } = await commerce.products.list();

  return (
    <>
      {/* <h1>{merchant.data[0].name}</h1> */}
      <ProductList products={products} />
    </>
  );
}

export default IndexPage;
