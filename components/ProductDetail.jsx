// components/ProductDetail.js
import commerce from "../lib/commerce";
import React, { useEffect, useState } from 'react';
import { useCartDispatch } from "../context/cart";

import { AiOutlineMinus, AiOutlinePlus} from 'react-icons/ai';

export default function ProductDetail({ product, colors, sizes, sizeOptionKey, colorOptionKey }) {
  const { setCart } = useCartDispatch();
  const [options, setOptions] = useState({});
  const [assets, setAssets] = useState([]);
  const [image, setImage] = useState(null);
  const [assetIds, setAssetIds] = useState([]);
  const [qty, setQty] = useState(1);
  //add product to cart
  const addToCart = () => {
    commerce.cart.add(product.id, qty, options).then(({ cart }) => setCart(cart))
  }
  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  }
  const decQty = () => {
    setQty((prevQty) => {
        if(prevQty - 1 < 1) return 1;
        return prevQty - 1; 
    });
  }
  const changeSize = (event) => {
    options[sizeOptionKey] = event.target.value; //sizeOptionValue
    setOptions(options)
  }
  const changeColor = (colorOptionValue, assetIdList) => (e) => {
    options[colorOptionKey] = colorOptionValue;
    setOptions(options)
    setImage(e.target.src);
    setAssetIds(assetIdList);
  }
  const defaultColor = () => {
    if (colors.length == 0) return;
    options[colorOptionKey] = colors[0].id
    setAssetIds(colors[0].assets);
  }
  const getAssets = async () => {
    if (colors.length == 0) return;
    const response = await fetch('/api/commercejs/assets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(colors),
    });
    if (response.statusCode === 500) return;
    const data = await response.json();
    setAssets(data);
    setImage(data[0].url);
  }//
  useEffect(() => {
    getAssets();
    defaultColor();
  }, [colors])
  return (
    <React.Fragment>
      <div className='product-detail-container'>
        <div>
          <div className='image-container'>
            <img src={image} className="product-detail-image" />
          </div>
          {assets.length != 0 &&
            <div className='small-images-container'>
              {assets.map(function (asset) {
                return (
                  assetIds.map((id) => {
                    {
                      if (asset.id === id) {
                        return (
                          <span key={id.toString()}>
                            <img className='small-image' src={asset.url} />
                          </span>
                        )
                      }
                    }
                  })
                )
              })}
            </div>
          }
        </div>
        <div className='product-detail-desc'>
          <h1>{product.name}</h1>
          <h4>Details:</h4>
          <p className='price'>{product.price.formatted_with_symbol}</p>
          
          <br />
          
          <h1>Color:</h1>
          <div className='small-images-container'>
            {colors.map((color) => (
              <span key={color.id} className="buttons">
                {assets.map((asset) => {
                  if (asset.id === color.assets[0]) {
                    return (
                      <button key={asset.id} type='button' id={color.id} name='color' onClick={changeColor(color.id, color.assets)}>
                        <img className='button' src={asset.url} />
                      </button>
                    )
                  }
                })}
              </span>
            ))}
          </div>

          <br />

          <h1>Size:</h1>
          <div onChange={changeSize}>
            {sizes.map((size) => (
              <span key={size.id} className='buttons'>
                <input id={size.id} type='radio' name='size' value={size.id} />
                <label className='label' htmlFor={size.id}>&nbsp;{size.name}&nbsp;</label>
              </span>
            ))}
          </div>
          <br />
          <hr />
          <br />
          <div className='quantity'>
            <h3>Quantity</h3>
            <p className='quantity-desc'>
              <span className="minus" onClick={decQty}><AiOutlineMinus /></span>
              <span className='num'>{qty}</span>
              <span className="plus" onClick={incQty}><AiOutlinePlus /></span>
            </p>
          </div>
          <br />
          <div className='buttons'>
            <button type='button' className='add-to-cart' onClick={addToCart}>Add to Cart</button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}