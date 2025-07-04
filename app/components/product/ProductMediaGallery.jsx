import {useState, useEffect} from 'react';
import {MediaCarousel} from '~/components/MediaCarousel';

/**
 * ProductMediaGallery component that displays a carousel of product images and videos
 * @param {{
 *   media: Array<{
 *     type: string;
 *     data?: any;
 *     src?: string;
 *     alt?: string;
 *     posterSrc?: string;
 *   }>;
 *   selectedVariant?: any;
 *   autoplay?: boolean;
 *   showControls?: boolean;
 *   className?: string;
 * }}
 */
export function ProductMediaGallery({
  media = [],
  selectedVariant,
  autoplay = false,
  showControls = true,
  className = '',
}) {
  const [mediaItems, setMediaItems] = useState([]);
  
  // Process media items when component mounts or media/selectedVariant changes
  useEffect(() => {
    if (!media || media.length === 0) return;
    
    // Filter and transform media items
    const processedItems = media.map(item => {
      // Determine media type
      let type = 'image';
      if (item.type === 'VIDEO' || item.type === 'EXTERNAL_VIDEO') {
        type = 'video';
      } else if (item.type === 'MODEL_3D') {
        type = 'model3d';
      }
      
      return {
        type,
        data: item.data,
        src: item.src,
        alt: item.alt || 'Product media',
        posterSrc: item.posterSrc,
      };
    });
    
    // If there's a selected variant with an image, prioritize it
    if (selectedVariant?.image) {
      const variantImageIndex = processedItems.findIndex(
        item => item.data?.id === selectedVariant.image.id
      );
      
      if (variantImageIndex > 0) {
        // Move the variant image to the first position
        const variantImage = processedItems.splice(variantImageIndex, 1)[0];
        processedItems.unshift(variantImage);
      }
    }
    
    setMediaItems(processedItems);
  }, [media, selectedVariant]);
  
  if (!mediaItems || mediaItems.length === 0) {
    return <div className={`product-media-gallery empty ${className}`} />;
  }
  
  return (
    <div className={`product-media-gallery ${className}`}>
      <MediaCarousel
        items={mediaItems}
        autoplay={autoplay}
        showControls={showControls}
        aspectRatio="1/1"
        interval={5000}
      />
    </div>
  );
}