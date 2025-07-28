// @ts-ignore
import { useEffect, RefObject } from 'react';

/**
 * Custom hook that triggers a callback when clicking outside of the referenced element
 * @param ref React ref object pointing to the element to watch
 * @param callback Function to call when clicking outside
 */
export function useClickOutside(ref: RefObject<HTMLElement>, callback: () => void) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
}