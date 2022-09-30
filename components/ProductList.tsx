import Link from "next/link";

import ProductCard from "./ProductCard";

export default function ProductList({ products }) {
  if (!products) return null;

  return (
    <div className="flex flex-wrap justify-start relative py-5 px-2.5 gap-4">
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
