import {createContext, useContext, useMemo, useState, useCallback} from 'react';
import {useSearchParams} from '@remix-run/react';
import {debounce} from '~/lib/utils';

const FilterContext = createContext();

export function FilterProvider({children}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => {
    // Initialize from URL params
    return {
      price: searchParams.get('price')?.split(',') || [],
      vendors: searchParams.getAll('vendor') || [],
      tags: searchParams.getAll('tag') || [],
      collections: searchParams.getAll('collection') || []
    };
  });

  const updateUrlParams = useCallback(debounce((newFilters) => {
    const newParams = new URLSearchParams();
    if (newFilters.price.length) {
      newParams.set('price', newFilters.price.join(','));
    }
    newFilters.vendors.forEach(v => newParams.append('vendor', v));
    newFilters.tags.forEach(t => newParams.append('tag', t));
    newFilters.collections.forEach(c => newParams.append('collection', c));
    setSearchParams(newParams);
  }, 300), [setSearchParams]);

  const value = useMemo(() => ({
    filters,
    setFilters: (newFilters) => {
      setFilters(newFilters);
      updateUrlParams(newFilters);
    }
  }), [filters, updateUrlParams]);

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}