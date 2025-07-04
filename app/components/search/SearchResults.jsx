import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';

/**
 * @param {{
 *   results: any;
 * }}
 */
export function SearchResults({results}) {
  if (!results) {
    return null;
  }

  const keys = Object.keys(results);
  const hasResults = keys.reduce((acc, key) => acc || results[key].nodes.length > 0, false);

  if (!hasResults) {
    return <p>No results found.</p>;
  }

  return (
    <div className="search-results">
      {results.products.nodes.length > 0 && (
        <div className="search-results-section">
          <h2>Products</h2>
          <div className="search-results-items">
            {results.products.nodes.map((product) => (
              <Link
                className="search-results-item"
                key={product.id}
                to={`/products/${product.handle}`}
                prefetch="intent"
              >
                {product.featuredImage && (
                  <Image
                    alt={product.featuredImage.altText || product.title}
                    aspectRatio="1/1"
                    data={product.featuredImage}
                    height={200}
                    loading="lazy"
                    sizes="(min-width: 45em) 20vw, 50vw"
                    width={200}
                  />
                )}
                <h3>{product.title}</h3>
                <small>
                  <Money data={product.priceRange.minVariantPrice} />
                </small>
              </Link>
            ))}
          </div>
        </div>
      )}

      {results.collections.nodes.length > 0 && (
        <div className="search-results-section">
          <h2>Collections</h2>
          <div className="search-results-items">
            {results.collections.nodes.map((collection) => (
              <Link
                className="search-results-item"
                key={collection.id}
                to={`/collections/${collection.handle}`}
                prefetch="intent"
              >
                {collection.image && (
                  <Image
                    alt={collection.image.altText || collection.title}
                    aspectRatio="1/1"
                    data={collection.image}
                    height={200}
                    loading="lazy"
                    sizes="(min-width: 45em) 20vw, 50vw"
                    width={200}
                  />
                )}
                <h3>{collection.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}

      {results.pages.nodes.length > 0 && (
        <div className="search-results-section">
          <h2>Pages</h2>
          <div className="search-results-items">
            {results.pages.nodes.map((page) => (
              <Link
                className="search-results-item"
                key={page.id}
                to={`/pages/${page.handle}`}
                prefetch="intent"
              >
                <h3>{page.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}