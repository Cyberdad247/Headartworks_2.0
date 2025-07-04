# Video Files

This directory contains video files used in the website.

## Current Videos
- `hero-video.mp4` - Main hero section video for dark mode
- `hero-video-light.mp4` - Hero section video for light mode

## Instructions
To update the hero video:
1. Replace the existing `hero-video.mp4` with your new video file
2. Make sure to keep the same filename to maintain compatibility with the existing code
3. Recommended video specs: MP4 format, 1920x1080 resolution, 10-30 seconds duration

The Hero component already has text overlay functionality built-in with the following default text:
- Title: "Welcome to Head Art Works"
- Subtitle: "Where tradition meets innovation. Our passion for quality and craftsmanship is evident in every product we create. Using only the finest natural ingredients."

These texts can be customized by passing props to the Hero component in `_index.jsx`.

## Last Update
The hero videos have been successfully placed in this directory. Both dark mode (`hero-video.mp4`) and light mode (`hero-video-light.mp4`) videos are now working correctly with the Hero component, which displays them with a full-width background and text overlay. The VideoContext component automatically selects the appropriate video based on the current theme mode.