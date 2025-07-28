# Faceted Filters Integration Guide

## Overview
The faceted filtering system integrates with the existing search functionality through:

1. **State Management**: `FilterContext` wraps the search results page
2. **URL Synchronization**: Filters are persisted in URL search params
3. **Data Flow**: 
   - Search results → Filter extraction → UI rendering
   - UI interactions → Filter updates → Search refinement

## Key Integration Points

### 1. SearchResultsPredictive.jsx
```jsx
// Wrap component with FilterProvider
<FilterProvider initialFilters={extractFilters(results)}>
  <FilterSidebar />
  <SearchResults products={applyFilters(results, filters)} />
</FilterProvider>
```

### 2. GraphQL Query Handling
Filters are applied client-side to avoid additional API calls:
```js
const filteredProducts = applyFilters(results.products, filters);
```

### 3. URL Synchronization
Filters are serialized to URL params:
```
/search?collections=abstract&price_min=100&price_max=500
```

## Performance Considerations
- Debounced filter updates (300ms)
- Memoized filter operations
- Client-side filtering only (no additional API calls)

## Customization
To modify filter behavior:
1. Update `filterUtils.js` for extraction/application logic
2. Modify `FilterSidebar.jsx` for UI changes
3. Adjust debounce timing in `FilterContext.jsx`