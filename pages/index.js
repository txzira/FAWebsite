// pages/index.js
import commerce from "../lib/commerce";
import ProductList from "../components/ProductList";
import CategoryList from "../components/CategoryList";
import Link from "next/link";
import React from 'react';

export async function getStaticProps() {
  const merchant = await commerce.merchants.about();
  const { data: categories } = await commerce.categories.list();
  const { data: products } = await commerce.products.list();

  return {
    props: {
      merchant,
      categories,
      products,
    },
  };
}
// pages/index.js
const IndexPage = ({ merchant, categories, products }) => {
  return (
    <>
      <h1>{merchant.business_name}</h1>    
      {/* <h3>
        <Link href="/products"><a>Products</a></Link>
      </h3> */}
      <ProductList products={products} />
    </>
  );
}

export default IndexPage;