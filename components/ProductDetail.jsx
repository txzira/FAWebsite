// components/ProductDetail.js
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useCartDispatch } from "../context/cart";
import commerce from "../lib/commerce";

import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import toast from "react-hot-toast";
import styles from "../styles/Product.module.css";

export default function ProductDetail({ product, variants, variantGroups }) {
  const { setCart } = useCartDispatch();
  const [options, setOptions] = useState({});
  const [image, setImage] = useState(product.image.url);
  const [assetImages, setAssetImages] = useState([]);
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  //set default color of shown image to first image from commercejs
  function defaultColor() {
    if (document.getElementById("color0")) {
      document.getElementById("color0").click();
    }
  }
  //change selected color and shown image
  function handleColor(name, mainImage, colorLabelId, colorId) {
    const images = [];

    variants.map((variant) => {
      if (variant.options[colorLabelId] === colorId) {
        variant.assets.map((asset) => {
          if (!images.includes(asset.url)) images.push(asset.url);
        });
      }
    });

    options[colorLabelId] = colorId;
    setOptions(options);
    setAssetImages(images);
    setImage(mainImage);
    setSelectedColor(name);
  }
  //change selected size
  function handleSize(name, sizeLabelId, sizeId) {
    options[sizeLabelId] = sizeId;
    setOptions(options);
    setSelectedSize(name);
  }
  //add product to cart
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
  //increment product quantity
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

  useEffect(() => {
    defaultColor();
  }, []);

  return (
    <React.Fragment>
      <div className={styles["product-detail-container"]}>
        <div>
          <div className="image-container">
            <Image className={styles["product-detail-image"]} src={image} height={400} width={400} alt="selected-variant" />
          </div>
          {assetImages.length != 0 && (
            <div className="small-images-container">
              {assetImages.map((image, i) => {
                return (
                  <button key={i} type="button" onClick={() => setImage(image)}>
                    <Image className="small-image" src={image} height={70} width={70} alt="variant-image" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className={styles["product-detail-desc"]}>
          <div className="products-heading">
            <h2>{product.name}</h2>
            <p className={styles["price"]}>{product.price.formatted_with_symbol}</p>
          </div>
          <br />
          {variantGroups.map((variantGroup) => {
            return (
              <div key={variantGroup.id}>
                <h2 id={variantGroup.id}>{variantGroup.name}:</h2>
                <ul style={{ listStyle: "none", display: "flex" }} className="small-images-container">
                  {variantGroup.options.map((option, i) => {
                    return variantGroup.name === "Color" ? (
                      <li id={option.id} key={option.id} className={styles["buttons"]}>
                        <button
                          id={`color${i}`}
                          className={styles["button"]}
                          onClick={() => handleColor(option.name, option.assets[0].url, variantGroup.id, option.id)}
                        >
                          <Image src={option.assets[0].url} height={100} width={100} alt={option.name} />
                        </button>
                      </li>
                    ) : (
                      <li key={option.id} className={styles["buttons"]}>
                        <input
                          id={option.id}
                          type="radio"
                          name={variantGroup.name}
                          onClick={() => handleSize(option.name, variantGroup.id, option.id)}
                        />
                        <label htmlFor={option.id}>{option.name}</label>
                      </li>
                    );
                  })}
                </ul>
                <span></span>
              </div>
            );
          })}
          {/* highlight selected colors/sizes... */}
          <br />
          <hr />
          <br />
          <div className={styles["quantity"]}>
            <h3>Quantity</h3>
            <p className="quantity-desc">
              <span className="minus" onClick={decQty}>
                <AiOutlineMinus />
              </span>
              <span className="num">{qty}</span>
              <span className="plus" onClick={incQty}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>
          <br />
          <div className="buttons">
            <button type="button" className="add-to-cart" onClick={addToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
