import {createContext, useContext, useEffect, useState, useMemo} from 'react';
import {useMatches} from '@remix-run/react';
import {
  loadTranslations,
  createOptimizedTranslator,
  performanceMonitor,
  preloadCriticalTranslations
} from '~/lib/translationCache';
import {
  trackTranslationPerformance,
  trackTranslationError,
  measureTranslationPerformance
} from '~/lib/analytics';

const TranslationContext = createContext();

export function TranslationProvider({children}) {
  const matches = useMatches();
  const rootData = matches.find(match => match.id === 'root')?.data;
  const language = rootData?.language || 'en';
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Preload critical translations on mount
  useEffect(() => {
    preloadCriticalTranslations();
  }, []);

  useEffect(() => {
    async function loadTranslationsWithPerformance() {
      setIsLoading(true);
      
      try {
        const translationData = await measureTranslationPerformance(language, () =>
          loadTranslations(language)
        );
        
        setTranslations(translationData);
        performanceMonitor.recordCacheHit();
        
      } catch (error) {
        trackTranslationError(error, { language, key: 'load_translations' });
        performanceMonitor.recordCacheMiss();
        
        // Fallback to empty translations
        setTranslations({});
      } finally {
        setIsLoading(false);
      }
    }
    
    loadTranslationsWithPerformance();
  }, [language]);

  // Create optimized translator function
  const t = useMemo(() => {
    if (isLoading || Object.keys(translations).length === 0) {
      return (key) => key;
    }
    
    return createOptimizedTranslator(translations);
  }, [translations, isLoading]);

  const value = useMemo(() => ({
    t,
    language,
    isLoading,
    translations,
    // Performance monitoring
    getPerformanceStats: () => performanceMonitor.getMetrics()
  }), [t, language, isLoading, translations]);

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

// Higher-order component for class components
export function withTranslation(Component) {
  return function TranslatedComponent(props) {
    const translation = useTranslation();
    return <Component {...props} {...translation} />;
  };
}