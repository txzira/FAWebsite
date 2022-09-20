// components/ProductList.js
import Link from "next/link";

import ProductCard from "./ProductCard";

import styles from "../styles/Product.module.css";

export default function ProductList({ products }) {
  if (!products) return null;

  return (
    <div className={styles["products-container"]}>
      {products.map((product) => (
        <div key={product.permalink}>
          <Link href={`/products/${product.permalink}`}>
            <a>
              <ProductCard {...product} />
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
}
