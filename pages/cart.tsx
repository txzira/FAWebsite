import { useCartDispatch, useCartState } from "../context/cart";
import { AiOutlineMinus, AiOutlinePlus, AiOutlineCloseCircle } from "react-icons/ai";
import Link from "next/link";
import Image from "next/image";

import commerce from "../lib/commerce";
import toast from "react-hot-toast";
import { VerticalDivider } from "../components/GeneralComponents";

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
    <div>
      <h4>{name}</h4>
      {selected_options.map((option) => (
        <p key={option.option_id}>{option.option_name}</p>
      ))}
      <div className="flex gap-2.5 mt-5">
        <Image className="bg-custom-200 rounded-lg cursor-pointer" src={image.url} height={150} width={150} alt="Product Image" />
      </div>
      <p>{line_total.formatted_with_symbol}</p>
      <div className="flex max-w-fit">
        <div className="flex border-2 border-black">
          <button className="text-red-600 align-middle py-1.5 px-3" onClick={decrementQuantity}>
            <AiOutlineMinus />
          </button>
          <VerticalDivider tailwindClass="border-black" />
          <span className="text-xl py-1.5 px-3">{quantity}</span>
          <VerticalDivider tailwindClass="border-black" />
          <button className="text-green-500 align-middle py-1.5 px-3" onClick={incrementQuantity}>
            <AiOutlinePlus />
          </button>
        </div>
        <button className="text-red-600 p-2" onClick={removeItem}>
          <AiOutlineCloseCircle size={16} />
        </button>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { line_items, subtotal, id } = useCartState();
  const isEmpty = line_items.length === 0;

  if (isEmpty) return <p>Your cart is empty</p>;

  return (
    <div>
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
