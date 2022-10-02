// pages/products/[permalink].js
import commerce from "../../lib/commerce";
import React, { useState, useEffect } from "react";
import { useCartDispatch } from "../../context/cart";
import { GetStaticProps, GetStaticPaths } from "next";
import { ProductVariantGroup } from "@chec/commerce.js/types/product-variant-group";
import { Product } from "@chec/commerce.js/types/product";
import { VariantCollection } from "@chec/commerce.js/features/products";
import {
  ProductImg,
  ProductContainer,
  ProductImages,
  ProductDetailsContainer,
  ProductHeading,
  ProductVariantGroups,
  ProductQuantity,
  AddToCart,
  ProductDesc,
} from "../../components/products/ProductDetails";
import toast from "react-hot-toast";
import { HorizontalDivider } from "../../components/GeneralComponents";

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const permalink: string = params.permalink.toString();
  const product = await commerce.products.retrieve(permalink, {
    type: "permalink",
  });
  const variants = await commerce.products.getVariants(product.id);
  let variantGroups: any = await product.variant_groups.sort((a, b) => a.name.localeCompare(b.name));

  const headers = {
    "X-Authorization": `${process.env.NEXT_PUBLIC_CHEC_SECRET_API_KEY}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  variantGroups = await Promise.all(
    variantGroups.map(async (variantGroup) => {
      const options = await Promise.all(
        variantGroup.options.map(async (option) => {
          const assets = await Promise.all(
            option.assets.map(async (asset) => {
              const url = new URL(`https://api.chec.io/v1/assets/${asset}`);
              let response = await fetch(url.toString(), {
                method: "GET",
                headers: headers,
              });
              response = await response.json();
              return { id: asset, url: response.url ? response.url : "" };
            })
          );
          return { ...option, assets: assets };
        })
      );
      return { ...variantGroup, options: options };
    })
  );

  return {
    props: {
      product,
      variants,
      variantGroups,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data: products } = await commerce.products.list();

  return {
    paths: products.map((product) => ({
      params: {
        permalink: product.permalink,
      },
    })),
    fallback: false,
  };
};

export default function ProductPage({
  product,
  variants,
  variantGroups,
}: {
  product: Product;
  variants: VariantCollection;
  variantGroups: ProductVariantGroup;
}) {
  const { setCart } = useCartDispatch();
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
    <React.Fragment>
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
          <ProductDesc product={product} />
        </ProductDetailsContainer>
      </ProductContainer>
    </React.Fragment>
  );
}
