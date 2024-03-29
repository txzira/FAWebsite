import React, { useEffect } from "react";
import Image from "next/image";
import { HorizontalDivider } from "../GeneralComponents";

const CartReview = ({ checkoutToken }) => {
  useEffect(() => {}, [checkoutToken]);

  return (
    <div className="flex justify-center  w-1/2">
      <div className="w-3/4">
        {checkoutToken.line_items.map((item) => (
          <div className="flex flex-row justify-between p-2" key={item.id}>
            <div className="flex flex-row">
              <Image src={item.image.url} height={60} width={60} alt="Product image." />
              <div className="flex flex-col">
                <p className="font-semibold">{item.name}</p>
                <div>
                  {item.selected_options.map((option) => (
                    <span key={option.id}>
                      {option.option_name}
                      {"  "}
                    </span>
                  ))}
                  <span>- x{item.quantity}</span>
                </div>
              </div>
            </div>
            <p className="items-start">{item.price.formatted_with_symbol}</p>
          </div>
        ))}
        <HorizontalDivider tailwindClass="border-black m-6" />
        <div className="flex flex-col">
          <div className="flex flex-row justify-between p-1">
            <span>Subtotal</span>
            <span>{checkoutToken.live.subtotal.formatted_with_symbol}</span>
          </div>
          <div className="flex flex-row justify-between p-1">
            <span>Shipping</span>
            <span>{checkoutToken.shipping.id ? checkoutToken.shipping.price.formatted_with_symbol : "Calculated at next step."}</span>
          </div>
          <div className="flex flex-row justify-between p-1">
            <span>Taxes (estimated)</span>
            <span>{checkoutToken.live.tax.amount.formatted_with_symbol}</span>
          </div>
        </div>
        <HorizontalDivider tailwindClass="border-black m-6" />
        <div className="flex flex-row justify-between p-1">
          <span>Total {checkoutToken.live.currency.code}</span>
          <span>{checkoutToken.live.total_with_tax.formatted_with_symbol}</span>
        </div>
      </div>
    </div>
  );
};

export default CartReview;
