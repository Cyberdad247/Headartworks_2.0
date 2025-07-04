import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {useFetcher} from '@remix-run/react';
import {useEffect, useRef} from 'react';

/**
 * @param {{
 *   searchTerm: string;
 * }}
 */
export function SearchResultsPredictive({searchTerm}) {
  const fetcher = useFetcher();
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (!searchTerm) return;

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set a new timeout to delay the search request
    searchTimeoutRef.current = setTimeout(() => {
      fetcher.load(`/search?q=${encodeURIComponent(searchTerm)}&predictive=true`);
    }, 300); // 300ms delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, fetcher]);

  const products = fetcher.data?.products?.nodes || [];

  if (!products.length) {
    return null;
  }

  return (
    <div className="search-results-predictive">
      <div className="search-results-predictive-items">
        {products.map((product) => {
          return (
            <Link
              className="search-results-predictive-item"
              key={product.id}
              to={`/products/${product.handle}`}
              prefetch="intent"
            >
              {product.featuredImage && (
                <Image
                  alt={product.featuredImage.altText || product.title}
                  aspectRatio="1/1"
                  data={product.featuredImage}
                  height={50}
                  loading="lazy"
                  width={50}
                />
              )}
              <div className="search-results-predictive-item-info">
                <h4>{product.title}</h4>
                <small>
                  <Money data={product.priceRange.minVariantPrice} />
                </small>
              </div>
            </Link>
          );
        })}
      </div>
      <Link to={`/search?q=${encodeURIComponent(searchTerm)}`}>
        View all results
      </Link>
    </div>
  );
}