import {Link} from '@remix-run/react';
import {useState, useRef} from 'react';
import {MediaOptimizedVideo} from './MediaOptimizedVideo';
import {useVideoContext} from './VideoContext';

/**
 * Enhanced Hero component that displays a video background with text overlay
 * Uses MediaOptimizedVideo for better performance
 * Automatically transitions after video plays once
 * @param {{
 *   videoSrc: string;
 *   posterSrc?: string;
 *   title?: string;
 *   subtitle?: string;
 *   ctaText?: string;
 *   ctaLink?: string;
 *   mobilePause?: boolean;
 * }}
 */
export function Hero({
  videoSrc,
  posterSrc,
  title = 'Welcome to Head Art Works',
  subtitle = 'Where tradition meets innovation. Our passion for quality and craftsmanship is evident in every product we create. Using only the finest natural ingredients.',
  ctaText = 'Shop Now',
  ctaLink = '/collections/all',
  mobilePause = true,
}) {
  const videoRef = useRef(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const {videoEnded, handleVideoEnd, darkMode, videoPlaying, currentVideoSrc} = useVideoContext();
  return (
    <div className={`hero-container ${videoEnded ? 'video-ended' : 'normal-scroll'} ${videoProgress > 50 ? 'video-progress' : ''}`}>
      <div className="hero-video-wrapper">
        <MediaOptimizedVideo
          src={currentVideoSrc} // Use the video source from context instead of prop
          posterSrc={posterSrc}
          autoPlay={videoPlaying}
          loop={darkMode} // Loop video in dark mode
          muted={true}
          playsInline={true}
          controls={false}
          className={`hero-video ${darkMode ? 'dark-mode-video' : ''}`}
          aspectRatio="16/9"
          lazyLoad={false}
          playOnScroll={!darkMode} // Only use scroll-based playback in light mode
          pauseOnExit={!darkMode} // Only pause on exit in light mode
          mobilePause={!darkMode && mobilePause} // Only use mobile pause in light mode
          playOnce={!darkMode} // Only play once in light mode
          alt="Head Art Works craftsmanship showcase"
          onEnded={() => {
            handleVideoEnd();
          }}
          onTimeUpdate={(e) => {
            if (e.target.duration > 0) {
              const progress = e.target.currentTime / e.target.duration * 100;
              setVideoProgress(progress);
              
              // Start transitioning to normal scroll when video is 75% complete
              if (progress > 75 && !videoEnded) {
                handleVideoEnd();
              }
            }
          }}
        />
      </div>
      <div className="hero-content">
        {title && <h1 className="hero-title">{title}</h1>}
        {subtitle && <p className="hero-subtitle">{subtitle}</p>}
        {ctaText && ctaLink && (
          <Link to={ctaLink} className="hero-cta">
            {ctaText}
          </Link>
        )}
      </div>
    </div>
  );
}