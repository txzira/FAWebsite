// components/ProductDetail.js
import React, { useEffect, useState } from "react";
import { useCartDispatch } from "../context/cart";
import commerce from "../lib/commerce";

import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import toast from "react-hot-toast";
import styles from "../styles/Product.module.css";

export default function ProductDetail({
  product,
  colors,
  sizes,
  sizeOptionKey,
  colorOptionKey,
}) {
  const { setCart } = useCartDispatch();
  const [options, setOptions] = useState({});
  const [assets, setAssets] = useState([]);
  const [image, setImage] = useState(null);
  const [assetIds, setAssetIds] = useState([]);
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  //add product to cart
  const addToCart = () => {
    commerce.cart
      .add(product.id, qty, options)
      .then(({ cart }) => setCart(cart));
    toast.success(
      `${product.name} ${selectedColor}/${selectedSize} was added to the cart`
    );
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
  //change selected size
  const changeSize = (sizeName) => (event) => {
    options[sizeOptionKey] = event.target.value; //sizeOptionValue
    setOptions(options);
    setSelectedSize(sizeName);
  };
  //change selected color and shown image
  const changeColor = (colorOptionValue, assetIdList, colorName) => (e) => {
    options[colorOptionKey] = colorOptionValue;
    setOptions(options);
    setImage(e.target.src);
    setAssetIds(assetIdList);
    setSelectedColor(colorName);
  };
  //set default color of shown image to first image from commercejs
  const defaultColor = () => {
    if (colors.length == 0) return;
    options[colorOptionKey] = colors[0].id;
    setAssetIds(colors[0].assets);
    setSelectedColor(colors[0].name);
  };

  const getAssets = async () => {
    if (colors.length == 0) return;
    const response = await fetch("/api/commercejs/assets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(colors),
    });
    if (response.statusCode === 500) return;
    const data = await response.json();
    setAssets(data);
    setImage(data[0].url);
  }; //
  useEffect(() => {
    getAssets();
    defaultColor();
  }, [colors]);
  return (
    <React.Fragment>
      <div className={styles["product-detail-container"]}>
        <div>
          <div className="image-container">
            <img src={image} className={styles["product-detail-image"]} />
          </div>
          {assets.length != 0 && (
            <div className="small-images-container">
              {assets.map(function (asset) {
                return assetIds.map((id) => {
                  {
                    if (asset.id === id) {
                      return (
                        <span key={id.toString()}>
                          <img className="small-image" src={asset.url} />
                        </span>
                      );
                    }
                  }
                });
              })}
            </div>
          )}
        </div>
        <div className={styles["product-detail-desc"]}>
          <div className="products-heading">
            <h2>{product.name}</h2>
            <p className={styles["price"]}>
              {product.price.formatted_with_symbol}
            </p>
          </div>

          <br />

          <h1>Color:</h1>
          <div className="small-images-container">
            {colors.map((color) => (
              <span key={color.id} className={styles["buttons"]}>
                {assets.map((asset) => {
                  if (asset.id === color.assets[0]) {
                    return (
                      <button
                        key={asset.id}
                        type="button"
                        id={color.id}
                        name="color"
                        onClick={changeColor(
                          color.id,
                          color.assets,
                          color.name
                        )}
                      >
                        <img className={styles["button"]} src={asset.url} />
                      </button>
                    );
                  }
                })}
              </span>
            ))}
          </div>
          <br />
          <h1>Size:</h1>
          <div>
            {sizes.map((size) => (
              <span
                key={size.id}
                className={styles["buttons"]}
                onChange={changeSize(size.name)}
              >
                <input id={size.id} type="radio" name="size" value={size.id} />
                <label className={styles["label"]} htmlFor={size.id}>
                  &nbsp;{size.name}&nbsp;
                </label>
              </span>
            ))}
          </div>
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
