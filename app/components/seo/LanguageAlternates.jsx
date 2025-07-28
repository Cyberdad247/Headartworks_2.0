import {useTranslation} from '~/contexts/TranslationContext';

/**
 * LanguageAlternates component generates hreflang tags for SEO
 * This helps search engines understand the language variants of the page
 */
export function LanguageAlternates({currentUrl}) {
  const {language} = useTranslation();
  const languages = ['en', 'es', 'fr'];
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://headartworks.com' 
    : 'http://localhost:3000';
  
  // Remove language prefix from current URL to get the base path
  const basePath = currentUrl.replace(/^\/(en|es|fr)/, '') || '/';
  
  return (
    <>
      {languages.map(lang => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={`${baseUrl}/${lang}${basePath}`}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}/en${basePath}`}
      />
    </>
  );
}

/**
 * LocalizedMeta component for language-specific meta tags
 */
export function LocalizedMeta({title, description, keywords}) {
  const {language, t} = useTranslation();
  
  const localizedTitle = title ? t(title) : t('seo.default_title');
  const localizedDescription = description ? t(description) : t('seo.default_description');
  const localizedKeywords = keywords ? t(keywords) : t('seo.default_keywords');
  
  // Language-specific locale mapping
  const localeMap = {
    en: 'en_US',
    es: 'es_ES',
    fr: 'fr_FR'
  };
  
  return (
    <>
      <title>{localizedTitle}</title>
      <meta name="description" content={localizedDescription} />
      <meta name="keywords" content={localizedKeywords} />
      <meta property="og:title" content={localizedTitle} />
      <meta property="og:description" content={localizedDescription} />
      <meta property="og:locale" content={localeMap[language]} />
      <meta name="twitter:title" content={localizedTitle} />
      <meta name="twitter:description" content={localizedDescription} />
      <html lang={language} />
    </>
  );
}