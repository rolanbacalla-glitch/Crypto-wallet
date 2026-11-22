import React, { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'framer-motion';
import {
  APPLE_BACKDROP_EASE,
  APPLE_REDUCED_CROSSFADE,
  APPLE_SPRING_SHEET,
  useIsMobileViewport,
} from '../motion/appleMotion';

export interface SlideOverSheetProps {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  /** Desktop edge; on mobile (<640px), 'right' adapts into an iOS bottom sheet while 'left' stays a left edge drawer. */
  side?: 'right' | 'left';
  maxWidthClass?: string;
  zIndexClass?: string;
  children: React.ReactNode;
}

const DISMISS_DISTANCE_PX = 100;
const DISMISS_VELOCITY_PX = 500;

export function SlideOverSheet({
  open,
  onClose,
  ariaLabel,
  side = 'right',
  maxWidthClass = 'sm:max-w-[520px]',
  zIndexClass = 'z-50',
  children,
}: SlideOverSheetProps) {
  const isMobile = useIsMobileViewport(640);
  const prefersReducedMotion = useReducedMotion();

  // iOS presentation: action pop-outs rise as bottom sheets on mobile; nav drawer slides from left edge.
  const isBottomSheet = isMobile && side === 'right';

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isBottomSheet) {
      if (info.offset.y > DISMISS_DISTANCE_PX || info.velocity.y > DISMISS_VELOCITY_PX) {
        onClose();
      }
    } else if (side === 'right') {
      if (info.offset.x > DISMISS_DISTANCE_PX || info.velocity.x > DISMISS_VELOCITY_PX) {
        onClose();
      }
    } else {
      if (info.offset.x < -DISMISS_DISTANCE_PX || info.velocity.x < -DISMISS_VELOCITY_PX) {
        onClose();
      }
    }
  };

  const sheetVariants = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : isBottomSheet
      ? {
          initial: { y: '100%' },
          animate: { y: 0 },
          exit: { y: '100%' },
        }
      : side === 'right'
        ? {
            initial: { x: '100%' },
            animate: { x: 0 },
            exit: { x: '100%' },
          }
        : {
            initial: { x: '-100%' },
            animate: { x: 0 },
            exit: { x: '-100%' },
          };

  const sheetTransition = prefersReducedMotion ? APPLE_REDUCED_CROSSFADE : APPLE_SPRING_SHEET;

  const containerAlignment = isBottomSheet
    ? 'items-end justify-center'
    : side === 'right'
      ? 'items-stretch justify-end'
      : 'items-stretch justify-start';

  const panelClasses = isBottomSheet
    ? 'w-full max-h-[92dvh] rounded-t-[24px] border-t border-x border-white/[0.15] glass-sheet'
    : side === 'right'
      ? `w-full ${maxWidthClass} h-full border-l border-white/[0.14] glass-sheet`
      : `w-64 max-w-[82vw] h-full border-r border-white/[0.14] glass-sheet`;

  return (
    <AnimatePresence>
      {open && (
        <div
          className={`fixed inset-0 ${zIndexClass} flex ${containerAlignment}`}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
        >
          {/* Dimmed Scrim with iOS Deceleration Curve */}
          <motion.div
            key="sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={prefersReducedMotion ? APPLE_REDUCED_CROSSFADE : APPLE_BACKDROP_EASE}
            onClick={onClose}
            className="fixed inset-0 bg-black/55 backdrop-blur-[6px]"
          />

          {/* Spring Slide-In Liquid Glass Surface with Velocity-Aware Gesture Dismiss */}
          <motion.div
            key="sheet-panel"
            initial={sheetVariants.initial}
            animate={sheetVariants.animate}
            exit={sheetVariants.exit}
            transition={sheetTransition}
            drag={prefersReducedMotion ? false : isBottomSheet ? 'y' : 'x'}
            dragConstraints={
              isBottomSheet
                ? { top: 0, bottom: 0 }
                : side === 'right'
                  ? { left: 0, right: 0 }
                  : { left: 0, right: 0 }
            }
            dragElastic={
              isBottomSheet
                ? { top: 0.04, bottom: 0.35 }
                : side === 'right'
                  ? { left: 0.03, right: 0.25 }
                  : { left: 0.25, right: 0.03 }
            }
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            style={{ willChange: 'transform' }}
            className={`relative z-10 flex flex-col overflow-hidden ${panelClasses}`}
          >
            {/* Native iOS Grabber Indicator on Mobile Bottom Sheets */}
            {isBottomSheet && (
              <div
                className="pt-2.5 pb-1 flex justify-center shrink-0 cursor-grab active:cursor-grabbing"
                aria-hidden="true"
              >
                <div className="w-10 h-1 rounded-full bg-white/25" />
              </div>
            )}

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
