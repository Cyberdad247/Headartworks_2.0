import React from 'react';

/**
 * DarkModeToggle component for switching between light and dark mode
 * @param {{
 *   darkMode: boolean;
 *   toggleDarkMode: () => void;
 * }}
 */
export function DarkModeToggle({ darkMode, toggleDarkMode }) {
  return (
    <button 
      className={`dark-mode-toggle ${darkMode ? 'dark' : 'light'}`}
      onClick={toggleDarkMode}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
}