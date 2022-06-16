import React from 'react';
import Link from 'next/link';



import { AiOutlineShopping } from 'react-icons/ai';
import { useStateContext } from '../context/StateContext';
import Cart from './Cart';
import CategoryList from './CategoryList';

const Navbar = () => {
  const { categories, showCart, setShowCart } = useStateContext();

  return (
    <div>
      <div className='navbar-header'>1-877-FA-WORLD</div>
      <div className='navbar-container'>

        <p className='logo'>
          <Link href='/'><a><img src='https://cdn.shopify.com/s/files/1/0060/5952/t/127/assets/logo-compact_60x.png?v=3226128657452717568' /></a></Link>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Link href='/'><a><img src='https://cdn.shopify.com/s/files/1/0060/5952/t/127/assets/logo-hockey_200x.png?v=8765466146010894979' /></a></Link>
        </p>
        {categories && <CategoryList />}
        <button type='button' className='cart-icon' onClick={() => setShowCart(true)}>
          <AiOutlineShopping />
          <span className='cart-item-qty'>0</span>
        </button>

        {showCart && <Cart />}
      </div>
    </div>
  )
}

export default Navbar