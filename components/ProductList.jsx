// components/ProductList.js
import Link from "next/link";

import Product from "./Product";

export default function ProductList({ products }) {
  if (!products) return null;

  return (
    <div className="products-container">
      {products.map((product) => (
        <div key={product.permalink}>
          <Link href={`/products/${product.permalink}`}>
            <a>
              <Product {...product} />
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
}