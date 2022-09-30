import styles from "../styles/Product.module.css";
import Image from "next/image";

export default function ProductCard({ name, price, image }) {
  return (
    <div className="cursor-pointer  scale-100 transition-transform ease-in-out hover:scale-110">
      <Image src={image.url} className="rounded-2xl transform scale-100 transition-transform" height={300} width={300} />
      <div className={styles["img-desc"]}>
        <p className="text-xs">{name.toUpperCase()}</p>
      </div>
      <p className="font-medium">{name}: </p>
      <span className="text-black font-extrabold mt-1.5">{price.formatted_with_symbol}</span>
    </div>
  );
}
