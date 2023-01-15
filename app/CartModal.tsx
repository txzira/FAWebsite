import React, { useRef, useEffect } from "react";
import { useStateContext } from "../context/StateContext";
import { AiOutlineLeft } from "react-icons/ai";
import { useCartState } from "../context/cart";
import Link from "next/link";
import { CartItem } from "../app/cart/page";

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
    <div className="fixed bg-opacity-50 bg-black right-0 top-0 w-screen z-50 " ref={cartRef} onClick={() => setShowCart(false)}>
      <div className="bg-white float-right h-screen py-10 px-2.5 relative w-3/5 " onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={() => setShowCart(false)}>
          <AiOutlineLeft />
        </button>
        <span>Your Cart</span>
        <span className="text-red-600 ml-2.5">({total_items} items)</span>
        {line_items.map((item) => (
          <CartItem key={item.id} {...item} />
        ))}
        <div>
          <div>
            <Link href="/cart">Cart</Link>
          </div>
          <div>
            <Link href={`/checkout/${id}`}>Checkout</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
