// pages/products.js
import commerce from "../lib/commerce";
import ProductList from "../components/ProductList";
import React from 'react';

export async function getStaticProps() {
  const { data: products } = await commerce.products.list();

  return {
    props: {
      products,
    },
  };
}

export default function ProductsPage({ products }) {
  return (
    <React.Fragment>
      <h1>Products</h1>

      <ProductList products={products} />
    </React.Fragment>
  );
}