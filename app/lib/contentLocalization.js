/**
 * Content Localization System for Head Artworks
 * Handles product, collection, and content translation management
 */

import {useTranslation} from '~/contexts/TranslationContext';

/**
 * Enhanced product content localization
 */
export class ProductLocalizer {
  constructor(storefront) {
    this.storefront = storefront;
  }

  /**
   * Get localized product data
   */
  async getLocalizedProduct(handle, language) {
    const query = `#graphql
      query LocalizedProduct($handle: String!, $language: LanguageCode!) {
        product(handle: $handle) {
          id
          handle
          title
          description
          seo {
            title
            description
          }
          translations(first: 50) {
            nodes {
              key
              value
              language
            }
          }
          variants(first: 100) {
            nodes {
              id
              title
              price {
                amount
                currencyCode
              }
              translations(first: 20) {
                nodes {
                  key
                  value
                  language
                }
              }
            }
          }
          tags
          productType
          vendor
          collections(first: 10) {
            nodes {
              handle
              title
              translations(first: 10) {
                nodes {
                  key
                  value
                  language
                }
              }
            }
          }
        }
      }
    `;

    const result = await this.storefront.query(query, {
      variables: { handle, language: language.toUpperCase() }
    });

    return this.processProductTranslations(result.product, language);
  }

  /**
   * Process and apply translations to product data
   */
  processProductTranslations(product, language) {
    if (!product) return null;

    const translations = this.buildTranslationMap(product.translations?.nodes || []);
    
    return {
      ...product,
      localizedTitle: this.getLocalizedValue(product.title, translations, 'title', language),
      localizedDescription: this.getLocalizedValue(product.description, translations, 'description', language),
      localizedSeo: {
        title: this.getLocalizedValue(product.seo?.title, translations, 'seo_title', language),
        description: this.getLocalizedValue(product.seo?.description, translations, 'seo_description', language)
      },
      localizedVariants: product.variants?.nodes.map(variant => ({
        ...variant,
        localizedTitle: this.getLocalizedVariantTitle(variant, language)
      })),
      localizedCollections: product.collections?.nodes.map(collection => ({
        ...collection,
        localizedTitle: this.getLocalizedCollectionTitle(collection, language)
      }))
    };
  }

  /**
   * Build translation map from Shopify translations
   */
  buildTranslationMap(translations) {
    const map = {};
    translations.forEach(translation => {
      if (!map[translation.language]) {
        map[translation.language] = {};
      }
      map[translation.language][translation.key] = translation.value;
    });
    return map;
  }

  /**
   * Get localized value with fallback
   */
  getLocalizedValue(defaultValue, translations, key, language) {
    const langCode = language.toUpperCase();
    
    // Try exact language match
    if (translations[langCode] && translations[langCode][key]) {
      return translations[langCode][key];
    }
    
    // Fallback to English
    if (translations['EN'] && translations['EN'][key]) {
      return translations['EN'][key];
    }
    
    // Final fallback to default value
    return defaultValue;
  }

  /**
   * Get localized variant title
   */
  getLocalizedVariantTitle(variant, language) {
    const translations = this.buildTranslationMap(variant.translations?.nodes || []);
    return this.getLocalizedValue(variant.title, translations, 'title', language);
  }

  /**
   * Get localized collection title
   */
  getLocalizedCollectionTitle(collection, language) {
    const translations = this.buildTranslationMap(collection.translations?.nodes || []);
    return this.getLocalizedValue(collection.title, translations, 'title', language);
  }
}

/**
 * Collection localization helper
 */
export class CollectionLocalizer {
  constructor(storefront) {
    this.storefront = storefront;
  }

  async getLocalizedCollection(handle, language) {
    const query = `#graphql
      query LocalizedCollection($handle: String!, $language: LanguageCode!) {
        collection(handle: $handle) {
          id
          handle
          title
          description
          seo {
            title
            description
          }
          translations(first: 20) {
            nodes {
              key
              value
              language
            }
          }
          products(first: 50) {
            nodes {
              handle
              title
              translations(first: 10) {
                nodes {
                  key
                  value
                  language
                }
              }
            }
          }
        }
      }
    `;

    const result = await this.storefront.query(query, {
      variables: { handle, language: language.toUpperCase() }
    });

    return this.processCollectionTranslations(result.collection, language);
  }

  processCollectionTranslations(collection, language) {
    if (!collection) return null;

    const translations = this.buildTranslationMap(collection.translations?.nodes || []);
    
    return {
      ...collection,
      localizedTitle: this.getLocalizedValue(collection.title, translations, 'title', language),
      localizedDescription: this.getLocalizedValue(collection.description, translations, 'description', language),
      localizedSeo: {
        title: this.getLocalizedValue(collection.seo?.title, translations, 'seo_title', language),
        description: this.getLocalizedValue(collection.seo?.description, translations, 'seo_description', language)
      }
    };
  }

  buildTranslationMap(translations) {
    const map = {};
    translations.forEach(translation => {
      if (!map[translation.language]) {
        map[translation.language] = {};
      }
      map[translation.language][translation.key] = translation.value;
    });
    return map;
  }

  getLocalizedValue(defaultValue, translations, key, language) {
    const langCode = language.toUpperCase();
    
    if (translations[langCode] && translations[langCode][key]) {
      return translations[langCode][key];
    }
    
    if (translations['EN'] && translations['EN'][key]) {
      return translations['EN'][key];
    }
    
    return defaultValue;
  }
}

/**
 * Content management utilities
 */
export class ContentManager {
  constructor() {
    this.contentTypes = {
      PRODUCT: 'product',
      COLLECTION: 'collection',
      PAGE: 'page',
      BLOG_POST: 'blog_post'
    };
  }

  /**
   * Generate translation keys for content
   */
  generateTranslationKeys(content, contentType) {
    const keys = [];
    
    switch (contentType) {
      case this.contentTypes.PRODUCT:
        keys.push(
          `${contentType}.${content.handle}.title`,
          `${contentType}.${content.handle}.description`,
          `${contentType}.${content.handle}.seo_title`,
          `${contentType}.${content.handle}.seo_description`
        );
        break;
        
      case this.contentTypes.COLLECTION:
        keys.push(
          `${contentType}.${content.handle}.title`,
          `${contentType}.${content.handle}.description`,
          `${contentType}.${content.handle}.seo_title`,
          `${contentType}.${content.handle}.seo_description`
        );
        break;
        
      default:
        keys.push(`${contentType}.${content.handle}.title`);
    }
    
    return keys;
  }

  /**
   * Extract translatable content
   */
  extractTranslatableContent(data, contentType) {
    const content = {};
    
    switch (contentType) {
      case this.contentTypes.PRODUCT:
        content.title = data.title;
        content.description = data.description;
        content.seo_title = data.seo?.title;
        content.seo_description = data.seo?.description;
        break;
        
      case this.contentTypes.COLLECTION:
        content.title = data.title;
        content.description = data.description;
        content.seo_title = data.seo?.title;
        content.seo_description = data.seo?.description;
        break;
    }
    
    return content;
  }

  /**
   * Validate translation completeness
   */
  validateTranslations(content, requiredLanguages = ['en', 'es', 'fr']) {
    const missing = [];
    const incomplete = [];
    
    requiredLanguages.forEach(lang => {
      if (!content[lang]) {
        missing.push(lang);
      } else {
        const requiredKeys = ['title', 'description'];
        const missingKeys = requiredKeys.filter(key => !content[lang][key]);
        if (missingKeys.length > 0) {
          incomplete.push({ language: lang, missingKeys });
        }
      }
    });
    
    return {
      isComplete: missing.length === 0 && incomplete.length === 0,
      missing,
      incomplete
    };
  }
}

/**
 * React hooks for content localization
 */
export function useLocalizedProduct(handle) {
  const {language} = useTranslation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const localizer = new ProductLocalizer(/* storefront instance */);
        const localizedProduct = await localizer.getLocalizedProduct(handle, language);
        setProduct(localizedProduct);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    if (handle) {
      loadProduct();
    }
  }, [handle, language]);

  return { product, loading, error };
}

export function useLocalizedCollection(handle) {
  const {language} = useTranslation();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCollection() {
      try {
        setLoading(true);
        const localizer = new CollectionLocalizer(/* storefront instance */);
        const localizedCollection = await localizer.getLocalizedCollection(handle, language);
        setCollection(localizedCollection);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    if (handle) {
      loadCollection();
    }
  }, [handle, language]);

  return { collection, loading, error };
}

/**
 * URL localization utilities
 */
export class URLLocalizer {
  constructor() {
    this.urlMappings = {
      en: {
        'products': 'products',
        'collections': 'collections',
        'blogs': 'blogs',
        'pages': 'pages'
      },
      es: {
        'products': 'productos',
        'collections': 'colecciones',
        'blogs': 'blog',
        'pages': 'paginas'
      },
      fr: {
        'products': 'produits',
        'collections': 'collections',
        'blogs': 'blog',
        'pages': 'pages'
      }
    };
  }

  /**
   * Localize URL path
   */
  localizeURL(path, language) {
    const segments = path.split('/').filter(Boolean);
    const mappings = this.urlMappings[language] || this.urlMappings.en;
    
    const localizedSegments = segments.map(segment => {
      return mappings[segment] || segment;
    });
    
    return `/${language}/${localizedSegments.join('/')}`;
  }

  /**
   * Get canonical URL for current page
   */
  getCanonicalURL(path, language, baseURL = 'https://headartworks.com') {
    const localizedPath = this.localizeURL(path, language);
    return `${baseURL}${localizedPath}`;
  }

  /**
   * Generate alternate URLs for hreflang
   */
  generateAlternateURLs(path, baseURL = 'https://headartworks.com') {
    const languages = ['en', 'es', 'fr'];
    const alternates = {};
    
    languages.forEach(lang => {
      alternates[lang] = this.getCanonicalURL(path, lang, baseURL);
    });
    
    alternates['x-default'] = this.getCanonicalURL(path, 'en', baseURL);
    
    return alternates;
  }
}