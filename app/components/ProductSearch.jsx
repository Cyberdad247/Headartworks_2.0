import {useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigate} from '@remix-run/react';
import {enhanceSearchResults, extractFilters} from '../lib/filterUtils';

/**
 * ProductSearch component provides search, filter and sort functionality for products
 */
export function ProductSearch({initialResults}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useState(new URLSearchParams(location.search));
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState(initialResults || {});
  const [availableFilters, setAvailableFilters] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({
    price: [],
    vendors: [],
    tags: [],
    productTypes: []
  });
  const [sortKey, setSortKey] = useState('RELEVANCE');

  // Extract available filters when results change
  useEffect(() => {
    if (results?.products?.length) {
      setAvailableFilters(extractFilters(results));
    }
  }, [results]);

  // Update URL when filters/sort change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Update search params
    if (searchTerm) params.set('q', searchTerm);
    else params.delete('q');
    
    // Update filter params
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value?.length) params.set(key, JSON.stringify(value));
      else params.delete(key);
    });
    
    // Update sort param
    if (sortKey !== 'RELEVANCE') params.set('sort', sortKey);
    else params.delete('sort');
    
    // Update URL if params changed
    const newSearch = params.toString();
    if (newSearch !== location.search) {
      navigate('?' + newSearch, {replace: true});
    }
  }, [searchTerm, selectedFilters, sortKey, location, navigate]);

  // Apply filters and sorting
  const enhancedResults = enhanceSearchResults(results, selectedFilters, sortKey);

  // Handle filter changes
  const handleFilterChange = useCallback((filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  }, []);

  // Price range filter component
  const PriceRangeFilter = () => {
    const {min, max} = availableFilters.price || {};
    const [range, setRange] = useState(selectedFilters.price || [min, max]);

    return (
      <div className="price-range-filter">
        <label>Price Range</label>
        <div className="range-inputs">
          <input
            type="range"
            min={min}
            max={max}
            value={range[0]}
            onChange={e => {
              const newRange = [Number(e.target.value), range[1]];
              setRange(newRange);
              handleFilterChange('price', newRange);
            }}
          />
          <input
            type="range"
            min={min}
            max={max}
            value={range[1]}
            onChange={e => {
              const newRange = [range[0], Number(e.target.value)];
              setRange(newRange);
              handleFilterChange('price', newRange);
            }}
          />
        </div>
        <div className="range-values">
          <span>${range[0]}</span>
          <span>${range[1]}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="product-search">
      <div className="search-filters">
        {/* Search input */}
        <input
          type="search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="search-input"
        />

        {/* Sort dropdown */}
        <select 
          value={sortKey}
          onChange={e => setSortKey(e.target.value)}
          className="sort-select"
        >
          <option value="RELEVANCE">Relevance</option>
          <option value="PRICE_ASC">Price: Low to High</option>
          <option value="PRICE_DESC">Price: High to Low</option>
          <option value="CREATED_AT">Newest</option>
          <option value="BEST_SELLING">Best Selling</option>
        </select>

        {/* Filters section */}
        <div className="filters-section">
          <h3>Filters</h3>
          
          {/* Price Range Filter */}
          {availableFilters.price && <PriceRangeFilter />}

          {/* Vendor Filter */}
          {availableFilters.vendors?.length > 0 && (
            <div className="vendor-filter">
              <label>Brands</label>
              <div className="checkbox-group">
                {availableFilters.vendors.map(vendor => (
                  <label key={vendor} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedFilters.vendors.includes(vendor)}
                      onChange={e => {
                        const newVendors = e.target.checked
                          ? [...selectedFilters.vendors, vendor]
                          : selectedFilters.vendors.filter(v => v !== vendor);
                        handleFilterChange('vendors', newVendors);
                      }}
                    />
                    {vendor}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Product Type Filter */}
          {availableFilters.productTypes?.length > 0 && (
            <div className="product-type-filter">
              <label>Product Types</label>
              <div className="checkbox-group">
                {availableFilters.productTypes.map(type => (
                  <label key={type} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedFilters.productTypes.includes(type)}
                      onChange={e => {
                        const newTypes = e.target.checked
                          ? [...selectedFilters.productTypes, type]
                          : selectedFilters.productTypes.filter(t => t !== type);
                        handleFilterChange('productTypes', newTypes);
                      }}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Tag Filter */}
          {availableFilters.tags?.length > 0 && (
            <div className="tag-filter">
              <label>Tags</label>
              <div className="checkbox-group">
                {availableFilters.tags.map(tag => (
                  <label key={tag} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedFilters.tags.includes(tag)}
                      onChange={e => {
                        const newTags = e.target.checked
                          ? [...selectedFilters.tags, tag]
                          : selectedFilters.tags.filter(t => t !== tag);
                        handleFilterChange('tags', newTags);
                      }}
                    />
                    {tag}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results section */}
      <div className="search-results">
        {enhancedResults?.products?.length > 0 ? (
          <div className="products-grid">
            {enhancedResults.products.map(product => (
              <div key={product.id} className="product-card">
                {/* Product card content */}
                <img src={product.featuredImage?.url} alt={product.title} />
                <h3>{product.title}</h3>
                <p className="price">
                  ${product.priceRange?.minVariantPrice?.amount}
                </p>
                {/* Add to cart button or product link */}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-results">No products found</p>
        )}
      </div>
    </div>
  );
}
