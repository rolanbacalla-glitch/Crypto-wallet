import React, { useMemo, useState } from 'react';
import {
  ArrowDownLeft,
  ArrowDownUp,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Search,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import {
  formatFiat,
  formatRelativeTime,
  formatTokenAmount,
  NETWORKS,
  shortenAddress,
} from '../data/initialWalletData';

type ActivityFilter = 'all' | 'send' | 'swap' | 'receive' | 'blocked' | 'revoke';

export function ActivityView() {
  const { transactions, mode, settings } = useWallet();
  const [filter, setFilter] = useState<ActivityFilter>('all');
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  return (
    <div className="space-y-6">
      {/* Filter Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#11151C] border border-white/[0.08] overflow-x-auto">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'send', label: 'Sent' },
              { id: 'swap', label: 'Swapped' },
              { id: 'receive', label: 'Received' },
              { id: 'blocked', label: 'Blocked' },
              { id: 'revoke', label: 'Revoked' },
            ] as const
          ).map((item) => {
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-ring ${
                  active
                    ? 'bg-[#1D2430] text-[#F3F5F8] border border-white/[0.1]'
                    : 'text-[#9AA4B2] hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-[#6B7686] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search counterparty or hash…"
            aria-label="Search transaction history"
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#11151C] border border-white/[0.08] text-sm text-[#F3F5F8] placeholder:text-[#6B7686] focus:border-emerald-400/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Ledger List */}
      <section className="surface-panel overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center space-y-3">
            <p className="text-sm font-medium text-[#F3F5F8]">No transactions match this filter</p>
            <p className="text-xs text-[#9AA4B2]">
              Execute a Send, Swap, or threat simulation to populate live ledger records here.
            </p>
            <button
              type="button"
              onClick={() => {
                setFilter('all');
                setQuery('');
              }}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-[#F3F5F8] transition-colors"
            >
              Show all activity
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {filtered.map((tx) => {
              const isExpanded = expandedId === tx.id;
              const isBlocked = tx.status === 'blocked';
              return (
                <div key={tx.id}>
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : tx.id)}
                    className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-white/[0.025] transition-colors focus-ring"
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
                          {isBlocked ? 'Intercepted & Blocked' : 'Confirmed'} · {NETWORKS[tx.network].shortName} ·{' '}
                          {tx.counterparty} · {formatRelativeTime(tx.timestamp)}
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
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#9AA4B2]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#9AA4B2]" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 bg-[#0C0F14] border-t border-white/[0.05] space-y-3 text-xs">
                      <p className="text-[#C7D0DC] leading-relaxed">
                        <span className="text-[#9AA4B2]">Safety audit: </span>
                        {tx.riskSummary}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono tabular-nums pt-1">
                        <div>
                          <span className="block text-[11px] text-[#6B7686]">Counterparty</span>
                          <span className="text-[#F3F5F8]">{shortenAddress(tx.counterpartyAddress)}</span>
                        </div>
                        <div>
                          <span className="block text-[11px] text-[#6B7686]">Network fee</span>
                          <span className="text-[#F3F5F8]">
                            {isBlocked
                              ? '$0.00 (Not broadcast)'
                              : `${formatFiat(tx.gasCostUsd, settings.currency)} · ${tx.gasGwei} gwei`}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[11px] text-[#6B7686]">Orderflow</span>
                          <span className="text-[#F3F5F8]">
                            {tx.mevProtected ? 'MEV Protected Relay' : 'Standard RPC'}
                          </span>
                        </div>
                      </div>

                      {mode === 'sentinel' && (
                        <div className="pt-2 border-t border-white/[0.06] space-y-2 font-mono text-[11px]">
                          <div className="flex flex-wrap gap-x-6 gap-y-1">
                            <div>
                              <span className="text-[#6B7686]">Method: </span>
                              <span className="text-sky-300">{tx.calldataMethod}</span>
                            </div>
                            <div>
                              <span className="text-[#6B7686]">Tx hash: </span>
                              <span className="text-[#9AA4B2]">{shortenAddress(tx.txHash)}</span>
                            </div>
                          </div>
                          <div>
                            <span className="block text-[#6B7686] mb-1">Calldata payload</span>
                            <p className="p-2 rounded bg-[#090B0E] border border-white/[0.06] text-[#9AA4B2] break-all">
                              {tx.calldataHex}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
