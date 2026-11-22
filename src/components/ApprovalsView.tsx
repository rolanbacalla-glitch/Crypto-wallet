import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { formatFiat, NETWORKS, shortenAddress } from '../data/initialWalletData';
import { TokenIcon } from './TokenIcon';

export function ApprovalsView() {
  const { approvals, mode, settings, revokeApproval } = useWallet();
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const totalExposedUsd = useMemo(
    () => approvals.reduce((sum, a) => sum + a.exposureUsd, 0),
    [approvals]
  );
  const unlimitedCount = useMemo(
    () => approvals.filter((a) => a.isUnlimited).length,
    [approvals]
  );

  const handleRevoke = (id: string) => {
    setRevokingId(id);
    window.setTimeout(() => {
      revokeApproval(id);
      setRevokingId(null);
    }, 320);
  };

  return (
    <div className="space-y-6">
      {/* Exposure Summary Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="surface-panel p-4 space-y-1">
          <p className="text-xs text-[#8E929B]">Active contract approvals</p>
          <p className="font-mono tabular-nums text-2xl font-semibold text-[#F7F8FA]">
            {approvals.length}
          </p>
        </div>
        <div className="surface-panel p-4 space-y-1">
          <p className="text-xs text-[#8E929B]">Unlimited spenders</p>
          <p
            className={`font-mono tabular-nums text-2xl font-semibold ${
              unlimitedCount > 0 ? 'text-[#FFB547]' : 'text-[#2DF5C6]'
            }`}
          >
            {unlimitedCount}
          </p>
        </div>
        <div className="surface-panel p-4 space-y-1">
          <p className="text-xs text-[#8E929B]">Total approved exposure</p>
          <p className="font-mono tabular-nums text-2xl font-semibold text-[#F7F8FA]">
            {formatFiat(totalExposedUsd, settings.currency)}
          </p>
        </div>
      </section>

      {/* Approvals Table */}
      <section className="surface-panel overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.07]">
          <h3 className="font-display text-base font-semibold text-[#F7F8FA]">
            Token spending permissions
          </h3>
          <p className="text-xs text-[#8E929B] mt-0.5">
            Revoking sets a contract’s ERC-20 allowance back to zero so it cannot move your tokens.
          </p>
        </div>

        {approvals.length === 0 ? (
          <div className="px-6 py-16 text-center space-y-2.5">
            <ShieldCheck className="w-8 h-8 text-[#2DF5C6] mx-auto" />
            <p className="text-sm font-medium text-[#F7F8FA]">Zero active spending allowances</p>
            <p className="text-xs text-[#8E929B] max-w-md mx-auto">
              No external smart contracts currently hold permission to spend your tokens.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {approvals.map((item) => {
              const isCritical = item.riskLevel === 'critical';
              const isCaution = item.riskLevel === 'caution';
              return (
                <div
                  key={item.id}
                  className="px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <TokenIcon symbol={item.tokenSymbol} size={36} />
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <p className="text-sm font-medium text-[#F7F8FA]">{item.spenderName}</p>
                        <span className="text-xs text-[#5C606A]">·</span>
                        <span className="text-xs text-[#8E929B]">{NETWORKS[item.network].shortName}</span>
                        {mode === 'sentinel' && (
                          <>
                            <span className="text-xs text-[#5C606A]">·</span>
                            <span className="font-mono text-xs text-[#19C8FF]">
                              {shortenAddress(item.spenderAddress)}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-[#8E929B] leading-relaxed">{item.riskReason}</p>
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs pt-0.5">
                        <span
                          className={`inline-flex items-center gap-1 font-medium ${
                            isCritical
                              ? 'text-[#FF5B5B]'
                              : isCaution
                                ? 'text-[#FFB547]'
                                : 'text-[#2DF5C6]'
                          }`}
                        >
                          {isCritical ? (
                            <ShieldAlert className="w-3.5 h-3.5" />
                          ) : isCaution ? (
                            <AlertTriangle className="w-3.5 h-3.5" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {isCritical ? 'Critical risk' : isCaution ? 'Review recommended' : 'Bounded & verified'}
                          </span>
                        </span>
                        <span className="text-[#5C606A]">·</span>
                        <span className="font-mono tabular-nums text-[#D2D5DC]">
                          Allowance: {item.allowanceLabel} ({formatFiat(item.exposureUsd, settings.currency)})
                        </span>
                        <span className="text-[#5C606A]">·</span>
                        <span className="text-[#5C606A]">Granted {item.grantedAt}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={revokingId === item.id}
                    onClick={() => handleRevoke(item.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 disabled:opacity-50 focus-ring ${
                      isCritical
                        ? 'bg-[#FF5B5B] hover:bg-[#FF7070] text-white'
                        : 'glass-btn text-[#F7F8FA]'
                    }`}
                  >
                    {revokingId === item.id ? 'Revoking…' : 'Revoke access'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
