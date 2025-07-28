/// <reference types="node" />

import { transformShopifyToHydrogen } from '../lib/product-transforms';

// Minimal process type declarations
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
import type { ShopifyProduct, HydrogenProductItem } from '../types/product-migration';

interface MigrationOptions {
  batchSize: number;
  maxRetries: number;
  dryRun: boolean;
}

const DEFAULT_OPTIONS: MigrationOptions = {
  batchSize: 10,
  maxRetries: 3,
  dryRun: false
};

interface MigrationStats {
  totalProducts: number;
  successful: number;
  failed: number;
  retries: number;
}

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          handle
          description
          images(first: 10) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 100) {
            edges {
              node {
                id
                title
                availableForSale
                selected
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                image {
                  id
                  url
                  altText
                  width
                  height
                }
                optionValues {
                  name
                  value
                }
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export class ProductMigrator {
  private options: MigrationOptions;
  private stats: MigrationStats = {
    totalProducts: 0,
    successful: 0,
    failed: 0,
    retries: 0
  };

  constructor(private storefrontToken: string, options: Partial<MigrationOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  async migrate(): Promise<MigrationStats> {
    console.time('Migration completed in');
    let hasNextPage = true;
    let endCursor: string | null = null;

    console.log('Starting product migration...');
    console.log(`Batch size: ${this.options.batchSize}`);
    console.log(`Max retries: ${this.options.maxRetries}`);
    console.log(`Dry run: ${this.options.dryRun ? 'YES' : 'NO'}`);

    while (hasNextPage) {
      try {
        const { products } = await this.fetchProducts(endCursor);
        hasNextPage = products.pageInfo.hasNextPage;
        endCursor = products.pageInfo.endCursor;

        for (const edge of products.edges) {
          await this.processProduct(edge.node);
        }
      } catch (error) {
        console.error('Batch processing failed:', error);
        hasNextPage = false;
      }
    }

    console.timeEnd('Migration completed in');
    console.log('Results:');
    console.log(`- Total products: ${this.stats.totalProducts}`);
    console.log(`- Successful: ${this.stats.successful}`);
    console.log(`- Failed: ${this.stats.failed}`);
    console.log(`- Retries: ${this.stats.retries}`);

    return this.stats;
  }

  private async fetchProducts(cursor?: string | null) {
    const variables = {
      first: this.options.batchSize,
      after: cursor
    };

    const response = await fetch('https://headartwork.myshopify.com/api/2024-01/graphql.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': this.storefrontToken
      },
      body: JSON.stringify({
        query: PRODUCTS_QUERY,
        variables
      })
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.statusText}`);
    }

    return response.json();
  }

  private async processProduct(product: ShopifyProduct) {
    this.stats.totalProducts++;
    let retryCount = 0;
    let success = false;

    while (retryCount <= this.options.maxRetries && !success) {
      try {
        const transformed = transformShopifyToHydrogen(product);
        
        if (!this.options.dryRun) {
          await this.saveToHydrogen(transformed);
        }

        this.stats.successful++;
        success = true;
        process.stdout.write('.');
      } catch (error) {
        retryCount++;
        this.stats.retries++;

        if (retryCount > this.options.maxRetries) {
          this.stats.failed++;
          console.error(`\nFailed to migrate product ${product.id} after ${retryCount} attempts`);
          console.error(error);
        }
      }
    }
  }
  private async saveToHydrogen(product: HydrogenProductItem) {
    // In a real implementation, this would save to your Hydrogen data store
    // For now, we'll just log the transformed product
    if (process.env.DEBUG) {
      console.log('\nMigrated product:', {
        id: product.id,
        title: product.title,
        handle: product.handle
      });
    }
    return Promise.resolve();
  }
}

function parseArgs(): MigrationOptions {
  const args = process.argv.slice(2);
  const options: Partial<MigrationOptions> = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--batch-size' && args[i + 1]) {
      options.batchSize = parseInt(args[++i]);
    } else if (arg === '--max-retries' && args[i + 1]) {
      options.maxRetries = parseInt(args[++i]);
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    }
  }

  return { ...DEFAULT_OPTIONS, ...options };
}

async function main() {
  const options = parseArgs();
  const storefrontToken = process.env.STOREFRONT_TOKEN || '';
  
  if (!storefrontToken) {
    console.error('Error: STOREFRONT_TOKEN environment variable is required');
    process.exit(1);
  }

  const migrator = new ProductMigrator(storefrontToken, options);
  await migrator.migrate();
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});