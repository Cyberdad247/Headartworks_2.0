import {Link} from '@remix-run/react';

/**
 * @param {{
 *   children?: React.ReactNode;
 *   count: number;
 *   page: number;
 *   pageSize: number;
 *   basePath: string;
 *   resourceName?: string;
 * }}
 */
export function PaginatedResourceSection({
  children,
  count,
  page,
  pageSize,
  basePath,
  resourceName = 'items',
}) {
  const totalPages = Math.ceil(count / pageSize);
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  return (
    <div className="paginated-resource-section">
      <div className="paginated-resource-content">{children}</div>
      <div className="paginated-resource-pagination">
        <div className="paginated-resource-pagination-info">
          <p>
            Showing {Math.min((page - 1) * pageSize + 1, count)} -{' '}
            {Math.min(page * pageSize, count)} of {count} {resourceName}
          </p>
        </div>
        <div className="paginated-resource-pagination-controls">
          {prevPage ? (
            <Link
              to={`${basePath}?page=${prevPage}`}
              prefetch="intent"
              className="paginated-resource-pagination-link"
            >
              ← Previous
            </Link>
          ) : (
            <span className="paginated-resource-pagination-link disabled">
              ← Previous
            </span>
          )}

          <span className="paginated-resource-pagination-page">
            Page {page} of {totalPages}
          </span>

          {nextPage ? (
            <Link
              to={`${basePath}?page=${nextPage}`}
              prefetch="intent"
              className="paginated-resource-pagination-link"
            >
              Next →
            </Link>
          ) : (
            <span className="paginated-resource-pagination-link disabled">
              Next →
            </span>
          )}
        </div>
      </div>
    </div>
  );
}