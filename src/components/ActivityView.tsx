import React, { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDownLeft,
  ArrowDownUp,
  ArrowUpRight,
  ChevronRight,
  Search,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import {
  formatRelativeTime,
  formatTokenAmount,
  NETWORKS,
} from '../data/initialWalletData';
import { APPLE_REDUCED_CROSSFADE, APPLE_SPRING_NAV_PUSH } from '../motion/appleMotion';
import { SlidingSegmentedControl, type SegmentedOption } from './SlidingSegmentedControl';

type ActivityFilter = 'all' | 'send' | 'swap' | 'receive' | 'blocked' | 'revoke';

const ACTIVITY_OPTIONS: Array<SegmentedOption<ActivityFilter>> = [
  { value: 'all', label: 'All' },
  { value: 'send', label: 'Sent' },
  { value: 'swap', label: 'Swapped' },
  { value: 'receive', label: 'Received' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'revoke', label: 'Revoked' },
];

const ACTIVITY_ORDER: Record<ActivityFilter, number> = {
  all: 0,
  send: 1,
  swap: 2,
  receive: 3,
  blocked: 4,
  revoke: 5,
};

export function ActivityView() {
  const { transactions, openTransactionDetail } = useWallet();
  const prefersReducedMotion = useReducedMotion();
  const [filter, setFilter] = useState<ActivityFilter>('all');
  const [slideDirection, setSlideDirection] = useState<number>(1);
  const prevFilterRef = useRef<ActivityFilter>('all');
  const [query, setQuery] = useState('');

  const handleFilterChange = (next: ActivityFilter) => {
    if (next === prevFilterRef.current) return;
    setSlideDirection(ACTIVITY_ORDER[next] > ACTIVITY_ORDER[prevFilterRef.current] ? 1 : -1);
    prevFilterRef.current = next;
    setFilter(next);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions
      .filter((tx) => {
        if (filter === 'all') return true;
        if (filter === 'blocked') return tx.status === 'blocked';
        return tx.type === filter && tx.status !== 'blocked';
      })
      .filter((tx) =>
        q
          ? tx.title.toLowerCase().includes(q) ||
            tx.counterparty.toLowerCase().includes(q) ||
            tx.counterpartyAddress.toLowerCase().includes(q) ||
            tx.txHash.toLowerCase().includes(q)
          : true
      );
  }, [filter, query, transactions]);

  const panelTransition = prefersReducedMotion ? APPLE_REDUCED_CROSSFADE : APPLE_SPRING_NAV_PUSH;

  return (
    <div className="space-y-6">
      {/* Filter Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <SlidingSegmentedControl
          layoutId="activityFilterThumb"
          options={ACTIVITY_OPTIONS}
          value={filter}
          onChange={handleFilterChange}
          ariaLabel="Filter activity by transaction type"
        />

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-[#6E7A8A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search counterparty or hash…"
            aria-label="Search transaction history"
            className="w-full h-10 pl-9 pr-3 glass-control text-sm text-[#F4F7FB] placeholder:text-[#6E7A8A] focus:border-emerald-400/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Ledger List with Directional Sliding Transition */}
      <section className="surface-panel overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={filter}
            initial={prefersReducedMotion ? { opacity: 0 } : { x: slideDirection * 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { x: slideDirection * -24, opacity: 0 }}
            transition={panelTransition}
            style={{ willChange: 'transform, opacity' }}
          >
            {filtered.length === 0 ? (
              <div className="px-6 py-16 text-center space-y-3">
                <p className="text-sm font-medium text-[#F3F5F8]">No transactions match this filter</p>
                <p className="text-xs text-[#9AA4B2]">
                  Execute a Send, Swap, or threat simulation to populate live ledger records here.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    handleFilterChange('all');
                    setQuery('');
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-medium glass-btn text-[#F3F5F8]"
                >
                  Show all activity
                </button>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.06]">
                {filtered.map((tx) => {
                  const isBlocked = tx.status === 'blocked';
                  return (
                    <button
                      key={tx.id}
                      type="button"
                      onClick={() => openTransactionDetail(tx)}
                      className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-white/[0.025] transition-colors focus-ring group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${
                            isBlocked
                              ? 'bg-red-500/[0.1] border-red-500/25 text-red-400'
                              : tx.type === 'receive'
                                ? 'bg-emerald-500/[0.1] border-emerald-500/25 text-emerald-400'
                                : tx.type === 'revoke'
                                  ? 'bg-sky-500/[0.1] border-sky-500/25 text-sky-400'
                                  : 'bg-white/[0.04] border-white/[0.08] text-[#C7D0DC]'
                          }`}
                        >
                          {isBlocked ? (
                            <ShieldAlert className="w-4 h-4" />
                          ) : tx.type === 'receive' ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : tx.type === 'swap' ? (
                            <ArrowDownUp className="w-4 h-4" />
                          ) : tx.type === 'revoke' ? (
                            <ShieldCheck className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#F3F5F8] truncate">{tx.title}</p>
                          <p className="text-xs text-[#9AA4B2] truncate mt-0.5">
                            {isBlocked ? 'Intercepted & Blocked' : 'Confirmed'} ·{' '}
                            {NETWORKS[tx.network].shortName} · {tx.counterparty} ·{' '}
                            {formatRelativeTime(tx.timestamp)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right font-mono tabular-nums">
                          {tx.balanceDiffs.length > 0 ? (
                            tx.balanceDiffs.map((diff, idx) => (
                              <p
                                key={idx}
                                className={`text-xs font-medium ${
                                  isBlocked
                                    ? 'text-red-400 line-through'
                                    : diff.direction === 'in'
                                      ? 'text-emerald-400'
                                      : 'text-[#F3F5F8]'
                                }`}
                              >
                                {diff.direction === 'in' ? '+' : '-'}
                                {formatTokenAmount(Math.abs(diff.delta))} {diff.symbol}
                              </p>
                            ))
                          ) : (
                            <p className="text-xs text-sky-400">Allowance = 0</p>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#6B7686] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
