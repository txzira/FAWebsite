// pages/products/[permalink].js
import commerce from "../../lib/commerce";
import React, { useState, useEffect } from 'react';
import { useCartDispatch } from "../../context/cart";

export async function getStaticProps({ params }) {
  const { permalink } = params;
  

  const product = await commerce.products.retrieve(permalink, {
    type: 'permalink',
  });



  return {
    props: {
      product,
    },
  };
}

export async function getStaticPaths() {
  const { data: products } = await commerce.products.list();
  
  return {
    paths: products.map((product) => ({
      params: {
        permalink: product.permalink,
      },
    })),
    fallback: false,
  };
}



export default function ProductPage({ product }) {
  
  const {setCart} = useCartDispatch();
  const [variants, setVariants] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  const addToCart = () => {
    commerce.cart.add(product.id).then(({cart}) => setCart(cart))

  }

  const getVariants = async () => {
    commerce.products.getVariants(product.id,{limit:150}).then(variants => {
      //console.log(variants)
      setVariants(variants.data);
      
    })  
  }
  const getOptions = async () => {
    const colors = [];
    const sizes = [];
    product.variant_groups.map((details) => {
      //console.log(details);
      if(details.name == 'Color'){
        details.options.map((option) => {
          colors.push(option.name);
          
        })
      } else if(details.name == 'Size'){
        details.options.map((option) => {
          sizes.push(option.name);
          
        })
      }
    })
    setSizes(sizes);
    setColors(colors);


  }
  useEffect(()=>{
    getVariants()
    getOptions()
  },[])

  //console.log(variants);

  return (
    <React.Fragment>
      {console.log(product)}
      <div className='product-detail-container'>
        <div className='image-container'>
          <img src={product.image.url} className="product-detail-image"/>         
        </div>
        <h1>{product.name}</h1>
        <p>{product.price.formatted_with_symbol}</p>
        <div>
          {}
          {sizes.map((size) => (
              <p>{size}</p>
          ))}
        </div>
        <div>
          {colors.map((color) => (
              <p>{color}</p>
          ))}
        </div>
        <button onClick={addToCart}>Add to Cart</button>
        
      </div>
    </React.Fragment>
  );
}