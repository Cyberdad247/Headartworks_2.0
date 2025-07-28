import {Form, useParams, useNavigation, useFetcher} from '@remix-run/react';
import {useEffect, useRef, useState} from 'react';
import {SearchResultsPredictive} from './SearchResultsPredictive';

/**
 * @param {{
 *   action?: string;
 *   children?: React.ReactNode;
 *   className?: string;
 *   method?: 'get' | 'post';
 *   [key: string]: any;
 * }}
 */
export function SearchForm({
  action,
  children,
  className = 'search-form',
  method = 'get',
  ...props
}) {
  const params = useParams();
  const navigation = useNavigation();
  const fetcher = useFetcher();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const formRef = useRef(null);
  const timerRef = useRef(null);

  const isSearching = navigation.formAction?.includes('/search');

  useEffect(() => {
    if (searchTerm.length > 2) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        fetcher.load(`/search?q=${searchTerm}&predictive=true`);
      }, 300);
    }
    return () => clearTimeout(timerRef.current);
  }, [searchTerm]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  return (
    <div className="search-form-container">
      <Form
        action={action ?? `/search`}
        className={className}
        method={method}
        preventScrollReset
        ref={formRef}
        {...props}
      >
        <input
          name="q"
          onChange={handleChange}
          placeholder="Search..."
          type="search"
          value={searchTerm}
          aria-expanded={showSuggestions}
          aria-controls="search-suggestions"
        />
        <button type="submit">Search</button>
        {children}
        {isSearching && <div className="search-form-loading">Searching...</div>}
      </Form>
      {showSuggestions && searchTerm.length > 2 && (
        <SearchResultsPredictive
          results={fetcher.data?.result?.items}
          searchTerm={searchTerm}
          onSelect={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}