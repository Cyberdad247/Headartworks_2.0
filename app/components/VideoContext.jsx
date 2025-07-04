import {createContext, useContext, useState, useEffect} from 'react';

// Create a context to manage video state, header visibility, and dark mode
const VideoContext = createContext();

/**
 * Provider component for video state management
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export function VideoProvider({children}) {
  const [videoEnded, setVideoEnded] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [currentVideoSrc, setCurrentVideoSrc] = useState('/videos/hero-video-light.mp4');
  
  // Function to update video state when it ends
  const handleVideoEnd = () => {
    setVideoEnded(true);
    setHeaderVisible(true);
    
    // Ensure smooth transition by adding a small delay
    setTimeout(() => {
      document.body.classList.add('video-completed');
    }, 300);
  };
  
  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      
      // Apply dark mode class to body
      if (newMode) {
        document.body.classList.add('dark-mode');
        // Switch to dark mode video and start playing
        setCurrentVideoSrc('/videos/hero-video.mp4');
        setVideoPlaying(true);
      } else {
        document.body.classList.remove('dark-mode');
        // Switch to light mode video
        setCurrentVideoSrc('/videos/hero-video-light.mp4');
        setVideoPlaying(true);
      }
      
      return newMode;
    });
  };
  
  // Function to update scroll position
  const updateScrollPosition = (position) => {
    setScrollPosition(position);
  };
  
  // Setup scroll event listener at the provider level
  useEffect(() => {
    const handleScroll = () => {
      updateScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <VideoContext.Provider 
      value={{
        videoEnded,
        scrollPosition,
        headerVisible,
        darkMode,
        videoPlaying,
        currentVideoSrc,
        handleVideoEnd,
        updateScrollPosition,
        toggleDarkMode
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

// Custom hook to use the video context
export function useVideoContext() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideoContext must be used within a VideoProvider');
  }
  return context;
}