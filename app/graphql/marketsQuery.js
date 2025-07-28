import {gql} from '@shopify/hydrogen';

export const MARKETS_QUERY = gql`
  query Markets {
    localization {
      availableCountries {
        isoCode
        name
        currency {
          isoCode
          name
          symbol
        }
        languages {
          isoCode
          name
          endonymName
        }
      }
    }
  }
`;