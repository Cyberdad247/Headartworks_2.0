import {Suspense, useState, useEffect, useRef} from 'react';
import {useLoaderData} from '@remix-run/react';
import {MARKETS_QUERY} from '~/graphql/marketsQuery';
import {trackLanguageSwitch} from '~/lib/analytics';
import {useTranslation} from '~/contexts/TranslationContext';
import '~/styles/language-selector.css';

export function LanguageSelector() {
  const data = useLoaderData();
  const {language: contextLanguage} = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(contextLanguage || 'en');
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Update current language when context changes
  useEffect(() => {
    if (contextLanguage && contextLanguage !== currentLanguage) {
      setCurrentLanguage(contextLanguage);
    }
  }, [contextLanguage, currentLanguage]);

  const countries = data?.localization?.availableCountries || [];

  // Get unique languages across all countries
  const languages = countries.reduce((acc, country) => {
    country.languages.forEach(lang => {
      if (!acc.some(l => l.isoCode === lang.isoCode)) {
        acc.push(lang);
      }
    });
    return acc;
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (buttonRef.current && !buttonRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = async (languageCode) => {
    // Get current path without language prefix
    const currentPath = window.location.pathname;
    const pathWithoutLang = currentPath.startsWith(`/${currentLanguage}`)
      ? currentPath.slice(currentLanguage.length + 1)
      : currentPath;

    // Build new URL with selected language
    const newPath = `/${languageCode}${pathWithoutLang || ''}`;
    
    // Submit form to change language (handles cookie setting)
    const formData = new FormData();
    formData.append('language', languageCode);
    await fetch('/api/language', {
      method: 'POST',
      body: formData,
    });

    // Reload page with new language
    window.location.href = newPath;
  };

  const currentLangObj = languages.find(lang => lang.isoCode === currentLanguage) ||
    {isoCode: 'en', name: 'English', endonymName: 'English'};

  return (
    <div className={`language-selector ${isOpen ? 'active' : ''}`}>
      <button
        ref={buttonRef}
        aria-label="Select language"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentLangObj.isoCode.toUpperCase()}
      </button>
      
      <div className="dropdown" ref={dropdownRef}>
        {languages.map((language) => (
          <div
            key={language.isoCode}
            className={`dropdown-item ${currentLanguage === language.isoCode ? 'active' : ''}`}
            onClick={() => handleLanguageChange(language.isoCode)}
            role="button"
            tabIndex={0}
            aria-label={`Switch to ${language.name}`}
          >
            <span>{language.isoCode.toUpperCase()}</span>
            <span>{language.endonymName || language.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LanguageSelectorWrapper() {
  return (
    <Suspense fallback={null}>
      <LanguageSelector />
    </Suspense>
  );
}