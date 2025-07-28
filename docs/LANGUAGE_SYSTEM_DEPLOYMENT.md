# Language System Deployment Guide

## Pre-Deployment Checklist

### 1. Code Integration Verification
- [ ] **Server Integration**: Verify `server.js` includes i18n middleware
- [ ] **Root Component**: Confirm `TranslationProvider` is wrapped around app
- [ ] **Header Integration**: Ensure `LanguageSelector` is properly placed
- [ ] **Translation Files**: Validate all translation JSON files are complete
- [ ] **API Endpoint**: Test `/api/language` route functionality

### 2. Environment Configuration
```bash
# Required environment variables
PUBLIC_STORE_DOMAIN=headartworks.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=your_token_here
SUPPORTED_LANGUAGES=en,es,fr
DEFAULT_LANGUAGE=en
```

### 3. Build Verification
```bash
# Test build process
npm run build

# Verify translation files are included in build
ls -la build/translations/

# Check bundle sizes
npm run analyze
```

## Deployment Steps

### Phase 1: Infrastructure Setup (Week 1)

#### Day 1-2: Core Implementation
```bash
# 1. Deploy middleware and context
git add app/lib/i18nMiddleware.js
git add app/contexts/TranslationContext.jsx
git add app/routes/api.language.jsx
git commit -m "feat: add i18n middleware and translation context"

# 2. Deploy enhanced language selector
git add app/components/LanguageSelector.jsx
git add app/styles/language-selector.css
git commit -m "feat: enhance language selector component"

# 3. Update root integration
git add app/root.jsx
git commit -m "feat: integrate translation provider in root"
```

#### Day 3-4: Translation Files
```bash
# Deploy translation files
git add app/translations/
git commit -m "feat: add translation files for en, es, fr"

# Deploy translation utilities
git add app/lib/translationUtils.js
git commit -m "feat: add translation utilities and helpers"
```

#### Day 5: Testing & Validation
```bash
# Deploy tests
git add app/__tests__/language-switching.test.jsx
git commit -m "test: add comprehensive language switching tests"

# Run test suite
npm test
```

### Phase 2: SEO Implementation (Week 2)

#### SEO Components Setup
```bash
# Create SEO enhancement components
mkdir -p app/components/seo
```

#### Hreflang Implementation
```jsx
// app/components/seo/LanguageAlternates.jsx
import {useTranslation} from '~/contexts/TranslationContext';

export function LanguageAlternates({currentUrl}) {
  const {language} = useTranslation();
  const languages = ['en', 'es', 'fr'];
  const baseUrl = 'https://headartworks.com';
  
  return (
    <>
      {languages.map(lang => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={`${baseUrl}/${lang}${currentUrl.replace(/^\/(en|es|fr)/, '')}`}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}/en${currentUrl.replace(/^\/(en|es|fr)/, '')}`}
      />
    </>
  );
}
```

#### Sitemap Enhancement
```jsx
// app/routes/sitemap[.]xml.jsx
import {generateMultilingualSitemap} from '~/lib/sitemapUtils';

export async function loader({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  
  const [products, collections] = await Promise.all([
    storefront.query(PRODUCTS_SITEMAP_QUERY),
    storefront.query(COLLECTIONS_SITEMAP_QUERY)
  ]);
  
  const sitemap = generateMultilingualSitemap({
    products: products.products.nodes,
    collections: collections.collections.nodes,
    baseUrl: url.origin,
    languages: ['en', 'es', 'fr']
  });
  
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
```

### Phase 3: Performance Optimization (Week 3)

#### Bundle Splitting
```javascript
// vite.config.js updates
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'translations-critical': [
            './app/translations/en/critical.json',
            './app/translations/es/critical.json',
            './app/translations/fr/critical.json'
          ]
        }
      }
    }
  }
});
```

#### Caching Strategy
```javascript
// app/lib/translationCache.js
export class TranslationCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }
  
  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return null;
  }
  
  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}
```

## Testing Strategy

### 1. Unit Tests
```bash
# Run translation context tests
npm test -- --testPathPattern=translation

# Run language selector tests  
npm test -- --testPathPattern=language-selector

# Run middleware tests
npm test -- --testPathPattern=i18n
```

### 2. Integration Tests
```bash
# Run full language switching flow
npm test -- --testPathPattern=language-switching

# Test SEO components
npm test -- --testPathPattern=seo

# Performance tests
npm test -- --testPathPattern=performance
```

### 3. E2E Tests (Recommended)
```javascript
// tests/e2e/language-switching.spec.js
import {test, expect} from '@playwright/test';

test('complete language switching flow', async ({page}) => {
  // Test language detection
  await page.goto('/');
  await expect(page).toHaveURL('/en/');
  
  // Test language switching
  await page.click('[data-testid="language-selector"]');
  await page.click('[data-testid="language-es"]');
  await expect(page).toHaveURL('/es/');
  
  // Test content translation
  await expect(page.locator('h1')).toContainText('Bienvenido');
  
  // Test persistence
  await page.reload();
  await expect(page).toHaveURL('/es/');
});
```

## Monitoring & Analytics

### 1. Performance Monitoring
```javascript
// app/lib/analytics.js
export function trackLanguagePerformance(language, metrics) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'language_performance', {
      language,
      translation_load_time: metrics.translationLoadTime,
      bundle_size: metrics.bundleSize,
      cache_hit_rate: metrics.cacheHitRate
    });
  }
}
```

### 2. User Behavior Tracking
```javascript
// Track language switching patterns
export function trackLanguageSwitch(fromLang, toLang, page) {
  gtag('event', 'language_switch', {
    from_language: fromLang,
    to_language: toLang,
    page_path: page,
    timestamp: Date.now()
  });
}
```

### 3. SEO Monitoring
```javascript
// Monitor hreflang implementation
export function validateHreflang() {
  const hreflangLinks = document.querySelectorAll('link[hreflang]');
  const languages = ['en', 'es', 'fr', 'x-default'];
  
  languages.forEach(lang => {
    const link = document.querySelector(`link[hreflang="${lang}"]`);
    if (!link) {
      console.warn(`Missing hreflang for ${lang}`);
    }
  });
}
```

## Rollback Strategy

### 1. Feature Flags
```javascript
// app/lib/featureFlags.js
export const FEATURE_FLAGS = {
  MULTILINGUAL_ENABLED: process.env.MULTILINGUAL_ENABLED === 'true',
  LANGUAGE_SELECTOR_V2: process.env.LANGUAGE_SELECTOR_V2 === 'true'
};
```

### 2. Gradual Rollout
```javascript
// Percentage-based rollout
export function shouldEnableMultilingual(userId) {
  const hash = simpleHash(userId);
  const percentage = parseInt(process.env.MULTILINGUAL_ROLLOUT_PERCENTAGE) || 0;
  return (hash % 100) < percentage;
}
```

### 3. Emergency Rollback
```bash
# Quick rollback commands
git revert HEAD~5..HEAD  # Revert last 5 commits
git push origin main --force-with-lease

# Or use feature flag
export MULTILINGUAL_ENABLED=false
```

## Post-Deployment Validation

### 1. Functional Testing
- [ ] **Language Detection**: Test URL, session, and browser detection
- [ ] **Translation Loading**: Verify all languages load correctly
- [ ] **UI Components**: Test language selector functionality
- [ ] **Persistence**: Confirm language preferences persist
- [ ] **Fallbacks**: Test error scenarios and fallbacks

### 2. Performance Testing
- [ ] **Bundle Size**: Verify translation impact on bundle size
- [ ] **Loading Times**: Test translation loading performance
- [ ] **Cache Efficiency**: Monitor cache hit rates
- [ ] **Core Web Vitals**: Ensure no regression in performance metrics

### 3. SEO Validation
- [ ] **Hreflang Tags**: Validate hreflang implementation
- [ ] **Sitemaps**: Test multilingual sitemap generation
- [ ] **Canonical URLs**: Verify canonical tag implementation
- [ ] **Search Console**: Monitor for crawl errors

### 4. User Experience Testing
- [ ] **Accessibility**: Test with screen readers and keyboard navigation
- [ ] **Mobile Experience**: Verify mobile language selector functionality
- [ ] **Cross-Browser**: Test across different browsers
- [ ] **User Flows**: Test complete user journeys in each language

## Success Metrics

### 1. Technical Metrics
- **Translation Loading Time**: < 100ms average
- **Cache Hit Rate**: > 90%
- **Bundle Size Impact**: < 5KB increase
- **Core Web Vitals**: No regression

### 2. Business Metrics
- **Language Adoption**: Track usage by language
- **Conversion Rates**: Compare across languages
- **User Engagement**: Monitor session duration by language
- **SEO Performance**: Track search visibility improvements

### 3. User Experience Metrics
- **Language Switch Rate**: Track how often users switch languages
- **Error Rate**: Monitor translation loading failures
- **Accessibility Score**: Maintain high accessibility ratings
- **User Satisfaction**: Collect feedback on multilingual experience

## Next Steps After Deployment

### 1. Content Localization
- **Product Descriptions**: Translate product content
- **Collection Pages**: Localize collection descriptions
- **Blog Content**: Create language-specific blog posts
- **Marketing Materials**: Adapt marketing content for each market

### 2. Market-Specific Features
- **Currency Integration**: Coordinate with currency selector
- **Shipping Information**: Localize shipping details
- **Legal Compliance**: Add market-specific legal pages
- **Customer Support**: Provide multilingual support

### 3. Advanced Features
- **Regional Variants**: Add support for regional language variants
- **RTL Languages**: Implement right-to-left language support
- **Dynamic Content**: Add CMS-driven translation management
- **AI Translation**: Explore automated translation options

This deployment guide provides a structured approach to implementing the language system with proper testing, monitoring, and rollback strategies to ensure a successful launch.