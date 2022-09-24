import React from "react";
import { useCartState } from "../context/cart";
import Image from "next/image";

const CartReview = ({ lineItems }) => (
  <div className="flex justify-center  w-1/2">
    <div className="w-3/4">
      {lineItems.map((item) => (
        <div className="flex flex-row items-center ">
          {/* {console.log(item)} */}
          <Image src={item.image.url} height={40} width={40} alt="Product image." />
          <p>{item.name}</p>
          <p>{item.price.formatted_with_symbol}</p>
        </div>
      ))}
    </div>
  </div>
);

export default CartReview;
