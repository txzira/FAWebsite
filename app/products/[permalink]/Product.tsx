"use client";

import { VariantCollection } from "@chec/commerce.js/features/products";
import { Product } from "@chec/commerce.js/types/product";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCartDispatch } from "../../../context/cart";
import commerce from "../../../lib/commerce";
import {
  ProductImg,
  ProductContainer,
  ProductImages,
  ProductDetailsContainer,
  ProductHeading,
  ProductVariantGroups,
  ProductQuantity,
  AddToCart,
  // ProductDesc,
} from "../../../components/products/ProductDetails";
import { HorizontalDivider } from "../../../components/GeneralComponents";

export function ProductDetails({
  product,
  variantGroups,
  variants,
}: {
  product: Product;
  variantGroups: any;
  variants: VariantCollection;
}) {
  const setCart = useCartDispatch();
  const [options, setOptions] = useState({});
  const [image, setImage] = useState<string>(product.image.url);
  const [assetImages, setAssetImages] = useState<Array<string>>([]);
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  function defaultColor() {
    if (document.getElementById("color0")) {
      document.getElementById("color0").click();
    }
  }
  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };
  //decrement product quantity
  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;
      return prevQty - 1;
    });
  };
  const getColorStyleImages = (colorLabelId: string, colorId: string) => {
    const images: Array<string> = [];
    //find all images with the same colorId
    variants.data.map((variant) => {
      if (variant.options[colorLabelId] === colorId) {
        variant.assets.map((asset) => {
          if (!images.includes(asset.url)) images.push(asset.url);
        });
      }
    });
    return images;
  };
  //change selected color and shown image
  function handleColor(name: string, mainImage: string, colorLabelId: string, colorId: string) {
    const images = getColorStyleImages(colorLabelId, colorId);
    options[colorLabelId] = colorId;
    setOptions(options);
    setAssetImages(images);
    setImage(mainImage);
    setSelectedColor(name);
  }
  //change selected size
  function handleSize(name: string, sizeLabelId: string, sizeId: string) {
    options[sizeLabelId] = sizeId;
    setOptions(options);
    setSelectedSize(name);
  }

  useEffect(() => {
    defaultColor();
  }, []);
  const addToCart = () => {
    if (!(Object.keys(options).length === 0)) {
      commerce.cart.add(product.id, qty, options).then(({ cart }) => setCart(cart));
      toast.success(
        `${product.name} \n${selectedColor ? `Color: ${selectedColor}` : ""}${selectedColor && selectedSize ? " | " : " "}${
          selectedSize ? `Size: ${selectedSize}` : ""
        }\nwas added to the cart`
      );
    } else {
      toast.error(`Failed to add to cart:\n${product.name}\nPlease select product options.`);
    }
  };

  return (
    <>
      <ProductContainer>
        {assetImages.length != 0 && <ProductImages images={assetImages} setImage={setImage} />}
        <ProductImg image={image} />
        <ProductDetailsContainer>
          <ProductHeading product={product} />
          <ProductVariantGroups variantGroups={variantGroups} handleColor={handleColor} handleSize={handleSize} />
          <HorizontalDivider tailwindClass="m-6" />
          <ProductQuantity quantity={qty} incFunction={incQty} decFunction={decQty} />
          <br />
          <AddToCart addToCart={addToCart} />
          {/* <ProductDesc product={product} /> */}
        </ProductDetailsContainer>
      </ProductContainer>
    </>
  );
}
