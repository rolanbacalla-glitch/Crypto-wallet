import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { formatFiat, formatTokenAmount, NETWORKS, shortenAddress } from '../data/initialWalletData';
import type { AiRiskExplanation, SimulationResult } from '../types/wallet';
import { TokenIcon } from './TokenIcon';

interface PreSignSimulationSheetProps {
  simulation: SimulationResult;
  onBack: () => void;
  onComplete: () => void;
}

export function PreSignSimulationSheet({ simulation, onBack, onComplete }: PreSignSimulationSheetProps) {
  const { mode, settings, executeSimulation, recordBlockedSimulation } = useWallet();

  const [isSimulating, setIsSimulating] = useState(true);
  const [riskAcknowledged, setRiskAcknowledged] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(mode === 'sentinel');

  // Optional Gemini AI Risk Explanation state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiRiskExplanation | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    setShowTechnicalDetails(mode === 'sentinel');
  }, [mode]);

  useEffect(() => {
    setIsSimulating(true);
    setRiskAcknowledged(false);
    setAiResult(null);
    setAiError(null);
    const timer = window.setTimeout(() => setIsSimulating(false), 380);
    return () => window.clearTimeout(timer);
  }, [simulation.id]);

  const net = NETWORKS[simulation.network];

  const handleExplainWithAi = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const response = await fetch('/api/explain-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          txType: simulation.txType,
          network: net.name,
          summary: simulation.summary,
          recipientOrRouter: `${simulation.counterpartyLabel} (${simulation.counterpartyAddress})`,
          balanceDiffs: simulation.balanceDiffs.map((d) => ({
            symbol: d.symbol,
            delta: `${d.direction === 'out' ? '-' : '+'}${formatTokenAmount(Math.abs(d.delta))}`,
            usdValue: formatFiat(d.usdValue, settings.currency),
          })),
          riskLevel: simulation.riskLevel,
          riskFlags: simulation.checks.map((c) => ({
            title: c.title,
            severity: c.status,
            detail: mode === 'sentinel' ? c.sentinelDetail : c.guardianDetail,
          })),
          gasGwei: Number((simulation.baseFeeGwei + simulation.priorityFeeGwei).toFixed(2)),
          slippagePct: simulation.slippagePct,
          mevProtected: simulation.mevProtected,
          calldataHex: simulation.calldataHex,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setAiError(data?.error || `Request failed with status ${response.status}.`);
        return;
      }
      setAiResult(data as AiRiskExplanation);
    } catch {
      setAiError('Could not reach the Nest risk analysis server. Check your connection and try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleCancelAndProtect = () => {
    if (simulation.riskLevel === 'critical') {
      recordBlockedSimulation(simulation);
      onComplete();
    } else {
      onBack();
    }
  };

  const handleConfirmSign = () => {
    executeSimulation(simulation);
    onComplete();
  };

  if (isSimulating) {
    return (
      <div className="space-y-5 py-2" aria-busy="true" aria-label="Simulating transaction">
        <div className="flex items-center gap-3 text-sm text-[#9AA4B2]">
          <div className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
          <span>Running pre-sign EVM state simulation on {net.shortName}…</span>
        </div>
        <div className="space-y-3">
          <div className="h-20 rounded-xl bg-white/[0.04] animate-pulse" />
          <div className="h-28 rounded-xl bg-white/[0.04] animate-pulse" />
          <div className="h-32 rounded-xl bg-white/[0.04] animate-pulse" />
        </div>
      </div>
    );
  }

  const verdictStyles =
    simulation.riskLevel === 'critical'
      ? {
          container: 'bg-red-500/[0.08] border-red-500/30',
          icon: ShieldAlert,
          iconColor: 'text-red-400',
          labelColor: 'text-red-300',
        }
      : simulation.riskLevel === 'caution'
        ? {
            container: 'bg-amber-500/[0.08] border-amber-500/30',
            icon: AlertTriangle,
            iconColor: 'text-amber-400',
            labelColor: 'text-amber-300',
          }
        : {
            container: 'bg-emerald-500/[0.08] border-emerald-500/25',
            icon: ShieldCheck,
            iconColor: 'text-emerald-400',
            labelColor: 'text-emerald-300',
          };

  const VerdictIcon = verdictStyles.icon;
  const canConfirm = !simulation.requiresRiskAck || riskAcknowledged;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-[#9AA4B2] hover:text-white transition-colors whitespace-nowrap shrink-0 focus-ring rounded-md px-1 py-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit transaction</span>
        </button>
        <div className="flex items-center gap-2 text-xs text-[#9AA4B2] font-mono tabular-nums">
          <span>{net.shortName}</span>
          <span aria-hidden="true">·</span>
          <span>Nonce #{simulation.nonce}</span>
        </div>
      </div>

      {/* Verdict Summary */}
      <div className={`p-4 rounded-xl border ${verdictStyles.container}`}>
        <div className="flex items-start gap-3">
          <VerdictIcon className={`w-5 h-5 mt-0.5 shrink-0 ${verdictStyles.iconColor}`} />
          <div className="min-w-0">
            <h3 className={`font-display font-semibold text-base ${verdictStyles.labelColor}`}>
              {simulation.verdictTitle}
            </h3>
            <p className="text-sm text-[#C7D0DC] mt-1 leading-relaxed">{simulation.verdictSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Expected Balance Changes */}
      <section className="glass-recessed divide-y divide-white/[0.06]">
        <div className="px-4 py-3 flex items-center justify-between">
          <h4 className="text-xs font-medium text-[#9AA4B2]">Simulated balance impact</h4>
          <span className="text-xs text-[#6B7686] font-mono tabular-nums">
            Est. fee {formatFiat(simulation.gasCostUsd, settings.currency)}
          </span>
        </div>
        <div className="divide-y divide-white/[0.06]">
          {simulation.balanceDiffs.map((diff, idx) => {
            const isOut = diff.direction === 'out';
            return (
              <div key={`${diff.symbol}-${idx}`} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <TokenIcon symbol={diff.symbol} size={32} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#F3F5F8] truncate">
                      {isOut ? 'Leaves your vault' : 'Enters your vault'}
                    </p>
                    <p className="text-xs text-[#9AA4B2] truncate">{diff.name}</p>
                  </div>
                </div>
                <div className="text-right font-mono tabular-nums shrink-0">
                  <p className={`text-sm font-semibold ${isOut ? 'text-red-400' : 'text-emerald-400'}`}>
                    {isOut ? '-' : '+'}
                    {formatTokenAmount(Math.abs(diff.delta))} {diff.symbol}
                  </p>
                  <p className="text-xs text-[#6B7686]">
                    {formatFiat(diff.usdValue, settings.currency)}
                  </p>
                </div>
              </div>
            );
          })}
          {simulation.txType === 'swap' && simulation.riskLevel === 'critical' && (
            <div className="px-4 py-3 flex items-center justify-between gap-3 bg-red-500/[0.05]">
              <span className="text-sm text-red-300 font-medium">Simulated asset received</span>
              <span className="text-sm font-mono tabular-nums font-semibold text-red-400">
                0.0000 (Drain detected)
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Safety Checks */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-medium text-[#9AA4B2]">
            {mode === 'sentinel' ? 'Pre-execution verification checks' : 'Safety checks'}
          </h4>
          <span className="text-xs text-[#6B7686]">
            {simulation.counterpartyLabel} · {shortenAddress(simulation.counterpartyAddress)}
          </span>
        </div>
        <div className="glass-recessed divide-y divide-white/[0.06]">
          {simulation.checks.map((check) => (
            <div key={check.id} className="px-4 py-3 flex items-start gap-3">
              {check.status === 'pass' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              )}
              {check.status === 'warn' && (
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              )}
              {check.status === 'fail' && <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />}
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#F3F5F8]">{check.title}</p>
                <p className="text-xs text-[#9AA4B2] mt-0.5 leading-relaxed">
                  {mode === 'sentinel' ? check.sentinelDetail : check.guardianDetail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Optional AI Risk Explanation */}
      <section className="glass-recessed p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
            <h4 className="text-sm font-medium text-[#F3F5F8]">AI risk explanation</h4>
          </div>
          <button
            type="button"
            onClick={handleExplainWithAi}
            disabled={aiLoading}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] text-[#F3F5F8] transition-colors disabled:opacity-50 whitespace-nowrap shrink-0 focus-ring"
          >
            {aiLoading ? 'Analyzing…' : aiResult ? 'Refresh analysis' : 'Explain risk with AI'}
          </button>
        </div>

        {!aiResult && !aiError && !aiLoading && (
          <p className="text-xs text-[#9AA4B2] leading-relaxed">
            Request an on-demand second opinion explaining this simulation in plain English along with technical findings.
          </p>
        )}

        {aiLoading && (
          <div className="space-y-2 pt-1">
            <div className="h-3.5 w-3/4 rounded bg-white/[0.06] animate-pulse" />
            <div className="h-3.5 w-full rounded bg-white/[0.06] animate-pulse" />
            <div className="h-3.5 w-2/3 rounded bg-white/[0.06] animate-pulse" />
          </div>
        )}

        {aiError && (
          <div className="p-3 rounded-lg bg-red-500/[0.08] border border-red-500/25 text-xs text-red-200 space-y-1.5">
            <p className="font-medium text-red-300">Unable to load AI risk explanation</p>
            <p className="text-red-200/80 leading-relaxed">{aiError}</p>
          </div>
        )}

        {aiResult && (
          <div className="space-y-3 pt-1 text-xs">
            <div className="flex items-center justify-between text-[#9AA4B2]">
              <span className="font-medium text-[#F3F5F8]">{aiResult.verdictLabel}</span>
              <span className="font-mono text-[11px] text-[#6B7686]">{aiResult.model}</span>
            </div>
            <p className="text-[#C7D0DC] leading-relaxed">{aiResult.guardianSummary}</p>
            {mode === 'sentinel' && aiResult.sentinelFindings.length > 0 && (
              <ul className="space-y-1.5 pt-1 border-t border-white/[0.06] text-[#9AA4B2]">
                {aiResult.sentinelFindings.map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-mono text-sky-400 shrink-0">{idx + 1}.</span>
                    <span className="leading-relaxed">{finding}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="pt-1 border-t border-white/[0.06] text-[#F3F5F8]">
              <span className="text-[#9AA4B2]">Recommended next step: </span>
              {aiResult.recommendedAction}
            </p>
          </div>
        )}
      </section>

      {/* Sentinel Technical Execution Inspector */}
      <section className="glass-recessed overflow-hidden">
        <button
          type="button"
          onClick={() => setShowTechnicalDetails((prev) => !prev)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors focus-ring"
        >
          <div className="flex items-center gap-2 text-xs font-medium text-[#C7D0DC]">
            <Cpu className="w-4 h-4 text-sky-400" />
            <span>Execution trace & calldata</span>
          </div>
          {showTechnicalDetails ? (
            <ChevronUp className="w-4 h-4 text-[#9AA4B2]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#9AA4B2]" />
          )}
        </button>

        {showTechnicalDetails && (
          <div className="px-4 pb-4 pt-2 border-t border-white/[0.06] space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs font-mono tabular-nums">
              <div>
                <p className="text-[#6B7686]">EIP-1559 gas</p>
                <p className="text-[#F3F5F8] mt-0.5">
                  {simulation.baseFeeGwei} base + {simulation.priorityFeeGwei} tip gwei
                </p>
              </div>
              <div>
                <p className="text-[#6B7686]">Orderflow relay</p>
                <p className="text-[#F3F5F8] mt-0.5">
                  {simulation.mevRelay === 'flashbots'
                    ? 'Flashbots Protect'
                    : simulation.mevRelay === 'mev-blocker'
                      ? 'MEV Blocker'
                      : 'Public Mempool'}
                </p>
              </div>
              <div>
                <p className="text-[#6B7686]">Estimated gas units</p>
                <p className="text-[#F3F5F8] mt-0.5">{simulation.gasUnits.toLocaleString()} units</p>
              </div>
              <div>
                <p className="text-[#6B7686]">Method signature</p>
                <p className="text-[#F3F5F8] mt-0.5 truncate" title={simulation.calldataMethod}>
                  {simulation.calldataMethod}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-[11px] font-medium text-[#6B7686]">Simulated EVM trace</p>
              <div className="bg-[#090B0E] border border-white/[0.06] rounded-lg divide-y divide-white/[0.05] font-mono text-[11px]">
                {simulation.traceSteps.map((step) => (
                  <div
                    key={step.step}
                    className={`px-3 py-2 flex items-start justify-between gap-3 ${
                      step.flagged ? 'bg-red-500/[0.08] text-red-200' : 'text-[#C7D0DC]'
                    }`}
                  >
                    <div className="min-w-0">
                      <span className={step.flagged ? 'text-red-400 font-semibold' : 'text-sky-400'}>
                        {step.opcode}
                      </span>{' '}
                      <span className="text-[#9AA4B2]">{step.target}</span>
                      <p className="text-[11px] text-[#9AA4B2] mt-0.5 break-words">{step.detail}</p>
                    </div>
                    <span className="text-[#6B7686] tabular-nums shrink-0">
                      {step.gasUsed.toLocaleString()} gas
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-medium text-[#6B7686]">Raw calldata</p>
              <p className="p-2.5 rounded-lg bg-[#090B0E] border border-white/[0.06] font-mono text-[11px] text-[#9AA4B2] break-all">
                {simulation.calldataHex}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Friction Gate for Critical Risks */}
      {simulation.requiresRiskAck && (
        <label className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/[0.06] border border-red-500/25 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={riskAcknowledged}
            onChange={(e) => setRiskAcknowledged(e.target.checked)}
            className="mt-0.5 rounded border-red-400/50 bg-[#090B0E] text-red-500 focus:ring-red-400"
          />
          <span className="text-xs text-red-200 leading-relaxed">
            I understand Nest flagged a critical threat and overriding this protection may permanently lose funds.
          </span>
        </label>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={handleCancelAndProtect}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors whitespace-nowrap focus-ring ${
            simulation.riskLevel === 'critical'
              ? 'bg-emerald-500 hover:bg-emerald-400 text-[#04140D]'
              : 'bg-white/[0.06] hover:bg-white/[0.1] text-[#F3F5F8] border border-white/[0.08]'
          }`}
        >
          {simulation.riskLevel === 'critical' ? 'Cancel & Protect' : 'Cancel'}
        </button>

        <button
          type="button"
          disabled={!canConfirm}
          onClick={handleConfirmSign}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed focus-ring ${
            simulation.riskLevel === 'critical'
              ? 'bg-red-600 hover:bg-red-500 text-white'
              : mode === 'sentinel'
                ? 'bg-sky-500 hover:bg-sky-400 text-[#05131E]'
                : 'bg-emerald-500 hover:bg-emerald-400 text-[#04140D]'
          }`}
        >
          {simulation.riskLevel === 'critical'
            ? 'Sign Anyway'
            : simulation.txType === 'send'
              ? 'Confirm & Send'
              : 'Confirm & Swap'}
        </button>
      </div>
    </div>
  );
}
