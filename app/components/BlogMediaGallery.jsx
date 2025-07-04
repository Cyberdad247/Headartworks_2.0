import {useState} from 'react';
import {Image} from '@shopify/hydrogen';
import {MediaCarousel} from './MediaCarousel';

/**
 * BlogMediaGallery component that displays a carousel of images and videos for blog posts
 * @param {{
 *   media: Array<{
 *     type: 'image' | 'video' | 'gif';
 *     data?: any;
 *     src?: string;
 *     alt?: string;
 *     posterSrc?: string;
 *   }>;
 *   title?: string;
 *   caption?: string;
 *   autoplay?: boolean;
 *   showControls?: boolean;
 *   className?: string;
 * }}
 */
export function BlogMediaGallery({
  media = [],
  title,
  caption,
  autoplay = false,
  showControls = true,
  className = '',
}) {
  if (!media || media.length === 0) {
    return null;
  }
  
  return (
    <div className={`blog-media-gallery ${className}`}>
      {title && <h3 className="blog-media-gallery-title">{title}</h3>}
      
      <div className="blog-media-gallery-container">
        <MediaCarousel
          items={media}
          autoplay={autoplay}
          showControls={showControls}
          aspectRatio="16/9"
          interval={5000}
        />
      </div>
      
      {caption && <p className="blog-media-gallery-caption">{caption}</p>}
    </div>
  );
}