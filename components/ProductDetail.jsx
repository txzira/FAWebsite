// components/Product.js
import commerce from "../lib/commerce";
import React, {useEffect, useState} from 'react';
import { useCartDispatch } from "../context/cart";


export default function ProductDetail({ product, colors, sizes, sizeOptionKey,colorOptionKey }) {
  const {setCart} = useCartDispatch();
  const [options, setOptions] = useState({});
  const [assets, setAssets] = useState([]);
  const [image, setImage] = useState(product.image.url);
  const [assetIds, setAssetIds] = useState([]);

  //add product to cart
  const addToCart = () => {
    commerce.cart.add(product.id, 1,options).then(({cart}) => setCart(cart))
  }
  
  const changeSize = (event) => {
    options[sizeOptionKey] = event.target.value;
    setOptions(options)
  }
  const changeColor = (value,value2) => (e) => {
    options[colorOptionKey] = value;
    setOptions(options)
    setImage(e.target.src);
    setAssetIds(value2);
    console.log(value2);
  }
  const getAssets = async () => {
    if(colors.length == 0) return;
    const response = await fetch('/api/assets',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(colors),
    });
    if(response.statusCode === 500) return;
    const data = await response.json();
    setAssets(data);
    
  }//
  useEffect(()=>{
    getAssets();
  },[colors])
    return (
      <div className='product-detail-container'>
        <div className='image-container'>
          <img src={image} className="product-detail-image"/>         
        </div>
        <div className='small-images-container'>
          {assets.map(function(asset) {
            return(
            assetIds.map((id) => {
                {if(asset.id === id){
                  return(
                    <span>
                      <img className='small-image' src={asset.url} />             
                    </span>
                  )
                }}     
            }))        
          })
        }
        </div>

        <div className='product-detail-desc'>
          <h1>{product.name}</h1>
          <p>{product.price.formatted_with_symbol}</p>
          <br/>
          <h1>Color:</h1>

          <div >
            {colors.map((color) => (
              <span key={color.id} className="buttons">  
                
                  {assets.map((asset)=> {
                    if (asset.id === color.assets[0]) {
                      return (
                        <button type='button' id={color.id} name='color' onClick={changeColor(color.id,color.assets)}>  
                          <img className='button' src={asset.url}/>
                        </button>
                      
                      )
                    }
                  })}           
              </span>
            ))}
          </div>

          <br/>
          <hr />
          <br/>

          <h1>Size:</h1>
          <div onChange={changeSize}>
            {sizes.map((size) => (
              <span key={size.id} className='buttons'>
                <input id={size.id} type='radio' name='size' value={size.id} />
                <label className='label' htmlFor={size.id}>&nbsp;{size.name}&nbsp;</label>
              </span>
            ))}
          </div>
          <br/>
          <hr />
          <br/>         
          <div className='buttons'>
            <button type='button' className='add-to-cart' onClick={addToCart}>Add to Cart</button>
          </div>
        </div>        
      </div>
    );
  }