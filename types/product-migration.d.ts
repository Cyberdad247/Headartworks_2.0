/**
 * Shopify Product Data Interfaces
 */
export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description?: string;
  images: ShopifyImage[];
  variants: ShopifyVariant[];
  options: ShopifyOption[];
  priceRange: MoneyV2;
  metafields?: Metafield[];
}

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selected: boolean;
  price: MoneyV2;
  compareAtPrice?: MoneyV2;
  image?: ShopifyImage;
  optionValues: {
    name: string;
    value: string;
  }[];
}

export interface ShopifyImage {
  id: string;
  url: string;
  altText?: string;
  width: number;
  height: number;
}

export interface ShopifyOption {
  id: string;
  name: string;
  values: string[];
}

export interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface Metafield {
  id: string;
  namespace: string;
  key: string;
  value: string;
  type: string;
}

/**
 * Hydrogen Component Interfaces
 */
export interface HydrogenProductItem {
  id: string;
  title: string;
  handle: string;
  featuredImage: HydrogenImage;
  images: HydrogenImage[];
  priceRange: MoneyV2;
  variants: HydrogenVariant[];
}

export interface HydrogenVariant {
  id: string;
  available: boolean;
  price: MoneyV2;
  compareAtPrice?: MoneyV2;
  image?: HydrogenImage;
  optionValues: HydrogenOptionValue[];
}

export interface HydrogenImage {
  id: string;
  url: string;
  altText: string;
  width: number;
  height: number;
}

export interface HydrogenOptionValue {
  name: string;
  value: string;
  selected: boolean;
}

/**
 * Transformation Functions
 */
declare function transformShopifyToHydrogen(
  product: ShopifyProduct
): HydrogenProductItem;