import React, { useEffect, useRef, useState } from 'react';
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion';
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
  APPLE_SPRING_NAV_PUSH,
  APPLE_SPRING_SHEET,
  APPLE_SPRING_SNAPPY,
} from './motion/appleMotion';
import type { NavTab } from './types/wallet';

const NAV_ORDER: Record<NavTab, number> = {
  overview: 0,
  assets: 1,
  activity: 2,
  approvals: 3,
  settings: 4,
};

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
      className={`min-h-screen bg-[#050507] flex items-center justify-center p-6 relative overflow-hidden ${
        settings.reduceTransparency ? 'reduce-transparency' : ''
      }`}
    >
      {!settings.reduceTransparency && (
        <div className="pointer-events-none fixed inset-0" aria-hidden="true">
          <div className="absolute top-[-15%] left-[20%] w-[520px] h-[520px] rounded-full bg-[#2DF5C6]/[0.08] blur-[130px]" />
          <div className="absolute bottom-[-18%] right-[18%] w-[460px] h-[460px] rounded-full bg-[#19C8FF]/[0.08] blur-[120px]" />
        </div>
      )}
      <div className="relative z-10 w-full max-w-md glass-sheet border border-white/[0.12] rounded-2xl p-8 space-y-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-[#2DF5C6]/[0.14] border border-[#2DF5C6]/35 flex items-center justify-center mx-auto shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
          <Lock className="w-5 h-5 text-[#2DF5C6]" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold text-[#F7F8FA] text-balance">
            Nest Wallet is locked
          </h1>
          <p className="text-sm text-[#8E929B]">
            {settings.walletLabel} · <span className="font-mono">{shortenAddress(settings.walletAddress)}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={unlockVault}
          className="w-full py-3 px-4 rounded-xl btn-primary-white font-semibold text-sm inline-flex items-center justify-center gap-2 focus-ring"
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
  const [navDirection, setNavDirection] = useState<number>(1);
  const prevTabRef = useRef<NavTab>(activeTab);

  // Keep direction synced even when child views call setActiveTab directly (e.g. Overview links)
  useEffect(() => {
    if (activeTab !== prevTabRef.current) {
      setNavDirection(NAV_ORDER[activeTab] > NAV_ORDER[prevTabRef.current] ? 1 : -1);
      prevTabRef.current = activeTab;
    }
  }, [activeTab]);

  const handleSelectNavTab = (next: NavTab) => {
    if (next !== activeTab) {
      setNavDirection(NAV_ORDER[next] > NAV_ORDER[activeTab] ? 1 : -1);
      prevTabRef.current = next;
      setActiveTab(next);
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
    setMobileNavOpen(false);
  };

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

  const renderSidebarContent = (variant: 'desktop' | 'mobile') => (
    <div className="flex flex-col h-full">
      {/* Brand Wordmark */}
      <div className="h-16 px-5 border-b border-white/[0.07] flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={() => handleSelectNavTab('overview')}
          className="flex items-center gap-2.5 text-left focus-ring rounded-md"
        >
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              mode === 'sentinel'
                ? 'bg-[#19C8FF] text-[#050507] shadow-[0_0_20px_rgba(25,200,255,0.28)]'
                : 'bg-[#2DF5C6] text-[#050507] shadow-[0_0_20px_rgba(45,245,198,0.25)]'
            }`}
          >
            <Shield className="w-4 h-4 stroke-[2.25]" />
          </div>
          <span className="font-display text-base font-bold text-[#F7F8FA] whitespace-nowrap">
            Nest Wallet
          </span>
        </button>
        <button
          type="button"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close navigation"
          className="lg:hidden w-8 h-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-[#8E929B]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Navigation with Gliding Glass Highlight */}
      <LayoutGroup id={`sidebar-nav-${variant}`}>
        <nav aria-label="Primary navigation" className="flex-1 px-3 py-4 space-y-1">
          {(Object.keys(NAV_META) as NavTab[]).map((tabKey) => {
            const item = NAV_META[tabKey];
            const Icon = item.icon;
            const active = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                type="button"
                onClick={() => handleSelectNavTab(tabKey)}
                className={`relative w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap focus-ring ${
                  active
                    ? 'text-[#F7F8FA]'
                    : 'text-[#8E929B] hover:text-[#F7F8FA] hover:bg-white/[0.04]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId={`sidebarNavThumb-${variant}`}
                    transition={prefersReducedMotion ? APPLE_REDUCED_CROSSFADE : APPLE_SPRING_SNAPPY}
                    className="absolute inset-0 rounded-xl glass-thumb"
                  />
                )}
                <span className="flex items-center gap-2.5 min-w-0 relative z-10">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      active
                        ? mode === 'sentinel'
                          ? 'text-[#19C8FF]'
                          : 'text-[#2DF5C6]'
                        : 'text-[#5C606A]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </span>
                {tabKey === 'approvals' && atRiskApprovalsCount > 0 && (
                  <span className="font-mono tabular-nums text-xs text-[#FFB547] shrink-0 relative z-10">
                    {atRiskApprovalsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </LayoutGroup>

      {/* Vault Account Footer */}
      <div className="p-3 border-t border-white/[0.07] space-y-2 shrink-0">
        <div className="px-3 py-2.5 bg-[#111216] border border-white/[0.07] rounded-xl flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleCopyWallet}
            className="min-w-0 text-left group focus-ring rounded"
            title="Copy vault address"
          >
            <p className="text-xs font-medium text-[#F7F8FA] truncate">{settings.walletLabel}</p>
            <p className="font-mono text-[11px] text-[#8E929B] group-hover:text-white transition-colors truncate flex items-center gap-1">
              <span>{shortenAddress(settings.walletAddress)}</span>
              {copiedAddr ? (
                <Check className="w-3 h-3 text-[#2DF5C6] shrink-0" />
              ) : (
                <Copy className="w-3 h-3 text-[#5C606A] shrink-0" />
              )}
            </p>
          </button>
          <button
            type="button"
            onClick={lockVault}
            aria-label="Lock vault"
            title="Lock vault"
            className="w-8 h-8 rounded-lg hover:bg-white/[0.07] flex items-center justify-center text-[#8E929B] hover:text-white transition-colors shrink-0 focus-ring"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen bg-[#050507] text-[#F7F8FA] overflow-x-clip relative ${
        settings.reduceTransparency ? 'reduce-transparency' : ''
      }`}
    >
      {/* Subtle Atmospheric Ambient Light Layer for Authentic Liquid Glass Refraction */}
      {!settings.reduceTransparency && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
          <div
            className={`absolute -top-48 left-[18%] w-[620px] h-[480px] rounded-full blur-[150px] transition-colors duration-700 ${
              mode === 'sentinel' ? 'bg-[#19C8FF]/[0.075]' : 'bg-[#2DF5C6]/[0.065]'
            }`}
          />
          <div className="absolute top-[38%] right-[-8%] w-[520px] h-[460px] rounded-full bg-[#7C5CFF]/[0.06] blur-[150px]" />
          <div className="absolute -bottom-48 left-[36%] w-[540px] h-[420px] rounded-full bg-[#19C8FF]/[0.045] blur-[140px]" />
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
        style={{ transformOrigin: 'center top' }}
        className="relative z-10 min-h-screen flex"
      >
        {/* Desktop Sidebar — Pitch-Black Navigation Rail */}
        <aside className="hidden lg:flex w-64 shrink-0 border-r border-white/[0.07] bg-[#000000]/95 backdrop-blur-xl sticky top-0 h-screen flex-col">
          {renderSidebarContent('desktop')}
        </aside>

        {/* Main Content Shell */}
        <div className="flex-1 min-w-0 flex flex-col bg-[#0C0D10]/70">
          {/* Clean Top Bar — Floating Glass Chrome */}
          <header className="h-16 px-4 md:px-8 border-b border-white/[0.07] glass-chrome sticky top-0 z-30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open navigation menu"
                className="lg:hidden w-9 h-9 rounded-xl glass-btn flex items-center justify-center text-[#D2D5DC] shrink-0"
              >
                <Menu className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 text-sm min-w-0 whitespace-nowrap">
                <span className="text-[#5C606A] hidden sm:inline">Nest Wallet</span>
                <span className="text-[#5C606A] hidden sm:inline" aria-hidden="true">/</span>
                <span className="font-medium text-[#F7F8FA] truncate">{currentMeta.label}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openActionDrawer('send')}
              className="px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 btn-primary-white focus-ring"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>New transaction</span>
            </button>
          </header>

          {/* Main Workspace Canvas */}
          <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 py-6 md:py-8 space-y-6">
            {/* Workspace Toolbar: Section Title */}
            <div className="pb-3 border-b border-white/[0.07]">
              <div className="space-y-1">
                <h1 className="font-display text-2xl font-bold text-[#F7F8FA] text-balance">
                  {currentMeta.heading}
                </h1>
                <p className="text-sm text-[#8E929B]">{currentMeta.subtitle}</p>
              </div>
            </div>

            {/* Active Route View with Instant Directional Slide Transition (never blocks or deadlocks nested layoutId controls) */}
            <motion.div
              key={activeTab}
              initial={
                prefersReducedMotion ? { opacity: 0 } : { y: navDirection * 12, opacity: 0 }
              }
              animate={{ y: 0, opacity: 1 }}
              transition={prefersReducedMotion ? APPLE_REDUCED_CROSSFADE : APPLE_SPRING_NAV_PUSH}
            >
              {activeTab === 'overview' && <OverviewView />}
              {activeTab === 'assets' && <AssetsView />}
              {activeTab === 'activity' && <ActivityView />}
              {activeTab === 'approvals' && <ApprovalsView />}
              {activeTab === 'settings' && <SettingsView />}
            </motion.div>
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
        {renderSidebarContent('mobile')}
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
