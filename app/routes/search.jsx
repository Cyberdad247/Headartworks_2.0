import {useLoaderData} from '@remix-run/react';
import {json} from '@remix-run/node';
import {getPaginationVariables} from '@shopify/hydrogen';
import {ProductSearch} from '~/components/ProductSearch';
import {enhanceSearchResults} from '~/lib/filterUtils';
import {SEARCH_QUERY} from '~/graphql/searchQueries';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Search Products'}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  
  const term = searchParams.get('q') || '';
  const sortKey = searchParams.get('sort') || 'RELEVANCE';
  
  // Get filter params
  const filters = {
    price: JSON.parse(searchParams.get('price') || '[]'),
    vendors: JSON.parse(searchParams.get('vendors') || '[]'),
    tags: JSON.parse(searchParams.get('tags') || '[]'),
    productTypes: JSON.parse(searchParams.get('productTypes') || '[]'),
  };

  // Get pagination variables
  const variables = getPaginationVariables(request, {pageBy: 24});

  try {
    // Fetch search results
    const {products} = await storefront.query(SEARCH_QUERY, {
      variables: {...variables, term, sortKey},
    });

    // Enhance results with filters and sorting
    const enhancedResults = enhanceSearchResults(products, filters, sortKey);

    return json({
      term,
      sortKey,
      filters,
      results: enhancedResults,
    });

  } catch (error) {
    console.error('Search error:', error);
    return json({
      term,
      sortKey,
      filters,
      results: null,
      error: 'An error occurred while searching. Please try again.'
    });
  }
}

/**
 * Renders the /search route
 */
export default function SearchPage() {
  const {results, error} = useLoaderData();

  return (
    <div className="search-page">
      <h1>Search Products</h1>
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      <ProductSearch initialResults={results} />
    </div>
  );
}

// GraphQL fragments for search
const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCard on Product {
    id
    title
    handle
    productType
    vendor
    tags
    variants(first: 1) {
      nodes {
        id
        image {
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
`;

// Main search query
const SEARCH_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query Search(
    $country: CountryCode
    $language: LanguageCode
    $first: Int!
    $last: Int
    $startCursor: String
    $endCursor: String
    $term: String!
    $sortKey: ProductSortKeys
  ) @inContext(country: $country, language: $language) {
    products: search(
      query: $term,
      types: [PRODUCT],
      first: $first,
      sortKey: $sortKey,
      after: $endCursor,
      before: $startCursor,
      last: $last
    ) {
      edges {
        node {
          ...ProductCard
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;
