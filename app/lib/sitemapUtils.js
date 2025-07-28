/**
 * Sitemap utilities for multilingual SEO
 */

/**
 * Generate multilingual sitemap with hreflang annotations
 */
export function generateMultilingualSitemap({products, collections, pages = [], baseUrl, languages}) {
  const urls = [];
  
  // Add homepage
  urls.push(generateUrlEntry('/', baseUrl, languages));
  
  // Add product pages
  products.forEach(product => {
    const productPath = `/products/${product.handle}`;
    urls.push(generateUrlEntry(productPath, baseUrl, languages, {
      lastmod: product.updatedAt,
      priority: '0.8'
    }));
  });
  
  // Add collection pages
  collections.forEach(collection => {
    const collectionPath = `/collections/${collection.handle}`;
    urls.push(generateUrlEntry(collectionPath, baseUrl, languages, {
      lastmod: collection.updatedAt,
      priority: '0.7'
    }));
  });
  
  // Add static pages
  const staticPages = [
    { path: '/collections', priority: '0.6' },
    { path: '/blogs/journal', priority: '0.5' },
    { path: '/policies', priority: '0.3' },
    { path: '/pages/about', priority: '0.4' }
  ];
  
  staticPages.forEach(page => {
    urls.push(generateUrlEntry(page.path, baseUrl, languages, {
      priority: page.priority
    }));
  });
  
  // Add custom pages if provided
  pages.forEach(page => {
    urls.push(generateUrlEntry(page.path, baseUrl, languages, {
      lastmod: page.updatedAt,
      priority: page.priority || '0.5'
    }));
  });
  
  return generateSitemapXML(urls);
}

/**
 * Generate a single URL entry with language alternates
 */
function generateUrlEntry(path, baseUrl, languages, options = {}) {
  const {lastmod, priority = '0.5', changefreq = 'weekly'} = options;
  
  // Generate alternates for each language
  const alternates = languages.map(lang => ({
    hreflang: lang,
    href: `${baseUrl}/${lang}${path}`
  }));
  
  // Add x-default alternate (English)
  alternates.push({
    hreflang: 'x-default',
    href: `${baseUrl}/en${path}`
  });
  
  return {
    loc: `${baseUrl}/en${path}`, // Default to English URL
    lastmod,
    priority,
    changefreq,
    alternates
  };
}

/**
 * Generate the complete sitemap XML
 */
function generateSitemapXML(urls) {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;
  
  const xmlFooter = '</urlset>';
  
  const urlEntries = urls.map(url => {
    let entry = `  <url>
    <loc>${escapeXml(url.loc)}</loc>`;
    
    if (url.lastmod) {
      entry += `
    <lastmod>${new Date(url.lastmod).toISOString().split('T')[0]}</lastmod>`;
    }
    
    entry += `
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>`;
    
    // Add hreflang alternates
    url.alternates.forEach(alternate => {
      entry += `
    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${escapeXml(alternate.href)}"/>`;
    });
    
    entry += `
  </url>`;
    
    return entry;
  }).join('\n');
  
  return `${xmlHeader}\n${urlEntries}\n${xmlFooter}`;
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * Generate robots.txt with sitemap reference
 */
export function generateRobotsTxt(baseUrl) {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Block admin and API routes
Disallow: /admin/
Disallow: /api/
Disallow: /_data/
Disallow: /_image/

# Block duplicate content
Disallow: /*?*
Disallow: /*/search
Disallow: /cart
Disallow: /account`;
}

/**
 * Validate sitemap structure
 */
export function validateSitemap(sitemapXml) {
  const errors = [];
  
  // Check for required elements
  if (!sitemapXml.includes('<urlset')) {
    errors.push('Missing urlset element');
  }
  
  if (!sitemapXml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
    errors.push('Missing sitemap namespace');
  }
  
  if (!sitemapXml.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"')) {
    errors.push('Missing xhtml namespace for hreflang');
  }
  
  // Check for hreflang implementation
  const hreflangCount = (sitemapXml.match(/hreflang="/g) || []).length;
  if (hreflangCount === 0) {
    errors.push('No hreflang attributes found');
  }
  
  // Check for x-default
  if (!sitemapXml.includes('hreflang="x-default"')) {
    errors.push('Missing x-default hreflang');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}