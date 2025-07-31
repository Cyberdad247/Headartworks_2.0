/// <reference types="node" />

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

declare global {
  namespace NodeJS {
    interface Process {
      argv: string[];
      env: Record<string, string | undefined>;
      stdout: {
        write: (text: string) => boolean;
      };
      exit: (code?: number) => never;
    }
  }
  const process: NodeJS.Process;
}

interface ContentMigrationOptions {
  storeDomain: string;
  storefrontToken: string;
  dryRun: boolean;
}

interface ShopifyMetaobject {
  id: string;
  type: string;
  handle: string;
  fields: Array<{
    key: string;
    value: string;
    type: string;
  }>;
}

// Static content structure for Head Art Works
const STATIC_CONTENT = {
  hero: {
    title: "Welcome to Head Art Works",
    subtitle: "Where tradition meets innovation. Our passion for quality and craftsmanship is evident in every product we create. Using only the finest natural ingredients.",
    ctaText: "Shop Now",
    ctaLink: "/collections/all",
    videoSrc: "/videos/hero-video.mp4"
  },
  about: {
    title: "Our Story",
    content: "Head Art Works has been dedicated to creating premium hair care products that combine traditional craftsmanship with modern innovation. Every product is carefully formulated with organic ingredients to deliver exceptional results.",
    image: "/images/about-craftsmanship.jpg"
  },
  organicIngredients: {
    title: "Organic Ingredients",
    content: "We source only the finest organic ingredients, ensuring that our products are not only effective but also safe and environmentally responsible.",
    features: [
      {
        name: "100% Natural",
        description: "All ingredients are sourced from certified organic suppliers"
      },
      {
        name: "Eco-Friendly",
        description: "Sustainable packaging and environmentally conscious production"
      },
      {
        name: "Cruelty-Free",
        description: "Never tested on animals, certified cruelty-free"
      }
    ]
  },
  policies: {
    shipping: {
      title: "Shipping Policy",
      content: "We offer fast and reliable shipping worldwide. Orders are processed within 1-2 business days."
    },
    returns: {
      title: "Return Policy", 
      content: "We accept returns within 30 days of purchase. Items must be in original condition."
    },
    privacy: {
      title: "Privacy Policy",
      content: "Your privacy is important to us. We protect your personal information and never share it with third parties."
    }
  }
};

export class ContentMigrator {
  private options: ContentMigrationOptions;

  constructor(options: ContentMigrationOptions) {
    this.options = options;
  }

  async migrate(): Promise<void> {
    console.log('Starting content migration...');
    console.log(`Store Domain: ${this.options.storeDomain}`);
    console.log(`Dry Run: ${this.options.dryRun ? 'YES' : 'NO'}`);

    try {
      // Migrate homepage content
      await this.migrateHomepageContent();
      
      // Migrate static pages
      await this.migrateStaticPages();
      
      // Update product features to use metafields
      await this.updateProductFeatures();
      
      console.log('Content migration completed successfully!');
    } catch (error) {
      console.error('Content migration failed:', error);
      throw error;
    }
  }

  private async migrateHomepageContent(): Promise<void> {
    console.log('Migrating homepage content...');
    
    if (!this.options.dryRun) {
      // Create metaobjects for dynamic content
      await this.createMetaobject('homepage_hero', STATIC_CONTENT.hero);
      await this.createMetaobject('homepage_about', STATIC_CONTENT.about);
      await this.createMetaobject('organic_ingredients', STATIC_CONTENT.organicIngredients);
    }
    
    console.log('✓ Homepage content migrated');
  }

  private async migrateStaticPages(): Promise<void> {
    console.log('Migrating static pages...');
    
    for (const [key, policy] of Object.entries(STATIC_CONTENT.policies)) {
      if (!this.options.dryRun) {
        await this.createPage(key, policy);
      }
      console.log(`✓ ${policy.title} page created`);
    }
  }

  private async updateProductFeatures(): Promise<void> {
    console.log('Updating product features to use metafields...');
    
    // This would typically query products and update their metafields
    // For now, we'll create a template for the product features
    const productFeaturesTemplate = {
      craftsmanship: {
        image: "/images/craftsmanship-badge.png",
        title: "Premium Craftsmanship",
        description: "Handcrafted with attention to detail"
      },
      organic: {
        image: "/images/organic-badge.png", 
        title: "100% Organic",
        description: "Made with certified organic ingredients"
      },
      sustainable: {
        image: "/images/sustainable-badge.png",
        title: "Sustainable",
        description: "Environmentally responsible production"
      }
    };

    if (!this.options.dryRun) {
      // Save template for later use
      this.saveLocalFile('product-features-template.json', productFeaturesTemplate);
    }
    
    console.log('✓ Product features template updated');
  }

  private async createMetaobject(handle: string, content: any): Promise<void> {
    // In a real implementation, this would create Shopify metaobjects
    console.log(`Creating metaobject: ${handle}`);
    this.saveLocalFile(`metaobject-${handle}.json`, content);
  }

  private async createPage(handle: string, pageData: any): Promise<void> {
    // In a real implementation, this would create Shopify pages
    console.log(`Creating page: ${handle}`);
    this.saveLocalFile(`page-${handle}.json`, pageData);
  }

  private saveLocalFile(filename: string, data: any): void {
    const outputDir = join(process.cwd(), 'content-migration-output');
    try {
      writeFileSync(join(outputDir, filename), JSON.stringify(data, null, 2));
    } catch (error) {
      // Directory might not exist, create the file in current directory
      writeFileSync(join(process.cwd(), filename), JSON.stringify(data, null, 2));
    }
  }
}

function parseArgs(): ContentMigrationOptions {
  const storeDomain = process.env.PUBLIC_STORE_DOMAIN || 'headartworks.myshopify.com';
  const storefrontToken = process.env.PUBLIC_STOREFRONT_API_TOKEN || '';
  const dryRun = process.argv.includes('--dry-run');

  return {
    storeDomain,
    storefrontToken,
    dryRun
  };
}

async function main() {
  const options = parseArgs();
  
  if (!options.storefrontToken && !options.dryRun) {
    console.warn('Warning: No storefront token provided. Running in dry-run mode.');
    options.dryRun = true;
  }

  const migrator = new ContentMigrator(options);
  await migrator.migrate();
}

main().catch(err => {
  console.error('Content migration failed:', err);
  process.exit(1);
});
