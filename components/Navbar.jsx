import React from 'react';
import Link from 'next/link';

import { AiOutlineShopping } from 'react-icons/ai';
import { useStateContext } from '../context/StateContext';
import Cart from './Cart';
import CategoryList from './CategoryList';
import { useCartState } from '../context/cart';

import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const { categories, showCart, setShowCart } = useStateContext();
  const { total_items } = useCartState();

  return (
    <div> 
      <div className={styles.navbarContainer}>
        <div className={styles.navbarHeader}>1-877-FA-WORLD</div>
        <ul className={styles.navbarLinks}>
          <li>                  
            <Link href='/'><a><img className={styles.navbarLogo} src='https://cdn.shopify.com/s/files/1/0060/5952/t/127/assets/logo-compact_60x.png?v=3226128657452717568'/></a></Link>
          </li>
          <li>
            <Link href='/'><a><img className={styles.navbarLogo} src='https://cdn.shopify.com/s/files/1/0060/5952/t/127/assets/logo-hockey_200x.png?v=8765466146010894979'/></a></Link>
          </li>
          {categories && <CategoryList />}
          <li>
            <button type='button' className='cart-icon' onClick={() => setShowCart(true)}>
              <AiOutlineShopping />
              <span className={styles.navbarCartItemQty}>{total_items}</span>
            </button>
          </li>
        </ul>
      </div>
      {showCart && <Cart />}
    </div>
  )
}

export default Navbar