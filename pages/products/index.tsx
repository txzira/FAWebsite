// pages/index.js
import commerce from "../../lib/commerce";
import ProductList from "../../components/ProductList";
import CategoryList from "../../components/CategoryList";
import Link from "next/link";
import React from "react";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async () => {
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
};

const IndexPage = ({ categories, products }) => {
  return (
    <>
      <ProductList products={products} />
    </>
  );
};

export default IndexPage;
