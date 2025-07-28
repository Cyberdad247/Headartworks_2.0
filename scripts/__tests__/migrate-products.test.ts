import { ProductMigrator } from '../migrate-products';
import { mockProduct } from '../../lib/__tests__/test-utils';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function describe(name: string, fn: () => void) {
  console.log(`\n${name}`);
  fn();
}

function it(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (err) {
    console.error(`✗ ${name}`);
    console.error(err);
  }
}

describe('ProductMigrator', () => {
  const mockToken = 'test-token';

  it('should initialize with default options', () => {
    const migrator = new ProductMigrator(mockToken);
    assert(migrator instanceof ProductMigrator, 'Should be instance of ProductMigrator');
  });

  it('should process product successfully', async () => {
    const migrator = new ProductMigrator(mockToken);
    migrator['fetchProducts'] = async () => ({
      products: {
        pageInfo: { hasNextPage: false, endCursor: null },
        edges: [{ node: mockProduct }]
      }
    });

    await migrator.migrate();
    assert(migrator['stats'].successful === 1, 'Should have 1 successful product');
  });

  it('should handle failed products with retries', async () => {
    const migrator = new ProductMigrator(mockToken, { maxRetries: 2 });
    migrator['fetchProducts'] = async () => ({
      products: {
        pageInfo: { hasNextPage: false, endCursor: null },
        edges: [{ node: mockProduct }]
      }
    });
    migrator['processProduct'] = async () => { throw new Error('Test error'); };

    await migrator.migrate();
    assert(migrator['stats'].failed === 1, 'Should have 1 failed product');
    assert(migrator['stats'].retries === 2, 'Should have 2 retries');
  });

  it('should respect dry run mode', async () => {
    const migrator = new ProductMigrator(mockToken, { dryRun: true });
    migrator['fetchProducts'] = async () => ({
      products: {
        pageInfo: { hasNextPage: false, endCursor: null },
        edges: [{ node: mockProduct }]
      }
    });
    migrator['saveToHydrogen'] = async () => { throw new Error('Should not be called in dry run'); };

    await migrator.migrate();
    assert(migrator['stats'].successful === 1, 'Should count as successful in dry run');
  });

  it('should process multiple batches', async () => {
    const migrator = new ProductMigrator(mockToken, { batchSize: 1 });
    let callCount = 0;
    migrator['fetchProducts'] = async (cursor) => {
      callCount++;
      return {
        products: {
          pageInfo: {
            hasNextPage: callCount < 3,
            endCursor: callCount < 3 ? `cursor-${callCount}` : null
          },
          edges: [{ node: mockProduct }]
        }
      };
    };

    await migrator.migrate();
    assert(callCount === 3, 'Should make 3 API calls for 2 pages');
    assert(migrator['stats'].successful === 3, 'Should have 3 successful products');
  });
});