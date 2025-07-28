# Currency Handling Strategy

## Implementation Overview
- ProductPrice component accepts `currency` prop
- Currency is passed from:
  - Product variants (for product pages)
  - Cart line items (for cart/checkout)
- Shopify's Hydrogen `Money` component handles:
  - Currency conversion (via Shopify Markets)
  - Locale-specific formatting
  - Currency symbol display

## Key Components
1. **ProductPrice.jsx** - Wrapper for Money component
2. **CurrencySelector.jsx** - Allows currency switching
3. **Shopify Markets** - Handles conversion rates

## Testing Requirements
- Verify prices convert correctly between currencies
- Check formatting matches locale expectations
- Ensure currency symbols display properly