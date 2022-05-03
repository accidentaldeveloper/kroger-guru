import type { ReactNode } from "react";
import type { Product } from "~/models/kroger/products.types";
import { SizeEnum } from "~/models/kroger/products.types";

export type ProductCardProps = {
  item: Product;
  children?: ReactNode;
  renderChildren?: (product: Product) => ReactNode;
};

export const ProductCard = ({
  item,
  children,
  renderChildren,
}: ProductCardProps) => {
  const image = item.images[0];
  const mediumImage = image.sizes.find((i) => i.size === SizeEnum.Medium);
  return (
    <div key={item.productId} className="w-96 border-2 py-4">
      <div>{item.description}</div>
      <div>{item.brand}</div>
      <img src={mediumImage?.url} alt=""></img>
      {children}
      {renderChildren?.(item)}
    </div>
  );
};
