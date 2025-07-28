import {Suspense} from 'react';
import {useQuery} from '@shopify/hydrogen';
import {MARKETS_QUERY} from '~/graphql/marketsQuery';

export function CurrencySelector() {
  const {data} = useQuery(MARKETS_QUERY);
  const countries = data?.localization?.availableCountries || [];

  // Get unique currencies across all countries
  const currencies = countries.reduce((acc, country) => {
    if (!acc.some(c => c.isoCode === country.currency.isoCode)) {
      acc.push(country.currency);
    }
    return acc;
  }, []);

  return (
    <div className="currency-selector">
      <select aria-label="Select currency">
        {currencies.map((currency) => (
          <option key={currency.isoCode} value={currency.isoCode}>
            {currency.isoCode} - {currency.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function CurrencySelectorWrapper() {
  return (
    <Suspense fallback={null}>
      <CurrencySelector />
    </Suspense>
  );
}