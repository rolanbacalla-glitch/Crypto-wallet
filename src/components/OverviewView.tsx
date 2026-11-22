import React, { useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDownLeft,
  ArrowDownUp,
  ArrowRight,
  ArrowUpRight,
  Download,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import {
  formatFiat,
  formatRelativeTime,
  formatTokenAmount,
  NETWORKS,
  PORTFOLIO_HISTORY_SERIES,
} from '../data/initialWalletData';
import { APPLE_REDUCED_CROSSFADE, APPLE_SPRING_NAV_PUSH } from '../motion/appleMotion';
import { SlidingSegmentedControl, type SegmentedOption } from './SlidingSegmentedControl';
import { TokenIcon } from './TokenIcon';

type TimeRange = '7D' | '30D' | '90D';

const RANGE_OPTIONS: Array<SegmentedOption<TimeRange>> = [
  { value: '7D', label: '7D' },
  { value: '30D', label: '30D' },
  { value: '90D', label: '90D' },
];

const RANGE_ORDER: Record<TimeRange, number> = { '7D': 0, '30D': 1, '90D': 2 };

export function OverviewView() {
  const {
    mode,
    assets,
    transactions,
    settings,
    totalPortfolioUsd,
    change24hUsd,
    change24hPct,
    todaySpentUsd,
    atRiskApprovalsCount,
    blockedThreatsCount,
    openActionDrawer,
    openTransactionDetail,
    setActiveTab,
  } = useWallet();

  const prefersReducedMotion = useReducedMotion();
  const [range, setRange] = useState<TimeRange>('30D');
  const [rangeDir, setRangeDir] = useState<number>(1);
  const prevRangeRef = useRef<TimeRange>('30D');

  const handleRangeChange = (next: TimeRange) => {
    if (next === prevRangeRef.current) return;
    setRangeDir(RANGE_ORDER[next] > RANGE_ORDER[prevRangeRef.current] ? 1 : -1);
    prevRangeRef.current = next;
    setRange(next);
  };

  // Anchor the sparkline's final point to the live computed portfolio total
  const chartPoints = useMemo(() => {
    const baseSeries = PORTFOLIO_HISTORY_SERIES[range];
    const lastBase = baseSeries[baseSeries.length - 1] || 1;
    const scale = totalPortfolioUsd / lastBase;
    return baseSeries.map((v, i) => (i === baseSeries.length - 1 ? totalPortfolioUsd : v * scale));
  }, [range, totalPortfolioUsd]);

  const sparkline = useMemo(() => {
    const w = 480;
    const h = 92;
    const padY = 10;
    const min = Math.min(...chartPoints);
    const max = Math.max(...chartPoints);
    const span = Math.max(1, max - min);

    const coords = chartPoints.map((val, idx) => {
      const x = (idx / Math.max(1, chartPoints.length - 1)) * w;
      const y = h - padY - ((val - min) / span) * (h - padY * 2);
      return { x, y };
    });

    const linePath = coords
      .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
      .join(' ');
    const areaPath = `${linePath} L ${w} ${h} L 0 ${h} Z`;
    return { linePath, areaPath, width: w, height: h };
  }, [chartPoints]);

  const topAssets = useMemo(
    () =>
      [...assets]
        .sort((a, b) => b.balance * b.priceUsd - a.balance * a.priceUsd)
        .slice(0, 5),
    [assets]
  );

  const recentTx = transactions.slice(0, 5);
  const spendProgressPct = Math.min(100, (todaySpentUsd / Math.max(1, settings.dailySpendLimitUsd)) * 100);
  const isPositive24h = change24hUsd >= 0;

  return (
    <div className="space-y-6">
      {/* Portfolio Hero + Action Bar */}
      <section className="surface-panel p-6 md:p-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#8E929B]">
                <span>Total vault balance</span>
                <span aria-hidden="true">·</span>
                <span>{assets.length} assets across 4 networks</span>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight font-mono tabular-nums text-[#F7F8FA]">
                  {formatFiat(totalPortfolioUsd, settings.currency)}
                </h2>
                <span
                  className={`font-mono tabular-nums text-sm font-medium ${
                    isPositive24h ? 'text-[#2DF5C6]' : 'text-[#FF5B5B]'
                  }`}
                >
                  {isPositive24h ? '+' : ''}
                  {formatFiat(change24hUsd, settings.currency)} ({isPositive24h ? '+' : ''}
                  {change24hPct.toFixed(2)}% · 24h)
                </span>
              </div>
            </div>

            {/* Primary Transaction Actions (Crisp Pure-White Primary CTA + Dark Graphite Secondaries) */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => openActionDrawer('send')}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 btn-primary-white focus-ring"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Send</span>
              </button>
              <button
                type="button"
                onClick={() => openActionDrawer('swap')}
                className="px-4 py-2.5 rounded-xl text-sm font-medium glass-btn text-[#F7F8FA] inline-flex items-center gap-2 whitespace-nowrap shrink-0 focus-ring"
              >
                <ArrowDownUp className="w-4 h-4 text-[#2DF5C6]" />
                <span>Swap</span>
              </button>
              <button
                type="button"
                onClick={() => openActionDrawer('receive')}
                className="px-4 py-2.5 rounded-xl text-sm font-medium glass-btn text-[#F7F8FA] inline-flex items-center gap-2 whitespace-nowrap shrink-0 focus-ring"
              >
                <Download className="w-4 h-4 text-[#19C8FF]" />
                <span>Receive</span>
              </button>
            </div>
          </div>

          {/* Equity Curve */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8E929B]">Portfolio trend</span>
              <SlidingSegmentedControl
                layoutId="overviewRangeThumb"
                options={RANGE_OPTIONS}
                value={range}
                onChange={handleRangeChange}
                ariaLabel="Portfolio trend timeframe"
                size="xs"
                mono
              />
            </div>
            <div className="w-full h-[92px] overflow-hidden relative">
              <motion.div
                key={range}
                initial={prefersReducedMotion ? { opacity: 0 } : { x: rangeDir * 18, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={prefersReducedMotion ? APPLE_REDUCED_CROSSFADE : APPLE_SPRING_NAV_PUSH}
                className="w-full h-full"
              >
                <svg
                  viewBox={`0 0 ${sparkline.width} ${sparkline.height}`}
                  preserveAspectRatio="none"
                  className="w-full h-full"
                  role="img"
                  aria-label={`${range} portfolio performance trend`}
                >
                  <defs>
                    <linearGradient id={`nestPortfolioArea-${range}`} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={mode === 'sentinel' ? '#19C8FF' : '#2DF5C6'}
                        stopOpacity="0.24"
                      />
                      <stop
                        offset="100%"
                        stopColor={mode === 'sentinel' ? '#19C8FF' : '#2DF5C6'}
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <path d={sparkline.areaPath} fill={`url(#nestPortfolioArea-${range})`} />
                  <path
                    d={sparkline.linePath}
                    fill="none"
                    stroke={mode === 'sentinel' ? '#19C8FF' : '#2DF5C6'}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Column Operational Safety Strip with Signature Vivid Crypto Icon Tiles */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="surface-panel p-4 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-xs text-[#8E929B]">
            <span>Pre-sign shield</span>
            <span className="w-7 h-7 rounded-lg bg-[#2DF5C6] text-[#050507] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
            </span>
          </div>
          <div>
            <p className="font-mono tabular-nums text-lg font-semibold text-[#F7F8FA]">
              {blockedThreatsCount} {blockedThreatsCount === 1 ? 'threat' : 'threats'} blocked
            </p>
            <p className="text-xs text-[#8E929B] mt-0.5">
              {mode === 'sentinel'
                ? 'Calldata & Permit2 heuristics armed'
                : 'Simulates every Send and Swap'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('approvals')}
          className="surface-panel glass-panel-interactive p-4 flex flex-col justify-between gap-3 text-left focus-ring"
        >
          <div className="flex items-center justify-between text-xs text-[#8E929B]">
            <span>Token approvals</span>
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                atRiskApprovalsCount > 0
                  ? 'bg-[#FFB547] text-[#050507]'
                  : 'bg-[#2DF5C6] text-[#050507]'
              }`}
            >
              <ShieldAlert className="w-4 h-4 stroke-[2.2]" />
            </span>
          </div>
          <div>
            <p
              className={`font-mono tabular-nums text-lg font-semibold ${
                atRiskApprovalsCount > 0 ? 'text-[#FFB547]' : 'text-[#2DF5C6]'
              }`}
            >
              {atRiskApprovalsCount > 0 ? `${atRiskApprovalsCount} need review` : 'All allowances clean'}
            </p>
            <p className="text-xs text-[#8E929B] mt-0.5">
              {atRiskApprovalsCount > 0 ? 'Inspect & revoke unlimited spenders' : 'Zero unverified spenders active'}
            </p>
          </div>
        </button>

        <div className="surface-panel p-4 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-xs text-[#8E929B]">
            <span>Daily spend guardrail</span>
            <span className="font-mono tabular-nums text-xs font-semibold text-[#9A7FFF]">
              {spendProgressPct.toFixed(0)}%
            </span>
          </div>
          <div className="space-y-2">
            <p className="font-mono tabular-nums text-lg font-semibold text-[#F7F8FA]">
              {formatFiat(todaySpentUsd, settings.currency)}{' '}
              <span className="text-xs font-normal text-[#8E929B]">
                / {formatFiat(settings.dailySpendLimitUsd, settings.currency, true)}
              </span>
            </p>
            <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  spendProgressPct > 85 ? 'bg-[#FFB547]' : 'bg-[#7C5CFF]'
                }`}
                style={{ width: `${Math.max(4, spendProgressPct)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="surface-panel p-4 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-xs text-[#8E929B]">
            <span>{mode === 'sentinel' ? 'Orderflow & L1 gas' : 'MEV protection'}</span>
            <span className="px-2 py-0.5 rounded-md bg-[#19C8FF]/[0.14] text-xs font-mono font-medium text-[#19C8FF]">
              {NETWORKS.ethereum.baseFeeGwei} gwei
            </span>
          </div>
          <div>
            <p className="text-lg font-semibold text-[#F7F8FA]">
              {settings.defaultMevRelay === 'flashbots'
                ? 'Flashbots Protect'
                : settings.defaultMevRelay === 'mev-blocker'
                  ? 'MEV Blocker'
                  : 'Public Mempool'}
            </p>
            <p className="text-xs text-[#8E929B] mt-0.5">
              {settings.defaultMevRelay === 'public'
                ? 'Private shielding disabled in Settings'
                : 'Private RPC shields swaps from sandwich bots'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Split: Top Holdings + Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Top Holdings Table */}
        <section className="xl:col-span-7 surface-panel overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.07] flex items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-base font-semibold text-[#F7F8FA]">Top holdings</h3>
              <p className="text-xs text-[#8E929B] mt-0.5">
                Select any asset to simulate a Send or Swap
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('assets')}
              className="text-xs font-medium text-[#8E929B] hover:text-white inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 focus-ring rounded px-1.5 py-1"
            >
              <span>All assets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] text-[11px] font-medium text-[#5C606A]">
                  <th className="py-2.5 pl-5 pr-3">Asset</th>
                  <th className="py-2.5 px-3 text-right">Balance</th>
                  <th className="py-2.5 px-3 text-right">Value</th>
                  <th className="py-2.5 pl-3 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {topAssets.map((asset) => {
                  const valueUsd = asset.balance * asset.priceUsd;
                  const net = NETWORKS[asset.network];
                  return (
                    <tr
                      key={asset.id}
                      className="hover:bg-white/[0.025] transition-colors group"
                    >
                      <td className="py-3 pl-5 pr-3">
                        <div className="flex items-center gap-3">
                          <TokenIcon symbol={asset.symbol} size={32} />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[#F7F8FA] truncate">
                              {asset.name}
                            </p>
                            <p className="text-xs text-[#8E929B] truncate">
                              {asset.symbol} · {net.shortName}
                              {mode === 'sentinel' && asset.stakingApr ? ` · ${asset.stakingApr}% APR` : ''}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-xs text-[#D2D5DC] whitespace-nowrap">
                        {formatTokenAmount(asset.balance)} {asset.symbol}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                        <p className="text-sm font-medium text-[#F7F8FA]">
                          {formatFiat(valueUsd, settings.currency)}
                        </p>
                        <p
                          className={`text-[11px] ${
                            asset.change24hPct >= 0 ? 'text-[#2DF5C6]' : 'text-[#FF5B5B]'
                          }`}
                        >
                          {asset.change24hPct >= 0 ? '+' : ''}
                          {asset.change24hPct.toFixed(2)}%
                        </p>
                      </td>
                      <td className="py-3 pl-3 pr-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openActionDrawer('send', asset.id)}
                            className="px-2.5 py-1 rounded-md text-xs font-medium glass-btn text-[#F7F8FA]"
                          >
                            Send
                          </button>
                          <button
                            type="button"
                            onClick={() => openActionDrawer('swap', asset.id)}
                            className="px-2.5 py-1 rounded-md text-xs font-medium glass-btn text-[#D2D5DC]"
                          >
                            Swap
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Activity Feed */}
        <section className="xl:col-span-5 surface-panel overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.07] flex items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-base font-semibold text-[#F7F8FA]">Recent activity</h3>
              <p className="text-xs text-[#8E929B] mt-0.5">
                Confirmed transfers and intercepted threats
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('activity')}
              className="text-xs font-medium text-[#8E929B] hover:text-white inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 focus-ring rounded px-1.5 py-1"
            >
              <span>Full log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {recentTx.map((tx) => {
              const isBlocked = tx.status === 'blocked';
              const primaryDiff = tx.balanceDiffs[0];
              return (
                <button
                  key={tx.id}
                  type="button"
                  onClick={() => openTransactionDetail(tx)}
                  className="w-full px-5 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-white/[0.025] transition-colors focus-ring"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
                        isBlocked
                          ? 'bg-[#FF5B5B]/[0.12] border-[#FF5B5B]/30 text-[#FF5B5B]'
                          : tx.type === 'receive'
                            ? 'bg-[#2DF5C6]/[0.12] border-[#2DF5C6]/30 text-[#2DF5C6]'
                            : 'bg-[#0B0C0E] border-white/[0.08] text-[#D2D5DC]'
                      }`}
                    >
                      {isBlocked ? (
                        <ShieldAlert className="w-4 h-4" />
                      ) : tx.type === 'receive' ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : tx.type === 'swap' ? (
                        <ArrowDownUp className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#F7F8FA] truncate">{tx.title}</p>
                      <p className="text-xs text-[#8E929B] truncate">
                        {isBlocked ? 'Blocked by Nest' : NETWORKS[tx.network].shortName} ·{' '}
                        {formatRelativeTime(tx.timestamp)}
                        {mode === 'sentinel' && tx.mevProtected ? ' · MEV shielded' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-mono tabular-nums shrink-0">
                    {primaryDiff ? (
                      <p
                        className={`text-xs font-medium ${
                          isBlocked
                            ? 'text-[#FF5B5B] line-through'
                            : primaryDiff.direction === 'in'
                              ? 'text-[#2DF5C6]'
                              : 'text-[#F7F8FA]'
                        }`}
                      >
                        {primaryDiff.direction === 'in' ? '+' : '-'}
                        {formatTokenAmount(Math.abs(primaryDiff.delta))} {primaryDiff.symbol}
                      </p>
                    ) : (
                      <p className="text-xs text-[#19C8FF]">Revoked</p>
                    )}
                    <p className="text-[11px] text-[#5C606A]">
                      {isBlocked ? 'Protected' : formatFiat(primaryDiff?.usdValue || 0, settings.currency)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
