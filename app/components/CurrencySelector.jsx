import {Suspense} from 'react';

export function CurrencySelector() {
  // Simplified currency selector with common currencies
  // In a real implementation, this would fetch from your storefront's available currencies
  const currencies = [
    { isoCode: 'USD', name: 'US Dollar' },
    { isoCode: 'EUR', name: 'Euro' },
    { isoCode: 'GBP', name: 'British Pound' },
    { isoCode: 'CAD', name: 'Canadian Dollar' },
  ];

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