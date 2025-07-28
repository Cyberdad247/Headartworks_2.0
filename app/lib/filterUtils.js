/**
 * Extracts available filters from search results
 * @param {object} results - Search results from GraphQL
 * @returns {object} Available filters
 */
export function extractFilters(results) {
  const filters = {
    price: {min: Infinity, max: 0},
    vendors: new Set(),
    tags: new Set(),
    collections: new Set()
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

    // Collections would need additional data
  });

  return {
    price: {min: filters.price.min, max: filters.price.max},
    vendors: Array.from(filters.vendors),
    tags: Array.from(filters.tags),
    collections: Array.from(filters.collections)
  };
}

/**
 * Applies filters to search results
 * @param {object} results - Original search results
 * @param {object} filters - Current filter selections
 * @returns {object} Filtered results
 */
export function applyFilters(results, filters) {
  if (!results) return results;

  return {
    ...results,
    products: results.products?.filter(product => {
      // Price filter
      if (filters.price.length) {
        const [min, max] = filters.price.map(Number);
        const price = parseFloat(product.priceRange?.minVariantPrice?.amount);
        if (price < min || price > max) return false;
      }

      // Vendor filter
      if (filters.vendors.length && !filters.vendors.includes(product.vendor)) {
        return false;
      }

      // Tag filter
      if (filters.tags.length && !filters.tags.some(t => product.tags?.includes(t))) {
        return false;
      }

      return true;
    })
  };
}