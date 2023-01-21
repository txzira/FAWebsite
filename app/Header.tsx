import { CategoryCollection } from "@chec/commerce.js/features/categories";
import { Category } from "@chec/commerce.js/types/category";
import Navbar from "./(navigation)/Navbar";

export default function Header({ categories }: { categories: Category[] }) {
  return (
    <header>
      <Navbar categories={categories} />
    </header>
  );
}
