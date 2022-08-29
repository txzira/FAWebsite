import React, { useRef, useEffect } from "react";
import { useStateContext } from "../context/StateContext";
import { AiOutlineLeft } from "react-icons/ai";
import { useCartState } from "../context/cart";
import Link from "next/link";
import { CartItem } from "../pages/cart";

const CartModal = () => {
  const cartRef = useRef();
  const { setShowCart } = useStateContext();
  const { total_items, line_items, id } = useCartState();
  function closeOnEscKeyDown(e) {
    if ((e.charCode || e.keyCode) === 27) {
      setShowCart(false);
    }
  }

  useEffect(() => {
    document.body.addEventListener("keydown", closeOnEscKeyDown);
    return function cleanup() {
      document.body.removeEventListener("keydown", closeOnEscKeyDown);
    };
  }, []);
  return (
    <div className="cart-wrapper" ref={cartRef} onClick={() => setShowCart(false)}>
      <div className="cart-container" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={() => setShowCart(false)}>
          <AiOutlineLeft />
        </button>
        <span className="heading">Your Cart</span>
        <span className="cart-num-items">({total_items} items)</span>
        {line_items.map((item) => (
          <CartItem key={item.id} {...item} />
        ))}
        <div className="">
          <div>
            <Link href="/cart">
              <a>Cart</a>
            </Link>
          </div>
          <div>
            <Link href={`/checkout/${id}`}>
              <a>Checkout</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
