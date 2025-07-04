export const scrollObserverOptions = {
  rootMargin: '100px',
  threshold: 0.1,
  trackVisibility: true,
  delay: 100,
};

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}