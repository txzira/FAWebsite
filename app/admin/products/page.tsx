"use client";
import React, { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { Product } from "@chec/commerce.js/types/product";
import Image from "next/image";
import ProductDetailModal from "../../../components/products/ProductDetailModal";
// import useSWR from "swr";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (session) {
    const url = new URL(`https://api.chec.io/v1/products`);

    const params = {
      limit: "20",
      page: "1",
    };
    Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

    const headers = {
      "X-Authorization": `${process.env.NEXT_PUBLIC_CHEC_SECRET_API_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    let products = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    products = await products.json();

    return {
      props: {
        initProducts: products,
      },
    };
  } else {
    return {
      props: {
        initProducts: null,
      },
    };
  }
};

export default function Products({ initProducts }) {
  const [products, setProducts] = useState(initProducts);
  const [productDetail, setProductDetail] = useState<Product>(initProducts.data[0]);
  const [showModal, setShowModal] = useState(false);
  const fetcher = (url) => fetch(url).then((res) => res.json());

  function showProductDetails(productObj) {
    setProductDetail(productObj);
    setShowModal(true);
    console.log(productDetail);
  }
  // const { data, error } = useSWR(`/api/commercejs/getorders?page=${pageNum}&limit=${limit}`, fetcher);
  // console.log(products);\
  useEffect(() => {}, [productDetail]);
  return (
    <div>
      <h1>Products</h1>
      <ProductDetailModal setShow={setShowModal} show={showModal} productObj={productDetail} />
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Price</th>
            <th>Shipping Allowed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.data.map((product: Product) => (
            <tr>
              <td>
                <Image src={product.image.url} height={40} width={40} alt="Product Image" />
              </td>
              <td>{product.name}</td>
              <td>{product.price.formatted_with_symbol}</td>
              <td>{product.meta ? "Allowed" : "Not Allowed"}</td>
              <td>
                <button onClick={() => showProductDetails(product)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
