import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Tracks the user's `prefers-reduced-motion` setting. Returns `false` on the
 * server and first client render, then updates from `matchMedia` after mount
 * and on changes. Used to suppress SVG SMIL animations (which CSS media queries
 * cannot disable) for users who request reduced motion (WCAG 2.3.3).
 */
export default function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (event) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}
