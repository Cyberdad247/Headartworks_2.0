import {gql} from '@shopify/hydrogen';

/**
 * Enhanced search fragments with more fields
 */
export const ENHANCED_SEARCH_PRODUCT_FRAGMENT = gql`
  fragment EnhancedSearchProduct on Product {
    __typename
    handle
    id
    publishedAt
    title
    description
    tags
    trackingParameters
    vendor
    metafields(identifiers: [
      {namespace: "custom", key: "search_keywords"}
    ]) {
      key
      value
    }
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
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
      product {
        handle
        title
      }
    }
  }
`;
export const ENHANCED_SEARCH_PAGE_FRAGMENT = gql`
  fragment EnhancedSearchPage on Page {
    __typename
    handle
    id
    title
    body
    trackingParameters
    metafields(identifiers: [
      {namespace: "custom", key: "search_keywords"}
    ]) {
      key
      value
    }
  }
`;

export const ENHANCED_SEARCH_ARTICLE_FRAGMENT = gql`
  fragment EnhancedSearchArticle on Article {
    __typename
    handle
    id
    title
    excerpt
    content
    tags
    trackingParameters
    blog {
      handle
      title
    }
    metafields(identifiers: [
      {namespace: "custom", key: "search_keywords"}
    ]) {
      key
      value
    }
  }
`;

export const ENHANCED_SEARCH_COLLECTION_FRAGMENT = gql`
  fragment EnhancedSearchCollection on Collection {
    __typename
    handle
    id
    title
    description
    trackingParameters
    metafields(identifiers: [
      {namespace: "custom", key: "search_keywords"}
    ]) {
      key
      value
    }
  }
`;

export const PAGE_INFO_FRAGMENT = gql`
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`;

/**
 * Enhanced full-text search query with:
 * - More searchable fields
 * - Fuzzy matching
 * - Search operators
 * - Relevance scoring
 */
export const ENHANCED_SEARCH_QUERY = gql`
  query EnhancedSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $term: String!
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    search(
      query: $term,
      types: [ARTICLE, PAGE, PRODUCT, COLLECTION],
      first: $first,
      last: $last,
      after: $endCursor,
      before: $startCursor,
      sortKey: RELEVANCE,
      unavailableProducts: HIDE,
    ) {
      totalCount
      edges {
        node {
          __typename
          ...on Article {
            ...EnhancedSearchArticle
            relevance: score
          }
          ...on Page {
            ...EnhancedSearchPage
            relevance: score
          }
          ...on Product {
            ...EnhancedSearchProduct
            relevance: score
          }
          ...on Collection {
            ...EnhancedSearchCollection
            relevance: score
          }
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${ENHANCED_SEARCH_PRODUCT_FRAGMENT}
  ${ENHANCED_SEARCH_PAGE_FRAGMENT}
  ${ENHANCED_SEARCH_ARTICLE_FRAGMENT}
  ${ENHANCED_SEARCH_COLLECTION_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

/**
 * Predictive search with enhanced fields
 */
export const ENHANCED_PREDICTIVE_SEARCH_QUERY = gql`
  query EnhancedPredictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope!
    $term: String!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $limit,
      limitScope: $limitScope,
      query: $term,
      types: $types,
    ) {
      articles {
        ...EnhancedSearchArticle
      }
      collections {
        ...EnhancedSearchCollection
      }
      pages {
        ...EnhancedSearchPage
      }
      products {
        ...EnhancedSearchProduct
      }
      queries {
        text
        styledText
        trackingParameters
      }
    }
  }
  ${ENHANCED_SEARCH_ARTICLE_FRAGMENT}
  ${ENHANCED_SEARCH_COLLECTION_FRAGMENT}
  ${ENHANCED_SEARCH_PAGE_FRAGMENT}
  ${ENHANCED_SEARCH_PRODUCT_FRAGMENT}
`;