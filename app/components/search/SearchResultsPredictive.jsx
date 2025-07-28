import {Link, useFetcher} from '@remix-run/react';
import {FilterSidebar} from './FilterSidebar';
import {extractFilters} from '~/lib/filterUtils';
import {Image, Money} from '@shopify/hydrogen';
import {useEffect, useRef, useState} from 'react';
import {useClickOutside} from '~/hooks/useClickOutside';

/**
 * @param {{
 *   results?: {
 *     products?: Array<any>;
 *     collections?: Array<any>;
 *     pages?: Array<any>;
 *     articles?: Array<any>;
 *     queries?: Array<any>;
 *   };
 *   searchTerm: string;
 *   onSelect?: () => void;
 *   isLoading?: boolean;
 * }}
 */
export function SearchResultsPredictive({results, searchTerm, onSelect, isLoading}) {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);
  const itemsRef = useRef([]);

  useClickOutside(containerRef, () => onSelect?.());

  const productResults = (results?.products || []).map(item => ({...item, type: 'product'}));
  const collectionResults = (results?.collections || []).map(item => ({...item, type: 'collection'}));
  const pageResults = (results?.pages || []).map(item => ({...item, type: 'page'}));
  const articleResults = (results?.articles || []).map(item => ({...item, type: 'article'}));
  const queryResults = (results?.queries || []).map(item => ({...item, type: 'query'}));

  const allResults = [
    ...productResults,
    ...collectionResults,
    ...pageResults,
    ...articleResults,
    ...queryResults
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!allResults.length) return;
      
      switch(e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => Math.min(prev + 1, allResults.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          if (focusedIndex >= 0) {
            const item = allResults[focusedIndex];
            const link = itemsRef.current[focusedIndex]?.querySelector('a');
            if (link) link.click();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allResults.length, focusedIndex]);

  if (isLoading) {
    return (
      <div className="search-results-predictive" ref={containerRef}>
        <div className="search-results-predictive-loading">Loading...</div>
      </div>
    );
  }

  if (!allResults.length) {
    return null;
  }

  const availableFilters = extractFilters(results);
  
  return (
    <div className="search-results-container">
      <FilterSidebar availableFilters={availableFilters} />
    <div className="search-results-predictive" ref={containerRef}>
      <div className="search-results-predictive-items">
        {allResults.map((item, index) => {
          const isFocused = index === focusedIndex;
          const className = `search-results-predictive-item ${
            isFocused ? 'focused' : ''
          }`;

          return (
            <div
              key={`${item.type}-${item.id || index}`}
              ref={el => itemsRef.current[index] = el}
              className={className}
              onMouseEnter={() => setFocusedIndex(index)}
            >
              {renderItem(item)}
            </div>
          );
        })}
        </div>
      </div>
      <Link
        to={`/search?q=${encodeURIComponent(searchTerm)}`}
        className="search-results-predictive-view-all"
        onClick={onSelect}
      >
        View all results
      </Link>
    </div>
  );
}

function renderItem(item) {
  switch(item.type) {
    case 'product':
      return (
        <Link to={`/products/${item.handle}`} prefetch="intent">
          {item.featuredImage && (
            <Image
              alt={item.featuredImage.altText || item.title}
              aspectRatio="1/1"
              data={item.featuredImage}
              height={50}
              loading="lazy"
              width={50}
            />
          )}
          <div className="search-results-predictive-item-info">
            <h4>{item.title}</h4>
            <small>
              <Money data={item.priceRange?.minVariantPrice} />
            </small>
          </div>
        </Link>
      );
    case 'collection':
      return (
        <Link to={`/collections/${item.handle}`} prefetch="intent">
          {item.image && (
            <Image
              alt={item.image.altText || item.title}
              aspectRatio="1/1"
              data={item.image}
              height={50}
              loading="lazy"
              width={50}
            />
          )}
          <h4>{item.title}</h4>
        </Link>
      );
    case 'page':
      return (
        <Link to={`/pages/${item.handle}`} prefetch="intent">
          <h4>{item.title}</h4>
        </Link>
      );
    case 'article':
      return (
        <Link
          to={`/blogs/${item.blog?.handle}/${item.handle}`}
          prefetch="intent"
        >
          {item.image && (
            <Image
              alt={item.image.altText || item.title}
              aspectRatio="1/1"
              data={item.image}
              height={50}
              loading="lazy"
              width={50}
            />
          )}
          <h4>{item.title}</h4>
        </Link>
      );
    case 'query':
      return (
        <Link to={`/search?q=${encodeURIComponent(item.text)}`}>
          <h4>{item.styledText || item.text}</h4>
        </Link>
      );
    default:
      return null;
  }
}