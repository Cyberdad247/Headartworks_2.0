import {Form, useParams, useNavigation} from '@remix-run/react';

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
  const isSearching = navigation.formAction?.includes('/search');

  return (
    <Form
      action={action ?? `/search`}
      className={className}
      method={method}
      preventScrollReset
      {...props}
    >
      {children}
      {isSearching && <div className="search-form-loading">Searching...</div>}
    </Form>
  );
}