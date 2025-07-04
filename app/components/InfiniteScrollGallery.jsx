import {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {Image} from '@shopify/hydrogen';
import {useVideoContext} from '~/components/VideoContext';

/**
 * InfiniteScrollGallery component that displays a grid of images with infinite scrolling
 * @param {{
 *   items: Array<{
 *     id: string;
 *     type: 'image' | 'video' | 'gif';
 *     src: string;
 *     alt?: string;
 *     width?: number;
 *     height?: number;
 *     posterSrc?: string;
 *   }>;
 *   initialItemsToShow?: number;
 *   itemsPerLoad?: number;
 *   gridColumns?: number;
 *   gap?: number;
 *   className?: string;
 *   onItemClick?: (item: Object, index: number) => void;
 *   layout?: 'grid' | 'masonry';
 *   enableVirtualization?: boolean;
 *   placeholderImage?: string;
 * }}
 */
export function InfiniteScrollGallery({
  items = [],
  initialItemsToShow = 12,
  itemsPerLoad = 8,
  gridColumns = 3,
  gap = 16,
  className = '',
  onItemClick,
  layout = 'grid',
  enableVirtualization = true,
  placeholderImage = '',
}) {
  const [visibleItems, setVisibleItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allItemsLoaded, setAllItemsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });
  
  const loaderRef = useRef(null);
  const galleryRef = useRef(null);
  const itemRefs = useRef({});
  const {darkMode} = useVideoContext();
  
  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);
  
  // Set up mounted ref for cleanup
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Initialize visible items
  useEffect(() => {
    if (items.length > 0) {
      try {
        const initialItems = items.slice(0, initialItemsToShow);
        setVisibleItems(initialItems);
        setAllItemsLoaded(initialItems.length >= items.length);
        setError(null);
      } catch (err) {
        console.error('Error initializing gallery items:', err);
        setError('Failed to load gallery items');
      }
    }
  }, [items, initialItemsToShow]);
  
  // Load more items when scrolling
  const loadMoreItems = useCallback(() => {
    if (loading || allItemsLoaded) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        if (!isMounted.current) return;
        
        const currentLength = visibleItems.length;
        const newItems = items.slice(
          currentLength,
          currentLength + itemsPerLoad
        );
        
        if (newItems.length > 0) {
          setVisibleItems(prev => [...prev, ...newItems]);
        }
        
        setLoading(false);
        setAllItemsLoaded(currentLength + newItems.length >= items.length);
      });
    } catch (err) {
      console.error('Error loading more items:', err);
      setLoading(false);
      setError('Failed to load more items');
    }
  }, [loading, allItemsLoaded, visibleItems, items, itemsPerLoad]);
  
  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const currentLoaderRef = loaderRef.current;
    
    // Only create observer if needed
    if (!currentLoaderRef || allItemsLoaded) return;
    
    try {
      const observer = new IntersectionObserver(
        (entries) => {
          const target = entries[0];
          if (target.isIntersecting && !loading && !allItemsLoaded) {
            loadMoreItems();
          }
        },
        {
          threshold: 0.1,
          rootMargin: '100px', // Load earlier for smoother experience
        }
      );
      
      observer.observe(currentLoaderRef);
      
      return () => {
        observer.unobserve(currentLoaderRef);
        observer.disconnect();
      };
    } catch (err) {
      console.error('Error setting up intersection observer:', err);
      setError('Failed to initialize infinite scrolling');
    }
  }, [loadMoreItems, loading, allItemsLoaded]);
  
  // Virtualization effect - only render items in viewport
  useEffect(() => {
    if (!enableVirtualization || !galleryRef.current) return;
    
    try {
      const updateVisibleItems = () => {
        if (!galleryRef.current || !isMounted.current) return;
        
        const galleryRect = galleryRef.current.getBoundingClientRect();
        const viewportTop = window.scrollY;
        const viewportBottom = viewportTop + window.innerHeight;
        const buffer = window.innerHeight; // Extra buffer for smoother scrolling
        
        // Expanded viewport with buffer
        const expandedTop = viewportTop - buffer;
        const expandedBottom = viewportBottom + buffer;
        
        // Find visible range
        let start = visibleItems.length;
        let end = 0;
        
        Object.entries(itemRefs.current).forEach(([index, ref]) => {
          if (!ref) return;
          
          const rect = ref.getBoundingClientRect();
          const itemTop = rect.top + window.scrollY;
          const itemBottom = rect.bottom + window.scrollY;
          
          // Check if item is in expanded viewport
          if (itemBottom >= expandedTop && itemTop <= expandedBottom) {
            start = Math.min(start, parseInt(index));
            end = Math.max(end, parseInt(index));
          }
        });
        
        if (start <= end) {
          setVisibleRange({ start, end });
        }
      };
      
      // Initial update
      updateVisibleItems();
      
      // Add scroll listener for virtualization
      window.addEventListener('scroll', updateVisibleItems, { passive: true });
      window.addEventListener('resize', updateVisibleItems, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', updateVisibleItems);
        window.removeEventListener('resize', updateVisibleItems);
      };
    } catch (err) {
      console.error('Error setting up virtualization:', err);
      // Fall back to non-virtualized rendering
    }
  }, [enableVirtualization, visibleItems.length]);
  
  // Handle item click
  const handleItemClick = (item, index) => {
    if (onItemClick) {
      onItemClick(item, index);
    }
  };
  
  // Determine if an item should be rendered based on virtualization
  const shouldRenderItem = useCallback((index) => {
    if (!enableVirtualization) return true;
    
    // Always render if we don't have visibility data yet
    if (visibleRange.start === 0 && visibleRange.end === 0) return true;
    
    // Add buffer for smoother scrolling
    const buffer = 5;
    return index >= (visibleRange.start - buffer) && 
           index <= (visibleRange.end + buffer);
  }, [enableVirtualization, visibleRange]);
  
  // Set ref for an item
  const setItemRef = useCallback((el, index) => {
    if (el) {
      itemRefs.current[index] = el;
    } else {
      delete itemRefs.current[index];
    }
  }, []);
  
  // Render media item based on type
  const renderMediaItem = (item, index) => {
    switch (item.type) {
      case 'video':
        return (
          <div 
            className="infinite-scroll-gallery-item video"
            key={`video-${item.id || index}`}
            onClick={() => handleItemClick(item, index)}
          >
            <video
              src={item.src}
              poster={item.posterSrc}
              muted
              playsInline
              loop
              className="infinite-scroll-gallery-media"
            />
            <div className="infinite-scroll-gallery-overlay">
              <span className="infinite-scroll-gallery-play-icon">▶</span>
            </div>
          </div>
        );
      case 'gif':
        return (
          <div 
            className="infinite-scroll-gallery-item gif"
            key={`gif-${item.id || index}`}
            onClick={() => handleItemClick(item, index)}
          >
            <img
              src={item.src}
              alt={item.alt || `Gallery item ${index + 1}`}
              width={item.width}
              height={item.height}
              className="infinite-scroll-gallery-media"
            />
          </div>
        );
      case 'image':
      default:
        return (
          <div 
            className="infinite-scroll-gallery-item image"
            key={`image-${item.id || index}`}
            onClick={() => handleItemClick(item, index)}
          >
            <Image
              src={item.src}
              alt={item.alt || `Gallery item ${index + 1}`}
              width={item.width}
              height={item.height}
              className="infinite-scroll-gallery-media"
              loading="lazy"
            />
          </div>
        );
    }
  };
  
  if (!items || items.length === 0) {
    return null;
  }
  
  return (
    <div className={`infinite-scroll-gallery ${darkMode ? 'dark' : 'light'} ${className}`}>
      <div 
        className="infinite-scroll-gallery-grid"
        style={{
          gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
          gap: `${gap}px`,
        }}
      >
        {visibleItems.map((item, index) => renderMediaItem(item, index))}
      </div>
      
      {!allItemsLoaded && (
        <div ref={loaderRef} className="infinite-scroll-gallery-loader">
          {loading ? (
            <div className="infinite-scroll-gallery-loading">
              <div className="infinite-scroll-gallery-spinner"></div>
              <span>Loading more items...</span>
            </div>
          ) : (
            <div className="infinite-scroll-gallery-load-more">
              <span>Scroll for more</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}