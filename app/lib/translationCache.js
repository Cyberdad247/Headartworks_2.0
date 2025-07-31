/**
 * Translation caching system for performance optimization
 */

/**
 * LRU Cache implementation for translations
 */
export class TranslationCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.hits = 0;
    this.misses = 0;
  }
  
  get(key) {
    if (this.cache.has(key)) {
      // Move to end (most recently used)
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      this.hits++;
      return value;
    }
    this.misses++;
    return null;
  }
  
  set(key, value) {
    if (this.cache.has(key)) {
      // Update existing entry
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
  
  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }
  
  getStats() {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? (this.hits / total) * 100 : 0
    };
  }
}

/**
 * Global translation cache instance
 */
export const translationCache = new TranslationCache(200);

/**
 * Translation loader with caching
 */
const translationPromises = new Map();

export async function loadTranslations(language) {
  const cacheKey = `translations-${language}`;
  
  // Check cache first
  const cached = translationCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  // Check if already loading
  if (translationPromises.has(language)) {
    return translationPromises.get(language);
  }
  
  // Load translations
  const promise = import(/* @vite-ignore */ `~/translations/${language}.json`)
    .then(module => {
      const translations = module.default || module;
      translationCache.set(cacheKey, translations);
      translationPromises.delete(language);
      return translations;
    })
    .catch(error => {
      console.error(`Failed to load translations for ${language}:`, error);
      translationPromises.delete(language);
      
      // Fallback to English if not already English
      if (language !== 'en') {
        return loadTranslations('en');
      }
      
      throw error;
    });
  
  translationPromises.set(language, promise);
  return promise;
}

/**
 * Preload critical translations for all languages
 */
export function preloadCriticalTranslations() {
  const languages = ['en', 'es', 'fr'];
  
  languages.forEach(lang => {
    // Use requestIdleCallback if available for non-blocking preload
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        loadTranslations(lang);
      });
    } else {
      // Fallback to setTimeout
      setTimeout(() => {
        loadTranslations(lang);
      }, 100);
    }
  });
}

/**
 * Translation function cache for memoization
 */
const translationFunctionCache = new Map();

export function createOptimizedTranslator(translations) {
  return function t(key, params = {}) {
    const cacheKey = `${key}:${JSON.stringify(params)}`;
    
    // Check function-level cache
    if (translationFunctionCache.has(cacheKey)) {
      return translationFunctionCache.get(cacheKey);
    }
    
    // Navigate nested object using dot notation
    const keys = key.split('.');
    let translation = translations;
    
    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k];
      } else {
        // Return the key if translation not found
        return key;
      }
    }
    
    // If translation is not a string, return the key
    if (typeof translation !== 'string') {
      return key;
    }
    
    // Replace placeholders with params
    let result = translation;
    Object.entries(params).forEach(([param, value]) => {
      result = result.replace(new RegExp(`{${param}}`, 'g'), value);
    });
    
    // Cache the result
    translationFunctionCache.set(cacheKey, result);
    
    // Limit cache size
    if (translationFunctionCache.size > 1000) {
      const firstKey = translationFunctionCache.keys().next().value;
      translationFunctionCache.delete(firstKey);
    }
    
    return result;
  };
}

/**
 * Performance monitoring for translations
 */
export class TranslationPerformanceMonitor {
  constructor() {
    this.metrics = {
      loadTimes: [],
      cacheHits: 0,
      cacheMisses: 0,
      translationCalls: 0
    };
  }
  
  recordLoadTime(language, duration) {
    this.metrics.loadTimes.push({
      language,
      duration,
      timestamp: Date.now()
    });
    
    // Keep only last 100 entries
    if (this.metrics.loadTimes.length > 100) {
      this.metrics.loadTimes.shift();
    }
  }
  
  recordCacheHit() {
    this.metrics.cacheHits++;
  }
  
  recordCacheMiss() {
    this.metrics.cacheMisses++;
  }
  
  recordTranslationCall() {
    this.metrics.translationCalls++;
  }
  
  getMetrics() {
    const totalCacheAccess = this.metrics.cacheHits + this.metrics.cacheMisses;
    const averageLoadTime = this.metrics.loadTimes.length > 0
      ? this.metrics.loadTimes.reduce((sum, entry) => sum + entry.duration, 0) / this.metrics.loadTimes.length
      : 0;
    
    return {
      ...this.metrics,
      cacheHitRate: totalCacheAccess > 0 ? (this.metrics.cacheHits / totalCacheAccess) * 100 : 0,
      averageLoadTime,
      recentLoadTimes: this.metrics.loadTimes.slice(-10)
    };
  }
  
  reset() {
    this.metrics = {
      loadTimes: [],
      cacheHits: 0,
      cacheMisses: 0,
      translationCalls: 0
    };
  }
}

/**
 * Global performance monitor instance
 */
export const performanceMonitor = new TranslationPerformanceMonitor();

/**
 * Analytics integration for translation performance
 */
export function trackTranslationPerformance(language, metrics) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'translation_performance', {
      language,
      load_time: metrics.loadTime,
      cache_hit_rate: metrics.cacheHitRate,
      translation_calls: metrics.translationCalls
    });
  }
}