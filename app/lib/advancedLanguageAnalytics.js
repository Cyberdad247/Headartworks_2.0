/**
 * Advanced Language Analytics System
 * Provides comprehensive tracking and insights for language usage,
 * user behavior, and translation performance across the multilingual storefront.
 */

import { analytics } from './analytics.js';

class AdvancedLanguageAnalytics {
  constructor() {
    this.sessionData = new Map();
    this.languageMetrics = new Map();
    this.translationPerformance = new Map();
    this.userBehaviorPatterns = new Map();
    this.conversionTracking = new Map();
    this.contentEngagement = new Map();
    
    // Initialize tracking
    this.initializeTracking();
  }

  /**
   * Initialize analytics tracking
   */
  initializeTracking() {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackSessionActivity();
    });

    // Track user interactions
    this.setupInteractionTracking();
    
    // Initialize performance monitoring
    this.initializePerformanceMonitoring();
  }

  /**
   * Track language selection events
   */
  trackLanguageSelection(data) {
    const {
      fromLanguage,
      toLanguage,
      selectionMethod,
      userAgent,
      timestamp = Date.now(),
      sessionId = this.getSessionId(),
      userId = this.getUserId()
    } = data;

    const event = {
      type: 'language_selection',
      fromLanguage,
      toLanguage,
      selectionMethod, // 'manual', 'auto_detect', 'browser_preference', 'geolocation'
      userAgent,
      timestamp,
      sessionId,
      userId,
      pageUrl: window.location.href,
      referrer: document.referrer
    };

    // Store in session data
    this.sessionData.set(`language_selection_${timestamp}`, event);

    // Update language metrics
    this.updateLanguageMetrics(toLanguage, 'selection');

    // Track with analytics service
    analytics.track('Language Selection', event);

    // Send to backend for storage
    this.sendToBackend('language_selection', event);

    return event;
  }

  /**
   * Track language auto-detection results
   */
  trackAutoDetection(data) {
    const {
      detectedLanguage,
      detectionMethod,
      confidence,
      fallbackUsed,
      detectionTime,
      browserLanguage,
      geolocationData,
      timestamp = Date.now()
    } = data;

    const event = {
      type: 'auto_detection',
      detectedLanguage,
      detectionMethod, // 'browser', 'geolocation', 'ip', 'previous_session'
      confidence,
      fallbackUsed,
      detectionTime,
      browserLanguage,
      geolocationData,
      timestamp,
      sessionId: this.getSessionId(),
      accuracy: this.calculateDetectionAccuracy(detectedLanguage)
    };

    this.sessionData.set(`auto_detection_${timestamp}`, event);
    analytics.track('Language Auto Detection', event);
    this.sendToBackend('auto_detection', event);

    return event;
  }

  /**
   * Track translation loading performance
   */
  trackTranslationPerformance(data) {
    const {
      language,
      loadTime,
      cacheHit,
      bundleSize,
      errorCount,
      timestamp = Date.now()
    } = data;

    const performanceData = {
      type: 'translation_performance',
      language,
      loadTime,
      cacheHit,
      bundleSize,
      errorCount,
      timestamp,
      sessionId: this.getSessionId()
    };

    // Update performance metrics
    if (!this.translationPerformance.has(language)) {
      this.translationPerformance.set(language, {
        totalLoads: 0,
        totalLoadTime: 0,
        cacheHits: 0,
        errors: 0,
        averageLoadTime: 0,
        cacheHitRate: 0
      });
    }

    const metrics = this.translationPerformance.get(language);
    metrics.totalLoads++;
    metrics.totalLoadTime += loadTime;
    metrics.errors += errorCount;
    
    if (cacheHit) {
      metrics.cacheHits++;
    }

    metrics.averageLoadTime = metrics.totalLoadTime / metrics.totalLoads;
    metrics.cacheHitRate = (metrics.cacheHits / metrics.totalLoads) * 100;

    analytics.track('Translation Performance', performanceData);
    this.sendToBackend('translation_performance', performanceData);

    return performanceData;
  }

  /**
   * Track user behavior patterns by language
   */
  trackUserBehavior(data) {
    const {
      language,
      action,
      element,
      value,
      duration,
      timestamp = Date.now()
    } = data;

    const behaviorData = {
      type: 'user_behavior',
      language,
      action, // 'click', 'scroll', 'hover', 'form_interaction', 'search'
      element,
      value,
      duration,
      timestamp,
      sessionId: this.getSessionId(),
      userId: this.getUserId(),
      pageUrl: window.location.href
    };

    // Update behavior patterns
    const patternKey = `${language}_${action}`;
    if (!this.userBehaviorPatterns.has(patternKey)) {
      this.userBehaviorPatterns.set(patternKey, {
        count: 0,
        totalDuration: 0,
        averageDuration: 0,
        elements: new Map()
      });
    }

    const pattern = this.userBehaviorPatterns.get(patternKey);
    pattern.count++;
    pattern.totalDuration += duration || 0;
    pattern.averageDuration = pattern.totalDuration / pattern.count;

    if (element) {
      const elementCount = pattern.elements.get(element) || 0;
      pattern.elements.set(element, elementCount + 1);
    }

    analytics.track('User Behavior', behaviorData);
    this.sendToBackend('user_behavior', behaviorData);

    return behaviorData;
  }

  /**
   * Track conversion events by language
   */
  trackConversion(data) {
    const {
      language,
      conversionType,
      value,
      currency,
      productId,
      categoryId,
      timestamp = Date.now()
    } = data;

    const conversionData = {
      type: 'conversion',
      language,
      conversionType, // 'purchase', 'add_to_cart', 'signup', 'newsletter', 'contact'
      value,
      currency,
      productId,
      categoryId,
      timestamp,
      sessionId: this.getSessionId(),
      userId: this.getUserId(),
      sessionDuration: this.getSessionDuration()
    };

    // Update conversion tracking
    if (!this.conversionTracking.has(language)) {
      this.conversionTracking.set(language, {
        totalConversions: 0,
        totalValue: 0,
        conversionsByType: new Map(),
        averageValue: 0
      });
    }

    const tracking = this.conversionTracking.get(language);
    tracking.totalConversions++;
    tracking.totalValue += value || 0;
    tracking.averageValue = tracking.totalValue / tracking.totalConversions;

    const typeCount = tracking.conversionsByType.get(conversionType) || 0;
    tracking.conversionsByType.set(conversionType, typeCount + 1);

    analytics.track('Conversion', conversionData);
    this.sendToBackend('conversion', conversionData);

    return conversionData;
  }

  /**
   * Track content engagement by language
   */
  trackContentEngagement(data) {
    const {
      language,
      contentType,
      contentId,
      engagementType,
      duration,
      scrollDepth,
      timestamp = Date.now()
    } = data;

    const engagementData = {
      type: 'content_engagement',
      language,
      contentType, // 'product', 'collection', 'blog', 'page'
      contentId,
      engagementType, // 'view', 'read', 'share', 'like', 'comment'
      duration,
      scrollDepth,
      timestamp,
      sessionId: this.getSessionId(),
      userId: this.getUserId()
    };

    // Update engagement metrics
    const engagementKey = `${language}_${contentType}`;
    if (!this.contentEngagement.has(engagementKey)) {
      this.contentEngagement.set(engagementKey, {
        totalViews: 0,
        totalDuration: 0,
        averageDuration: 0,
        averageScrollDepth: 0,
        engagementsByType: new Map()
      });
    }

    const engagement = this.contentEngagement.get(engagementKey);
    engagement.totalViews++;
    engagement.totalDuration += duration || 0;
    engagement.averageDuration = engagement.totalDuration / engagement.totalViews;
    
    if (scrollDepth) {
      engagement.averageScrollDepth = 
        ((engagement.averageScrollDepth * (engagement.totalViews - 1)) + scrollDepth) / engagement.totalViews;
    }

    const typeCount = engagement.engagementsByType.get(engagementType) || 0;
    engagement.engagementsByType.set(engagementType, typeCount + 1);

    analytics.track('Content Engagement', engagementData);
    this.sendToBackend('content_engagement', engagementData);

    return engagementData;
  }

  /**
   * Track A/B test results for language features
   */
  trackABTest(data) {
    const {
      testName,
      variant,
      language,
      metric,
      value,
      timestamp = Date.now()
    } = data;

    const testData = {
      type: 'ab_test',
      testName,
      variant,
      language,
      metric,
      value,
      timestamp,
      sessionId: this.getSessionId(),
      userId: this.getUserId()
    };

    analytics.track('A/B Test', testData);
    this.sendToBackend('ab_test', testData);

    return testData;
  }

  /**
   * Generate language usage report
   */
  generateLanguageReport(timeframe = '7d') {
    const report = {
      timeframe,
      generatedAt: new Date().toISOString(),
      summary: {
        totalSessions: this.sessionData.size,
        uniqueUsers: new Set([...this.sessionData.values()].map(s => s.userId)).size,
        languageDistribution: this.getLanguageDistribution(),
        topLanguages: this.getTopLanguages(5)
      },
      performance: {
        translationLoadTimes: this.getTranslationPerformanceReport(),
        cacheEfficiency: this.getCacheEfficiencyReport(),
        errorRates: this.getErrorRateReport()
      },
      userBehavior: {
        behaviorPatterns: this.getBehaviorPatternsReport(),
        engagementMetrics: this.getEngagementMetricsReport(),
        conversionRates: this.getConversionRatesReport()
      },
      insights: this.generateInsights(),
      recommendations: this.generateRecommendations()
    };

    return report;
  }

  /**
   * Get language distribution
   */
  getLanguageDistribution() {
    const distribution = new Map();
    
    for (const [key, data] of this.sessionData) {
      if (data.type === 'language_selection') {
        const count = distribution.get(data.toLanguage) || 0;
        distribution.set(data.toLanguage, count + 1);
      }
    }

    return Object.fromEntries(distribution);
  }

  /**
   * Get top languages by usage
   */
  getTopLanguages(limit = 5) {
    const distribution = this.getLanguageDistribution();
    return Object.entries(distribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([language, count]) => ({ language, count }));
  }

  /**
   * Get translation performance report
   */
  getTranslationPerformanceReport() {
    const report = {};
    
    for (const [language, metrics] of this.translationPerformance) {
      report[language] = {
        averageLoadTime: Math.round(metrics.averageLoadTime),
        cacheHitRate: Math.round(metrics.cacheHitRate * 100) / 100,
        errorRate: Math.round((metrics.errors / metrics.totalLoads) * 100 * 100) / 100,
        totalLoads: metrics.totalLoads
      };
    }

    return report;
  }

  /**
   * Get behavior patterns report
   */
  getBehaviorPatternsReport() {
    const report = {};
    
    for (const [patternKey, pattern] of this.userBehaviorPatterns) {
      const [language, action] = patternKey.split('_');
      
      if (!report[language]) {
        report[language] = {};
      }
      
      report[language][action] = {
        count: pattern.count,
        averageDuration: Math.round(pattern.averageDuration),
        topElements: Array.from(pattern.elements.entries())
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([element, count]) => ({ element, count }))
      };
    }

    return report;
  }

  /**
   * Get conversion rates report
   */
  getConversionRatesReport() {
    const report = {};
    
    for (const [language, tracking] of this.conversionTracking) {
      const sessionCount = this.getSessionCountByLanguage(language);
      
      report[language] = {
        conversionRate: Math.round((tracking.totalConversions / sessionCount) * 100 * 100) / 100,
        averageValue: Math.round(tracking.averageValue * 100) / 100,
        totalConversions: tracking.totalConversions,
        conversionsByType: Object.fromEntries(tracking.conversionsByType)
      };
    }

    return report;
  }

  /**
   * Generate insights from analytics data
   */
  generateInsights() {
    const insights = [];
    
    // Language preference insights
    const topLanguages = this.getTopLanguages(3);
    if (topLanguages.length > 0) {
      insights.push({
        type: 'language_preference',
        message: `${topLanguages[0].language} is the most popular language with ${topLanguages[0].count} selections`,
        impact: 'high',
        data: topLanguages
      });
    }

    // Performance insights
    const performanceReport = this.getTranslationPerformanceReport();
    const slowLanguages = Object.entries(performanceReport)
      .filter(([, metrics]) => metrics.averageLoadTime > 1000)
      .map(([language]) => language);
    
    if (slowLanguages.length > 0) {
      insights.push({
        type: 'performance',
        message: `Translation loading is slow for: ${slowLanguages.join(', ')}`,
        impact: 'medium',
        data: slowLanguages
      });
    }

    // Conversion insights
    const conversionReport = this.getConversionRatesReport();
    const bestPerformingLanguage = Object.entries(conversionReport)
      .sort(([,a], [,b]) => b.conversionRate - a.conversionRate)[0];
    
    if (bestPerformingLanguage) {
      insights.push({
        type: 'conversion',
        message: `${bestPerformingLanguage[0]} has the highest conversion rate at ${bestPerformingLanguage[1].conversionRate}%`,
        impact: 'high',
        data: bestPerformingLanguage
      });
    }

    return insights;
  }

  /**
   * Generate recommendations based on analytics
   */
  generateRecommendations() {
    const recommendations = [];
    const insights = this.generateInsights();

    // Performance recommendations
    const performanceInsight = insights.find(i => i.type === 'performance');
    if (performanceInsight) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        action: 'Optimize translation loading for slow languages',
        details: 'Consider implementing lazy loading or improving caching for these languages',
        languages: performanceInsight.data
      });
    }

    // Language support recommendations
    const languageInsight = insights.find(i => i.type === 'language_preference');
    if (languageInsight && languageInsight.data.length > 0) {
      const underperformingLanguages = languageInsight.data
        .filter(lang => lang.count < languageInsight.data[0].count * 0.1);
      
      if (underperformingLanguages.length > 0) {
        recommendations.push({
          type: 'language_support',
          priority: 'medium',
          action: 'Review underperforming language support',
          details: 'Consider improving content quality or marketing for these languages',
          languages: underperformingLanguages.map(l => l.language)
        });
      }
    }

    // Conversion optimization recommendations
    const conversionInsight = insights.find(i => i.type === 'conversion');
    if (conversionInsight) {
      recommendations.push({
        type: 'conversion',
        priority: 'high',
        action: 'Apply best practices from high-converting languages',
        details: `Study ${conversionInsight.data[0]} implementation and apply learnings to other languages`,
        bestPracticeLanguage: conversionInsight.data[0]
      });
    }

    return recommendations;
  }

  /**
   * Helper methods
   */
  getSessionId() {
    if (!this.currentSessionId) {
      this.currentSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    return this.currentSessionId;
  }

  getUserId() {
    // Get from localStorage or generate anonymous ID
    let userId = localStorage.getItem('analytics_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('analytics_user_id', userId);
    }
    return userId;
  }

  getSessionDuration() {
    const sessionStart = localStorage.getItem('session_start');
    if (sessionStart) {
      return Date.now() - parseInt(sessionStart);
    }
    return 0;
  }

  getSessionCountByLanguage(language) {
    return [...this.sessionData.values()]
      .filter(data => data.type === 'language_selection' && data.toLanguage === language)
      .length;
  }

  calculateDetectionAccuracy(detectedLanguage) {
    // This would be calculated based on user corrections/confirmations
    // For now, return a placeholder
    return 0.85;
  }

  updateLanguageMetrics(language, action) {
    if (!this.languageMetrics.has(language)) {
      this.languageMetrics.set(language, {
        selections: 0,
        sessions: 0,
        conversions: 0,
        engagement: 0
      });
    }

    const metrics = this.languageMetrics.get(language);
    if (action === 'selection') {
      metrics.selections++;
    }
  }

  setupInteractionTracking() {
    // Track clicks on language-related elements
    document.addEventListener('click', (event) => {
      const target = event.target.closest('[data-language-element]');
      if (target) {
        this.trackUserBehavior({
          language: document.documentElement.lang || 'en',
          action: 'click',
          element: target.dataset.languageElement,
          timestamp: Date.now()
        });
      }
    });

    // Track form interactions
    document.addEventListener('input', (event) => {
      if (event.target.matches('input, textarea, select')) {
        this.trackUserBehavior({
          language: document.documentElement.lang || 'en',
          action: 'form_interaction',
          element: event.target.name || event.target.id,
          value: event.target.value?.length || 0,
          timestamp: Date.now()
        });
      }
    });
  }

  initializePerformanceMonitoring() {
    // Monitor translation loading performance
    if (window.performance && window.performance.observer) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes('translation') || entry.name.includes('i18n')) {
            this.trackTranslationPerformance({
              language: this.getCurrentLanguage(),
              loadTime: entry.duration,
              cacheHit: entry.transferSize === 0,
              bundleSize: entry.transferSize,
              errorCount: 0
            });
          }
        }
      });
      
      observer.observe({ entryTypes: ['resource'] });
    }
  }

  getCurrentLanguage() {
    return document.documentElement.lang || 'en';
  }

  trackSessionActivity() {
    if (document.visibilityState === 'visible') {
      localStorage.setItem('session_start', Date.now().toString());
    }
  }

  sendToBackend(eventType, data) {
    // Send analytics data to backend
    if (typeof fetch !== 'undefined') {
      fetch('/api/analytics/language', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType,
          data,
          timestamp: Date.now()
        })
      }).catch(error => {
        console.warn('Failed to send analytics data:', error);
      });
    }
  }

  // Export data for external analysis
  exportData(format = 'json') {
    const data = {
      sessionData: Object.fromEntries(this.sessionData),
      languageMetrics: Object.fromEntries(this.languageMetrics),
      translationPerformance: Object.fromEntries(this.translationPerformance),
      userBehaviorPatterns: Object.fromEntries(this.userBehaviorPatterns),
      conversionTracking: Object.fromEntries(this.conversionTracking),
      contentEngagement: Object.fromEntries(this.contentEngagement),
      exportedAt: new Date().toISOString()
    };

    if (format === 'csv') {
      return this.convertToCSV(data);
    }

    return JSON.stringify(data, null, 2);
  }

  convertToCSV(data) {
    // Convert analytics data to CSV format
    const csvRows = [];
    
    // Add headers
    csvRows.push('Type,Language,Timestamp,Value,Additional_Data');
    
    // Add session data
    for (const [key, session] of Object.entries(data.sessionData)) {
      csvRows.push([
        session.type,
        session.toLanguage || session.language,
        session.timestamp,
        session.value || '',
        JSON.stringify(session).replace(/,/g, ';')
      ].join(','));
    }

    return csvRows.join('\n');
  }
}

// Create singleton instance
const advancedLanguageAnalytics = new AdvancedLanguageAnalytics();

// Auto-track page loads
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    advancedLanguageAnalytics.trackUserBehavior({
      language: document.documentElement.lang || 'en',
      action: 'page_load',
      element: 'page',
      timestamp: Date.now()
    });
  });
}

export default advancedLanguageAnalytics;
export { AdvancedLanguageAnalytics };