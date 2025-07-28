/**
 * Advanced Language Support System for Head Artworks
 * Handles additional languages, regional variants, and RTL support
 */

import { useTranslation } from '~/contexts/TranslationContext';
import { useEffect } from 'react';

/**
 * Extended language configuration with regional variants
 */
export const EXTENDED_LANGUAGE_CONFIG = {
  // English variants
  'en-US': {
    name: 'English (United States)',
    nativeName: 'English (US)',
    region: 'US',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: 'en-US',
    direction: 'ltr',
    flag: '🇺🇸'
  },
  'en-GB': {
    name: 'English (United Kingdom)',
    nativeName: 'English (UK)',
    region: 'GB',
    currency: 'GBP',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'en-GB',
    direction: 'ltr',
    flag: '🇬🇧'
  },
  'en-CA': {
    name: 'English (Canada)',
    nativeName: 'English (Canada)',
    region: 'CA',
    currency: 'CAD',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'en-CA',
    direction: 'ltr',
    flag: '🇨🇦'
  },
  'en-AU': {
    name: 'English (Australia)',
    nativeName: 'English (Australia)',
    region: 'AU',
    currency: 'AUD',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'en-AU',
    direction: 'ltr',
    flag: '🇦🇺'
  },

  // Spanish variants
  'es-ES': {
    name: 'Spanish (Spain)',
    nativeName: 'Español (España)',
    region: 'ES',
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'es-ES',
    direction: 'ltr',
    flag: '🇪🇸'
  },
  'es-MX': {
    name: 'Spanish (Mexico)',
    nativeName: 'Español (México)',
    region: 'MX',
    currency: 'MXN',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'es-MX',
    direction: 'ltr',
    flag: '🇲🇽'
  },
  'es-AR': {
    name: 'Spanish (Argentina)',
    nativeName: 'Español (Argentina)',
    region: 'AR',
    currency: 'ARS',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'es-AR',
    direction: 'ltr',
    flag: '🇦🇷'
  },

  // French variants
  'fr-FR': {
    name: 'French (France)',
    nativeName: 'Français (France)',
    region: 'FR',
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'fr-FR',
    direction: 'ltr',
    flag: '🇫🇷'
  },
  'fr-CA': {
    name: 'French (Canada)',
    nativeName: 'Français (Canada)',
    region: 'CA',
    currency: 'CAD',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'fr-CA',
    direction: 'ltr',
    flag: '🇨🇦'
  },

  // Portuguese variants
  'pt-BR': {
    name: 'Portuguese (Brazil)',
    nativeName: 'Português (Brasil)',
    region: 'BR',
    currency: 'BRL',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'pt-BR',
    direction: 'ltr',
    flag: '🇧🇷'
  },
  'pt-PT': {
    name: 'Portuguese (Portugal)',
    nativeName: 'Português (Portugal)',
    region: 'PT',
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'pt-PT',
    direction: 'ltr',
    flag: '🇵🇹'
  },

  // German
  'de-DE': {
    name: 'German (Germany)',
    nativeName: 'Deutsch (Deutschland)',
    region: 'DE',
    currency: 'EUR',
    dateFormat: 'DD.MM.YYYY',
    numberFormat: 'de-DE',
    direction: 'ltr',
    flag: '🇩🇪'
  },
  'de-AT': {
    name: 'German (Austria)',
    nativeName: 'Deutsch (Österreich)',
    region: 'AT',
    currency: 'EUR',
    dateFormat: 'DD.MM.YYYY',
    numberFormat: 'de-AT',
    direction: 'ltr',
    flag: '🇦🇹'
  },

  // Italian
  'it-IT': {
    name: 'Italian (Italy)',
    nativeName: 'Italiano (Italia)',
    region: 'IT',
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'it-IT',
    direction: 'ltr',
    flag: '🇮🇹'
  },

  // Japanese
  'ja-JP': {
    name: 'Japanese (Japan)',
    nativeName: '日本語 (日本)',
    region: 'JP',
    currency: 'JPY',
    dateFormat: 'YYYY/MM/DD',
    numberFormat: 'ja-JP',
    direction: 'ltr',
    flag: '🇯🇵'
  },

  // Korean
  'ko-KR': {
    name: 'Korean (South Korea)',
    nativeName: '한국어 (대한민국)',
    region: 'KR',
    currency: 'KRW',
    dateFormat: 'YYYY.MM.DD',
    numberFormat: 'ko-KR',
    direction: 'ltr',
    flag: '🇰🇷'
  },

  // Chinese variants
  'zh-CN': {
    name: 'Chinese (Simplified)',
    nativeName: '中文 (简体)',
    region: 'CN',
    currency: 'CNY',
    dateFormat: 'YYYY/MM/DD',
    numberFormat: 'zh-CN',
    direction: 'ltr',
    flag: '🇨🇳'
  },
  'zh-TW': {
    name: 'Chinese (Traditional)',
    nativeName: '中文 (繁體)',
    region: 'TW',
    currency: 'TWD',
    dateFormat: 'YYYY/MM/DD',
    numberFormat: 'zh-TW',
    direction: 'ltr',
    flag: '🇹🇼'
  },

  // RTL Languages
  'ar-SA': {
    name: 'Arabic (Saudi Arabia)',
    nativeName: 'العربية (السعودية)',
    region: 'SA',
    currency: 'SAR',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'ar-SA',
    direction: 'rtl',
    flag: '🇸🇦'
  },
  'he-IL': {
    name: 'Hebrew (Israel)',
    nativeName: 'עברית (ישראל)',
    region: 'IL',
    currency: 'ILS',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'he-IL',
    direction: 'rtl',
    flag: '🇮🇱'
  }
};

/**
 * Advanced Language Manager
 */
export class AdvancedLanguageManager {
  constructor() {
    this.config = EXTENDED_LANGUAGE_CONFIG;
    this.fallbackMap = this.buildFallbackMap();
  }

  /**
   * Build fallback language map
   */
  buildFallbackMap() {
    return {
      'en-GB': 'en-US',
      'en-CA': 'en-US',
      'en-AU': 'en-US',
      'es-MX': 'es-ES',
      'es-AR': 'es-ES',
      'fr-CA': 'fr-FR',
      'pt-PT': 'pt-BR',
      'de-AT': 'de-DE',
      'zh-TW': 'zh-CN'
    };
  }

  /**
   * Get language configuration
   */
  getLanguageConfig(languageCode) {
    return this.config[languageCode] || this.config['en-US'];
  }

  /**
   * Get fallback language
   */
  getFallbackLanguage(languageCode) {
    return this.fallbackMap[languageCode] || 'en-US';
  }

  /**
   * Check if language is RTL
   */
  isRTL(languageCode) {
    const config = this.getLanguageConfig(languageCode);
    return config.direction === 'rtl';
  }

  /**
   * Get available languages grouped by base language
   */
  getGroupedLanguages() {
    const grouped = {};
    
    Object.entries(this.config).forEach(([code, config]) => {
      const baseLanguage = code.split('-')[0];
      if (!grouped[baseLanguage]) {
        grouped[baseLanguage] = [];
      }
      grouped[baseLanguage].push({
        code,
        ...config
      });
    });

    return grouped;
  }

  /**
   * Detect user's preferred language
   */
  detectPreferredLanguage() {
    // Check browser language preferences
    const browserLanguages = navigator.languages || [navigator.language];
    
    for (const browserLang of browserLanguages) {
      // Try exact match first
      if (this.config[browserLang]) {
        return browserLang;
      }
      
      // Try base language match
      const baseLang = browserLang.split('-')[0];
      const matchingLanguages = Object.keys(this.config).filter(
        code => code.startsWith(baseLang)
      );
      
      if (matchingLanguages.length > 0) {
        return matchingLanguages[0];
      }
    }
    
    return 'en-US'; // Default fallback
  }

  /**
   * Format content for language
   */
  formatForLanguage(content, languageCode) {
    const config = this.getLanguageConfig(languageCode);
    
    return {
      ...content,
      formattedDate: this.formatDate(content.date, config),
      formattedPrice: this.formatCurrency(content.price, config),
      formattedNumber: this.formatNumber(content.number, config)
    };
  }

  /**
   * Format date for language
   */
  formatDate(date, config) {
    if (!date) return '';
    return new Intl.DateTimeFormat(config.numberFormat).format(new Date(date));
  }

  /**
   * Format currency for language
   */
  formatCurrency(amount, config) {
    if (!amount) return '';
    return new Intl.NumberFormat(config.numberFormat, {
      style: 'currency',
      currency: config.currency
    }).format(amount);
  }

  /**
   * Format number for language
   */
  formatNumber(number, config) {
    if (!number) return '';
    return new Intl.NumberFormat(config.numberFormat).format(number);
  }
}

/**
 * RTL Support Manager
 */
export class RTLSupportManager {
  constructor() {
    this.rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  }

  /**
   * Check if language requires RTL support
   */
  isRTLLanguage(languageCode) {
    const baseLanguage = languageCode.split('-')[0];
    return this.rtlLanguages.includes(baseLanguage);
  }

  /**
   * Apply RTL styles to document
   */
  applyRTLStyles(languageCode) {
    const isRTL = this.isRTLLanguage(languageCode);
    const htmlElement = document.documentElement;
    
    if (isRTL) {
      htmlElement.setAttribute('dir', 'rtl');
      htmlElement.classList.add('rtl');
      this.loadRTLStylesheet();
    } else {
      htmlElement.setAttribute('dir', 'ltr');
      htmlElement.classList.remove('rtl');
      this.unloadRTLStylesheet();
    }
  }

  /**
   * Load RTL-specific stylesheet
   */
  loadRTLStylesheet() {
    if (!document.getElementById('rtl-styles')) {
      const link = document.createElement('link');
      link.id = 'rtl-styles';
      link.rel = 'stylesheet';
      link.href = '/styles/rtl.css';
      document.head.appendChild(link);
    }
  }

  /**
   * Unload RTL stylesheet
   */
  unloadRTLStylesheet() {
    const rtlStyles = document.getElementById('rtl-styles');
    if (rtlStyles) {
      rtlStyles.remove();
    }
  }

  /**
   * Mirror directional icons for RTL
   */
  mirrorDirectionalIcons() {
    const directionalIcons = document.querySelectorAll('.icon-directional');
    directionalIcons.forEach(icon => {
      icon.style.transform = 'scaleX(-1)';
    });
  }
}

/**
 * Language Detection Service
 */
export class LanguageDetectionService {
  constructor() {
    this.languageManager = new AdvancedLanguageManager();
  }

  /**
   * Detect language from multiple sources
   */
  detectLanguage() {
    // Priority order: URL -> Session -> Browser -> Geolocation -> Default
    return (
      this.detectFromURL() ||
      this.detectFromSession() ||
      this.detectFromBrowser() ||
      this.detectFromGeolocation() ||
      'en-US'
    );
  }

  /**
   * Detect language from URL
   */
  detectFromURL() {
    const pathSegments = window.location.pathname.split('/');
    const potentialLang = pathSegments[1];
    
    if (this.languageManager.config[potentialLang]) {
      return potentialLang;
    }
    
    return null;
  }

  /**
   * Detect language from session storage
   */
  detectFromSession() {
    const storedLang = sessionStorage.getItem('preferred_language');
    if (storedLang && this.languageManager.config[storedLang]) {
      return storedLang;
    }
    
    return null;
  }

  /**
   * Detect language from browser preferences
   */
  detectFromBrowser() {
    return this.languageManager.detectPreferredLanguage();
  }

  /**
   * Detect language from geolocation (if available)
   */
  async detectFromGeolocation() {
    try {
      // This would integrate with a geolocation service
      const response = await fetch('/api/detect-location');
      const data = await response.json();
      
      // Map country codes to preferred languages
      const countryLanguageMap = {
        'US': 'en-US',
        'GB': 'en-GB',
        'CA': 'en-CA', // Could be fr-CA based on region
        'AU': 'en-AU',
        'ES': 'es-ES',
        'MX': 'es-MX',
        'AR': 'es-AR',
        'FR': 'fr-FR',
        'BR': 'pt-BR',
        'PT': 'pt-PT',
        'DE': 'de-DE',
        'AT': 'de-AT',
        'IT': 'it-IT',
        'JP': 'ja-JP',
        'KR': 'ko-KR',
        'CN': 'zh-CN',
        'TW': 'zh-TW',
        'SA': 'ar-SA',
        'IL': 'he-IL'
      };
      
      return countryLanguageMap[data.country] || null;
    } catch (error) {
      console.warn('Geolocation detection failed:', error);
      return null;
    }
  }
}

/**
 * React Components for Advanced Language Support
 */

/**
 * Advanced Language Selector with Regional Variants
 */
export function AdvancedLanguageSelector() {
  const {language, setLanguage} = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const languageManager = new AdvancedLanguageManager();
  const rtlManager = new RTLSupportManager();
  
  const groupedLanguages = languageManager.getGroupedLanguages();
  const currentConfig = languageManager.getLanguageConfig(language);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    rtlManager.applyRTLStyles(newLanguage);
    sessionStorage.setItem('preferred_language', newLanguage);
    setIsOpen(false);
    
    // Reload page with new language
    const newPath = `/${newLanguage}${window.location.pathname.replace(/^\/[^\/]+/, '')}`;
    window.location.href = newPath;
  };

  return (
    <div className={`advanced-language-selector ${isOpen ? 'open' : ''}`}>
      <button 
        className="language-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="current-flag">{currentConfig.flag}</span>
        <span className="current-name">{currentConfig.nativeName}</span>
        <span className="dropdown-arrow">▼</span>
      </button>
      
      {isOpen && (
        <div className="language-dropdown">
          {Object.entries(groupedLanguages).map(([baseLanguage, variants]) => (
            <div key={baseLanguage} className="language-group">
              <div className="group-header">{baseLanguage.toUpperCase()}</div>
              {variants.map(variant => (
                <button
                  key={variant.code}
                  className={`language-option ${language === variant.code ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(variant.code)}
                >
                  <span className="option-flag">{variant.flag}</span>
                  <span className="option-name">{variant.nativeName}</span>
                  <span className="option-region">({variant.region})</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Language Auto-Detection Component
 */
export function LanguageAutoDetection({onLanguageDetected}) {
  const detectionService = new LanguageDetectionService();
  
  useEffect(() => {
    const detectAndSet = async () => {
      const detectedLanguage = await detectionService.detectLanguage();
      onLanguageDetected(detectedLanguage);
    };
    
    detectAndSet();
  }, []);

  return null; // This component doesn't render anything
}

/**
 * RTL Layout Component
 */
export function RTLLayout({children}) {
  const {language} = useTranslation();
  const rtlManager = new RTLSupportManager();
  
  useEffect(() => {
    rtlManager.applyRTLStyles(language);
  }, [language]);

  return (
    <div className={`layout ${rtlManager.isRTLLanguage(language) ? 'rtl' : 'ltr'}`}>
      {children}
    </div>
  );
}

/**
 * React Hooks for Advanced Language Support
 */
export function useAdvancedLanguage() {
  const {language} = useTranslation();
  const languageManager = new AdvancedLanguageManager();
  const config = languageManager.getLanguageConfig(language);
  
  return {
    config,
    isRTL: languageManager.isRTL(language),
    formatDate: (date) => languageManager.formatDate(date, config),
    formatCurrency: (amount) => languageManager.formatCurrency(amount, config),
    formatNumber: (number) => languageManager.formatNumber(number, config),
    fallbackLanguage: languageManager.getFallbackLanguage(language)
  };
}

export function useRTLSupport() {
  const {language} = useTranslation();
  const rtlManager = new RTLSupportManager();
  
  return {
    isRTL: rtlManager.isRTLLanguage(language),
    applyRTLStyles: () => rtlManager.applyRTLStyles(language),
    mirrorIcons: () => rtlManager.mirrorDirectionalIcons()
  };
}

useKeyboardNavigation();

export {
  AdvancedLanguageManager,
  RTLSupportManager,
  LanguageDetectionService,
  useKeyboardNavigation
};