import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';

/**
 * Enhanced ProductItem component with hover animations and craftsmanship reveal
 * @param {{
 *   product: ProductItemFragment;
 *   loading?: 'eager' | 'lazy';
 *   showCraftsmanshipBadge?: boolean;
 *   craftsmanshipImage?: string;
 *   className?: string;
 * }}
 */
export function ProductItem({
  product,
  loading = 'lazy',
  showCraftsmanshipBadge = true,
  craftsmanshipImage,
  className = '',
}) {
  const variantUrl = useVariantUrl(product.handle);
  
  // Use the second image as craftsmanship reveal if available and no custom image provided
  const hasMultipleImages = product.images?.nodes?.length > 1;
  const revealImage = craftsmanshipImage || 
    (hasMultipleImages ? product.images.nodes[1] : null);
  
  return (
    <Link
      className={`product-item ${className}`}
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <div className="product-image-container">
        {product.featuredImage && (
          <Image
            alt={product.featuredImage.altText || product.title}
            aspectRatio="1/1"
            data={product.featuredImage}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
            className="product-image"
          />
        )}
        
        {/* Craftsmanship reveal effect */}
        {revealImage && (
          <div 
            className="craftsmanship-reveal"
            style={{
              backgroundImage: typeof revealImage === 'string' 
                ? `url(${revealImage})` 
                : null
            }}
          >
            {typeof revealImage !== 'string' && (
              <Image
                alt={`${product.title} craftsmanship detail`}
                aspectRatio="1/1"
                data={revealImage}
                loading="lazy"
                sizes="(min-width: 45em) 400px, 100vw"
              />
            )}
          </div>
        )}
        
        {/* Craftsmanship badge */}
        {showCraftsmanshipBadge && (
          <div className="craftsmanship-badge">Handcrafted</div>
        )}
      </div>
      
      <div className="product-info">
        <h4>{product.title}</h4>
        <small>
          <Money data={product.priceRange.minVariantPrice} />
        </small>
      </div>
    </Link>
  );
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */