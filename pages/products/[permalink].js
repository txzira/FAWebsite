// pages/products/[permalink].js
import commerce from "../../lib/commerce";
import React, { useState, useEffect } from "react";
import ProductDetail from "../../components/ProductDetail";

export async function getStaticProps({ params }) {
  const { permalink } = params;
  const product = await commerce.products.retrieve(permalink, {
    type: "permalink",
  });
  const variants = await commerce.products.getVariants(product.id);
  let variantGroups = await product.variant_groups.sort((a, b) => a.name.localeCompare(b.name));

  const headers = {
    "X-Authorization": `${process.env.NEXT_PUBLIC_CHEC_SECRET_API_KEY}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  variantGroups = await Promise.all(
    variantGroups.map(async (variantGroup) => {
      const options = await Promise.all(
        variantGroup.options.map(async (option) => {
          const assets = await Promise.all(
            option.assets.map(async (asset) => {
              const url = new URL(`https://api.chec.io/v1/assets/${asset}`);
              let response = await fetch(url, {
                method: "GET",
                headers: headers,
              });
              response = await response.json();
              return { id: asset, url: response.url ? response.url : "" };
            })
          );
          return { ...option, assets: assets };
        })
      );
      return { ...variantGroup, options: options };
    })
  );

  return {
    props: {
      product,
      variants,
      variantGroups,
    },
  };
}

export async function getStaticPaths() {
  const { data: products } = await commerce.products.list();

  return {
    paths: products.map((product) => ({
      params: {
        permalink: product.permalink,
      },
    })),
    fallback: false,
  };
}

export default function ProductPage({ product, variants, variantGroups }) {
  return (
    <React.Fragment>
      <ProductDetail product={product} variants={variants.data} variantGroups={variantGroups} />
    </React.Fragment>
  );
}
