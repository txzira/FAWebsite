import React from "react";
import commerce from "../lib/commerce";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async () => {
  const merchant = await commerce.merchants.about();

  return {
    props: {
      merchant,
    },
  };
};

const about = ({ merchant }) => {
  console.log(merchant);

  return <div>about page</div>;
};

export default about;
