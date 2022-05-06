import type { ReactNode } from "react";
import type { Product } from "~/models/kroger/products.types";
import { SizeEnum } from "~/models/kroger/products.types";

export type ProductCardProps = {
  item: Product;
  children?: ReactNode;
};

export const ProductCard = ({ item, children }: ProductCardProps) => {
  const image = item.images[0];
  const mediumImage = image.sizes.find((i) => i.size === SizeEnum.Medium);
  return (
    <div key={item.productId} className="w-96 border-2 border-slate-400 p-8 m-1 drop-shadow-md">
      <div className="text-xl font-semibold">{item.description}</div>
      {/* <div>{item.brand}</div> */}
      <img src={mediumImage?.url} alt="" className="p-4"></img>
      {children}
    </div>
  );
};
