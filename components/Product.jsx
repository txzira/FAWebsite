// components/Product.js
export default function Product({ name, price, image }) {
  return (
    <div className="product-card">
      <p className="product-name">
        {name}: <span className="product-price">{price.formatted_with_symbol}</span>
      </p>
      <img src={image.url} className='product-image' />
    </div>
  );
}