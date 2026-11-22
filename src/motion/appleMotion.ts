import { useEffect, useState } from 'react';
import type { Transition } from 'framer-motion';

/**
 * Apple HIG / WWDC23 Spring Motion Tokens
 * Uses Apple's perceptual `duration` + `bounce` spring model for organic,
 * interruptible, velocity-preserving transitions.
 */

// Critically damped (.smooth): sheets, drawers, pop-out windows — physical weight, zero rubbery wobble.
export const APPLE_SPRING_SHEET: Transition = {
  type: 'spring',
  duration: 0.44,
  bounce: 0,
};

// Navigation push/pop (UINavigationController style): crisp parallax slide between form and simulation.
export const APPLE_SPRING_NAV_PUSH: Transition = {
  type: 'spring',
  duration: 0.38,
  bounce: 0,
};

// Snappy control spring (.snappy): segmented controls, mode switcher, toast notifications.
export const APPLE_SPRING_SNAPPY: Transition = {
  type: 'spring',
  duration: 0.28,
  bounce: 0.08,
};

// Classic iOS sheet backdrop deceleration curve.
export const APPLE_BACKDROP_EASE: Transition = {
  duration: 0.28,
  ease: [0.32, 0.72, 0, 1],
};

// Accessibility fallback for prefers-reduced-motion (HIG: Prefer Cross-Fade Transitions).
export const APPLE_REDUCED_CROSSFADE: Transition = {
  duration: 0.18,
  ease: 'easeOut',
};

/**
 * Matches mobile viewport (< 640px) so pop-out sheets adapt from desktop right slide-over
 * to native iOS bottom-sheet presentation with grabber handle & swipe-down dismiss.
 */
export function useIsMobileViewport(breakpointPx = 640): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpointPx : false
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    const update = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    update(mq);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [breakpointPx]);

  return isMobile;
}
