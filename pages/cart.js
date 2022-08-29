import { useCartDispatch, useCartState } from "../context/cart";
import { AiOutlineMinus, AiOutlinePlus, AiOutlineCloseCircle } from "react-icons/ai";
import Link from "next/link";

import commerce from "../lib/commerce";
import toast from "react-hot-toast";

export function CartItem({ id, name, quantity, line_total, image, selected_options }) {
  const { setCart } = useCartDispatch();

  const handleUpdateCart = ({ cart }) => setCart(cart);

  const removeItem = () => {
    let productName = name;
    commerce.cart.remove(id).then(handleUpdateCart);
    for (let i = 0; i < selected_options.length; i++) {
      if (i === selected_options.length - 1) {
        productName = productName + selected_options[i].option_name;
        break;
      }
      productName = productName + " " + selected_options[i].option_name + "/";
    }
    toast.success(`${productName} was removed from the cart.`);
  };

  const decrementQuantity = () => {
    quantity > 1 ? commerce.cart.update(id, { quantity: quantity - 1 }).then(handleUpdateCart) : removeItem();
  };

  const incrementQuantity = () => commerce.cart.update(id, { quantity: quantity + 1 }).then(handleUpdateCart);

  return (
    <div className="">
      <h4>{name}</h4>
      {selected_options.map((option) => (
        <p key={option.option_id}>{option.option_name}</p>
      ))}
      <div className="small-images-container">
        <img className="medium-image" src={image.url} />
      </div>
      <p>{line_total.formatted_with_symbol}</p>
      <div className="quantity">
        <p className="quantity-desc">
          <span className="minus" onClick={decrementQuantity}>
            <AiOutlineMinus />
          </span>
          <span className="num">{quantity}</span>
          <span className="plus" onClick={incrementQuantity}>
            <AiOutlinePlus />
          </span>
          <span className="remove" onClick={removeItem}>
            <AiOutlineCloseCircle size={16} />
          </span>
        </p>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { line_items, subtotal, id } = useCartState();
  const isEmpty = line_items.length === 0;

  if (isEmpty) return <p>Your cart is empty</p>;

  return (
    <div className="">
      <h1>Your Cart</h1>

      {line_items.map((item) => (
        <CartItem key={item.id} {...item} />
      ))}
      <hr />
      <p>
        <strong>Sub total: </strong>
        {subtotal.formatted_with_symbol}
      </p>
      <Link href={`/checkout/${id}`}>
        <a>Checkout</a>
      </Link>
    </div>
  );
}
