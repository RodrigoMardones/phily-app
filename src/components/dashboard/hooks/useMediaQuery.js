import { useSyncExternalStore } from 'react';

/**
 * Suscribe a una media query de forma segura para SSR usando
 * `useSyncExternalStore`: el snapshot del servidor devuelve `false`, así que el
 * primer render del cliente coincide con el del servidor y no hay parpadeo de
 * hidratación (regla `rendering-hydration-no-flicker`).
 *
 * @param {string} query - media query CSS, p.ej. '(max-width: 1023px)'.
 * @returns {boolean} si la media query coincide actualmente.
 */
export default function useMediaQuery(query) {
  const subscribe = (onStoreChange) => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return () => {};
    }
    const mql = window.matchMedia(query);
    mql.addEventListener('change', onStoreChange);
    return () => mql.removeEventListener('change', onStoreChange);
  };

  const getSnapshot = () => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  };

  // En el servidor no hay viewport: se asume "escritorio" (no coincide).
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
