import React from 'react';
import { Lock, RotateCcw, Shield, Terminal } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import type { CurrencyCode, MevRelay, WalletMode } from '../types/wallet';
import { SlidingSegmentedControl } from './SlidingSegmentedControl';

export function SettingsView() {
  const { mode, setMode, settings, updateSettings, resetSandbox, lockVault, addToast } = useWallet();

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Experience & Display */}
      <section className="surface-panel divide-y divide-white/[0.06]">
        <div className="px-5 py-4">
          <h3 className="font-display text-base font-semibold text-[#F3F5F8]">
            Workspace & display
          </h3>
          <p className="text-xs text-[#9AA4B2] mt-0.5">
            Configure your default safety view and fiat display currency.
          </p>
        </div>

        <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#F3F5F8]">Default interface mode</p>
            <p className="text-xs text-[#9AA4B2]">
              Guardian emphasizes plain-English clarity; Sentinel exposes calldata, gas, and traces.
            </p>
          </div>
          <SlidingSegmentedControl<WalletMode>
            layoutId="settingsModeThumb"
            ariaLabel="Default interface mode"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'guardian', label: 'Guardian', icon: Shield, accent: 'emerald' },
              { value: 'sentinel', label: 'Sentinel', icon: Terminal, accent: 'sky' },
            ]}
            className="shrink-0"
          />
        </div>

        <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#F3F5F8]">Display currency</p>
            <p className="text-xs text-[#9AA4B2]">
              Converts all balances, diffs, and spend limits live across the app.
            </p>
          </div>
          <SlidingSegmentedControl<CurrencyCode>
            layoutId="settingsCurrencyThumb"
            ariaLabel="Display currency"
            value={settings.currency}
            onChange={(cur) => {
              updateSettings({ currency: cur });
              addToast({ tone: 'info', title: `Currency switched to ${cur}` });
            }}
            mono
            options={[
              { value: 'USD', label: 'USD' },
              { value: 'GBP', label: 'GBP' },
              { value: 'EUR', label: 'EUR' },
            ]}
            className="shrink-0"
          />
        </div>

        <div className="px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#F3F5F8]">Reduce transparency</p>
            <p className="text-xs text-[#9AA4B2]">
              Replaces translucent Liquid Glass materials with high-contrast opaque obsidian surfaces.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.reduceTransparency}
            onClick={() => {
              const next = !settings.reduceTransparency;
              updateSettings({ reduceTransparency: next });
              addToast({
                tone: 'info',
                title: next ? 'Reduced transparency enabled' : 'Liquid Glass transparency restored',
              });
            }}
            className={`w-11 h-6 rounded-full transition-colors relative shrink-0 focus-ring ${
              settings.reduceTransparency ? 'bg-emerald-500' : 'bg-white/[0.14]'
            }`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                settings.reduceTransparency ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Safety Guardrails */}
      <section className="surface-panel divide-y divide-white/[0.06]">
        <div className="px-5 py-4">
          <h3 className="font-display text-base font-semibold text-[#F3F5F8]">
            Safety guardrails & execution
          </h3>
          <p className="text-xs text-[#9AA4B2] mt-0.5">
            Rules evaluated automatically inside Nest’s Pre-Sign Simulator.
          </p>
        </div>

        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[#F3F5F8]">Daily outbound spend limit</p>
              <p className="text-xs text-[#9AA4B2]">
                Triggers a caution check when 24h transfers exceed this threshold.
              </p>
            </div>
            <span className="font-mono tabular-nums text-sm font-semibold text-emerald-400">
              ${settings.dailySpendLimitUsd.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={1000}
            max={50000}
            step={1000}
            value={settings.dailySpendLimitUsd}
            onChange={(e) => updateSettings({ dailySpendLimitUsd: Number(e.target.value) })}
            aria-label="Daily outbound spend limit in USD"
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between font-mono text-[11px] text-[#6B7686]">
            <span>$1,000</span>
            <span>$25,000</span>
            <span>$50,000</span>
          </div>
        </div>

        <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#F3F5F8]">Default MEV orderflow relay</p>
            <p className="text-xs text-[#9AA4B2]">
              Routes transactions privately to protect swaps from front-running and sandwich bots.
            </p>
          </div>
          <select
            aria-label="Default MEV orderflow relay"
            value={settings.defaultMevRelay}
            onChange={(e) => updateSettings({ defaultMevRelay: e.target.value as MevRelay })}
            className="h-9 px-3 rounded-lg bg-[#090B0E] border border-white/[0.1] text-xs text-[#F3F5F8] focus:outline-none"
          >
            <option value="flashbots">Flashbots Protect (Recommended)</option>
            <option value="mev-blocker">MEV Blocker</option>
            <option value="public">Public Mempool (Unprotected)</option>
          </select>
        </div>

        <div className="px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#F3F5F8]">
              Require explicit risk acknowledgment
            </p>
            <p className="text-xs text-[#9AA4B2]">
              Forces an extra confirmation checkbox before overriding critical simulation blocks.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.requireRiskConfirmation}
            onClick={() =>
              updateSettings({ requireRiskConfirmation: !settings.requireRiskConfirmation })
            }
            className={`w-11 h-6 rounded-full transition-colors relative shrink-0 focus-ring ${
              settings.requireRiskConfirmation ? 'bg-emerald-500' : 'bg-white/[0.12]'
            }`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                settings.requireRiskConfirmation ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Vault Session & Sandbox Controls */}
      <section className="surface-panel p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-sm font-semibold text-[#F3F5F8]">
            Vault session & sandbox data
          </h3>
          <p className="text-xs text-[#9AA4B2] mt-0.5">
            Lock the vault screen or restore default demo balances, approvals, and history.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={lockVault}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-[#F3F5F8] transition-colors whitespace-nowrap focus-ring"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock vault</span>
          </button>
          <button
            type="button"
            onClick={resetSandbox}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium bg-white/[0.05] hover:bg-red-500/15 border border-white/[0.1] hover:border-red-500/30 text-[#F3F5F8] hover:text-red-200 transition-colors whitespace-nowrap focus-ring"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset sandbox</span>
          </button>
        </div>
      </section>
    </div>
  );
}
