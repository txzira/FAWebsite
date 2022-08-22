import styles from "../styles/Product.module.css";

export default function Product({ name, price, image }) {
  return (
    <div className={styles["product-card"]}>
      <img src={image.url} className={styles["product-image"]} />
      <p className={styles["product-name"]}>{name}: </p>
      <span className={styles["product-price"]}>
        {price.formatted_with_symbol}
      </span>
    </div>
  );
}
