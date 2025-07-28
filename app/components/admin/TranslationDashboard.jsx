/**
 * Translation Management Dashboard
 * Admin interface for managing content translations
 */

import {useState, useEffect} from 'react';
import {useTranslation} from '~/contexts/TranslationContext';
import {ContentManager, ProductLocalizer, CollectionLocalizer} from '~/lib/contentLocalization';
import {validateTranslations, extractStrings} from '~/lib/translationUtils';

export function TranslationDashboard() {
  const {language, t} = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [translationStats, setTranslationStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTranslationStats();
  }, []);

  const loadTranslationStats = async () => {
    try {
      setLoading(true);
      // Load translation statistics
      const stats = await getTranslationStatistics();
      setTranslationStats(stats);
    } catch (error) {
      console.error('Failed to load translation stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: t('admin.overview'), icon: '📊' },
    { id: 'products', label: t('admin.products'), icon: '🛍️' },
    { id: 'collections', label: t('admin.collections'), icon: '📁' },
    { id: 'content', label: t('admin.content'), icon: '📝' },
    { id: 'settings', label: t('admin.settings'), icon: '⚙️' }
  ];

  if (loading) {
    return (
      <div className="translation-dashboard loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>{t('admin.loading_dashboard')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="translation-dashboard">
      <header className="dashboard-header">
        <h1>{t('admin.translation_dashboard')}</h1>
        <div className="language-indicator">
          <span className="current-language">{language.toUpperCase()}</span>
        </div>
      </header>

      <nav className="dashboard-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="dashboard-content">
        {activeTab === 'overview' && (
          <OverviewTab stats={translationStats} />
        )}
        {activeTab === 'products' && (
          <ProductsTab />
        )}
        {activeTab === 'collections' && (
          <CollectionsTab />
        )}
        {activeTab === 'content' && (
          <ContentTab />
        )}
        {activeTab === 'settings' && (
          <SettingsTab />
        )}
      </main>
    </div>
  );
}

function OverviewTab({stats}) {
  const {t} = useTranslation();

  return (
    <div className="overview-tab">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🌍</div>
          <div className="stat-content">
            <h3>{t('admin.total_languages')}</h3>
            <div className="stat-value">{stats?.totalLanguages || 3}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{t('admin.translation_coverage')}</h3>
            <div className="stat-value">{stats?.coverage || 85}%</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛍️</div>
          <div className="stat-content">
            <h3>{t('admin.translated_products')}</h3>
            <div className="stat-value">{stats?.translatedProducts || 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>{t('admin.missing_translations')}</h3>
            <div className="stat-value">{stats?.missingTranslations || 0}</div>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>{t('admin.recent_activity')}</h3>
        <div className="activity-list">
          {stats?.recentActivity?.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">{activity.icon}</div>
              <div className="activity-content">
                <p className="activity-description">{activity.description}</p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          )) || (
            <p className="no-activity">{t('admin.no_recent_activity')}</p>
          )}
        </div>
      </div>

      <div className="language-progress">
        <h3>{t('admin.language_progress')}</h3>
        <div className="progress-list">
          {['es', 'fr'].map(lang => (
            <div key={lang} className="progress-item">
              <div className="progress-header">
                <span className="language-name">{t(`languages.${lang}`)}</span>
                <span className="progress-percentage">
                  {stats?.languageProgress?.[lang] || 0}%
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{width: `${stats?.languageProgress?.[lang] || 0}%`}}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductsTab() {
  const {t} = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadProducts();
  }, [filter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // Load products with translation status
      const productData = await getProductsWithTranslationStatus(filter);
      setProducts(productData);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = [
    { value: 'all', label: t('admin.all_products') },
    { value: 'translated', label: t('admin.fully_translated') },
    { value: 'partial', label: t('admin.partially_translated') },
    { value: 'untranslated', label: t('admin.untranslated') }
  ];

  return (
    <div className="products-tab">
      <div className="tab-header">
        <h2>{t('admin.product_translations')}</h2>
        <div className="tab-controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button className="btn-primary">
            {t('admin.export_translations')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>{t('admin.loading_products')}</p>
        </div>
      ) : (
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>{t('admin.product_name')}</th>
                <th>{t('admin.handle')}</th>
                <th>{t('admin.english')}</th>
                <th>{t('admin.spanish')}</th>
                <th>{t('admin.french')}</th>
                <th>{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <ProductRow key={product.id} product={product} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ProductRow({product}) {
  const {t} = useTranslation();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'complete': return '✅';
      case 'partial': return '⚠️';
      case 'missing': return '❌';
      default: return '❓';
    }
  };

  return (
    <tr className="product-row">
      <td className="product-name">
        <div className="product-info">
          <span className="product-title">{product.title}</span>
          <span className="product-type">{product.productType}</span>
        </div>
      </td>
      <td className="product-handle">{product.handle}</td>
      <td className="translation-status">
        <span className="status-indicator">
          {getStatusIcon(product.translations?.en?.status)}
        </span>
      </td>
      <td className="translation-status">
        <span className="status-indicator">
          {getStatusIcon(product.translations?.es?.status)}
        </span>
      </td>
      <td className="translation-status">
        <span className="status-indicator">
          {getStatusIcon(product.translations?.fr?.status)}
        </span>
      </td>
      <td className="product-actions">
        <button className="btn-secondary btn-small">
          {t('admin.edit_translations')}
        </button>
      </td>
    </tr>
  );
}

function CollectionsTab() {
  const {t} = useTranslation();
  // Similar implementation to ProductsTab but for collections
  return (
    <div className="collections-tab">
      <h2>{t('admin.collection_translations')}</h2>
      {/* Collection translation management interface */}
    </div>
  );
}

function ContentTab() {
  const {t} = useTranslation();
  // Content pages, blog posts, etc.
  return (
    <div className="content-tab">
      <h2>{t('admin.content_translations')}</h2>
      {/* Content translation management interface */}
    </div>
  );
}

function SettingsTab() {
  const {t} = useTranslation();
  const [settings, setSettings] = useState({
    autoTranslate: false,
    translationProvider: 'manual',
    qualityThreshold: 85,
    notificationEmail: ''
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="settings-tab">
      <h2>{t('admin.translation_settings')}</h2>
      
      <div className="settings-section">
        <h3>{t('admin.automation_settings')}</h3>
        <div className="setting-item">
          <label className="setting-label">
            <input
              type="checkbox"
              checked={settings.autoTranslate}
              onChange={(e) => handleSettingChange('autoTranslate', e.target.checked)}
            />
            {t('admin.enable_auto_translation')}
          </label>
          <p className="setting-description">
            {t('admin.auto_translation_description')}
          </p>
        </div>

        <div className="setting-item">
          <label className="setting-label">
            {t('admin.translation_provider')}
          </label>
          <select
            value={settings.translationProvider}
            onChange={(e) => handleSettingChange('translationProvider', e.target.value)}
            className="setting-select"
          >
            <option value="manual">{t('admin.manual_translation')}</option>
            <option value="google">{t('admin.google_translate')}</option>
            <option value="deepl">{t('admin.deepl')}</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h3>{t('admin.quality_settings')}</h3>
        <div className="setting-item">
          <label className="setting-label">
            {t('admin.quality_threshold')}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.qualityThreshold}
            onChange={(e) => handleSettingChange('qualityThreshold', e.target.value)}
            className="setting-range"
          />
          <span className="range-value">{settings.qualityThreshold}%</span>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn-primary">
          {t('admin.save_settings')}
        </button>
        <button className="btn-secondary">
          {t('admin.reset_to_defaults')}
        </button>
      </div>
    </div>
  );
}

// Helper functions (would be implemented with actual API calls)
async function getTranslationStatistics() {
  // Mock data - replace with actual API call
  return {
    totalLanguages: 3,
    coverage: 85,
    translatedProducts: 45,
    missingTranslations: 12,
    languageProgress: {
      es: 78,
      fr: 92
    },
    recentActivity: [
      {
        icon: '✅',
        description: 'Product "Art Piece #123" translated to Spanish',
        time: '2 hours ago'
      },
      {
        icon: '📝',
        description: 'Collection "Modern Art" updated in French',
        time: '1 day ago'
      }
    ]
  };
}

async function getProductsWithTranslationStatus(filter) {
  // Mock data - replace with actual API call
  return [
    {
      id: '1',
      title: 'Abstract Canvas Art',
      handle: 'abstract-canvas-art',
      productType: 'Canvas',
      translations: {
        en: { status: 'complete' },
        es: { status: 'partial' },
        fr: { status: 'complete' }
      }
    }
    // ... more products
  ];
}

export default TranslationDashboard;