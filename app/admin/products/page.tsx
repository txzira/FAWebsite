import React from "react";
import { Product } from "@chec/commerce.js/types/product";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import ProductTable from "./ProductTable";
// import useSWR from "swr";

export default async function Products() {
  const session = await unstable_getServerSession(authOptions);
  if (session.user.role) {
    const url = new URL(`https://api.chec.io/v1/products`);

    const params = {
      limit: "20",
      page: "1",
    };
    Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

    let products: any = await fetch(url, {
      method: "GET",
      headers: {
        "X-Authorization": `${process.env.CHEC_SECRET_API_KEY}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    products = await products.json();
    console.log(products);
    return (
      <div>
        <h1>Products</h1>
        <ProductTable initProducts={products.data} />
      </div>
    );
  } else return null;
}
