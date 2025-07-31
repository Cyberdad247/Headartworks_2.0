/**
 * Enhances product search results with sorting, filtering and price tracking.
 * @param {object} results - Original search results from GraphQL
 * @param {object} filters - Current filter selections
 * @param {string} sortKey - Sort key (e.g., PRICE_ASC, PRICE_DESC, BEST_SELLING, etc.)
 * @returns {object} Enhanced and filtered search results
 */
export function enhanceSearchResults(results, filters, sortKey = 'RELEVANCE') {
  if (!results) return results;

  // Apply filters first
  const filteredProducts = applyFilters(results, filters);

  // Then apply sorting
  return {
    ...filteredProducts,
    products: sortProducts(filteredProducts.products, sortKey),
  };
}

/**
 * Extracts available filters from search results
 * @param {object} results - Search results from GraphQL
 * @returns {object} Available filters
 */
export function extractFilters(results) {
  const filters = {
    price: {min: Infinity, max: -Infinity},
    vendors: new Set(),
    tags: new Set(),
    collections: new Set(),
    productTypes: new Set(),
  };

  results?.products?.forEach(product => {
    // Price range
    const price = parseFloat(product.priceRange?.minVariantPrice?.amount);
    if (price) {
      filters.price.min = Math.min(filters.price.min, price);
      filters.price.max = Math.max(filters.price.max, price);
    }

    // Vendors
    if (product.vendor) {
      filters.vendors.add(product.vendor);
    }

    // Tags
    product.tags?.forEach(tag => filters.tags.add(tag));

    // Product Type
    if (product.productType) {
      filters.productTypes.add(product.productType);
    }
  });

  // Round price ranges for better UX
  filters.price.min = Math.floor(filters.price.min);
  filters.price.max = Math.ceil(filters.price.max);

  return {
    price: filters.price,
    vendors: Array.from(filters.vendors),
    tags: Array.from(filters.tags),
    collections: Array.from(filters.collections),
    productTypes: Array.from(filters.productTypes),
  };
}

/**
 * Applies filters to search results
 * @param {object} results - Original search results
 * @param {object} filters - Current filter selections
 * @returns {object} Filtered results
 */
export function applyFilters(results, filters) {
  if (!results?.products) return results;

  return {
    ...results,
    products: results.products.filter(product => {
      // Price filter
      if (filters.price?.length === 2) {
        const [min, max] = filters.price.map(Number);
        const price = parseFloat(product.priceRange?.minVariantPrice?.amount);
        if (price < min || price > max) return false;
      }

      // Vendor filter
      if (filters.vendors?.length && !filters.vendors.includes(product.vendor)) {
        return false;
      }

      // Tag filter
      if (filters.tags?.length && !filters.tags.some(t => product.tags?.includes(t))) {
        return false;
      }

      // Product type filter
      if (filters.productTypes?.length && !filters.productTypes.includes(product.productType)) {
        return false;
      }

      return true;
    }),
  };
}

/**
 * Sorts products based on the provided sort key
 * @param {Array} products - Array of products to sort
 * @param {string} sortKey - Sort key
 * @returns {Array} Sorted products
 */
export function sortProducts(products, sortKey) {
  if (!products?.length) return products;

  const sortedProducts = [...products];

  switch (sortKey) {
    case 'PRICE_ASC':
      return sortedProducts.sort((a, b) => {
        const aPrice = parseFloat(a.priceRange?.minVariantPrice?.amount) || 0;
        const bPrice = parseFloat(b.priceRange?.minVariantPrice?.amount) || 0;
        return aPrice - bPrice;
      });

    case 'PRICE_DESC':
      return sortedProducts.sort((a, b) => {
        const aPrice = parseFloat(a.priceRange?.minVariantPrice?.amount) || 0;
        const bPrice = parseFloat(b.priceRange?.minVariantPrice?.amount) || 0;
        return bPrice - aPrice;
      });

    case 'CREATED_AT':
      return sortedProducts.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );

    case 'UPDATED_AT':
      return sortedProducts.sort((a, b) => 
        new Date(b.updatedAt) - new Date(a.updatedAt)
      );

    case 'BEST_SELLING':
      // This would need sales data from the API
      return sortedProducts;

    case 'RELEVANCE':
    default:
      return sortedProducts;
  }
}