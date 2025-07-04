import {Link} from '@remix-run/react';

/**
 * @param {{
 *   menu?: any;
 *   shop?: any;
 * }}
 */
export function Footer({menu, shop}) {
  return (
    <footer className="footer">
      <div className="footer-menu">
        <nav className="footer-menu-nav">
          {menu?.items?.map((item) => {
            if (!item.url) return null;
            const url = item.url.includes('myshopify.com')
              ? new URL(item.url).pathname
              : item.url;
            return (
              <Link
                className="footer-menu-item"
                key={item.id}
                prefetch="intent"
                to={url}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {shop?.name}</p>
      </div>
    </footer>
  );
}