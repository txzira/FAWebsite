// pages/products/[permalink].js
import commerce from "../../lib/commerce";
import React, { useState, useEffect } from "react";
import ProductDetail from "../../components/ProductDetail";

export async function getStaticProps({ params }) {
  const { permalink } = params;
  const product = await commerce.products.retrieve(permalink, {
    type: "permalink",
  });

  return {
    props: {
      product,
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

export default function ProductPage({ product }) {
  const [sizeOptionKey, setSizeOptionKey] = useState(null);
  const [colorOptionKey, setColorOptionKey] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    getOptions();
  }, []);

  const getOptions = () => {
    const colorsArr = [];
    let color = {};
    const sizesArr = [];
    let size = {};

    product.variant_groups.map((details) => {
      if (details.name == "Color") {
        setColorOptionKey(details.id);
        details.options.map((option) => {
          color.id = option.id;
          color.name = option.name;
          color.assets = option.assets;
          colorsArr.push(color);
          // [{ id: option.id, color: option.name, assets: [option.assets] },{},...,{}]
          color = {};
        });
      } else if (details.name == "Size") {
        setSizeOptionKey(details.id);
        details.options.map((option) => {
          size.id = option.id;
          size.name = option.name;
          sizesArr.push(size);
          // [{ id: option.id, size: option.name },{},...,{}]
          size = {};
        });
      }
    });
    setSizes(sizesArr);
    setColors(colorsArr);
  };

  return (
    <React.Fragment>
      <ProductDetail
        product={product}
        colors={colors}
        sizes={sizes}
        sizeOptionKey={sizeOptionKey}
        colorOptionKey={colorOptionKey}
      />
    </React.Fragment>
  );
}
