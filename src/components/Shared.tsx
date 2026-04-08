import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
export type AppState = 'auth' | 'onboarding' | 'dashboard';
export type UserPersona = 'normal' | 'advanced';

// --- Components ---

export const GlassCard = ({ children, className, glow = false, persona = 'normal' }: { children: React.ReactNode, className?: string, glow?: boolean, persona?: UserPersona }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={cn(
      "glass relative overflow-hidden rounded-2xl md:rounded-3xl p-4 md:p-6 transition-all duration-500",
      glow && (persona === 'normal' ? "after:absolute after:inset-0 after:-z-10 after:bg-lime-500/10 after:blur-3xl" : "after:absolute after:inset-0 after:-z-10 after:bg-blue-500/10 after:blur-3xl"),
      className
    )}
  >
    {children}
  </motion.div>
);

export const CoinIcon = ({ symbol, size = 32 }: { symbol: string, size?: number }) => {
  const icons: Record<string, { color: string, path: string }> = {
    ETH: {
      color: '#627EEA',
      path: 'M12 2L4.5 14.5L12 19L19.5 14.5L12 2ZM12 4.13L17.74 13.5L12 17L6.26 13.5L12 4.13ZM12 19.5L4.5 15L12 22L19.5 15L12 19.5Z'
    },
    USDC: {
      color: '#2775CA',
      path: 'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM10.5 14.5H13.5V16H10.5V14.5ZM10.5 8H13.5V9.5H10.5V8ZM9 10C9 9.45 9.45 9 10 9H14C14.55 9 15 9.45 15 10V11H13.5V10.5H10.5V11H9V10ZM9 13V12H15V13C15 13.55 14.55 14 14 14H10C9.45 14 9 13.55 9 13ZM9 14.5C9 14.5 9 14.5 9 14.5V15.5C9 16.05 9.45 16.5 10 16.5H14C14.55 16.5 15 16.05 15 15.5V14.5H13.5V15H10.5V14.5H9Z'
    },
    WBTC: {
      color: '#F7931A',
      path: 'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.5 13.5C16.5 15.16 15.16 16.5 13.5 16.5H9V7.5H13C14.38 7.5 15.5 8.62 15.5 10C15.5 10.97 14.95 11.82 14.15 12.25C15.53 12.65 16.5 13.9 16.5 15.25L16.5 13.5ZM10.5 9H13C13.55 9 14 9.45 14 10C14 10.55 13.55 11 13 11H10.5V9ZM10.5 12.5H14C14.55 12.5 15 12.95 15 13.5C15 14.05 14.55 14.5 14 14.5H10.5V12.5Z'
    },
    rETH: {
      color: '#FF4D4D',
      path: 'M12 2L15.39 6.06L19.5 7.5L16.06 10.89L17.5 15L13.44 11.61L12 16L10.56 11.61L6.5 15L7.94 10.89L4.5 7.5L8.61 6.06L12 2Z'
    }
  };

  const icon = icons[symbol] || icons['ETH'];

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={icon.path} fill={icon.color} />
    </svg>
  );
};

export const SidebarItem = ({ icon: Icon, label, active = false, onClick, persona = 'normal' }: { icon: any, label: string, active?: boolean, onClick?: () => void, persona?: UserPersona }) => (
  <div
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group",
      active ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"
    )}>
    <Icon className={cn("w-5 h-5", active ? (persona === 'normal' ? "text-lime-400" : "text-blue-400") : (persona === 'normal' ? "group-hover:text-lime-400" : "group-hover:text-blue-400"))} />
    <span className="font-medium text-sm">{label}</span>
  </div>
);
