import React from 'react';
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { APPLE_REDUCED_CROSSFADE, APPLE_SPRING_SNAPPY } from '../motion/appleMotion';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ElementType;
  accent?: 'default' | 'emerald' | 'sky';
}

interface SlidingSegmentedControlProps<T extends string> {
  /** Unique layoutId prefix so multiple segmented controls on screen animate independently. */
  layoutId: string;
  options: Array<SegmentedOption<T>>;
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  size?: 'xs' | 'sm' | 'md';
  fullWidth?: boolean;
  mono?: boolean;
  className?: string;
}

export function SlidingSegmentedControl<T extends string>({
  layoutId,
  options,
  value,
  onChange,
  ariaLabel,
  size = 'sm',
  fullWidth = false,
  mono = false,
  className = '',
}: SlidingSegmentedControlProps<T>) {
  const prefersReducedMotion = useReducedMotion();
  const transition = prefersReducedMotion ? APPLE_REDUCED_CROSSFADE : APPLE_SPRING_SNAPPY;

  const sizeClasses =
    size === 'xs'
      ? 'px-2 py-1 text-[11px] rounded-md'
      : size === 'md'
        ? 'px-3.5 py-2 text-xs rounded-lg'
        : 'px-3 py-1.5 text-xs rounded-lg';

  const trackPadding = size === 'xs' ? 'p-0.5 rounded-lg' : 'p-1';

  return (
    <LayoutGroup id={layoutId}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={`glass-control relative ${trackPadding} ${
          fullWidth ? 'grid' : 'inline-flex items-center overflow-x-auto'
        } gap-1 ${className}`}
        style={
          fullWidth
            ? { gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }
            : undefined
        }
      >
        {options.map((opt) => {
          const active = opt.value === value;
          const Icon = opt.icon;
          const accent = opt.accent || 'default';

          const activeTextClass =
            accent === 'sky'
              ? 'text-[#19C8FF] font-medium'
              : accent === 'emerald'
                ? 'text-[#2DF5C6] font-medium'
                : 'text-[#F7F8FA] font-medium';

          const thumbSurfaceClass =
            accent === 'sky'
              ? 'bg-[#19C8FF]/[0.15] border border-[#19C8FF]/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
              : accent === 'emerald'
                ? 'bg-[#2DF5C6]/[0.14] border border-[#2DF5C6]/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
                : 'glass-thumb';

          return (
            <button
              key={opt.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(opt.value)}
              className={`relative inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 focus-ring ${sizeClasses} ${
                mono ? 'font-mono tabular-nums' : 'font-medium'
              } ${active ? activeTextClass : 'text-[#8E929B] hover:text-[#F7F8FA]'}`}
            >
              {active && (
                <motion.span
                  layoutId={layoutId}
                  transition={transition}
                  className={`absolute inset-0 ${size === 'xs' ? 'rounded-md' : 'rounded-lg'} ${thumbSurfaceClass}`}
                />
              )}
              {Icon && <Icon className="w-3.5 h-3.5 relative z-10 shrink-0" />}
              <span className="relative z-10">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
