import {useEffect, useState, useCallback} from 'react';
import {Link} from '@remix-run/react';
import debounce from 'lodash.debounce';

/**
 * Predictive search component that shows suggestions as you type
 */
export function PredictiveSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (term) => {
      if (term.length < 2) {
        setResults(null);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/predictive-search?q=${encodeURIComponent(term)}`
        );
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Predictive search error:', error);
        setResults(null);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  // Update search when term changes
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  return (
    <div className="predictive-search">
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products..."
        className="search-input"
      />

      {isLoading && (
        <div className="search-loading">
          <span className="loading-spinner" />
          Searching...
        </div>
      )}

      {results && !isLoading && (
        <div className="search-results-dropdown">
          {results.products?.length > 0 ? (
            <div className="search-results-list">
              {results.products.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.handle}`}
                  className="search-result-item"
                >
                  {product.featuredImage && (
                    <img
                      src={product.featuredImage.url}
                      alt={product.title}
                      className="search-result-image"
                    />
                  )}
                  <div className="search-result-info">
                    <h3>{product.title}</h3>
                    <p className="search-result-price">
                      ${product.priceRange?.minVariantPrice?.amount}
                    </p>
                  </div>
                </Link>
              ))}
              
              <Link to={`/search?q=${searchTerm}`} className="view-all-link">
                View all results
              </Link>
            </div>
          ) : (
            <div className="no-results">
              No products found for "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
