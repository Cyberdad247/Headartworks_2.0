import {useState, useEffect, useRef} from 'react';
import {Image} from '@shopify/hydrogen';

/**
 * MediaCarousel component that displays a carousel of images, videos, or GIFs
 * with navigation controls and autoplay functionality.
 * @param {{
 *   items: Array<{
 *     type: 'image' | 'video' | 'gif';
 *     src: string;
 *     alt?: string;
 *     posterSrc?: string;
 *   }>;
 *   autoplay?: boolean;
 *   interval?: number;
 *   showControls?: boolean;
 *   showDots?: boolean;
 *   aspectRatio?: string;
 *   className?: string;
 * }}
 */
export function MediaCarousel({
  items = [],
  autoplay = true,
  interval = 5000,
  showControls = true,
  showDots = true,
  aspectRatio = '1/1',
  className = '',
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const carouselRef = useRef(null);
  const autoplayTimerRef = useRef(null);

  // Handle autoplay
  useEffect(() => {
    if (isPlaying && items.length > 1) {
      autoplayTimerRef.current = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % items.length);
      }, interval);
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isPlaying, items.length, interval]);

  // Pause autoplay when user interacts with carousel
  const pauseAutoplay = () => {
    setIsPlaying(false);
  };

  // Resume autoplay
  const resumeAutoplay = () => {
    if (autoplay) {
      setIsPlaying(true);
    }
  };

  // Navigate to previous slide
  const prevSlide = () => {
    pauseAutoplay();
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  // Navigate to next slide
  const nextSlide = () => {
    pauseAutoplay();
    setActiveIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  // Navigate to specific slide
  const goToSlide = (index) => {
    pauseAutoplay();
    setActiveIndex(index);
  };

  // Render media item based on type
  const renderMediaItem = (item, index) => {
    const isActive = index === activeIndex;
    
    switch (item.type) {
      case 'video':
        return (
          <div 
            className={`media-carousel-item ${isActive ? 'active' : ''}`}
            key={`video-${index}`}
          >
            <video
              src={item.src}
              poster={item.posterSrc}
              autoPlay={isActive && isPlaying}
              loop
              muted
              playsInline
              className="media-carousel-video"
              onEnded={() => nextSlide()}
              loading="lazy"
            >
              <p>Your browser doesn't support HTML video.</p>
            </video>
          </div>
        );
      case 'gif':
      case 'image':
      default:
        return (
          <div 
            className={`media-carousel-item ${isActive ? 'active' : ''}`}
            key={`image-${index}`}
          >
            {item.data ? (
              <Image
                data={item.data}
                alt={item.alt || 'Product media'}
                aspectRatio={aspectRatio}
                sizes="(min-width: 45em) 50vw, 100vw"
                className="media-carousel-image"
                loading="lazy"
              />
            ) : (
              <img 
                src={item.src} 
                alt={item.alt || 'Product media'} 
                className="media-carousel-image"
                loading="lazy"
              />
            )}
          </div>
        );
    }
  };

  if (!items || items.length === 0) {
    return <div className={`media-carousel empty ${className}`} />;
  }

  return (
    <div 
      className={`media-carousel ${className}`}
      ref={carouselRef}
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
      onTouchStart={pauseAutoplay}
      onTouchEnd={resumeAutoplay}
    >
      <div 
        className="media-carousel-inner"
        style={{
          transform: `translateX(-${activeIndex * 100}%)`
        }}
      >
        {items.map((item, index) => renderMediaItem(item, index))}
      </div>

      {showControls && items.length > 1 && (
        <div className="media-carousel-controls">
          <button 
            className="media-carousel-control prev" 
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <span>‹</span>
          </button>
          
          {showDots && (
            <div className="media-carousel-dots">
              {items.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  className={`media-carousel-dot ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
          
          <button 
            className="media-carousel-control next" 
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <span>›</span>
          </button>
        </div>
      )}
    </div>
  );
}