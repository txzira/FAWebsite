import React, { useRef } from 'react';
import { useStateContext } from '../context/StateContext';
import { AiOutlineLeft } from 'react-icons/ai';

const Cart = () => {
  const cartRef = useRef();
  const { setShowCart } = useStateContext();
  return (
    <div className='cart-wrapper' ref={cartRef}>
      <div className='cart-container'>
        <button type='button' className='cart-heading' onClick={() => setShowCart(false)}>
          <AiOutlineLeft />
          <span className='heading'>Your Cart</span>
          <span className='cart-num-items'>(0 items)</span>
        </button>
      </div>
    </div>
  )
}

export default Cart