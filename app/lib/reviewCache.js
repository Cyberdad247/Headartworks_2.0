import { useState, useEffect } from 'react';
import { useSWR } from 'swr';

const CACHE_KEY = 'yotpo-reviews';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useReviewCache(productId) {
  const [cachedData, setCachedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { data, error: swrError } = useSWR(
    productId ? `reviews-${productId}` : null,
    async () => {
      const cached = localStorage.getItem(`${CACHE_KEY}-${productId}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) {
          return data;
        }
      }
      return null;
    }
  );

  const fetchAndCache = async (fetcher) => {
    setIsLoading(true);
    try {
      const freshData = await fetcher();
      const cacheItem = {
        data: freshData,
        timestamp: Date.now()
      };
      localStorage.setItem(`${CACHE_KEY}-${productId}`, JSON.stringify(cacheItem));
      setCachedData(freshData);
      return freshData;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      setCachedData(data);
    }
  }, [data]);

  return {
    cachedData,
    isLoading: isLoading || (!cachedData && !error),
    error: error || swrError,
    fetchAndCache
  };
}