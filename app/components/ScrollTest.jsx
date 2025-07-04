import {useEffect, useRef} from 'react';
import {scrollObserverOptions, debounce} from '~/lib/scroll-observer';

export function ScrollTest() {
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const handleIntersection = debounce((entries) => {
      // Replace forEach with for...of
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const element = entry.target;
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }
      }
    }, 50);

    observerRef.current = new IntersectionObserver(
      handleIntersection,
      scrollObserverOptions
    );

    const elements = containerRef.current.querySelectorAll('.scroll-item');
    // Replace forEach with for...of
    for (const el of elements) {
      observerRef.current.observe(el);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="scroll-test-container">
      {[...Array(20)].map((_, index) => (
        // Use a unique ID instead of index as key
        <div key={`scroll-item-${index}-${Date.now()}`} className="scroll-item">
          <div className="scroll-content">
            Item {index + 1}
          </div>
        </div>
      ))}
    </div>
  );
}