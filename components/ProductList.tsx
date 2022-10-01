import Link from "next/link";

import ProductCard from "./ProductCard";

export default function ProductList({ products }) {
  if (!products) return null;

  return (
    <div className="flex flex-wrap justify-evenly relative py-6 px-2.5 gap-y-6">
      {products.map((product) => (
        <Link href={`/products/${product.permalink}`} key={product.permalink}>
          <a>
            <ProductCard {...product} />
          </a>
        </Link>
      ))}
    </div>
  );
}
