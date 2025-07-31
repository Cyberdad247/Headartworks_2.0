import {json} from '@remix-run/node';

const PREDICTIVE_SEARCH_QUERY = `#graphql
  fragment PredictiveProductFragment on Product {
    id
    title
    handle
    featuredImage {
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    vendor
    tags
  }

  query predictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int!
    $searchTerm: String!
  ) @inContext(country: $country, language: $language) {
    products: search(
      types: [PRODUCT],
      first: $limit,
      query: $searchTerm
    ) {
      edges {
        node {
          ...PredictiveProductFragment
        }
      }
    }
  }
`;

export async function loader({request, context}) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get('q');
  const limit = parseInt(url.searchParams.get('limit') || '6', 10);

  if (!searchTerm?.length) {
    return json({products: []});
  }

  try {
    const {products} = await context.storefront.query(PREDICTIVE_SEARCH_QUERY, {
      variables: {
        limit,
        searchTerm,
        country: context.storefront.i18n?.country,
        language: context.storefront.i18n?.language,
      },
    });

    return json({
      products: products.edges.map(({node}) => node),
    });
  } catch (error) {
    console.error('Predictive search query error:', error);
    return json({error: 'Failed to load search results'}, {status: 500});
  }
}
