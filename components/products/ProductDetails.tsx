import { Product } from "@chec/commerce.js/types/product";
import Image from "next/image";
import React, { useState } from "react";

import type { ProductVariantGroup } from "@chec/commerce.js/types/product-variant-group";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import DOMPurify from "isomorphic-dompurify";
import { VerticalDivider } from "../GeneralComponents";

export const ProductImg = ({ image }: { image: string }) => (
  <div className="relative w-32 h-32 md:w-96 md:h-96">
    <Image className="bg-custom-100 cursor-pointer ease-in-out" layout="fill" alt="selected-variant" src={image} />
  </div>
);

export const ProductContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex md:m-10 md:mt-14 md:gap-10">{children}</div>
);

export const ProductImages = ({ images, setImage }: { images: Array<string>; setImage: React.Dispatch<React.SetStateAction<string>> }) => (
  <div className="flex flex-col gap-2.5">
    {images.map((image: string, i) => (
      <button className="relative w-14 h-14 md:w-20 md:h-20" key={i} type="button" onClick={() => setImage(image)}>
        <Image className="bg-custom-100" src={image} layout="fill" alt="variant-image" />
      </button>
    ))}
  </div>
);

export const ProductDetailsContainer = ({ children }: { children: React.ReactNode }) => <div className="flex flex-col">{children}</div>;

export const ProductHeading = ({ product }: { product: Product }) => (
  <div className="text-black my-10 mx-0">
    <h2 className="text-4xl font-extrabold">{product.name.toUpperCase()}</h2>
    <p className="text-black text-2xl font-bold mt-2.5">{product.price.formatted_with_symbol}</p>
  </div>
);

export const ProductVariantGroups = ({
  variantGroups,
  handleColor,
  handleSize,
}: {
  variantGroups: ProductVariantGroup;
  handleColor: (name: string, mainImage: string, colorLabelId: string, colorId: string) => void;
  handleSize: (name: string, sizeLabelId: string, sizeId: string) => void;
}) => (
  <div>
    {Array.isArray(variantGroups) &&
      variantGroups.map((variantGroup) => (
        <div key={variantGroup.id}>
          <h2 id={variantGroup.id}>{variantGroup.name}:</h2>
          <ul className="flex gap-2.5 mt-5">
            {variantGroup.options.map((option, i) => {
              return variantGroup.name === "Color" ? (
                <li id={option.id} key={option.id} className="flex gap-8">
                  <button
                    id={`color${i}`}
                    className="border checked:border-black"
                    onClick={() => handleColor(option.name, option.assets[0].url, variantGroup.id, option.id)}
                  >
                    <Image src={option.assets[0].url} height={100} width={100} alt={option.name} />
                  </button>
                </li>
              ) : (
                <li key={option.id} className="flex gap-8">
                  <input
                    id={option.id}
                    className="hidden"
                    type="radio"
                    name={variantGroup.name}
                    onClick={() => handleSize(option.name, variantGroup.id, option.id)}
                  />
                  <label htmlFor={option.id}>{option.name}</label>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
  </div>
);

export const ProductQuantity = ({
  quantity,
  incFunction,
  decFunction,
}: {
  quantity: number;
  incFunction: () => void;
  decFunction: () => void;
}) => (
  <div className="block max-w-fit">
    <h3 className="text-lg">Qty</h3>
    <div className="flex border-2 border-black">
      <button className="text-red-600 align-middle py-1.5 px-3" onClick={decFunction}>
        <AiOutlineMinus />
      </button>
      <VerticalDivider tailwindClass="border-black" />
      <span className="text-xl py-1.5 px-3">{quantity}</span>
      <VerticalDivider tailwindClass="border-black" />
      <button className="text-green-500 align-middle py-1.5 px-3" onClick={incFunction}>
        <AiOutlinePlus />
      </button>
    </div>
  </div>
);

export const AddToCart = ({ addToCart }: { addToCart: () => void }) => (
  <button
    type="button"
    className="bg-black text-white border border-black rounded-3xl text-lg font-medium mt-10 py-2.5 px-5 hover:scale-110 hover:ease-in duration-300 w-48"
    onClick={addToCart}
  >
    Add to Cart
  </button>
);

export const ProductDesc = ({ product }: { product: Product }) => {
  const [showDesc, setShowDesc] = useState();

  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}></div>;
};
