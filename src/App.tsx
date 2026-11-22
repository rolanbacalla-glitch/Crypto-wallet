import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Activity,
  ArrowUpRight,
  Check,
  Copy,
  KeyRound,
  LayoutDashboard,
  Lock,
  Menu,
  Settings,
  Shield,
  ShieldCheck,
  Terminal,
  Wallet,
  X,
} from 'lucide-react';
import { ActionDrawer } from './components/ActionDrawer';
import { ActivityView } from './components/ActivityView';
import { ApprovalsView } from './components/ApprovalsView';
import { AssetsView } from './components/AssetsView';
import { OverviewView } from './components/OverviewView';
import { SettingsView } from './components/SettingsView';
import { SlideOverSheet } from './components/SlideOverSheet';
import { ToastStack } from './components/ToastStack';
import { TransactionDetailSheet } from './components/TransactionDetailSheet';
import { useWallet, WalletProvider } from './context/WalletContext';
import { shortenAddress } from './data/initialWalletData';
import {
  APPLE_REDUCED_CROSSFADE,
  APPLE_SPRING_SHEET,
  APPLE_SPRING_SNAPPY,
} from './motion/appleMotion';
import type { NavTab, WalletMode } from './types/wallet';

const NAV_META: Record<NavTab, { label: string; heading: string; subtitle: string; icon: React.ElementType }> = {
  overview: {
    label: 'Overview',
    heading: 'Portfolio overview',
    subtitle: 'Simulate every transfer and swap before signing.',
    icon: LayoutDashboard,
  },
  assets: {
    label: 'Assets',
    heading: 'Multi-chain assets',
    subtitle: 'Live holdings across Ethereum, Base, Arbitrum, and Optimism.',
    icon: Wallet,
  },
  activity: {
    label: 'Activity',
    heading: 'Transaction ledger',
    subtitle: 'Chronological record of confirmed transfers and intercepted threats.',
    icon: Activity,
  },
  approvals: {
    label: 'Approvals',
    heading: 'Token approvals',
    subtitle: 'Audit active smart contract allowances and revoke unnecessary spenders.',
    icon: ShieldCheck,
  },
  settings: {
    label: 'Settings',
    heading: 'Vault settings',
    subtitle: 'Configure guardrails, MEV orderflow relays, and display preferences.',
    icon: Settings,
  },
};

function VaultLockScreen() {
  const { unlockVault, settings } = useWallet();
  return (
    <div
      className={`min-h-screen bg-[#07090D] flex items-center justify-center p-6 relative overflow-hidden ${
        settings.reduceTransparency ? 'reduce-transparency' : ''
      }`}
    >
      {!settings.reduceTransparency && (
        <div className="pointer-events-none fixed inset-0" aria-hidden="true">
          <div className="absolute top-[-15%] left-[20%] w-[520px] h-[520px] rounded-full bg-emerald-500/[0.11] blur-[130px]" />
          <div className="absolute bottom-[-18%] right-[18%] w-[460px] h-[460px] rounded-full bg-sky-500/[0.08] blur-[120px]" />
        </div>
      )}
      <div className="relative z-10 w-full max-w-md glass-sheet border border-white/[0.14] rounded-2xl p-8 space-y-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center mx-auto shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
          <Lock className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold text-[#F3F5F8] text-balance">
            Nest Wallet is locked
          </h1>
          <p className="text-sm text-[#9EA9B8]">
            {settings.walletLabel} · <span className="font-mono">{shortenAddress(settings.walletAddress)}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={unlockVault}
          className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#04140D] font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors btn-specular focus-ring"
        >
          <KeyRound className="w-4 h-4" />
          <span>Unlock with Passkey</span>
        </button>
      </div>
    </div>
  );
}

function WalletShell() {
  const {
    mode,
    setMode,
    activeTab,
    setActiveTab,
    isLocked,
    lockVault,
    settings,
    atRiskApprovalsCount,
    actionDrawer,
    openActionDrawer,
    inspectedTransaction,
    closeTransactionDetail,
    addToast,
  } = useWallet();

  const prefersReducedMotion = useReducedMotion();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);

  if (isLocked) {
    return <VaultLockScreen />;
  }

  const currentMeta = NAV_META[activeTab];
  const anyPopoutOpen = actionDrawer.open || Boolean(inspectedTransaction) || mobileNavOpen;

  const handleCopyWallet = async () => {
    try {
      await navigator.clipboard.writeText(settings.walletAddress);
    } catch {
      // Clipboard may be restricted in embedded preview
    }
    setCopiedAddr(true);
    addToast({
      tone: 'success',
      title: 'Vault address copied',
      detail: shortenAddress(settings.walletAddress),
    });
    window.setTimeout(() => setCopiedAddr(false), 1800);
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand Wordmark */}
      <div className="h-16 px-5 border-b border-white/[0.08] flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={() => {
            setActiveTab('overview');
            setMobileNavOpen(false);
          }}
          className="flex items-center gap-2.5 text-left focus-ring rounded-md"
        >
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              mode === 'sentinel'
                ? 'bg-sky-500/15 border border-sky-400/35 text-sky-400'
                : 'bg-emerald-500/15 border border-emerald-400/35 text-emerald-400'
            }`}
          >
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-display text-base font-bold text-[#F3F5F8] whitespace-nowrap">
            Nest Wallet
          </span>
        </button>
        <button
          type="button"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close navigation"
          className="lg:hidden w-8 h-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-[#9AA4B2]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Navigation */}
      <nav aria-label="Primary navigation" className="flex-1 px-3 py-4 space-y-1">
        {(Object.keys(NAV_META) as NavTab[]).map((tabKey) => {
          const item = NAV_META[tabKey];
          const Icon = item.icon;
          const active = activeTab === tabKey;
          return (
            <button
              key={tabKey}
              type="button"
              onClick={() => {
                setActiveTab(tabKey);
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap focus-ring ${
                active
                  ? 'glass-thumb text-[#F4F7FB]'
                  : 'text-[#9EA9B8] hover:text-[#F4F7FB] hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    active
                      ? mode === 'sentinel'
                        ? 'text-sky-400'
                        : 'text-emerald-400'
                      : 'text-[#6E7A8A]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </span>
              {tabKey === 'approvals' && atRiskApprovalsCount > 0 && (
                <span className="font-mono tabular-nums text-xs text-amber-400 shrink-0">
                  {atRiskApprovalsCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Vault Account Footer */}
      <div className="p-3 border-t border-white/[0.08] space-y-2 shrink-0">
        <div className="px-3 py-2.5 glass-recessed flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleCopyWallet}
            className="min-w-0 text-left group focus-ring rounded"
            title="Copy vault address"
          >
            <p className="text-xs font-medium text-[#F4F7FB] truncate">{settings.walletLabel}</p>
            <p className="font-mono text-[11px] text-[#9EA9B8] group-hover:text-white transition-colors truncate flex items-center gap-1">
              <span>{shortenAddress(settings.walletAddress)}</span>
              {copiedAddr ? (
                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
              ) : (
                <Copy className="w-3 h-3 text-[#6E7A8A] shrink-0" />
              )}
            </p>
          </button>
          <button
            type="button"
            onClick={lockVault}
            aria-label="Lock vault"
            title="Lock vault"
            className="w-8 h-8 rounded-lg hover:bg-white/[0.07] flex items-center justify-center text-[#9EA9B8] hover:text-white transition-colors shrink-0 focus-ring"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen bg-[#07090D] text-[#F4F7FB] overflow-x-hidden relative ${
        settings.reduceTransparency ? 'reduce-transparency' : ''
      }`}
    >
      {/* Subtle Atmospheric Ambient Light Layer for Authentic Liquid Glass Refraction */}
      {!settings.reduceTransparency && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
          <div
            className={`absolute -top-44 left-[14%] w-[640px] h-[520px] rounded-full blur-[140px] transition-colors duration-700 ${
              mode === 'sentinel' ? 'bg-sky-500/[0.11]' : 'bg-emerald-500/[0.10]'
            }`}
          />
          <div
            className={`absolute top-[38%] right-[-8%] w-[520px] h-[460px] rounded-full blur-[140px] transition-colors duration-700 ${
              mode === 'sentinel' ? 'bg-indigo-500/[0.08]' : 'bg-teal-400/[0.065]'
            }`}
          />
          <div className="absolute -bottom-48 left-[32%] w-[560px] h-[420px] rounded-full bg-slate-400/[0.045] blur-[130px]" />
        </div>
      )}

      {/* iOS Spatial Depth Pushback on Background Shell When a Pop-Out Sheet Opens */}
      <motion.div
        animate={
          prefersReducedMotion
            ? { opacity: anyPopoutOpen ? 0.92 : 1 }
            : {
                scale: anyPopoutOpen ? 0.988 : 1,
                opacity: anyPopoutOpen ? 0.88 : 1,
              }
        }
        transition={prefersReducedMotion ? APPLE_REDUCED_CROSSFADE : APPLE_SPRING_SHEET}
        style={{ transformOrigin: 'center top', willChange: 'transform, opacity' }}
        className="relative z-10 min-h-screen flex"
      >
        {/* Desktop Sidebar — Apple Navigation Chrome Glass */}
        <aside className="hidden lg:flex w-64 shrink-0 border-r border-white/[0.09] glass-chrome sticky top-0 h-screen flex-col">
          {renderSidebarContent()}
        </aside>

        {/* Main Content Shell */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Clean 3-Zone Top Bar — Apple Floating Chrome Glass */}
          <header className="h-16 px-4 md:px-8 border-b border-white/[0.09] glass-chrome sticky top-0 z-30 flex items-center justify-between gap-4 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open navigation menu"
                className="lg:hidden w-9 h-9 rounded-xl glass-btn flex items-center justify-center text-[#C7D0DC] shrink-0"
              >
                <Menu className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 text-sm min-w-0 whitespace-nowrap">
                <span className="text-[#6E7A8A] hidden sm:inline">Nest Wallet</span>
                <span className="text-[#6E7A8A] hidden sm:inline" aria-hidden="true">/</span>
                <span className="font-medium text-[#F4F7FB] truncate">{currentMeta.label}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openActionDrawer('send')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 btn-specular focus-ring ${
                mode === 'sentinel'
                  ? 'bg-sky-500 hover:bg-sky-400 text-[#05131E]'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-[#04140D]'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>New transaction</span>
            </button>
          </header>

          {/* Main Workspace Canvas */}
          <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 py-6 md:py-8 space-y-6">
            {/* Workspace Toolbar: Section Title + Instant Guardian / Sentinel Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-white/[0.07]">
              <div className="space-y-1">
                <h1 className="font-display text-2xl font-bold text-[#F4F7FB] text-balance">
                  {currentMeta.heading}
                </h1>
                <p className="text-sm text-[#9EA9B8]">{currentMeta.subtitle}</p>
              </div>

              {/* Instant Mode Switcher with Apple Liquid Glass Track & Specular Thumb */}
              <div
                role="group"
                aria-label="Safety interface mode"
                className="inline-flex items-center gap-1 p-1 glass-control self-start sm:self-auto shrink-0 relative"
              >
                {(
                  [
                    { id: 'guardian', label: 'Guardian', icon: Shield },
                    { id: 'sentinel', label: 'Sentinel', icon: Terminal },
                  ] as Array<{ id: WalletMode; label: string; icon: React.ElementType }>
                ).map((item) => {
                  const active = mode === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMode(item.id)}
                      aria-pressed={active}
                      className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-ring ${
                        active
                          ? item.id === 'sentinel'
                            ? 'text-sky-300'
                            : 'text-emerald-300'
                          : 'text-[#9EA9B8] hover:text-white'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="walletModeThumb"
                          transition={
                            prefersReducedMotion ? APPLE_REDUCED_CROSSFADE : APPLE_SPRING_SNAPPY
                          }
                          className={`absolute inset-0 rounded-lg border shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] ${
                            item.id === 'sentinel'
                              ? 'bg-sky-500/20 border-sky-400/35'
                              : 'bg-emerald-500/20 border-emerald-400/35'
                          }`}
                        />
                      )}
                      <Icon className="w-3.5 h-3.5 relative z-10" />
                      <span className="relative z-10">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Route View */}
            {activeTab === 'overview' && <OverviewView />}
            {activeTab === 'assets' && <AssetsView />}
            {activeTab === 'activity' && <ActivityView />}
            {activeTab === 'approvals' && <ApprovalsView />}
            {activeTab === 'settings' && <SettingsView />}
          </main>
        </div>
      </motion.div>

      {/* Mobile Navigation Slide-In Sheet (Apple HIG Spring + Swipe-Left Dismiss) */}
      <SlideOverSheet
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        ariaLabel="Navigation menu"
        side="left"
      >
        {renderSidebarContent()}
      </SlideOverSheet>

      {/* Flagship Interactive Action Drawer (Send / Swap / Receive + Pre-Sign Simulation) */}
      <ActionDrawer />

      {/* Slide-In Transaction Audit Detail Sheet */}
      <TransactionDetailSheet
        transaction={inspectedTransaction}
        onClose={closeTransactionDetail}
      />

      {/* Live Spring Toast Notifications */}
      <ToastStack />
    </div>
  );
}

export function App() {
  return (
    <WalletProvider>
      <WalletShell />
    </WalletProvider>
  );
}

export default App;
