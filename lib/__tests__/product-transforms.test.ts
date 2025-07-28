import { transformShopifyToHydrogen } from '../product-transforms';
import type { ShopifyProduct, MoneyV2 } from '../../types/product-migration';

const sampleProduct: ShopifyProduct = {
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
  options: [{
    id: 'gid://shopify/ProductOption/101',
    name: 'Title',
    values: ['Default']
  }],
  priceRange: {
    minVariantPrice: { amount: '29.99', currencyCode: 'USD' },
    maxVariantPrice: { amount: '29.99', currencyCode: 'USD' }
  } as { minVariantPrice: MoneyV2; maxVariantPrice: MoneyV2 },
  metafields: [{
    id: 'gid://shopify/Metafield/202',
    namespace: 'custom',
    key: 'craftsmanship',
    value: 'handmade',
    type: 'single_line_text_field'
  }]
};

describe('Product Transforms', () => {
  test('transforms Shopify product to Hydrogen format', () => {
    const result = transformShopifyToHydrogen(sampleProduct);
    
    // Verify basic fields
    expect(result.id).toBe(sampleProduct.id);
    expect(result.title).toBe(sampleProduct.title);
    expect(result.handle).toBe(sampleProduct.handle);
    
    // Verify image transformation
    expect(result.featuredImage.url).toContain('format=webp');
    expect(result.images[0].altText).toBe('Test image');
    
    // Verify variant transformation
    expect(result.variants[0].available).toBe(true);
    expect(result.variants[0].optionValues[0].selected).toBe(true);
    
    // Verify price range
    expect(result.priceRange.minVariantPrice.amount).toBe('29.99');
  });
});