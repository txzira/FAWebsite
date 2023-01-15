import React from "react";
import commerce from "../../lib/commerce";
import { GetStaticProps } from "next";

export default async function about() {
  const merchant = await commerce.merchants.about();

  console.log(merchant);

  return <div>about page</div>;
}
