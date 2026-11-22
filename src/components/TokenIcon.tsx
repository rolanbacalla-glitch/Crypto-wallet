import React from 'react';

interface TokenIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

const TOKEN_META: Record<string, { bg: string; fg: string }> = {
  ETH: { bg: '#1D253D', fg: '#8EA2F6' },
  USDC: { bg: '#13263C', fg: '#60A5FA' },
  WBTC: { bg: '#302114', fg: '#F59E0B' },
  rETH: { bg: '#321B1B', fg: '#F87171' },
  ARB: { bg: '#122738', fg: '#38BDF8' },
  UNI: { bg: '#32182A', fg: '#F472B6' },
};

export function TokenIcon({ symbol, size = 34, className = '' }: TokenIconProps) {
  const palette = TOKEN_META[symbol] || { bg: '#202227', fg: '#8E929B' };

  return (
    <div
      style={{ width: size, height: size, backgroundColor: palette.bg, color: palette.fg }}
      className={`rounded-lg border border-white/[0.08] flex items-center justify-center shrink-0 select-none ${className}`}
      aria-hidden="true"
    >
      {symbol === 'ETH' && (
        <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L5.5 12.2L12 16L18.5 12.2L12 2ZM12 17.5L5.5 13.7L12 22L18.5 13.7L12 17.5Z" />
        </svg>
      )}
      {symbol === 'USDC' && (
        <span className="font-mono text-[11px] font-semibold tracking-tight">$</span>
      )}
      {symbol === 'WBTC' && (
        <span className="font-mono text-[11px] font-semibold tracking-tight">₿</span>
      )}
      {symbol === 'rETH' && (
        <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.5L15.2 8.2L21.5 9.5L17 14L18.1 20.5L12 17.4L5.9 20.5L7 14L2.5 9.5L8.8 8.2L12 2.5Z" />
        </svg>
      )}
      {symbol !== 'ETH' && symbol !== 'USDC' && symbol !== 'WBTC' && symbol !== 'rETH' && (
        <span className="font-mono text-[10px] font-semibold uppercase tracking-tight">
          {symbol.slice(0, 3)}
        </span>
      )}
    </div>
  );
}
