import { useEffect, useRef, useState } from 'react';

/**
 * Hook that delays heavy initialization (like Three.js scenes)
 * until the target element is visible in the viewport.
 *
 * @param {{ rootMargin?: string, threshold?: number }} options
 * @returns {{ ref: React.RefObject, isVisible: boolean }}
 */
export default function useLazyScene(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: options.rootMargin || '200px',
        threshold: options.threshold || 0,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isVisible, options.rootMargin, options.threshold]);

  return { ref, isVisible };
}
