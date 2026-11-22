import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  INITIAL_APPROVALS,
  INITIAL_ASSETS,
  INITIAL_SETTINGS,
  INITIAL_TRANSACTIONS,
  NETWORKS,
} from '../data/initialWalletData';
import { generateTxHash } from '../engine/simulator';
import type {
  ActionDrawerTab,
  NavTab,
  NetworkId,
  SimulationResult,
  ToastItem,
  TokenApproval,
  TokenAsset,
  TransactionRecord,
  VaultSettings,
  WalletMode,
} from '../types/wallet';

const STORAGE_KEY = 'nest_wallet_state_v2';

interface PersistedState {
  mode: WalletMode;
  assets: TokenAsset[];
  transactions: TransactionRecord[];
  approvals: TokenApproval[];
  settings: VaultSettings;
  nonce: number;
}

interface ActionDrawerState {
  open: boolean;
  tab: ActionDrawerTab;
  preselectedTokenId?: string;
}

interface WalletContextValue {
  mode: WalletMode;
  setMode: (mode: WalletMode) => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isLocked: boolean;
  lockVault: () => void;
  unlockVault: () => void;
  assets: TokenAsset[];
  transactions: TransactionRecord[];
  approvals: TokenApproval[];
  settings: VaultSettings;
  nonce: number;
  totalPortfolioUsd: number;
  change24hUsd: number;
  change24hPct: number;
  todaySpentUsd: number;
  atRiskApprovalsCount: number;
  blockedThreatsCount: number;
  actionDrawer: ActionDrawerState;
  openActionDrawer: (tab: ActionDrawerTab, preselectedTokenId?: string) => void;
  closeActionDrawer: () => void;
  executeSimulation: (sim: SimulationResult) => TransactionRecord;
  recordBlockedSimulation: (sim: SimulationResult) => void;
  simulateIncomingReceive: (network: NetworkId, symbol: string, amount: number) => void;
  revokeApproval: (approvalId: string) => void;
  updateSettings: (partial: Partial<VaultSettings>) => void;
  resetSandbox: () => void;
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      if (Array.isArray(parsed.assets) && parsed.assets.length > 0 && parsed.settings) {
        return {
          mode: parsed.mode === 'sentinel' ? 'sentinel' : 'guardian',
          assets: parsed.assets,
          transactions: Array.isArray(parsed.transactions) ? parsed.transactions : INITIAL_TRANSACTIONS,
          approvals: Array.isArray(parsed.approvals) ? parsed.approvals : INITIAL_APPROVALS,
          settings: { ...INITIAL_SETTINGS, ...parsed.settings },
          nonce: typeof parsed.nonce === 'number' ? parsed.nonce : 42,
        };
      }
    }
  } catch {
    // Fallback cleanly to defaults
  }
  return {
    mode: 'guardian',
    assets: INITIAL_ASSETS,
    transactions: INITIAL_TRANSACTIONS,
    approvals: INITIAL_APPROVALS,
    settings: INITIAL_SETTINGS,
    nonce: 42,
  };
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [persisted, setPersisted] = useState<PersistedState>(loadInitialState);
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [isLocked, setIsLocked] = useState(false);
  const [actionDrawer, setActionDrawer] = useState<ActionDrawerState>({
    open: false,
    tab: 'send',
  });
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // Ignore storage quota errors
    }
  }, [persisted]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-3), { ...toast, id }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const setMode = useCallback(
    (mode: WalletMode) => {
      setPersisted((prev) => (prev.mode === mode ? prev : { ...prev, mode }));
    },
    []
  );

  const openActionDrawer = useCallback((tab: ActionDrawerTab, preselectedTokenId?: string) => {
    setActionDrawer({ open: true, tab, preselectedTokenId });
  }, []);

  const closeActionDrawer = useCallback(() => {
    setActionDrawer((prev) => ({ ...prev, open: false }));
  }, []);

  const executeSimulation = useCallback(
    (sim: SimulationResult): TransactionRecord => {
      const txHash = generateTxHash(`${sim.id}-${persisted.nonce}`);
      const txRecord: TransactionRecord = {
        id: `tx-${Date.now()}`,
        type: sim.txType,
        status: 'confirmed',
        timestamp: new Date().toISOString(),
        network: sim.network,
        title: sim.summary,
        counterparty: sim.counterpartyLabel,
        counterpartyAddress: sim.counterpartyAddress,
        balanceDiffs: sim.balanceDiffs,
        riskLevel: sim.riskLevel,
        riskSummary: sim.verdictSubtitle,
        gasCostUsd: sim.gasCostUsd,
        gasGwei: Number((sim.baseFeeGwei + sim.priorityFeeGwei).toFixed(2)),
        mevProtected: sim.mevProtected,
        txHash,
        calldataMethod: sim.calldataMethod,
        calldataHex: sim.calldataHex,
      };

      setPersisted((prev) => {
        const nextAssets = prev.assets.map((asset) => {
          if (sim.txType === 'send' && sim.sendPayload && asset.id === sim.sendPayload.tokenId) {
            return { ...asset, balance: Math.max(0, Number((asset.balance - sim.sendPayload.amount).toFixed(6))) };
          }
          if (sim.txType === 'swap' && sim.swapPayload) {
            if (asset.id === sim.swapPayload.fromTokenId) {
              const outDelta = sim.riskLevel === 'critical' ? asset.balance : sim.swapPayload.fromAmount;
              return { ...asset, balance: Math.max(0, Number((asset.balance - outDelta).toFixed(6))) };
            }
            if (asset.id === sim.swapPayload.toTokenId && sim.riskLevel !== 'critical') {
              return { ...asset, balance: Number((asset.balance + sim.swapPayload.toAmount).toFixed(6)) };
            }
          }
          return asset;
        });

        return {
          ...prev,
          assets: nextAssets,
          transactions: [txRecord, ...prev.transactions],
          nonce: prev.nonce + 1,
        };
      });

      addToast({
        tone: sim.riskLevel === 'critical' ? 'warning' : 'success',
        title: sim.txType === 'send' ? 'Transfer confirmed' : 'Swap settled',
        detail: `${sim.summary} on ${NETWORKS[sim.network].shortName}.`,
      });

      return txRecord;
    },
    [addToast, persisted.nonce]
  );

  const recordBlockedSimulation = useCallback(
    (sim: SimulationResult) => {
      const blockedRecord: TransactionRecord = {
        id: `tx-blocked-${Date.now()}`,
        type: sim.txType,
        status: 'blocked',
        timestamp: new Date().toISOString(),
        network: sim.network,
        title: `Blocked: ${sim.summary}`,
        counterparty: sim.counterpartyLabel,
        counterpartyAddress: sim.counterpartyAddress,
        balanceDiffs: sim.balanceDiffs,
        riskLevel: sim.riskLevel,
        riskSummary: sim.verdictSubtitle,
        gasCostUsd: 0,
        gasGwei: Number((sim.baseFeeGwei + sim.priorityFeeGwei).toFixed(2)),
        mevProtected: sim.mevProtected,
        txHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        calldataMethod: sim.calldataMethod,
        calldataHex: sim.calldataHex,
      };

      setPersisted((prev) => ({
        ...prev,
        transactions: [blockedRecord, ...prev.transactions],
      }));

      addToast({
        tone: 'info',
        title: 'Transaction canceled & logged',
        detail: 'Nest prevented the flagged interaction from leaving your vault.',
      });
    },
    [addToast]
  );

  const simulateIncomingReceive = useCallback(
    (network: NetworkId, symbol: string, amount: number) => {
      if (amount <= 0) return;

      setPersisted((prev) => {
        const match = prev.assets.find((a) => a.network === network && a.symbol === symbol);
        const priceUsd = match ? match.priceUsd : symbol === 'ETH' ? 3240 : 1;
        const name = match ? match.name : symbol;
        const nextAssets = match
          ? prev.assets.map((a) =>
              a.id === match.id ? { ...a, balance: Number((a.balance + amount).toFixed(6)) } : a
            )
          : [
              ...prev.assets,
              {
                id: `${symbol.toLowerCase()}-${network}-${Date.now()}`,
                symbol,
                name,
                network,
                balance: amount,
                priceUsd,
                change24hPct: 0,
                contractAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
                verified: true,
              },
            ];

        const tx: TransactionRecord = {
          id: `tx-rcv-${Date.now()}`,
          type: 'receive',
          status: 'confirmed',
          timestamp: new Date().toISOString(),
          network,
          title: `Received ${amount} ${symbol} on ${NETWORKS[network].shortName}`,
          counterparty: 'External Sender',
          counterpartyAddress: '0x2932b7A2355D6fecc4b5c0B6BD44cC31df247a2e',
          balanceDiffs: [
            {
              symbol,
              name,
              delta: amount,
              usdValue: amount * priceUsd,
              direction: 'in',
            },
          ],
          riskLevel: 'safe',
          riskSummary: 'Verified inbound deposit settled in your vault.',
          gasCostUsd: 0,
          gasGwei: NETWORKS[network].baseFeeGwei,
          mevProtected: false,
          txHash: generateTxHash(`rcv-${symbol}-${amount}`),
          calldataMethod: 'transfer(address,uint256)',
          calldataHex: '0xa9059cbb0000000000000000000000007a2f94c8b13e4409d3812a1b299c88d73a1b8fe3',
        };

        return {
          ...prev,
          assets: nextAssets,
          transactions: [tx, ...prev.transactions],
        };
      });

      addToast({
        tone: 'success',
        title: `Received ${amount} ${symbol}`,
        detail: `Credited to your ${NETWORKS[network].shortName} balance.`,
      });
    },
    [addToast]
  );

  const revokeApproval = useCallback(
    (approvalId: string) => {
      const target = persisted.approvals.find((a) => a.id === approvalId);
      if (!target) return;

      const net = NETWORKS[target.network];
      const revokeTx: TransactionRecord = {
        id: `tx-rev-${Date.now()}`,
        type: 'revoke',
        status: 'confirmed',
        timestamp: new Date().toISOString(),
        network: target.network,
        title: `Revoked ${target.tokenSymbol} access for ${target.spenderName}`,
        counterparty: target.spenderName,
        counterpartyAddress: target.spenderAddress,
        balanceDiffs: [],
        riskLevel: 'safe',
        riskSummary: `Allowance reset to 0 ${target.tokenSymbol}. Exposure eliminated.`,
        gasCostUsd: target.network === 'ethereum' ? 1.85 : 0.02,
        gasGwei: net.baseFeeGwei,
        mevProtected: true,
        txHash: generateTxHash(`revoke-${approvalId}`),
        calldataMethod: 'approve(address,uint256) [0]',
        calldataHex: `0x095ea7b3000000000000000000000000${target.spenderAddress.slice(2).toLowerCase()}0000000000000000000000000000000000000000000000000000000000000000`,
      };

      setPersisted((prev) => ({
        ...prev,
        approvals: prev.approvals.filter((a) => a.id !== approvalId),
        transactions: [revokeTx, ...prev.transactions],
        nonce: prev.nonce + 1,
      }));

      addToast({
        tone: 'success',
        title: `Revoked ${target.tokenSymbol} allowance`,
        detail: `${target.spenderName} can no longer spend your ${target.tokenSymbol}.`,
      });
    },
    [addToast, persisted.approvals]
  );

  const updateSettings = useCallback(
    (partial: Partial<VaultSettings>) => {
      setPersisted((prev) => ({
        ...prev,
        settings: { ...prev.settings, ...partial },
      }));
    },
    []
  );

  const resetSandbox = useCallback(() => {
    const fresh: PersistedState = {
      mode: persisted.mode,
      assets: INITIAL_ASSETS,
      transactions: INITIAL_TRANSACTIONS,
      approvals: INITIAL_APPROVALS,
      settings: INITIAL_SETTINGS,
      nonce: 42,
    };
    setPersisted(fresh);
    addToast({
      tone: 'info',
      title: 'Sandbox reset',
      detail: 'Balances, approvals, and transaction history restored to defaults.',
    });
  }, [addToast, persisted.mode]);

  const metrics = useMemo(() => {
    let totalPortfolioUsd = 0;
    let weightedChangeUsd = 0;

    for (const asset of persisted.assets) {
      const value = asset.balance * asset.priceUsd;
      totalPortfolioUsd += value;
      weightedChangeUsd += value * (asset.change24hPct / 100);
    }

    const change24hPct = totalPortfolioUsd > 0 ? (weightedChangeUsd / totalPortfolioUsd) * 100 : 0;

    const oneDayAgo = Date.now() - 1000 * 60 * 60 * 24;
    const todaySpentUsd = persisted.transactions
      .filter((tx) => tx.status === 'confirmed' && tx.type === 'send' && new Date(tx.timestamp).getTime() >= oneDayAgo)
      .reduce((sum, tx) => {
        const out = tx.balanceDiffs.filter((d) => d.direction === 'out').reduce((s, d) => s + d.usdValue, 0);
        return sum + out;
      }, 0);

    const atRiskApprovalsCount = persisted.approvals.filter((a) => a.riskLevel !== 'safe').length;
    const blockedThreatsCount = persisted.transactions.filter((tx) => tx.status === 'blocked').length;

    return {
      totalPortfolioUsd,
      change24hUsd: weightedChangeUsd,
      change24hPct,
      todaySpentUsd,
      atRiskApprovalsCount,
      blockedThreatsCount,
    };
  }, [persisted.approvals, persisted.assets, persisted.transactions]);

  const value: WalletContextValue = {
    mode: persisted.mode,
    setMode,
    activeTab,
    setActiveTab,
    isLocked,
    lockVault: () => setIsLocked(true),
    unlockVault: () => setIsLocked(false),
    assets: persisted.assets,
    transactions: persisted.transactions,
    approvals: persisted.approvals,
    settings: persisted.settings,
    nonce: persisted.nonce,
    ...metrics,
    actionDrawer,
    openActionDrawer,
    closeActionDrawer,
    executeSimulation,
    recordBlockedSimulation,
    simulateIncomingReceive,
    revokeApproval,
    updateSettings,
    resetSandbox,
    toasts,
    addToast,
    dismissToast,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error('useWallet must be used inside WalletProvider');
  }
  return ctx;
}
