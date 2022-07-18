import React, { useRef } from 'react';
import { useStateContext } from '../context/StateContext';
import { AiOutlineLeft } from 'react-icons/ai';
import { useCartState } from '../context/cart';
import Link from "next/link";
import CartItem from '../pages/cart';


const Cart = () => {
  const cartRef = useRef();
  const { setShowCart } = useStateContext();
  const { total_items,line_items } = useCartState();

  console.log(line_items);
  return (
    <div className='cart-wrapper' ref={cartRef}>
      <button className='cart-button' type='button' onClick={() => setShowCart(false)}>
      </button>
      <div className='cart-container'>
        <button type='button' onClick={() => setShowCart(false)}>
          <AiOutlineLeft />
        </button>

          <span className='heading'>Your Cart</span>
          <span className='cart-num-items'>({total_items} items)</span>
          {line_items.map((item)=> (<CartItem key={item.id} {...item} />))}
          <span className=''>
            <Link href='/cart'>
              <a>Cart</a>
            </Link>
          </span>
      </div>
    </div>
  )
}

export default Cart