import {useState, useEffect, useRef} from 'react';

/**
 * MediaOptimizedVideo component that optimizes video playback based on device and viewport
 * @param {{
 *   src: string;
 *   posterSrc?: string;
 *   alt?: string;
 *   autoPlay?: boolean;
 *   loop?: boolean;
 *   muted?: boolean;
 *   playsInline?: boolean;
 *   controls?: boolean;
 *   preload?: 'auto' | 'metadata' | 'none';
 *   className?: string;
 *   aspectRatio?: string;
 *   lazyLoad?: boolean;
 *   playOnScroll?: boolean;
 *   pauseOnExit?: boolean;
 *   mobilePause?: boolean;
 *   playOnce?: boolean;
 *   onEnded?: () => void;
 *   onTimeUpdate?: (event: Event) => void;
 * }}
 */
export function MediaOptimizedVideo({
  src,
  posterSrc,
  alt = 'Video content',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  controls = false,
  preload = 'metadata',
  className = '',
  aspectRatio = '16/9',
  lazyLoad = true,
  playOnScroll = true,
  pauseOnExit = true,
  mobilePause = true,
  playOnce = false,
  onEnded,
  onTimeUpdate,
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Set up intersection observer for lazy loading and scroll-based playback
  useEffect(() => {
    if (!videoRef.current || !containerRef.current) return;
    
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };
    
    const handleIntersection = (entries) => {
      const [entry] = entries;
      setIsVisible(entry.isIntersecting);
      
      if (entry.isIntersecting) {
        if (lazyLoad) {
          // Set the actual video source when in viewport
          videoRef.current.src = src;
        }
        
        if (playOnScroll && (!mobilePause || !isMobile)) {
          videoRef.current.play().catch(error => {
            console.warn('Auto-play was prevented:', error);
          });
        }
      } else if (pauseOnExit) {
        videoRef.current.pause();
      }
    };
    
    const observer = new IntersectionObserver(handleIntersection, options);
    observer.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [src, lazyLoad, playOnScroll, pauseOnExit, mobilePause, isMobile]);
  
  // Handle auto-play when visible
  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isVisible && autoPlay && (!mobilePause || !isMobile) && !(playOnce && hasPlayed)) {
      videoRef.current.play().catch(error => {
        console.warn('Auto-play was prevented:', error);
      });
    }
  }, [isVisible, autoPlay, mobilePause, isMobile, playOnce, hasPlayed]);
  
  // Handle video end event for playOnce functionality
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handleEnded = () => {
      if (playOnce) {
        setHasPlayed(true);
      }
      if (onEnded) {
        onEnded();
      }
    };
    
    videoElement.addEventListener('ended', handleEnded);
    
    return () => {
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, [playOnce, onEnded]);
  
  return (
    <div 
      className={`media-optimized-video-container ${className}`} 
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: aspectRatio,
        overflow: 'hidden',
      }}
    >
      <video
        ref={videoRef}
        className="media-optimized-video"
        poster={posterSrc}
        autoPlay={autoPlay && (!mobilePause || !isMobile) && !(playOnce && hasPlayed)}
        loop={playOnce ? false : loop}
        muted={muted}
        playsInline={playsInline}
        controls={controls}
        preload={lazyLoad ? 'none' : preload}
        src={lazyLoad ? undefined : src}
        aria-label={alt}
        onTimeUpdate={onTimeUpdate}
      >
        <p>Your browser doesn't support HTML video.</p>
      </video>
    </div>
  );
}