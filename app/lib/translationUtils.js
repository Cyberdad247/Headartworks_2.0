/**
 * Translation utilities for Head Artworks i18n system
 */

/**
 * Extract translatable strings from JSX files
 * This is a simple regex-based extractor for demonstration
 * In production, you might want to use a more sophisticated AST parser
 */
export function extractStrings(fileContent) {
  const strings = new Set();
  
  // Match strings in JSX text content
  const jsxTextRegex = />([^<>{]+)</g;
  let match;
  
  while ((match = jsxTextRegex.exec(fileContent)) !== null) {
    const text = match[1].trim();
    if (text && !text.match(/^\s*$/) && !text.match(/^[\d\s.,!?-]+$/)) {
      strings.add(text);
    }
  }
  
  // Match strings in common attributes
  const attributeRegex = /(title|alt|placeholder|aria-label)=["']([^"']+)["']/g;
  while ((match = attributeRegex.exec(fileContent)) !== null) {
    strings.add(match[2]);
  }
  
  return Array.from(strings);
}

/**
 * Generate translation keys from strings
 */
export function generateTranslationKey(text, category = 'common') {
  const key = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 50);
  
  return `${category}.${key}`;
}

/**
 * Validate translation completeness
 */
export function validateTranslations(baseTranslations, targetTranslations) {
  const missing = [];
  const extra = [];
  
  function checkKeys(base, target, prefix = '') {
    for (const key in base) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof base[key] === 'object' && base[key] !== null) {
        if (!target[key] || typeof target[key] !== 'object') {
          missing.push(fullKey);
        } else {
          checkKeys(base[key], target[key], fullKey);
        }
      } else {
        if (!(key in target)) {
          missing.push(fullKey);
        }
      }
    }
    
    for (const key in target) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (!(key in base)) {
        extra.push(fullKey);
      }
    }
  }
  
  checkKeys(baseTranslations, targetTranslations);
  
  return { missing, extra };
}

/**
 * Format translation for different contexts
 */
export function formatTranslation(text, context = 'default') {
  switch (context) {
    case 'title':
      return text.charAt(0).toUpperCase() + text.slice(1);
    case 'uppercase':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
    default:
      return text;
  }
}

/**
 * Pluralization helper
 */
export function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural;
}

/**
 * Currency formatting with i18n support
 */
export function formatCurrency(amount, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Date formatting with i18n support
 */
export function formatDate(date, locale = 'en-US', options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(date);
}