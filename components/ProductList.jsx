// components/ProductList.js
import Link from "next/link";

import Product from "./Product";

import styles from "../styles/Product.module.css";

export default function ProductList({ products }) {
  if (!products) return null;

  return (
    <div className={styles["products-container"]}>
      {products.map((product) => (
        <div key={product.permalink}>
          {/* {console.log(product)} */}
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
