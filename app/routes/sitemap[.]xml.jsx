import {json} from '@shopify/remix-oxygen';
import {generateMultilingualSitemap} from '~/lib/sitemapUtils';

// GraphQL queries for sitemap data
const PRODUCTS_SITEMAP_QUERY = `#graphql
  query ProductsSitemap($first: Int!) {
    products(first: $first) {
      nodes {
        handle
        updatedAt
        seo {
          title
          description
        }
      }
    }
  }
`;

const COLLECTIONS_SITEMAP_QUERY = `#graphql
  query CollectionsSitemap($first: Int!) {
    collections(first: $first) {
      nodes {
        handle
        updatedAt
        seo {
          title
          description
        }
      }
    }
  }
`;

const PAGES_SITEMAP_QUERY = `#graphql
  query PagesSitemap($first: Int!) {
    pages(first: $first) {
      nodes {
        handle
        updatedAt
        seo {
          title
          description
        }
      }
    }
  }
`;

export async function loader({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  
  try {
    // Fetch all data in parallel for better performance
    const [productsResult, collectionsResult, pagesResult] = await Promise.all([
      storefront.query(PRODUCTS_SITEMAP_QUERY, {
        variables: { first: 250 }, // Shopify limit
        cache: storefront.CacheLong()
      }),
      storefront.query(COLLECTIONS_SITEMAP_QUERY, {
        variables: { first: 250 },
        cache: storefront.CacheLong()
      }),
      storefront.query(PAGES_SITEMAP_QUERY, {
        variables: { first: 250 },
        cache: storefront.CacheLong()
      })
    ]);
    
    // Transform pages data to include path
    const pages = pagesResult.pages.nodes.map(page => ({
      ...page,
      path: `/pages/${page.handle}`
    }));
    
    // Generate the multilingual sitemap
    const sitemap = generateMultilingualSitemap({
      products: productsResult.products.nodes,
      collections: collectionsResult.collections.nodes,
      pages,
      baseUrl: url.origin,
      languages: ['en', 'es', 'fr']
    });
    
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'X-Robots-Tag': 'noindex' // Don't index the sitemap itself
      }
    });
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return a basic sitemap on error
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url.origin}/en/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    
    return new Response(basicSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300' // Shorter cache on error
      }
    });
  }
}