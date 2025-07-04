import {useMatches} from '@remix-run/react';
import {useEffect} from 'react';

/**
 * A component that sets the SEO metadata for a page
 * @param {{
 *   type: 'product' | 'collection' | 'page' | 'article' | 'home';
 *   data?: any;
 *   title?: string;
 *   description?: string;
 *   url?: string;
 *   image?: string;
 * }}
 */
export function Seo({type, data, title, description, url, image}) {
  const matches = useMatches();
  const routeData = matches[matches.length - 1].data;
  
  // Set default values from route data if available
  const defaultTitle = routeData?.shop?.name || 'Headartworks';
  const defaultDescription = routeData?.shop?.description || 'Shop for unique art and designs';
  const defaultUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  // Determine SEO values based on type and data
  let seoTitle = title;
  let seoDescription = description;
  let seoUrl = url || defaultUrl;
  let seoImage = image;
  
  if (type === 'product' && data?.product) {
    const product = data.product;
    const selectedVariant = data.selectedVariant || product.variants?.nodes?.[0];
    
    seoTitle = seoTitle || product.seo?.title || product.title;
    seoDescription = seoDescription || product.seo?.description || product.description;
    seoImage = seoImage || selectedVariant?.image?.url || product.featuredImage?.url;
  } else if (type === 'collection' && data?.collection) {
    const collection = data.collection;
    
    seoTitle = seoTitle || collection.seo?.title || collection.title;
    seoDescription = seoDescription || collection.seo?.description || collection.description;
    seoImage = seoImage || collection.image?.url;
  } else if (type === 'page' && data?.page) {
    const page = data.page;
    
    seoTitle = seoTitle || page.seo?.title || page.title;
    seoDescription = seoDescription || page.seo?.description || page.body;
  } else if (type === 'article' && data?.article) {
    const article = data.article;
    
    seoTitle = seoTitle || article.seo?.title || article.title;
    seoDescription = seoDescription || article.seo?.description || article.excerpt;
    seoImage = seoImage || article.image?.url;
  }
  
  // Fallback to defaults
  seoTitle = seoTitle || defaultTitle;
  seoDescription = seoDescription || defaultDescription;
  
  // Format title
  const formattedTitle = seoTitle === defaultTitle 
    ? seoTitle 
    : `${seoTitle} | ${defaultTitle}`;
  
  useEffect(() => {
    // Update document title
    document.title = formattedTitle;
    
    // Update meta tags
    updateMetaTag('description', seoDescription);
    updateMetaTag('og:title', formattedTitle);
    updateMetaTag('og:description', seoDescription);
    updateMetaTag('og:url', seoUrl);
    if (seoImage) updateMetaTag('og:image', seoImage);
    
    // Twitter cards
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', formattedTitle);
    updateMetaTag('twitter:description', seoDescription);
    if (seoImage) updateMetaTag('twitter:image', seoImage);
  }, [formattedTitle, seoDescription, seoUrl, seoImage]);
  
  return null;
}

/**
 * Helper function to update or create meta tags
 * @param {string} name - The name or property attribute of the meta tag
 * @param {string} content - The content value
 */
function updateMetaTag(name, content) {
  if (!content) return;
  
  // Check if the meta tag exists
  let metaTag = document.querySelector(`meta[name="${name}"]`);
  if (!metaTag) {
    metaTag = document.querySelector(`meta[property="${name}"]`);
  }
  
  if (metaTag) {
    // Update existing tag
    metaTag.setAttribute('content', content);
  } else {
    // Create new tag
    metaTag = document.createElement('meta');
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      metaTag.setAttribute('property', name);
    } else {
      metaTag.setAttribute('name', name);
    }
    metaTag.setAttribute('content', content);
    document.head.appendChild(metaTag);
  }
}