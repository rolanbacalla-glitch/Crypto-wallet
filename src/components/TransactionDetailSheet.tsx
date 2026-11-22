import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowDownUp,
  ArrowUpRight,
  Check,
  Copy,
  ShieldAlert,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import {
  formatFiat,
  formatRelativeTime,
  formatTokenAmount,
  NETWORKS,
  shortenAddress,
} from '../data/initialWalletData';
import type { TransactionRecord } from '../types/wallet';
import { SlideOverSheet } from './SlideOverSheet';
import { TokenIcon } from './TokenIcon';

interface TransactionDetailSheetProps {
  transaction: TransactionRecord | null;
  onClose: () => void;
}

export function TransactionDetailSheet({ transaction, onClose }: TransactionDetailSheetProps) {
  const { mode, settings, addToast } = useWallet();
  const [copiedHash, setCopiedHash] = useState(false);

  const handleCopyHash = async () => {
    if (!transaction) return;
    try {
      await navigator.clipboard.writeText(transaction.txHash);
    } catch {
      // Clipboard may be restricted in embedded preview
    }
    setCopiedHash(true);
    addToast({
      tone: 'success',
      title: 'Transaction hash copied',
      detail: shortenAddress(transaction.txHash),
    });
    window.setTimeout(() => setCopiedHash(false), 1800);
  };

  const isBlocked = transaction?.status === 'blocked';

  return (
    <SlideOverSheet
      open={Boolean(transaction)}
      onClose={onClose}
      ariaLabel="Transaction details"
      side="right"
      maxWidthClass="sm:max-w-[480px]"
    >
      {transaction && (
        <>
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${
                  isBlocked
                    ? 'bg-red-500/[0.1] border-red-500/25 text-red-400'
                    : transaction.type === 'receive'
                      ? 'bg-emerald-500/[0.1] border-emerald-500/25 text-emerald-400'
                      : transaction.type === 'revoke'
                        ? 'bg-sky-500/[0.1] border-sky-500/25 text-sky-400'
                        : 'bg-white/[0.04] border-white/[0.08] text-[#C7D0DC]'
                }`}
              >
                {isBlocked ? (
                  <ShieldAlert className="w-4 h-4" />
                ) : transaction.type === 'receive' ? (
                  <ArrowDownLeft className="w-4 h-4" />
                ) : transaction.type === 'swap' ? (
                  <ArrowDownUp className="w-4 h-4" />
                ) : transaction.type === 'revoke' ? (
                  <ShieldCheck className="w-4 h-4" />
                ) : (
                  <ArrowUpRight className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-base font-semibold text-[#F3F5F8] truncate">
                  {transaction.title}
                </h2>
                <p className="text-xs text-[#9AA4B2] mt-0.5 truncate">
                  {isBlocked ? 'Intercepted & Blocked' : 'Confirmed'} ·{' '}
                  {NETWORKS[transaction.network].shortName} ·{' '}
                  {formatRelativeTime(transaction.timestamp)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close transaction details"
              className="w-9 h-9 rounded-lg border border-white/[0.08] hover:bg-white/[0.06] flex items-center justify-center text-[#9AA4B2] hover:text-white transition-colors focus-ring shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Risk Audit Summary */}
            <div
              className={`p-4 rounded-xl border ${
                isBlocked
                  ? 'bg-red-500/[0.08] border-red-500/25'
                  : 'bg-emerald-500/[0.06] border-emerald-500/20'
              }`}
            >
              <p
                className={`text-xs font-semibold ${
                  isBlocked ? 'text-red-300' : 'text-emerald-300'
                }`}
              >
                {isBlocked ? 'Threat blocked prior to broadcast' : 'Pre-sign safety audit passed'}
              </p>
              <p className="text-xs text-[#C7D0DC] mt-1 leading-relaxed">
                {transaction.riskSummary}
              </p>
            </div>

            {/* Balance Movements */}
            <section className="glass-recessed divide-y divide-white/[0.06]">
              <div className="px-4 py-3 text-xs font-medium text-[#9AA4B2]">
                {isBlocked ? 'Prevented balance movement' : 'Recorded balance changes'}
              </div>
              {transaction.balanceDiffs.length === 0 ? (
                <div className="px-4 py-3.5 text-xs text-sky-300 font-mono">
                  ERC-20 spending allowance reset to 0
                </div>
              ) : (
                transaction.balanceDiffs.map((diff, idx) => (
                  <div
                    key={`${diff.symbol}-${idx}`}
                    className="px-4 py-3 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <TokenIcon symbol={diff.symbol} size={30} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#F3F5F8] truncate">{diff.name}</p>
                        <p className="text-xs text-[#9AA4B2]">
                          {diff.direction === 'in' ? 'Credited' : 'Debited'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right font-mono tabular-nums shrink-0">
                      <p
                        className={`text-sm font-semibold ${
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
                      <p className="text-xs text-[#6B7686]">
                        {formatFiat(diff.usdValue, settings.currency)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </section>

            {/* Execution Metadata */}
            <section className="glass-recessed divide-y divide-white/[0.06] text-xs">
              <div className="px-4 py-3 flex items-center justify-between gap-3">
                <span className="text-[#9AA4B2]">Counterparty</span>
                <span className="text-[#F3F5F8] font-medium truncate">{transaction.counterparty}</span>
              </div>
              <div className="px-4 py-3 flex items-center justify-between gap-3">
                <span className="text-[#9AA4B2]">Address</span>
                <span className="font-mono text-[#C7D0DC]">
                  {shortenAddress(transaction.counterpartyAddress)}
                </span>
              </div>
              <div className="px-4 py-3 flex items-center justify-between gap-3">
                <span className="text-[#9AA4B2]">Network fee</span>
                <span className="font-mono tabular-nums text-[#F3F5F8]">
                  {isBlocked
                    ? '$0.00 (Canceled)'
                    : `${formatFiat(transaction.gasCostUsd, settings.currency)} · ${transaction.gasGwei} gwei`}
                </span>
              </div>
              <div className="px-4 py-3 flex items-center justify-between gap-3">
                <span className="text-[#9AA4B2]">Orderflow</span>
                <span className="text-[#F3F5F8]">
                  {transaction.mevProtected ? 'MEV Protected Relay' : 'Standard RPC'}
                </span>
              </div>
              {!isBlocked && (
                <div className="px-4 py-3 flex items-center justify-between gap-3">
                  <span className="text-[#9AA4B2]">Transaction hash</span>
                  <button
                    type="button"
                    onClick={handleCopyHash}
                    className="inline-flex items-center gap-1.5 font-mono text-[#C7D0DC] hover:text-white transition-colors"
                  >
                    <span>{shortenAddress(transaction.txHash)}</span>
                    {copiedHash ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-[#6B7686]" />
                    )}
                  </button>
                </div>
              )}
            </section>

            {/* Sentinel Calldata Inspector */}
            {mode === 'sentinel' && (
              <section className="bg-[#0D1015] border border-sky-400/20 rounded-xl p-4 space-y-2.5 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-sky-300 font-medium">Sentinel calldata trace</span>
                  <span className="text-[#6B7686]">{NETWORKS[transaction.network].shortName}</span>
                </div>
                <div>
                  <span className="text-[#6B7686]">Method: </span>
                  <span className="text-[#F3F5F8]">{transaction.calldataMethod}</span>
                </div>
                <p className="p-2.5 rounded-lg bg-[#090B0E] border border-white/[0.06] text-[#9AA4B2] break-all">
                  {transaction.calldataHex}
                </p>
              </section>
            )}
          </div>
        </>
      )}
    </SlideOverSheet>
  );
}
