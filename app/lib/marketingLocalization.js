/**
 * Marketing Localization System for Head Artworks
 * Handles promotional content, email templates, and marketing campaigns
 */

import {useTranslation} from '~/contexts/TranslationContext';
import {useMarketConfig} from './marketConfiguration';

/**
 * Marketing Campaign Manager
 */
export class MarketingCampaignManager {
  constructor() {
    this.campaigns = new Map();
    this.templates = new Map();
  }

  /**
   * Register marketing campaign
   */
  registerCampaign(id, campaign) {
    this.campaigns.set(id, campaign);
  }

  /**
   * Get localized campaign
   */
  getLocalizedCampaign(id, language) {
    const campaign = this.campaigns.get(id);
    if (!campaign) return null;

    return {
      ...campaign,
      title: campaign.titles[language] || campaign.titles.en,
      description: campaign.descriptions[language] || campaign.descriptions.en,
      cta: campaign.ctas[language] || campaign.ctas.en,
      image: campaign.images[language] || campaign.images.en
    };
  }

  /**
   * Get active campaigns for language
   */
  getActiveCampaigns(language) {
    const now = new Date();
    const activeCampaigns = [];

    for (const [id, campaign] of this.campaigns) {
      const startDate = new Date(campaign.startDate);
      const endDate = new Date(campaign.endDate);
      
      if (now >= startDate && now <= endDate) {
        // Check if campaign is enabled for this market
        if (!campaign.markets || campaign.markets.includes(language)) {
          activeCampaigns.push(this.getLocalizedCampaign(id, language));
        }
      }
    }

    return activeCampaigns.sort((a, b) => b.priority - a.priority);
  }
}

/**
 * Email Template Manager
 */
export class EmailTemplateManager {
  constructor() {
    this.templates = {
      welcome: {
        en: {
          subject: 'Welcome to Head Artworks!',
          preheader: 'Discover unique art pieces and premium designs',
          greeting: 'Welcome to Head Artworks',
          body: 'Thank you for joining our community of art lovers. Explore our curated collection of contemporary art, sculptures, and creative works.',
          cta: 'Start Shopping',
          footer: 'You received this email because you signed up for Head Artworks updates.'
        },
        es: {
          subject: '¡Bienvenido a Head Artworks!',
          preheader: 'Descubre piezas de arte únicas y diseños premium',
          greeting: 'Bienvenido a Head Artworks',
          body: 'Gracias por unirte a nuestra comunidad de amantes del arte. Explora nuestra colección curada de arte contemporáneo, esculturas y obras creativas.',
          cta: 'Comenzar a Comprar',
          footer: 'Recibiste este correo porque te registraste para recibir actualizaciones de Head Artworks.'
        },
        fr: {
          subject: 'Bienvenue chez Head Artworks !',
          preheader: 'Découvrez des œuvres d\'art uniques et des designs premium',
          greeting: 'Bienvenue chez Head Artworks',
          body: 'Merci de rejoindre notre communauté d\'amateurs d\'art. Explorez notre collection curatée d\'art contemporain, sculptures et œuvres créatives.',
          cta: 'Commencer les Achats',
          footer: 'Vous avez reçu cet email car vous vous êtes inscrit aux mises à jour de Head Artworks.'
        }
      },
      orderConfirmation: {
        en: {
          subject: 'Order Confirmation #{orderNumber}',
          greeting: 'Thank you for your order!',
          body: 'We\'ve received your order and will process it shortly. You\'ll receive a shipping confirmation once your items are on their way.',
          cta: 'Track Your Order',
          footer: 'Questions? Contact our support team.'
        },
        es: {
          subject: 'Confirmación de Pedido #{orderNumber}',
          greeting: '¡Gracias por tu pedido!',
          body: 'Hemos recibido tu pedido y lo procesaremos en breve. Recibirás una confirmación de envío una vez que tus artículos estén en camino.',
          cta: 'Rastrear tu Pedido',
          footer: '¿Preguntas? Contacta a nuestro equipo de soporte.'
        },
        fr: {
          subject: 'Confirmation de Commande #{orderNumber}',
          greeting: 'Merci pour votre commande !',
          body: 'Nous avons reçu votre commande et la traiterons sous peu. Vous recevrez une confirmation d\'expédition une fois vos articles expédiés.',
          cta: 'Suivre votre Commande',
          footer: 'Des questions ? Contactez notre équipe de support.'
        }
      },
      newsletter: {
        en: {
          subject: 'New Arrivals & Art Inspiration',
          greeting: 'Hello Art Lover!',
          body: 'Discover our latest collection of contemporary art pieces and get inspired by the stories behind each creation.',
          cta: 'Explore New Arrivals',
          footer: 'Unsubscribe anytime from your account settings.'
        },
        es: {
          subject: 'Nuevas Llegadas e Inspiración Artística',
          greeting: '¡Hola Amante del Arte!',
          body: 'Descubre nuestra última colección de piezas de arte contemporáneo e inspírate con las historias detrás de cada creación.',
          cta: 'Explorar Nuevas Llegadas',
          footer: 'Cancela la suscripción en cualquier momento desde la configuración de tu cuenta.'
        },
        fr: {
          subject: 'Nouvelles Arrivées et Inspiration Artistique',
          greeting: 'Bonjour Amateur d\'Art !',
          body: 'Découvrez notre dernière collection d\'œuvres d\'art contemporain et inspirez-vous des histoires derrière chaque création.',
          cta: 'Explorer les Nouvelles Arrivées',
          footer: 'Désabonnez-vous à tout moment depuis les paramètres de votre compte.'
        }
      }
    };
  }

  /**
   * Get localized email template
   */
  getTemplate(templateId, language, variables = {}) {
    const template = this.templates[templateId];
    if (!template) return null;

    const localizedTemplate = template[language] || template.en;
    
    // Replace variables in template
    const processedTemplate = {};
    for (const [key, value] of Object.entries(localizedTemplate)) {
      processedTemplate[key] = this.replaceVariables(value, variables);
    }

    return processedTemplate;
  }

  /**
   * Replace variables in template string
   */
  replaceVariables(template, variables) {
    return template.replace(/#{(\w+)}/g, (match, key) => {
      return variables[key] || match;
    });
  }
}

/**
 * Promotional Banner Manager
 */
export class PromotionalBannerManager {
  constructor() {
    this.banners = {
      freeShipping: {
        en: {
          text: 'Free shipping on orders over ${threshold}',
          cta: 'Shop Now',
          type: 'info',
          icon: '🚚'
        },
        es: {
          text: 'Envío gratis en pedidos superiores a ${threshold}',
          cta: 'Comprar Ahora',
          type: 'info',
          icon: '🚚'
        },
        fr: {
          text: 'Livraison gratuite pour les commandes supérieures à ${threshold}',
          cta: 'Acheter Maintenant',
          type: 'info',
          icon: '🚚'
        }
      },
      newCollection: {
        en: {
          text: 'New Collection: ${collectionName} - Limited Time',
          cta: 'Explore Collection',
          type: 'promotion',
          icon: '✨'
        },
        es: {
          text: 'Nueva Colección: ${collectionName} - Tiempo Limitado',
          cta: 'Explorar Colección',
          type: 'promotion',
          icon: '✨'
        },
        fr: {
          text: 'Nouvelle Collection : ${collectionName} - Temps Limité',
          cta: 'Explorer la Collection',
          type: 'promotion',
          icon: '✨'
        }
      },
      sale: {
        en: {
          text: 'Save ${discount}% on Selected Art Pieces',
          cta: 'Shop Sale',
          type: 'sale',
          icon: '🏷️'
        },
        es: {
          text: 'Ahorra ${discount}% en Piezas de Arte Seleccionadas',
          cta: 'Comprar Ofertas',
          type: 'sale',
          icon: '🏷️'
        },
        fr: {
          text: 'Économisez ${discount}% sur les Œuvres d\'Art Sélectionnées',
          cta: 'Acheter en Solde',
          type: 'sale',
          icon: '🏷️'
        }
      }
    };
  }

  /**
   * Get localized banner
   */
  getBanner(bannerId, language, variables = {}) {
    const banner = this.banners[bannerId];
    if (!banner) return null;

    const localizedBanner = banner[language] || banner.en;
    
    return {
      ...localizedBanner,
      text: this.replaceVariables(localizedBanner.text, variables),
      id: bannerId
    };
  }

  /**
   * Replace variables in banner text
   */
  replaceVariables(text, variables) {
    return text.replace(/\${(\w+)}/g, (match, key) => {
      return variables[key] || match;
    });
  }
}

/**
 * Social Media Manager
 */
export class SocialMediaManager {
  constructor() {
    this.platforms = {
      facebook: {
        baseUrl: 'https://www.facebook.com/sharer/sharer.php',
        params: ['u', 'quote']
      },
      twitter: {
        baseUrl: 'https://twitter.com/intent/tweet',
        params: ['url', 'text', 'hashtags']
      },
      pinterest: {
        baseUrl: 'https://pinterest.com/pin/create/button',
        params: ['url', 'media', 'description']
      },
      instagram: {
        baseUrl: 'https://www.instagram.com',
        params: [] // Instagram doesn't support direct sharing URLs
      }
    };

    this.shareTexts = {
      product: {
        en: 'Check out this amazing art piece from Head Artworks: ${productTitle}',
        es: 'Mira esta increíble pieza de arte de Head Artworks: ${productTitle}',
        fr: 'Découvrez cette œuvre d\'art incroyable de Head Artworks : ${productTitle}'
      },
      collection: {
        en: 'Discover the ${collectionName} collection at Head Artworks',
        es: 'Descubre la colección ${collectionName} en Head Artworks',
        fr: 'Découvrez la collection ${collectionName} chez Head Artworks'
      }
    };
  }

  /**
   * Generate social sharing URL
   */
  generateShareUrl(platform, contentType, language, data) {
    const platformConfig = this.platforms[platform];
    if (!platformConfig) return null;

    const shareText = this.getShareText(contentType, language, data);
    const url = new URL(platformConfig.baseUrl);

    // Add platform-specific parameters
    switch (platform) {
      case 'facebook':
        url.searchParams.set('u', data.url);
        url.searchParams.set('quote', shareText);
        break;
      case 'twitter':
        url.searchParams.set('url', data.url);
        url.searchParams.set('text', shareText);
        if (data.hashtags) {
          url.searchParams.set('hashtags', data.hashtags.join(','));
        }
        break;
      case 'pinterest':
        url.searchParams.set('url', data.url);
        url.searchParams.set('media', data.image);
        url.searchParams.set('description', shareText);
        break;
    }

    return url.toString();
  }

  /**
   * Get localized share text
   */
  getShareText(contentType, language, data) {
    const template = this.shareTexts[contentType];
    if (!template) return '';

    const localizedTemplate = template[language] || template.en;
    return this.replaceVariables(localizedTemplate, data);
  }

  /**
   * Replace variables in share text
   */
  replaceVariables(text, variables) {
    return text.replace(/\${(\w+)}/g, (match, key) => {
      return variables[key] || match;
    });
  }
}

/**
 * React Components for Marketing Localization
 */

/**
 * Promotional Banner Component
 */
export function PromotionalBanner({bannerId, variables = {}, onClose}) {
  const {language} = useTranslation();
  const bannerManager = new PromotionalBannerManager();
  const banner = bannerManager.getBanner(bannerId, language, variables);

  if (!banner) return null;

  return (
    <div className={`promotional-banner banner-${banner.type}`}>
      <div className="banner-content">
        <span className="banner-icon">{banner.icon}</span>
        <span className="banner-text">{banner.text}</span>
        <button className="banner-cta">{banner.cta}</button>
      </div>
      {onClose && (
        <button className="banner-close" onClick={onClose}>×</button>
      )}
    </div>
  );
}

/**
 * Social Share Buttons Component
 */
export function SocialShareButtons({contentType, data}) {
  const {language} = useTranslation();
  const socialManager = new SocialMediaManager();

  const platforms = ['facebook', 'twitter', 'pinterest'];

  const handleShare = (platform) => {
    const shareUrl = socialManager.generateShareUrl(platform, contentType, language, data);
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="social-share-buttons">
      <span className="share-label">Share:</span>
      {platforms.map(platform => (
        <button
          key={platform}
          className={`share-button share-${platform}`}
          onClick={() => handleShare(platform)}
          aria-label={`Share on ${platform}`}
        >
          <span className="share-icon">{getPlatformIcon(platform)}</span>
        </button>
      ))}
    </div>
  );
}

/**
 * Newsletter Signup Component
 */
export function NewsletterSignup() {
  const {language, t} = useTranslation();
  const {config} = useMarketConfig();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Submit newsletter signup
      await submitNewsletterSignup(email, language);
      setIsSubscribed(true);
    } catch (error) {
      console.error('Newsletter signup failed:', error);
    }
  };

  if (isSubscribed) {
    return (
      <div className="newsletter-success">
        <h3>{t('newsletter.thank_you')}</h3>
        <p>{t('newsletter.confirmation_sent')}</p>
      </div>
    );
  }

  return (
    <div className="newsletter-signup">
      <h3>{t('newsletter.title')}</h3>
      <p>{t('newsletter.description')}</p>
      <form onSubmit={handleSubmit} className="newsletter-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('newsletter.email_placeholder')}
          required
          className="newsletter-input"
        />
        <button type="submit" className="newsletter-button">
          {t('newsletter.subscribe')}
        </button>
      </form>
      <small className="newsletter-disclaimer">
        {t('newsletter.privacy_notice')}
      </small>
    </div>
  );
}

/**
 * Helper functions
 */
function getPlatformIcon(platform) {
  const icons = {
    facebook: '📘',
    twitter: '🐦',
    pinterest: '📌',
    instagram: '📷'
  };
  return icons[platform] || '🔗';
}

async function submitNewsletterSignup(email, language) {
  // Implementation would integrate with email service provider
  const response = await fetch('/api/newsletter/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, language })
  });
  
  if (!response.ok) {
    throw new Error('Newsletter signup failed');
  }
  
  return response.json();
}

/**
 * React hooks for marketing localization
 */
export function useMarketingCampaigns() {
  const {language} = useTranslation();
  const [campaigns, setCampaigns] = useState([]);
  const campaignManager = new MarketingCampaignManager();

  useEffect(() => {
    const activeCampaigns = campaignManager.getActiveCampaigns(language);
    setCampaigns(activeCampaigns);
  }, [language]);

  return campaigns;
}

export function useEmailTemplate(templateId, variables = {}) {
  const {language} = useTranslation();
  const templateManager = new EmailTemplateManager();
  
  return templateManager.getTemplate(templateId, language, variables);
}

export {
  MarketingCampaignManager,
  EmailTemplateManager,
  PromotionalBannerManager,
  SocialMediaManager
};