import type { ShopifyProduct, MoneyV2 } from '../../types/product-migration';

export const mockProduct: ShopifyProduct = {
  id: 'gid://shopify/Product/123',
  title: 'Test Product',
  handle: 'test-product',
  description: 'Test description',
  images: [{
    id: 'gid://shopify/ProductImage/456',
    url: 'https://cdn.shopify.com/test.jpg',
    altText: 'Test image',
    width: 800,
    height: 800
  }],
  variants: [{
    id: 'gid://shopify/ProductVariant/789',
    title: 'Default',
    availableForSale: true,
    selected: true,
    price: { amount: '29.99', currencyCode: 'USD' },
    compareAtPrice: { amount: '39.99', currencyCode: 'USD' },
    image: {
      id: 'gid://shopify/ProductImage/456',
      url: 'https://cdn.shopify.com/test.jpg',
      altText: 'Test image',
      width: 800,
      height: 800
    },
    optionValues: [{
      name: 'Title',
      value: 'Default'
    }]
  }],
  priceRange: {
    minVariantPrice: { amount: '29.99', currencyCode: 'USD' },
    maxVariantPrice: { amount: '29.99', currencyCode: 'USD' }
  } as { minVariantPrice: MoneyV2; maxVariantPrice: MoneyV2 }
};