export interface ProductsResponse {
  data: Product[];
  meta: Meta;
}

export interface Product {
  productId: string;
  aisleLocations: AisleLocation[];
  brand: string;
  categories: string[];
  countryOrigin: string;
  description: string;
  items: Item[];
  itemInformation: ItemInformation;
  temperature: Temperature;
  images: Image[];
  upc: string;
}

export interface AisleLocation {
  bayNumber: string;
  description: string;
  number: string;
  numberOfFacings: string;
  sequenceNumber: string;
  side: string;
  shelfNumber: string;
  shelfPositionInBay: string;
}

export interface Image {
  id: string;
  perspective: string;
  default: boolean;
  sizes: Size[];
}

export interface Size {
  id: string;
  size: SizeEnum;
  url: string;
}

export enum SizeEnum {
  Large = "large",
  Medium = "medium",
  Small = "small",
  Thumbnail = "thumbnail",
  Xlarge = "xlarge",
}

export interface ItemInformation {
  depth: string;
  height: string;
  width: string;
}

export interface Item {
  itemId: string;
  favorite: boolean;
  fulfillment: Fulfillment;
  price: Price;
  nationalPrice: Price;
  size: string;
  soldBy: string;
}

export interface Fulfillment {
  curbside: boolean;
  delivery: boolean;
  instore: boolean;
  shiptohome: boolean;
}

export interface Price {
  regular: number;
  promo: number;
  regularPerUnitEstimate: number;
  promoPerUnitEstimate: number;
}

export interface Temperature {
  indicator: string;
  heatSensitive: boolean;
}

export interface Meta {
  pagination: Pagination;
  warnings: string[];
}

export interface Pagination {
  start: number;
  limit: number;
  total: number;
}
