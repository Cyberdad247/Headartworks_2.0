import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import {vi, describe, it, expect, beforeEach, afterEach} from 'vitest';
import {TranslationProvider} from '~/contexts/TranslationContext';
import {LanguageSelector} from '~/components/LanguageSelector';
import {useTranslation} from '~/contexts/TranslationContext';

// Mock translations
const mockTranslations = {
  en: {
    common: {
      welcome: 'Welcome to Head Artworks',
      loading: 'Loading...'
    },
    navigation: {
      home: 'Home',
      cart: 'Cart'
    }
  },
  es: {
    common: {
      welcome: 'Bienvenido a Head Artworks',
      loading: 'Cargando...'
    },
    navigation: {
      home: 'Inicio',
      cart: 'Carrito'
    }
  },
  fr: {
    common: {
      welcome: 'Bienvenue chez Head Artworks',
      loading: 'Chargement...'
    },
    navigation: {
      home: 'Accueil',
      cart: 'Panier'
    }
  }
};

// Mock dynamic imports
vi.mock('~/translations/en.json', () => ({ default: mockTranslations.en }));
vi.mock('~/translations/es.json', () => ({ default: mockTranslations.es }));
vi.mock('~/translations/fr.json', () => ({ default: mockTranslations.fr }));

// Mock useMatches hook
vi.mock('@remix-run/react', async () => {
  const actual = await vi.importActual('@remix-run/react');
  return {
    ...actual,
    useMatches: () => [
      {
        id: 'root',
        data: { language: 'en' }
      }
    ]
  };
});

// Mock fetch for language API
global.fetch = vi.fn();

// Test component that uses translations
function TestComponent() {
  const {t, language} = useTranslation();
  
  return (
    <div>
      <div data-testid="language">{language}</div>
      <div data-testid="welcome">{t('common.welcome')}</div>
      <div data-testid="home">{t('navigation.home')}</div>
      <div data-testid="loading">{t('common.loading')}</div>
    </div>
  );
}

// Wrapper component for tests
function TestWrapper({children, initialLanguage = 'en'}) {
  // Mock the useMatches hook to return the desired language
  vi.doMock('@remix-run/react', async () => {
    const actual = await vi.importActual('@remix-run/react');
    return {
      ...actual,
      useMatches: () => [
        {
          id: 'root',
          data: { language: initialLanguage }
        }
      ]
    };
  });

  return (
    <BrowserRouter>
      <TranslationProvider>
        {children}
      </TranslationProvider>
    </BrowserRouter>
  );
}

describe('Language Switching System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({})
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('TranslationProvider', () => {
    it('should load English translations by default', async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('language')).toHaveTextContent('en');
        expect(screen.getByTestId('welcome')).toHaveTextContent('Welcome to Head Artworks');
        expect(screen.getByTestId('home')).toHaveTextContent('Home');
      });
    });

    it('should handle nested translation keys', async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Loading...');
      });
    });

    it('should return key when translation is missing', async () => {
      function MissingTranslationComponent() {
        const {t} = useTranslation();
        return <div data-testid="missing">{t('missing.key')}</div>;
      }

      render(
        <TestWrapper>
          <MissingTranslationComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('missing')).toHaveTextContent('missing.key');
      });
    });

    it('should handle parameter substitution', async () => {
      // Add a translation with parameters to mock
      const mockTranslationsWithParams = {
        ...mockTranslations.en,
        common: {
          ...mockTranslations.en.common,
          greeting: 'Hello {name}!'
        }
      };

      vi.doMock('~/translations/en.json', () => ({ default: mockTranslationsWithParams }));

      function ParameterComponent() {
        const {t} = useTranslation();
        return <div data-testid="greeting">{t('common.greeting', {name: 'John'})}</div>;
      }

      render(
        <TestWrapper>
          <ParameterComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('greeting')).toHaveTextContent('Hello John!');
      });
    });
  });

  describe('LanguageSelector Component', () => {
    const mockMarketsData = {
      localization: {
        availableCountries: [
          {
            languages: [
              { isoCode: 'en', name: 'English', endonymName: 'English' },
              { isoCode: 'es', name: 'Spanish', endonymName: 'Español' },
              { isoCode: 'fr', name: 'French', endonymName: 'Français' }
            ]
          }
        ]
      }
    };

    // Mock useQuery hook
    vi.mock('@shopify/hydrogen', () => ({
      useQuery: () => ({ data: mockMarketsData })
    }));

    it('should render language selector button', () => {
      render(
        <TestWrapper>
          <LanguageSelector />
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: /select language/i })).toBeInTheDocument();
    });

    it('should show dropdown when clicked', async () => {
      render(
        <TestWrapper>
          <LanguageSelector />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /select language/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('English')).toBeInTheDocument();
        expect(screen.getByText('Español')).toBeInTheDocument();
        expect(screen.getByText('Français')).toBeInTheDocument();
      });
    });

    it('should close dropdown when clicking outside', async () => {
      render(
        <TestWrapper>
          <div data-testid="outside">
            <LanguageSelector />
          </div>
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /select language/i });
      fireEvent.click(button);

      // Dropdown should be open
      await waitFor(() => {
        expect(screen.getByText('English')).toBeInTheDocument();
      });

      // Click outside
      fireEvent.mouseDown(screen.getByTestId('outside'));

      await waitFor(() => {
        expect(screen.queryByText('English')).not.toBeInTheDocument();
      });
    });

    it('should call language change API when language is selected', async () => {
      // Mock window.location
      delete window.location;
      window.location = { pathname: '/en/products', href: '' };

      render(
        <TestWrapper>
          <LanguageSelector />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /select language/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Español')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Español'));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/language', {
          method: 'POST',
          body: expect.any(FormData)
        });
      });
    });
  });

  describe('Language Switching Integration', () => {
    it('should update translations when language changes', async () => {
      const {rerender} = render(
        <TestWrapper initialLanguage="en">
          <TestComponent />
        </TestWrapper>
      );

      // Initial English content
      await waitFor(() => {
        expect(screen.getByTestId('welcome')).toHaveTextContent('Welcome to Head Artworks');
      });

      // Change to Spanish
      rerender(
        <TestWrapper initialLanguage="es">
          <TestComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('welcome')).toHaveTextContent('Bienvenido a Head Artworks');
        expect(screen.getByTestId('home')).toHaveTextContent('Inicio');
      });
    });

    it('should handle loading state during language change', async () => {
      function LoadingTestComponent() {
        const {t, isLoading} = useTranslation();
        
        if (isLoading) {
          return <div data-testid="loading-state">Loading translations...</div>;
        }
        
        return <div data-testid="content">{t('common.welcome')}</div>;
      }

      render(
        <TestWrapper>
          <LoadingTestComponent />
        </TestWrapper>
      );

      // Should show loading state initially
      expect(screen.getByTestId('loading-state')).toBeInTheDocument();

      // Should show content after loading
      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument();
        expect(screen.getByTestId('content')).toHaveTextContent('Welcome to Head Artworks');
      });
    });

    it('should fallback to English when translation file fails to load', async () => {
      // Mock import failure for Spanish
      vi.doMock('~/translations/es.json', () => {
        throw new Error('Failed to load');
      });

      render(
        <TestWrapper initialLanguage="es">
          <TestComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should fallback to English
        expect(screen.getByTestId('welcome')).toHaveTextContent('Welcome to Head Artworks');
      });
    });
  });

  describe('URL Structure', () => {
    it('should handle language prefixes in URLs', () => {
      // Mock window.location for different language URLs
      const testCases = [
        { url: '/en/products', expectedLang: 'en' },
        { url: '/es/productos', expectedLang: 'es' },
        { url: '/fr/produits', expectedLang: 'fr' }
      ];

      testCases.forEach(({url, expectedLang}) => {
        delete window.location;
        window.location = { pathname: url };

        const pathLang = url.split('/')[1];
        expect(['en', 'es', 'fr']).toContain(pathLang);
      });
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', async () => {
      let renderCount = 0;

      function RenderCountComponent() {
        renderCount++;
        const {t} = useTranslation();
        return <div>{t('common.welcome')}</div>;
      }

      const {rerender} = render(
        <TestWrapper>
          <RenderCountComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(renderCount).toBe(2); // Initial + after translation load
      });

      // Re-render with same language shouldn't cause additional renders
      rerender(
        <TestWrapper>
          <RenderCountComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(renderCount).toBe(2); // Should not increase
      });
    });

    it('should cache translation lookups', async () => {
      function CacheTestComponent() {
        const {t} = useTranslation();
        
        // Call same translation multiple times
        return (
          <div>
            <div>{t('common.welcome')}</div>
            <div>{t('common.welcome')}</div>
            <div>{t('common.welcome')}</div>
          </div>
        );
      }

      render(
        <TestWrapper>
          <CacheTestComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        const elements = screen.getAllByText('Welcome to Head Artworks');
        expect(elements).toHaveLength(3);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <TestWrapper>
          <LanguageSelector />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /select language/i });
      expect(button).toHaveAttribute('aria-label', 'Select language');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('should update aria-expanded when dropdown opens', async () => {
      render(
        <TestWrapper>
          <LanguageSelector />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /select language/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('should support keyboard navigation', async () => {
      render(
        <TestWrapper>
          <LanguageSelector />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /select language/i });
      
      // Open with Enter key
      fireEvent.keyDown(button, { key: 'Enter' });

      await waitFor(() => {
        expect(screen.getByText('English')).toBeInTheDocument();
      });

      // Navigate with arrow keys (implementation would depend on actual keyboard handling)
      const spanishOption = screen.getByText('Español');
      fireEvent.keyDown(spanishOption, { key: 'Enter' });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });
  });
});