import { Product } from "@chec/commerce.js/types/product";
import Image from "next/image";
import React, { useState } from "react";

import type { ProductVariantGroup } from "@chec/commerce.js/types/product-variant-group";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import DOMPurify from "isomorphic-dompurify";

export const ProductImg = ({ image }: { image: string }) => (
  <div>
    <Image className="bg-neutral-200 cursor-pointer ease-in-out" height={400} width={400} alt="selected-variant" src={image} />
  </div>
);

export const ProductContainer = ({ children }: { children: React.ReactNode }) => <div className="flex m-10 mt-14 gap-10">{children}</div>;

export const ProductImages = ({ images, setImage }: { images: Array<string>; setImage: React.Dispatch<React.SetStateAction<string>> }) => (
  <div className="flex flex-col gap-2.5">
    {images.map((image: string, i) => (
      <button key={i} type="button" onClick={() => setImage(image)}>
        <Image className="small-image" src={image} height={70} width={70} alt="variant-image" />
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
          <ul className="flex list-none small-images-container">
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
  <div className="flex items-center gap-5 mt-2.5">
    <h3>Quantity</h3>
    <p className="quantity-desc">
      <span className="minus" onClick={decFunction}>
        <AiOutlineMinus />
      </span>
      <span className="num">{quantity}</span>
      <span className="plus" onClick={incFunction}>
        <AiOutlinePlus />
      </span>
    </p>
  </div>
);

export const AddToCart = ({ addToCart }: { addToCart: () => void }) => (
  <div className="buttons">
    <button type="button" className="add-to-cart" onClick={addToCart}>
      Add to Cart
    </button>
  </div>
);

export const ProductDesc = ({ product }: { product: Product }) => {
  const [showDesc, setShowDesc] = useState();

  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}></div>;
};
