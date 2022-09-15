import styles from "../styles/Product.module.css";
import Image from "next/image";

export default function Product({ name, price, image }) {
  return (
    <div className={styles["product-card"]}>
      <Image src={image.url} className={styles["product-image"]} height={300} width={300} />
      <div className={styles["img-desc"]}>
        <p>{name.toUpperCase()}</p>
      </div>
      <p className={styles["product-name"]}>{name}: </p>
      <span className={styles["product-price"]}>{price.formatted_with_symbol}</span>
    </div>
  );
}
