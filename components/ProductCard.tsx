import Image from "next/image";

export default function ProductCard({ name, price, image }) {
  return (
    <div className="flex flex-col items-center group cursor-pointer transition-transform hover:ease-in-out duration-300 hover:scale-110 ">
      <div className="w-32 h-32 md:w-72 md:h-72 relative">
        <Image src={image.url} fill={true} className="object-cover" alt="product image" />
        <div className="hidden md:block bg-custom-300 text-white text-center pt-2 px-2.5 pb-1.5 w-11/12 top-1/3 left-1/2 absolute -translate-x-1/2 invisible group-hover:visible">
          <p className="text-xs">{name.toUpperCase()}</p>
        </div>
      </div>
      <p className="hidden md:block font-medium text-center">{name}</p>
      <span className="hidden md:block text-black font-extrabold mt-1.5">{price.formatted_with_symbol}</span>
    </div>
  );
}
