import {Aside} from '../Aside';
import {Footer} from './Footer';
import {Header} from './Header';
import {Seo} from '../Seo';

/**
 * @param {{
 *   children?: React.ReactNode;
 *   title?: string;
 *   description?: string;
 *   seoType?: 'product' | 'collection' | 'page' | 'article' | 'home';
 *   seoData?: any;
 *   menu?: any;
 *   shop?: any;
 *   cart?: any;
 * }}
 */
export function PageLayout({
  children,
  title,
  description,
  seoType = 'home',
  seoData,
  menu,
  shop,
  cart,
}) {
  return (
    <>
      <Seo type={seoType} data={seoData} title={title} description={description} />
      <div className="page-layout">
        <Header menu={menu} shop={shop} cart={cart} />
        <main>{children}</main>
        <Aside />
        <Footer menu={menu} shop={shop} />
      </div>
    </>
  );
}