/**
 * Analytics utilities for language system monitoring
 */

/**
 * Track language switching events
 */
export function trackLanguageSwitch(fromLang, toLang, page) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'language_switch', {
      from_language: fromLang,
      to_language: toLang,
      page_path: page,
      timestamp: Date.now()
    });
  }
  
  // Also track in custom analytics if available
  if (typeof analytics !== 'undefined') {
    analytics.track('Language Changed', {
      previousLanguage: fromLang,
      newLanguage: toLang,
      pagePath: page,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Track translation performance metrics
 */
export function trackTranslationPerformance(language, metrics) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'translation_performance', {
      language,
      translation_load_time: metrics.translationLoadTime,
      bundle_size: metrics.bundleSize,
      cache_hit_rate: metrics.cacheHitRate,
      translation_calls: metrics.translationCalls
    });
  }
}

/**
 * Track SEO-related events
 */
export function trackSEOEvent(eventType, data) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'seo_event', {
      event_type: eventType,
      language: data.language,
      page_path: data.pagePath,
      hreflang_present: data.hreflangPresent,
      canonical_url: data.canonicalUrl
    });
  }
}

/**
 * Track user language preferences
 */
export function trackLanguagePreference(detectionMethod, detectedLanguage, userLanguage) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'language_preference', {
      detection_method: detectionMethod, // 'url', 'session', 'browser', 'default'
      detected_language: detectedLanguage,
      user_language: userLanguage,
      preference_match: detectedLanguage === userLanguage
    });
  }
}

/**
 * Monitor Core Web Vitals impact
 */
export function monitorWebVitals() {
  if (typeof web_vitals !== 'undefined') {
    web_vitals.getCLS((metric) => {
      gtag('event', 'web_vitals', {
        metric_name: 'CLS',
        metric_value: metric.value,
        metric_rating: metric.rating
      });
    });
    
    web_vitals.getFID((metric) => {
      gtag('event', 'web_vitals', {
        metric_name: 'FID',
        metric_value: metric.value,
        metric_rating: metric.rating
      });
    });
    
    web_vitals.getLCP((metric) => {
      gtag('event', 'web_vitals', {
        metric_name: 'LCP',
        metric_value: metric.value,
        metric_rating: metric.rating
      });
    });
  }
}

/**
 * Validate hreflang implementation
 */
export function validateHreflang() {
  const hreflangLinks = document.querySelectorAll('link[hreflang]');
  const languages = ['en', 'es', 'fr', 'x-default'];
  const missing = [];
  
  languages.forEach(lang => {
    const link = document.querySelector(`link[hreflang="${lang}"]`);
    if (!link) {
      missing.push(lang);
      console.warn(`Missing hreflang for ${lang}`);
    }
  });
  
  // Track validation results
  trackSEOEvent('hreflang_validation', {
    language: document.documentElement.lang,
    pagePath: window.location.pathname,
    hreflangPresent: hreflangLinks.length > 0,
    missingLanguages: missing,
    totalHreflangTags: hreflangLinks.length
  });
  
  return {
    isValid: missing.length === 0,
    missing,
    total: hreflangLinks.length
  };
}

/**
 * Performance measurement utilities
 */
export class PerformanceMeasurement {
  constructor(name) {
    this.name = name;
    this.startTime = null;
    this.endTime = null;
  }
  
  start() {
    this.startTime = performance.now();
    performance.mark(`${this.name}-start`);
    return this;
  }
  
  end() {
    this.endTime = performance.now();
    performance.mark(`${this.name}-end`);
    performance.measure(this.name, `${this.name}-start`, `${this.name}-end`);
    
    const measure = performance.getEntriesByName(this.name)[0];
    return measure ? measure.duration : this.endTime - this.startTime;
  }
  
  getDuration() {
    return this.endTime - this.startTime;
  }
}

/**
 * Measure translation loading performance
 */
export function measureTranslationPerformance(language, callback) {
  const measurement = new PerformanceMeasurement(`translation-load-${language}`);
  measurement.start();
  
  return callback().then(result => {
    const duration = measurement.end();
    
    trackTranslationPerformance(language, {
      translationLoadTime: duration,
      language
    });
    
    return result;
  });
}

/**
 * Bundle size tracking
 */
export function trackBundleSize(bundleName, size) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'bundle_size', {
      bundle_name: bundleName,
      size_bytes: size,
      size_kb: Math.round(size / 1024 * 100) / 100
    });
  }
}

/**
 * Error tracking for translations
 */
export function trackTranslationError(error, context) {
  console.error('Translation error:', error, context);
  
  if (typeof gtag !== 'undefined') {
    gtag('event', 'translation_error', {
      error_message: error.message,
      error_type: error.name,
      language: context.language,
      translation_key: context.key,
      page_path: window.location.pathname
    });
  }
}

/**
 * User engagement tracking by language
 */
export function trackLanguageEngagement(language, metrics) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'language_engagement', {
      language,
      session_duration: metrics.sessionDuration,
      page_views: metrics.pageViews,
      bounce_rate: metrics.bounceRate,
      conversion_events: metrics.conversionEvents
    });
  }
}

/**
 * A/B test tracking for language features
 */
export function trackLanguageExperiment(experimentName, variant, language) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'language_experiment', {
      experiment_name: experimentName,
      variant,
      language,
      page_path: window.location.pathname
    });
  }
}

/**
 * Initialize analytics for language system
 */
export function initializeLanguageAnalytics() {
  // Validate hreflang on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', validateHreflang);
  } else {
    validateHreflang();
  }
  
  // Monitor web vitals
  monitorWebVitals();
  
  // Track initial language preference
  const currentLang = document.documentElement.lang || 'en';
  const urlLang = window.location.pathname.split('/')[1];
  const detectionMethod = ['en', 'es', 'fr'].includes(urlLang) ? 'url' : 'default';
  
  trackLanguagePreference(detectionMethod, urlLang, currentLang);
}

/**
 * Create analytics dashboard data
 */
export function getAnalyticsDashboardData() {
  const data = {
    timestamp: new Date().toISOString(),
    page: window.location.pathname,
    language: document.documentElement.lang,
    hreflang: validateHreflang(),
    performance: {
      navigation: performance.getEntriesByType('navigation')[0],
      resources: performance.getEntriesByType('resource').filter(r => 
        r.name.includes('translation') || r.name.includes('language')
      )
    }
  };
  
  return data;
}