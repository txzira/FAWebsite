import commerce from "../../../lib/commerce";
import { ProductDetails } from "./Product";

export async function generateStaticParams() {
  const { data: products } = await commerce.products.list();

  return products.map((product) => ({
    permalink: product.permalink,
  }));
}

export default async function ProductPage({ params }) {
  const permalink: string = params.permalink.toString();
  const product = await commerce.products.retrieve(permalink, {
    type: "permalink",
  });
  const variants = await commerce.products.getVariants(product.id);
  let variantGroups: any = await product.variant_groups.sort((a, b) => a.name.localeCompare(b.name));

  const headers = {
    "X-Authorization": `${process.env.NEXT_PUBLIC_CHEC_SECRET_API_KEY}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  variantGroups = await Promise.all(
    variantGroups.map(async (variantGroup) => {
      const options = await Promise.all(
        variantGroup.options.map(async (option) => {
          const assets = await Promise.all(
            option.assets.map(async (asset) => {
              const url = new URL(`https://api.chec.io/v1/assets/${asset}`);
              let response = await fetch(url.toString(), {
                method: "GET",
                headers: headers,
              });
              response = await response.json();
              return { id: asset, url: response.url ? response.url : "" };
            })
          );
          return { ...option, assets: assets };
        })
      );
      return { ...variantGroup, options: options };
    })
  );

  return (
    <>
      <ProductDetails product={product} variantGroups={variantGroups} variants={variants} />
    </>
  );
}
