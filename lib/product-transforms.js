/**
 * Transforms Shopify product data to Hydrogen-compatible format
 */
export function transformShopifyToHydrogen(product) {
  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    featuredImage: product.images?.[0] ? transformImage(product.images[0]) : null,
    images: (product.images || []).map(transformImage),
    priceRange: product.priceRange,
    variants: (product.variants || []).map(variant => ({
      id: variant.id,
      available: variant.availableForSale,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
      image: variant.image ? transformImage(variant.image) : undefined,
      optionValues: (variant.optionValues || []).map(opt => ({
        name: opt.name,
        value: opt.value,
        selected: variant.selected
      }))
    }))
  };
}

/**
 * Transforms Shopify image to Hydrogen format with CDN optimization
 */
function transformImage(image) {
  return {
    id: image.id,
    url: optimizeImageUrl(image.url),
    altText: image.altText || '',
    width: image.width,
    height: image.height
  };
}

/**
 * Optimizes Shopify image URL for CDN
 */
function optimizeImageUrl(url) {
  // Add CDN parameters for optimal delivery
  return url.replace(/\?(.*)$/, '?width=1000&height=1000&format=webp&quality=85');
}

/**
 * Extracts craftsmanship details from metafields
 */
function getCraftsmanshipDetails(metafields) {
  if (!metafields) return { showBadge: false };
  
  const craftsmanshipMeta = metafields.find(
    m => m.namespace === 'custom' && m.key === 'craftsmanship'
  );
  
  return {
    craftsmanshipImage: craftsmanshipMeta?.value,
    showBadge: craftsmanshipMeta !== undefined
  };
}
