/**
 * Market Configuration System for Head Artworks
 * Handles region-specific settings, currency, shipping, and compliance
 */

import {useTranslation} from '~/contexts/TranslationContext';

/**
 * Market configuration data
 */
export const MARKET_CONFIG = {
  en: {
    language: 'en',
    region: 'US',
    currency: 'USD',
    currencySymbol: '$',
    locale: 'en-US',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: 'en-US',
    tax: {
      type: 'exclusive',
      display: 'excluding tax',
      rate: 0.08
    },
    shipping: {
      freeThreshold: 75,
      currency: 'USD',
      estimatedDays: '3-5 business days',
      providers: ['UPS', 'FedEx', 'USPS']
    },
    payment: {
      methods: ['credit_card', 'paypal', 'apple_pay', 'google_pay'],
      currencies: ['USD']
    },
    legal: {
      termsUrl: '/en/policies/terms-of-service',
      privacyUrl: '/en/policies/privacy-policy',
      returnsUrl: '/en/policies/refund-policy',
      shippingUrl: '/en/policies/shipping-policy'
    },
    contact: {
      phone: '+1 (555) 123-4567',
      email: 'support@headartworks.com',
      hours: '9 AM - 6 PM EST, Monday - Friday',
      address: {
        street: '123 Art Street',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'United States'
      }
    }
  },
  es: {
    language: 'es',
    region: 'ES',
    currency: 'EUR',
    currencySymbol: '€',
    locale: 'es-ES',
    timezone: 'Europe/Madrid',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'es-ES',
    tax: {
      type: 'inclusive',
      display: 'IVA incluido',
      rate: 0.21
    },
    shipping: {
      freeThreshold: 65,
      currency: 'EUR',
      estimatedDays: '2-4 días laborables',
      providers: ['Correos', 'SEUR', 'MRW']
    },
    payment: {
      methods: ['credit_card', 'paypal', 'sepa', 'bizum'],
      currencies: ['EUR']
    },
    legal: {
      termsUrl: '/es/politicas/terminos-de-servicio',
      privacyUrl: '/es/politicas/politica-de-privacidad',
      returnsUrl: '/es/politicas/politica-de-devoluciones',
      shippingUrl: '/es/politicas/politica-de-envios'
    },
    contact: {
      phone: '+34 91 123 4567',
      email: 'soporte@headartworks.com',
      hours: '9:00 - 18:00 CET, Lunes - Viernes',
      address: {
        street: 'Calle del Arte 123',
        city: 'Madrid',
        state: 'Madrid',
        zip: '28001',
        country: 'España'
      }
    }
  },
  fr: {
    language: 'fr',
    region: 'FR',
    currency: 'EUR',
    currencySymbol: '€',
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'fr-FR',
    tax: {
      type: 'inclusive',
      display: 'TVA incluse',
      rate: 0.20
    },
    shipping: {
      freeThreshold: 65,
      currency: 'EUR',
      estimatedDays: '2-4 jours ouvrables',
      providers: ['La Poste', 'Chronopost', 'Colissimo']
    },
    payment: {
      methods: ['credit_card', 'paypal', 'sepa', 'bancontact'],
      currencies: ['EUR']
    },
    legal: {
      termsUrl: '/fr/politiques/conditions-de-service',
      privacyUrl: '/fr/politiques/politique-de-confidentialite',
      returnsUrl: '/fr/politiques/politique-de-retour',
      shippingUrl: '/fr/politiques/politique-dexpedition'
    },
    contact: {
      phone: '+33 1 23 45 67 89',
      email: 'support@headartworks.com',
      hours: '9h00 - 18h00 CET, Lundi - Vendredi',
      address: {
        street: '123 Rue de l\'Art',
        city: 'Paris',
        state: 'Île-de-France',
        zip: '75001',
        country: 'France'
      }
    }
  }
};

/**
 * Market Configuration Manager
 */
export class MarketConfigManager {
  constructor() {
    this.config = MARKET_CONFIG;
  }

  /**
   * Get market configuration for language
   */
  getMarketConfig(language) {
    return this.config[language] || this.config.en;
  }

  /**
   * Get currency information
   */
  getCurrencyInfo(language) {
    const config = this.getMarketConfig(language);
    return {
      code: config.currency,
      symbol: config.currencySymbol,
      locale: config.locale
    };
  }

  /**
   * Format currency amount
   */
  formatCurrency(amount, language) {
    const config = this.getMarketConfig(language);
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency
    }).format(amount);
  }

  /**
   * Format date
   */
  formatDate(date, language) {
    const config = this.getMarketConfig(language);
    return new Intl.DateTimeFormat(config.locale).format(date);
  }

  /**
   * Format number
   */
  formatNumber(number, language) {
    const config = this.getMarketConfig(language);
    return new Intl.NumberFormat(config.locale).format(number);
  }

  /**
   * Get shipping information
   */
  getShippingInfo(language) {
    const config = this.getMarketConfig(language);
    return config.shipping;
  }

  /**
   * Get payment methods
   */
  getPaymentMethods(language) {
    const config = this.getMarketConfig(language);
    return config.payment;
  }

  /**
   * Get legal page URLs
   */
  getLegalUrls(language) {
    const config = this.getMarketConfig(language);
    return config.legal;
  }

  /**
   * Get contact information
   */
  getContactInfo(language) {
    const config = this.getMarketConfig(language);
    return config.contact;
  }

  /**
   * Calculate tax amount
   */
  calculateTax(amount, language) {
    const config = this.getMarketConfig(language);
    const taxRate = config.tax.rate;
    
    if (config.tax.type === 'inclusive') {
      // Tax is already included in the price
      const taxAmount = amount - (amount / (1 + taxRate));
      return {
        taxAmount,
        totalAmount: amount,
        baseAmount: amount - taxAmount
      };
    } else {
      // Tax needs to be added to the price
      const taxAmount = amount * taxRate;
      return {
        taxAmount,
        totalAmount: amount + taxAmount,
        baseAmount: amount
      };
    }
  }

  /**
   * Check if free shipping applies
   */
  checkFreeShipping(amount, language) {
    const config = this.getMarketConfig(language);
    return amount >= config.shipping.freeThreshold;
  }
}

/**
 * React hook for market configuration
 */
export function useMarketConfig() {
  const {language} = useTranslation();
  const manager = new MarketConfigManager();
  
  return {
    config: manager.getMarketConfig(language),
    formatCurrency: (amount) => manager.formatCurrency(amount, language),
    formatDate: (date) => manager.formatDate(date, language),
    formatNumber: (number) => manager.formatNumber(number, language),
    getShippingInfo: () => manager.getShippingInfo(language),
    getPaymentMethods: () => manager.getPaymentMethods(language),
    getLegalUrls: () => manager.getLegalUrls(language),
    getContactInfo: () => manager.getContactInfo(language),
    calculateTax: (amount) => manager.calculateTax(amount, language),
    checkFreeShipping: (amount) => manager.checkFreeShipping(amount, language)
  };
}

/**
 * Enhanced Currency Selector with Market Integration
 */
export function EnhancedCurrencySelector() {
  const {language} = useTranslation();
  const {config, formatCurrency} = useMarketConfig();
  const [selectedCurrency, setSelectedCurrency] = useState(config.currency);

  // Available currencies based on market
  const availableCurrencies = {
    USD: { symbol: '$', name: 'US Dollar', regions: ['US', 'CA'] },
    EUR: { symbol: '€', name: 'Euro', regions: ['ES', 'FR', 'DE', 'IT'] },
    GBP: { symbol: '£', name: 'British Pound', regions: ['GB'] },
    CAD: { symbol: 'C$', name: 'Canadian Dollar', regions: ['CA'] }
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    // Update currency preference
    localStorage.setItem('preferred_currency', currency);
    // Trigger currency change event
    window.dispatchEvent(new CustomEvent('currencyChanged', {
      detail: { currency, language }
    }));
  };

  return (
    <div className="enhanced-currency-selector">
      <select 
        value={selectedCurrency}
        onChange={(e) => handleCurrencyChange(e.target.value)}
        aria-label="Select currency"
      >
        {Object.entries(availableCurrencies).map(([code, info]) => (
          <option key={code} value={code}>
            {info.symbol} {code} - {info.name}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Shipping Information Component
 */
export function ShippingInfo({cartTotal}) {
  const {getShippingInfo, checkFreeShipping, formatCurrency} = useMarketConfig();
  const {t} = useTranslation();
  
  const shippingInfo = getShippingInfo();
  const isFreeShipping = checkFreeShipping(cartTotal);
  const remainingForFree = shippingInfo.freeThreshold - cartTotal;

  return (
    <div className="shipping-info">
      <div className="shipping-header">
        <h3>{t('shipping.title')}</h3>
      </div>
      
      {isFreeShipping ? (
        <div className="free-shipping-message">
          <span className="shipping-icon">🚚</span>
          <span>{t('shipping.free_shipping_qualified')}</span>
        </div>
      ) : (
        <div className="shipping-threshold">
          <p>
            {t('shipping.free_shipping_threshold', {
              amount: formatCurrency(remainingForFree)
            })}
          </p>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{width: `${(cartTotal / shippingInfo.freeThreshold) * 100}%`}}
            ></div>
          </div>
        </div>
      )}
      
      <div className="shipping-details">
        <p className="estimated-delivery">
          <strong>{t('shipping.estimated_delivery')}:</strong> {shippingInfo.estimatedDays}
        </p>
        <div className="shipping-providers">
          <strong>{t('shipping.providers')}:</strong>
          <ul>
            {shippingInfo.providers.map(provider => (
              <li key={provider}>{provider}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Payment Methods Component
 */
export function PaymentMethods() {
  const {getPaymentMethods} = useMarketConfig();
  const {t} = useTranslation();
  
  const paymentMethods = getPaymentMethods();
  
  const methodIcons = {
    credit_card: '💳',
    paypal: '🅿️',
    apple_pay: '🍎',
    google_pay: '🔍',
    sepa: '🏦',
    bizum: '📱',
    bancontact: '🏧'
  };

  return (
    <div className="payment-methods">
      <h3>{t('payment.accepted_methods')}</h3>
      <div className="payment-grid">
        {paymentMethods.methods.map(method => (
          <div key={method} className="payment-method">
            <span className="payment-icon">{methodIcons[method]}</span>
            <span className="payment-name">{t(`payment.methods.${method}`)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Legal Links Component
 */
export function LegalLinks() {
  const {getLegalUrls} = useMarketConfig();
  const {t} = useTranslation();
  
  const legalUrls = getLegalUrls();

  return (
    <div className="legal-links">
      <nav className="legal-nav">
        <a href={legalUrls.termsUrl}>{t('legal.terms_of_service')}</a>
        <a href={legalUrls.privacyUrl}>{t('legal.privacy_policy')}</a>
        <a href={legalUrls.returnsUrl}>{t('legal.return_policy')}</a>
        <a href={legalUrls.shippingUrl}>{t('legal.shipping_policy')}</a>
      </nav>
    </div>
  );
}

/**
 * Contact Information Component
 */
export function ContactInfo() {
  const {getContactInfo} = useMarketConfig();
  const {t} = useTranslation();
  
  const contactInfo = getContactInfo();

  return (
    <div className="contact-info">
      <h3>{t('contact.get_in_touch')}</h3>
      
      <div className="contact-methods">
        <div className="contact-method">
          <span className="contact-icon">📞</span>
          <div className="contact-details">
            <strong>{t('contact.phone')}</strong>
            <p>{contactInfo.phone}</p>
            <small>{contactInfo.hours}</small>
          </div>
        </div>
        
        <div className="contact-method">
          <span className="contact-icon">✉️</span>
          <div className="contact-details">
            <strong>{t('contact.email')}</strong>
            <p>{contactInfo.email}</p>
          </div>
        </div>
        
        <div className="contact-method">
          <span className="contact-icon">📍</span>
          <div className="contact-details">
            <strong>{t('contact.address')}</strong>
            <address>
              {contactInfo.address.street}<br/>
              {contactInfo.address.city}, {contactInfo.address.state} {contactInfo.address.zip}<br/>
              {contactInfo.address.country}
            </address>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Tax Display Component
 */
export function TaxDisplay({amount}) {
  const {calculateTax, config} = useMarketConfig();
  const {t} = useTranslation();
  
  const taxInfo = calculateTax(amount);

  return (
    <div className="tax-display">
      {config.tax.type === 'inclusive' ? (
        <small className="tax-note">
          {t('tax.inclusive_note', {
            amount: formatCurrency(taxInfo.taxAmount),
            display: config.tax.display
          })}
        </small>
      ) : (
        <div className="tax-breakdown">
          <div className="tax-line">
            <span>{t('tax.subtotal')}</span>
            <span>{formatCurrency(taxInfo.baseAmount)}</span>
          </div>
          <div className="tax-line">
            <span>{t('tax.tax')}</span>
            <span>{formatCurrency(taxInfo.taxAmount)}</span>
          </div>
          <div className="tax-line total">
            <span>{t('tax.total')}</span>
            <span>{formatCurrency(taxInfo.totalAmount)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketConfigManager;