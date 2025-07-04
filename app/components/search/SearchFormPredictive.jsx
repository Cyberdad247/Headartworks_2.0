import {Form, useParams, useNavigation} from '@remix-run/react';
import {useRef, useState} from 'react';
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
export function SearchFormPredictive({
  action,
  children,
  className = 'search-form-predictive',
  method = 'get',
  ...props
}) {
  const params = useParams();
  const navigation = useNavigation();
  const isSearching = navigation.formAction?.includes('/search');
  const [searchTerm, setSearchTerm] = useState('');
  const formRef = useRef(null);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="search-form-predictive-container">
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
          onChange={handleSearchTermChange}
          placeholder="Search..."
          type="search"
          value={searchTerm}
        />
        <button type="submit">Search</button>
        {children}
        {isSearching && <div className="search-form-loading">Searching...</div>}
      </Form>
      {searchTerm.length > 2 && (
        <SearchResultsPredictive searchTerm={searchTerm} />
      )}
    </div>
  );
}