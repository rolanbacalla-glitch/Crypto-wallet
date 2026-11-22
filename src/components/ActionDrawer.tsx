import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDownUp,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Shield,
  ShieldAlert,
  X,
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import {
  formatFiat,
  formatTokenAmount,
  NETWORKS,
  SEND_PRESETS,
  SWAP_SCENARIOS,
} from '../data/initialWalletData';
import {
  generateQrMatrix,
  isValidRecipientInput,
  simulateSendTransaction,
  simulateSwapTransaction,
} from '../engine/simulator';
import {
  APPLE_REDUCED_CROSSFADE,
  APPLE_SPRING_NAV_PUSH,
  APPLE_SPRING_SNAPPY,
} from '../motion/appleMotion';
import type {
  ActionDrawerTab,
  GasSpeed,
  MevRelay,
  NetworkId,
  SimulationResult,
} from '../types/wallet';
import { PreSignSimulationSheet } from './PreSignSimulationSheet';
import { SlideOverSheet } from './SlideOverSheet';
import { SlidingSegmentedControl } from './SlidingSegmentedControl';
import { TokenIcon } from './TokenIcon';

const RECEIVE_NETWORK_ORDER: Record<NetworkId, number> = {
  ethereum: 0,
  base: 1,
  arbitrum: 2,
  optimism: 3,
};

const TAB_ORDER: Record<ActionDrawerTab, number> = {
  send: 0,
  swap: 1,
  receive: 2,
};

export function ActionDrawer() {
  const {
    actionDrawer,
    closeActionDrawer,
    openActionDrawer,
    assets,
    mode,
    settings,
    todaySpentUsd,
    nonce,
    simulateIncomingReceive,
    addToast,
  } = useWallet();

  const prefersReducedMotion = useReducedMotion();
  const [activeSimulation, setActiveSimulation] = useState<SimulationResult | null>(null);
  const prevTabRef = useRef<ActionDrawerTab>(actionDrawer.tab);
  const [tabDirection, setTabDirection] = useState<number>(1);

  // Send Form State
  const [sendTokenId, setSendTokenId] = useState<string>(assets[0]?.id || 'eth-mainnet');
  const [sendAmount, setSendAmount] = useState<string>('1.25');
  const [recipientInput, setRecipientInput] = useState<string>(SEND_PRESETS[0].address);
  const [gasSpeed, setGasSpeed] = useState<GasSpeed>('standard');
  const [mevRelay, setMevRelay] = useState<MevRelay>(settings.defaultMevRelay);

  // Swap Form State
  const [swapFromId, setSwapFromId] = useState<string>('eth-mainnet');
  const [swapToId, setSwapToId] = useState<string>('usdc-mainnet');
  const [swapAmount, setSwapAmount] = useState<string>('1.5');
  const [slippagePct, setSlippagePct] = useState<number>(0.5);
  const [swapVenue, setSwapVenue] = useState<string>('Uniswap V3 · 0.05% Pool');
  const [forcedPriceImpactPct, setForcedPriceImpactPct] = useState<number | undefined>(undefined);
  const [maliciousSwapFlag, setMaliciousSwapFlag] = useState<boolean>(false);
  const [selectedSwapScenarioId, setSelectedSwapScenarioId] = useState<string>('swap-verified');

  // Receive Form State
  const [receiveNetwork, setReceiveNetwork] = useState<NetworkId>('ethereum');
  const [receiveNetDir, setReceiveNetDir] = useState<number>(1);
  const prevReceiveNetRef = useRef<NetworkId>('ethereum');
  const [requestSymbol, setRequestSymbol] = useState<string>('USDC');
  const [requestAmount, setRequestAmount] = useState<string>('');
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleReceiveNetworkChange = (next: NetworkId) => {
    if (next === prevReceiveNetRef.current) return;
    setReceiveNetDir(RECEIVE_NETWORK_ORDER[next] > RECEIVE_NETWORK_ORDER[prevReceiveNetRef.current] ? 1 : -1);
    prevReceiveNetRef.current = next;
    setReceiveNetwork(next);
  };

  useEffect(() => {
    if (prevTabRef.current !== actionDrawer.tab) {
      setTabDirection(TAB_ORDER[actionDrawer.tab] > TAB_ORDER[prevTabRef.current] ? 1 : -1);
      prevTabRef.current = actionDrawer.tab;
    }
  }, [actionDrawer.tab]);

  useEffect(() => {
    if (actionDrawer.open) {
      setActiveSimulation(null);
      setMevRelay(settings.defaultMevRelay);
      if (actionDrawer.preselectedTokenId) {
        const found = assets.find((a) => a.id === actionDrawer.preselectedTokenId);
        if (found) {
          if (actionDrawer.tab === 'send') {
            setSendTokenId(found.id);
          } else if (actionDrawer.tab === 'swap') {
            setSwapFromId(found.id);
            const peer = assets.find((a) => a.network === found.network && a.id !== found.id);
            if (peer) setSwapToId(peer.id);
          }
        }
      }
    }
  }, [actionDrawer.open, actionDrawer.preselectedTokenId, actionDrawer.tab, assets, settings.defaultMevRelay]);

  const selectedSendToken = assets.find((a) => a.id === sendTokenId) || assets[0];
  const parsedSendAmount = Number(sendAmount);
  const sendAmountUsd =
    Number.isFinite(parsedSendAmount) && parsedSendAmount > 0
      ? parsedSendAmount * selectedSendToken.priceUsd
      : 0;

  const sendValidationError = useMemo(() => {
    if (!sendAmount.trim()) return 'Enter an amount to transfer.';
    if (!Number.isFinite(parsedSendAmount) || parsedSendAmount <= 0) return 'Amount must be greater than zero.';
    if (parsedSendAmount > selectedSendToken.balance) {
      return `Insufficient ${selectedSendToken.symbol} balance (${formatTokenAmount(selectedSendToken.balance)} available).`;
    }
    if (!recipientInput.trim()) return 'Enter a recipient address or ENS name.';
    if (!isValidRecipientInput(recipientInput)) {
      return 'Enter a valid 0x Ethereum address or .eth ENS name.';
    }
    return null;
  }, [parsedSendAmount, recipientInput, selectedSendToken.balance, selectedSendToken.symbol, sendAmount]);

  const fromToken = assets.find((a) => a.id === swapFromId) || assets[0];
  const sameNetworkTargets = useMemo(
    () => assets.filter((a) => a.network === fromToken.network && a.id !== fromToken.id),
    [assets, fromToken.id, fromToken.network]
  );
  const toToken =
    sameNetworkTargets.find((a) => a.id === swapToId) ||
    sameNetworkTargets[0] ||
    assets.find((a) => a.id !== fromToken.id) ||
    assets[1];

  const parsedSwapAmount = Number(swapAmount);
  const swapQuote = useMemo(() => {
    if (!Number.isFinite(parsedSwapAmount) || parsedSwapAmount <= 0 || !toToken) {
      return { outAmount: 0, rate: 0, impactPct: 0, minReceived: 0 };
    }
    const inputUsd = parsedSwapAmount * fromToken.priceUsd;
    const impactPct =
      forcedPriceImpactPct !== undefined
        ? forcedPriceImpactPct
        : Number(Math.min(1.85, Math.max(0.04, (inputUsd / 450_000) * 1.4)).toFixed(2));
    const effectiveOutUsd = inputUsd * (1 - impactPct / 100 - 0.0005);
    const outAmount = effectiveOutUsd / toToken.priceUsd;
    const rate = outAmount / parsedSwapAmount;
    const minReceived = outAmount * (1 - slippagePct / 100);
    return { outAmount, rate, impactPct, minReceived };
  }, [forcedPriceImpactPct, fromToken.priceUsd, parsedSwapAmount, slippagePct, toToken]);

  const swapValidationError = useMemo(() => {
    if (!toToken) return 'No swap pair available on this network.';
    if (!swapAmount.trim()) return 'Enter an amount to swap.';
    if (!Number.isFinite(parsedSwapAmount) || parsedSwapAmount <= 0) return 'Swap amount must be greater than zero.';
    if (parsedSwapAmount > fromToken.balance) {
      return `Insufficient ${fromToken.symbol} balance (${formatTokenAmount(fromToken.balance)} available).`;
    }
    return null;
  }, [fromToken.balance, fromToken.symbol, parsedSwapAmount, swapAmount, toToken]);

  const paymentUri = useMemo(() => {
    const chainId = NETWORKS[receiveNetwork].chainId;
    const base = `ethereum:${settings.walletAddress}@${chainId}`;
    const amt = Number(requestAmount);
    if (Number.isFinite(amt) && amt > 0) {
      return `${base}?asset=${requestSymbol}&amount=${amt}`;
    }
    return base;
  }, [receiveNetwork, requestAmount, requestSymbol, settings.walletAddress]);

  const qrMatrix = useMemo(() => generateQrMatrix(paymentUri), [paymentUri]);

  const handleSimulateSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (sendValidationError) return;
    const sim = simulateSendTransaction({
      token: selectedSendToken,
      amount: parsedSendAmount,
      recipientInput,
      gasSpeed,
      mevRelay,
      settings,
      todaySpentUsd,
      nonce,
    });
    setActiveSimulation(sim);
  };

  const handleSimulateSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (swapValidationError || !toToken) return;
    const sim = simulateSwapTransaction({
      fromToken,
      toToken,
      fromAmount: parsedSwapAmount,
      slippagePct,
      gasSpeed,
      mevRelay,
      venue: swapVenue,
      forcedPriceImpactPct,
      maliciousContract: maliciousSwapFlag,
      settings,
      nonce,
    });
    setActiveSimulation(sim);
  };

  const handleSelectSwapScenario = (scenarioId: string) => {
    const scenario = SWAP_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;
    setSelectedSwapScenarioId(scenario.id);
    setSwapFromId(scenario.fromTokenId);
    setSwapToId(scenario.toTokenId);
    setSwapAmount(scenario.amount);
    setSwapVenue(scenario.venue);
    setForcedPriceImpactPct(scenario.forcedPriceImpactPct);
    setMaliciousSwapFlag(Boolean(scenario.maliciousContract));
  };

  const handleFlipSwapTokens = () => {
    if (!toToken) return;
    const prevFrom = fromToken.id;
    setSwapFromId(toToken.id);
    setSwapToId(prevFrom);
    setForcedPriceImpactPct(undefined);
    setMaliciousSwapFlag(false);
    setSelectedSwapScenarioId('custom');
    setSwapVenue('Uniswap V3 · 0.05% Pool');
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(settings.walletAddress);
    } catch {
      // Clipboard API may be blocked in restricted iframes; still show confirmation
    }
    setCopiedAddress(true);
    addToast({
      tone: 'success',
      title: 'Vault address copied',
      detail: `${settings.ensName} (${NETWORKS[receiveNetwork].shortName})`,
    });
    window.setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleSimulateTestDeposit = () => {
    const amt = Number(requestAmount) > 0 ? Number(requestAmount) : requestSymbol === 'ETH' ? 0.5 : 500;
    simulateIncomingReceive(receiveNetwork, requestSymbol, amt);
  };

  const switchTab = (tab: ActionDrawerTab) => {
    setActiveSimulation(null);
    openActionDrawer(tab);
  };

  const navTransition = prefersReducedMotion ? APPLE_REDUCED_CROSSFADE : APPLE_SPRING_NAV_PUSH;
  const tabTransition = prefersReducedMotion ? APPLE_REDUCED_CROSSFADE : APPLE_SPRING_SNAPPY;

  return (
    <SlideOverSheet
      open={actionDrawer.open}
      onClose={closeActionDrawer}
      ariaLabel="Transaction action center"
      side="right"
      maxWidthClass="sm:max-w-[520px]"
    >
      {/* Drawer Header */}
      <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="font-display text-lg font-semibold text-[#F3F5F8]">
            {activeSimulation
              ? 'Pre-sign simulation'
              : actionDrawer.tab === 'send'
                ? 'Send assets'
                : actionDrawer.tab === 'swap'
                  ? 'Swap assets'
                  : 'Receive assets'}
          </h2>
          <p className="text-xs text-[#9AA4B2] mt-0.5">
            {activeSimulation
              ? mode === 'sentinel'
                ? 'Inspecting calldata, state diff, and threat heuristics'
                : 'Verified preview of what leaves and enters your vault'
              : 'Every outgoing transaction is simulated before signing'}
          </p>
        </div>
        <button
          type="button"
          onClick={closeActionDrawer}
          aria-label="Close panel"
          className="w-9 h-9 rounded-lg border border-white/[0.08] hover:bg-white/[0.06] flex items-center justify-center text-[#9AA4B2] hover:text-white transition-colors focus-ring shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* iOS Segmented Tab Switcher (slides smoothly out during simulation push) */}
      <AnimatePresence initial={false}>
        {!activeSimulation && (
          <motion.div
            key="drawer-tab-bar"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={tabTransition}
            className="px-6 pt-4 shrink-0"
          >
            <LayoutGroup id="action-drawer-tabs">
              <div className="grid grid-cols-3 gap-1 p-1 glass-control relative">
                {(['send', 'swap', 'receive'] as ActionDrawerTab[]).map((tab) => {
                  const isActive = actionDrawer.tab === tab;
                  const Icon = tab === 'send' ? ArrowUpRight : tab === 'swap' ? ArrowDownUp : Download;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => switchTab(tab)}
                      className={`relative flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-colors whitespace-nowrap focus-ring ${
                        isActive ? 'text-[#F4F7FB]' : 'text-[#9EA9B8] hover:text-[#F4F7FB]'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="actionDrawerTabThumb"
                          transition={tabTransition}
                          className="absolute inset-0 rounded-lg glass-thumb"
                        />
                      )}
                      <Icon className="w-3.5 h-3.5 relative z-10" />
                      <span className="capitalize relative z-10">{tab}</span>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drawer Body with iOS UINavigationController Push / Pop Parallax */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-5 relative">
        {activeSimulation ? (
          <motion.div
            key="simulation-push-view"
            initial={prefersReducedMotion ? { opacity: 0 } : { x: '22%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={navTransition}
          >
            <PreSignSimulationSheet
              simulation={activeSimulation}
              onBack={() => setActiveSimulation(null)}
              onComplete={() => {
                setActiveSimulation(null);
                closeActionDrawer();
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key={`form-view-${actionDrawer.tab}`}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { x: tabDirection * 24, opacity: 0 }
            }
            animate={{ x: 0, opacity: 1 }}
            transition={navTransition}
          >
              {actionDrawer.tab === 'send' ? (
                <form onSubmit={handleSimulateSend} className="space-y-5">
                  {/* Token Selector */}
                  <div className="space-y-2">
                    <label htmlFor="send-asset" className="block text-xs font-medium text-[#9AA4B2]">
                      Asset & network
                    </label>
                    <select
                      id="send-asset"
                      value={sendTokenId}
                      onChange={(e) => setSendTokenId(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-lg bg-[#090B0E] border border-white/[0.1] text-sm text-[#F3F5F8] focus:border-emerald-400/60 focus:outline-none"
                    >
                      {assets.map((asset) => (
                        <option key={asset.id} value={asset.id}>
                          {asset.symbol} · {NETWORKS[asset.network].shortName} — {formatTokenAmount(asset.balance)} available
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Amount Input */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <label htmlFor="send-amount" className="font-medium text-[#9AA4B2]">
                        Amount
                      </label>
                      <span className="text-[#9AA4B2] font-mono tabular-nums">
                        Balance: {formatTokenAmount(selectedSendToken.balance)} {selectedSendToken.symbol}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#090B0E] border border-white/[0.1] focus-within:border-emerald-400/60">
                      <TokenIcon symbol={selectedSendToken.symbol} size={28} />
                      <input
                        id="send-amount"
                        type="number"
                        step="any"
                        min="0"
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                        placeholder="0.00"
                        className="flex-1 bg-transparent text-lg font-mono tabular-nums text-[#F3F5F8] placeholder:text-[#6B7686] focus:outline-none min-w-0"
                      />
                      <span className="text-xs font-mono tabular-nums text-[#9AA4B2] shrink-0">
                        {formatFiat(sendAmountUsd, settings.currency)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {[0.25, 0.5, 1].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() =>
                            setSendAmount(String(Number((selectedSendToken.balance * pct).toFixed(4))))
                          }
                          className="px-2.5 py-1 rounded-md text-xs font-mono tabular-nums bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#C7D0DC] transition-colors whitespace-nowrap"
                        >
                          {pct === 1 ? 'Max' : `${pct * 100}%`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recipient Input */}
                  <div className="space-y-2">
                    <label htmlFor="send-recipient" className="block text-xs font-medium text-[#9AA4B2]">
                      Recipient address or ENS
                    </label>
                    <input
                      id="send-recipient"
                      type="text"
                      value={recipientInput}
                      onChange={(e) => setRecipientInput(e.target.value)}
                      placeholder="0x… or name.eth"
                      className="w-full h-11 px-3.5 rounded-lg bg-[#090B0E] border border-white/[0.1] font-mono text-xs text-[#F3F5F8] placeholder:text-[#6B7686] focus:border-emerald-400/60 focus:outline-none"
                    />
                  </div>

                  {/* Quick Safety Test Presets */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-[#9AA4B2]">
                      Contacts & threat simulation presets
                    </p>
                    <div className="grid grid-cols-1 gap-1.5">
                      {SEND_PRESETS.map((preset) => {
                        const selected = recipientInput.toLowerCase() === preset.address.toLowerCase();
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => setRecipientInput(preset.address)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg border transition-colors ${
                              selected
                                ? 'bg-[#18202B] border-white/[0.18]'
                                : 'bg-[#0D1015] border-white/[0.06] hover:border-white/[0.12]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-medium text-[#F3F5F8] flex items-center gap-1.5">
                                {preset.category === 'threat' && (
                                  <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
                                )}
                                {preset.label}
                              </span>
                              <span
                                className={`text-[11px] shrink-0 ${
                                  preset.category === 'threat'
                                    ? 'text-red-400'
                                    : preset.category === 'unverified'
                                      ? 'text-amber-400'
                                      : 'text-emerald-400'
                                }`}
                              >
                                {preset.category === 'threat'
                                  ? 'Critical test'
                                  : preset.category === 'unverified'
                                    ? 'Caution test'
                                    : 'Verified'}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#9AA4B2] mt-0.5">{preset.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sentinel Execution Controls */}
                  {mode === 'sentinel' && (
                    <div className="p-3.5 rounded-xl bg-[#0D1015] border border-sky-400/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-sky-300">Sentinel execution controls</span>
                        <span className="text-[11px] font-mono tabular-nums text-[#9AA4B2]">
                          Base {NETWORKS[selectedSendToken.network].baseFeeGwei} gwei
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <span className="block text-[11px] text-[#9AA4B2]">Priority speed</span>
                          <SlidingSegmentedControl<GasSpeed>
                            layoutId="sendGasSpeedThumb"
                            ariaLabel="Priority gas speed"
                            value={gasSpeed}
                            onChange={setGasSpeed}
                            size="xs"
                            fullWidth
                            options={[
                              { value: 'standard', label: 'Std', accent: 'sky' },
                              { value: 'fast', label: 'Fast', accent: 'sky' },
                              { value: 'priority', label: 'Max', accent: 'sky' },
                            ]}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="send-mev-relay" className="block text-[11px] text-[#9AA4B2]">
                            MEV orderflow relay
                          </label>
                          <select
                            id="send-mev-relay"
                            value={mevRelay}
                            onChange={(e) => setMevRelay(e.target.value as MevRelay)}
                            className="w-full h-8 px-2 rounded-md bg-[#090B0E] border border-white/[0.08] text-xs text-[#F3F5F8] focus:outline-none"
                          >
                            <option value="flashbots">Flashbots Protect</option>
                            <option value="mev-blocker">MEV Blocker</option>
                            <option value="public">Public Mempool</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {sendValidationError && (
                    <p className="text-xs text-amber-300">{sendValidationError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={Boolean(sendValidationError)}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-specular focus-ring ${
                      mode === 'sentinel'
                        ? 'bg-sky-500 hover:bg-sky-400 text-[#05131E]'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-[#04140D]'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Review & simulate transfer</span>
                  </button>
                </form>
              ) : actionDrawer.tab === 'swap' ? (
                <form onSubmit={handleSimulateSwap} className="space-y-5">
                  {/* Curated Scenario Strip */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-[#9AA4B2]">Swap test scenarios</p>
                    <div className="grid grid-cols-1 gap-1.5">
                      {SWAP_SCENARIOS.map((sc) => {
                        const selected = selectedSwapScenarioId === sc.id;
                        return (
                          <button
                            key={sc.id}
                            type="button"
                            onClick={() => handleSelectSwapScenario(sc.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg border transition-colors ${
                              selected
                                ? 'bg-[#18202B] border-white/[0.18]'
                                : 'bg-[#0D1015] border-white/[0.06] hover:border-white/[0.12]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-medium text-[#F3F5F8]">{sc.label}</span>
                              <span
                                className={`text-[11px] shrink-0 ${
                                  sc.category === 'threat'
                                    ? 'text-red-400'
                                    : sc.category === 'caution'
                                      ? 'text-amber-400'
                                      : 'text-emerald-400'
                                }`}
                              >
                                {sc.category === 'threat'
                                  ? 'Permit trap'
                                  : sc.category === 'caution'
                                    ? 'High impact'
                                    : 'Safe route'}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#9AA4B2] mt-0.5">{sc.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pay Input */}
                  <div className="p-4 glass-recessed space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#9AA4B2]">
                      <span>You pay</span>
                      <span className="font-mono tabular-nums">
                        Balance: {formatTokenAmount(fromToken.balance)} {fromToken.symbol}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        aria-label="Token to pay"
                        value={fromToken.id}
                        onChange={(e) => {
                          const nextFrom = assets.find((a) => a.id === e.target.value);
                          if (!nextFrom) return;
                          setSwapFromId(nextFrom.id);
                          const nextTarget = assets.find(
                            (a) => a.network === nextFrom.network && a.id !== nextFrom.id
                          );
                          if (nextTarget) setSwapToId(nextTarget.id);
                          setForcedPriceImpactPct(undefined);
                          setMaliciousSwapFlag(false);
                          setSelectedSwapScenarioId('custom');
                          setSwapVenue('Uniswap V3 · 0.05% Pool');
                        }}
                        className="h-10 px-3 rounded-lg bg-[#161B22] border border-white/[0.1] text-sm font-medium text-[#F3F5F8] focus:outline-none"
                      >
                        {assets.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.symbol} ({NETWORKS[a.network].shortName})
                          </option>
                        ))}
                      </select>
                      <input
                        aria-label="Swap input amount"
                        type="number"
                        step="any"
                        min="0"
                        value={swapAmount}
                        onChange={(e) => {
                          setSwapAmount(e.target.value);
                          if (selectedSwapScenarioId !== 'swap-drainer') {
                            setForcedPriceImpactPct(undefined);
                          }
                        }}
                        placeholder="0.00"
                        className="flex-1 bg-transparent text-right text-xl font-mono tabular-nums font-semibold text-[#F3F5F8] placeholder:text-[#6B7686] focus:outline-none min-w-0"
                      />
                    </div>
                  </div>

                  {/* Flip Button */}
                  <div className="flex justify-center -my-2 relative z-10">
                    <button
                      type="button"
                      onClick={handleFlipSwapTokens}
                      aria-label="Flip swap direction"
                      className="w-9 h-9 rounded-lg bg-[#161B22] border border-white/[0.12] hover:bg-[#1E2530] flex items-center justify-center text-[#C7D0DC] transition-colors focus-ring"
                    >
                      <ArrowDownUp className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Receive Quote */}
                  <div className="p-4 glass-recessed space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#9AA4B2]">
                      <span>Estimated receive</span>
                      <span className="font-mono tabular-nums">
                        {toToken ? NETWORKS[toToken.network].shortName : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        aria-label="Token to receive"
                        value={toToken?.id || ''}
                        onChange={(e) => {
                          setSwapToId(e.target.value);
                          setForcedPriceImpactPct(undefined);
                          setMaliciousSwapFlag(false);
                          setSelectedSwapScenarioId('custom');
                        }}
                        className="h-10 px-3 rounded-lg bg-[#161B22] border border-white/[0.1] text-sm font-medium text-[#F3F5F8] focus:outline-none"
                      >
                        {(sameNetworkTargets.length > 0 ? sameNetworkTargets : assets.filter((a) => a.id !== fromToken.id)).map(
                          (a) => (
                            <option key={a.id} value={a.id}>
                              {a.symbol} ({NETWORKS[a.network].shortName})
                            </option>
                          )
                        )}
                      </select>
                      <div className="flex-1 text-right font-mono tabular-nums text-xl font-semibold text-[#F3F5F8] truncate">
                        {formatTokenAmount(swapQuote.outAmount)}
                      </div>
                    </div>
                  </div>

                  {/* Route Summary */}
                  <div className="p-3.5 glass-recessed space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#9AA4B2]">Route venue</span>
                      <span className="text-[#F3F5F8] font-medium">{swapVenue}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#9AA4B2]">Rate</span>
                      <span className="font-mono tabular-nums text-[#F3F5F8]">
                        1 {fromToken.symbol} = {formatTokenAmount(swapQuote.rate)} {toToken?.symbol}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#9AA4B2]">Price impact</span>
                      <span
                        className={`font-mono tabular-nums font-medium ${
                          swapQuote.impactPct >= 3 ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        -{swapQuote.impactPct.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#9AA4B2]">Minimum received</span>
                      <span className="font-mono tabular-nums text-[#C7D0DC]">
                        {formatTokenAmount(swapQuote.minReceived)} {toToken?.symbol}
                      </span>
                    </div>
                  </div>

                  {/* Sentinel Slippage & MEV Controls */}
                  {mode === 'sentinel' && (
                    <div className="p-3.5 rounded-xl bg-[#0D1015] border border-sky-400/20 space-y-3">
                      <span className="block text-xs font-medium text-sky-300">
                        Sentinel execution controls
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <span className="block text-[11px] text-[#9AA4B2]">Max slippage</span>
                          <SlidingSegmentedControl<string>
                            layoutId="swapSlippageThumb"
                            ariaLabel="Max swap slippage"
                            value={String(slippagePct)}
                            onChange={(val) => setSlippagePct(Number(val))}
                            size="xs"
                            fullWidth
                            mono
                            options={[
                              { value: '0.1', label: '0.1%', accent: 'sky' },
                              { value: '0.5', label: '0.5%', accent: 'sky' },
                              { value: '1', label: '1%', accent: 'sky' },
                            ]}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="swap-mev-relay" className="block text-[11px] text-[#9AA4B2]">
                            MEV orderflow relay
                          </label>
                          <select
                            id="swap-mev-relay"
                            value={mevRelay}
                            onChange={(e) => setMevRelay(e.target.value as MevRelay)}
                            className="w-full h-8 px-2 rounded-md bg-[#090B0E] border border-white/[0.08] text-xs text-[#F3F5F8] focus:outline-none"
                          >
                            <option value="flashbots">Flashbots Protect</option>
                            <option value="mev-blocker">MEV Blocker</option>
                            <option value="public">Public Mempool</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {swapValidationError && (
                    <p className="text-xs text-amber-300">{swapValidationError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={Boolean(swapValidationError)}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-specular focus-ring ${
                      mode === 'sentinel'
                        ? 'bg-sky-500 hover:bg-sky-400 text-[#05131E]'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-[#04140D]'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Simulate swap before signing</span>
                  </button>
                </form>
              ) : (
                /* RECEIVE TAB */
                <div className="space-y-5">
                  {/* Network Selector with Sliding Glass Thumb */}
                  <div className="space-y-2">
                    <span className="block text-xs font-medium text-[#9AA4B2]">Receiving network</span>
                    <SlidingSegmentedControl<NetworkId>
                      layoutId="receiveNetworkThumb"
                      ariaLabel="Select receiving network"
                      value={receiveNetwork}
                      onChange={handleReceiveNetworkChange}
                      fullWidth
                      options={[
                        { value: 'ethereum', label: NETWORKS.ethereum.shortName },
                        { value: 'base', label: NETWORKS.base.shortName },
                        { value: 'arbitrum', label: NETWORKS.arbitrum.shortName },
                        { value: 'optimism', label: NETWORKS.optimism.shortName },
                      ]}
                    />
                  </div>

                  {/* QR Display with Directional Slide on Network Change */}
                  <motion.div
                    key={receiveNetwork}
                    initial={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { x: receiveNetDir * 20, opacity: 0 }
                    }
                    animate={{ x: 0, opacity: 1 }}
                    transition={navTransition}
                    className="p-6 glass-recessed flex flex-col items-center text-center space-y-4"
                  >
                    <div className="p-3.5 rounded-xl bg-white">
                      <svg
                        width="180"
                        height="180"
                        viewBox={`0 0 ${qrMatrix.length} ${qrMatrix.length}`}
                        shapeRendering="crispEdges"
                        role="img"
                        aria-label={`Deposit QR code for ${settings.walletAddress} on ${NETWORKS[receiveNetwork].name}`}
                      >
                        <rect width={qrMatrix.length} height={qrMatrix.length} fill="#FFFFFF" />
                        {qrMatrix.map((row, rIdx) =>
                          row.map((cell, cIdx) =>
                            cell ? (
                              <rect
                                key={`${rIdx}-${cIdx}`}
                                x={cIdx}
                                y={rIdx}
                                width={1}
                                height={1}
                                fill="#090B0E"
                              />
                            ) : null
                          )
                        )}
                      </svg>
                    </div>

                    <div className="space-y-1 max-w-full">
                      <p className="text-sm font-medium text-[#F3F5F8]">{settings.ensName}</p>
                      <p className="font-mono text-xs text-[#9AA4B2] break-all px-2">
                        {settings.walletAddress}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-medium text-[#F3F5F8] transition-colors whitespace-nowrap focus-ring"
                    >
                      {copiedAddress ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Address copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy vault address</span>
                        </>
                      )}
                    </button>
                  </motion.div>

                  {/* Optional Payment Request */}
                  <div className="p-4 rounded-xl bg-[#0D1015] border border-white/[0.08] space-y-3">
                    <h4 className="text-xs font-medium text-[#C7D0DC]">
                      Request specific amount (optional)
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        aria-label="Requested asset"
                        value={requestSymbol}
                        onChange={(e) => setRequestSymbol(e.target.value)}
                        className="h-10 px-2.5 rounded-lg bg-[#090B0E] border border-white/[0.1] text-xs text-[#F3F5F8] focus:outline-none"
                      >
                        <option value="USDC">USDC</option>
                        <option value="ETH">ETH</option>
                        <option value="WBTC">WBTC</option>
                        <option value="rETH">rETH</option>
                      </select>
                      <input
                        aria-label="Requested amount"
                        type="number"
                        min="0"
                        step="any"
                        value={requestAmount}
                        onChange={(e) => setRequestAmount(e.target.value)}
                        placeholder="Amount"
                        className="col-span-2 h-10 px-3 rounded-lg bg-[#090B0E] border border-white/[0.1] font-mono tabular-nums text-xs text-[#F3F5F8] placeholder:text-[#6B7686] focus:outline-none"
                      />
                    </div>
                    {mode === 'sentinel' && (
                      <p className="font-mono text-[11px] text-[#6B7686] break-all">
                        URI: {paymentUri}
                      </p>
                    )}
                  </div>

                  {/* Network Safety Notice + Sandbox Deposit Tester */}
                  <div className="p-3.5 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
                    Only send EVM-compatible assets on{' '}
                    <strong className="text-amber-200">{NETWORKS[receiveNetwork].name}</strong> (Chain ID{' '}
                    {NETWORKS[receiveNetwork].chainId}). Sending non-EVM tokens may result in permanent loss.
                  </div>

                  <button
                    type="button"
                    onClick={handleSimulateTestDeposit}
                    className="w-full py-2.5 px-4 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-medium text-[#F3F5F8] transition-colors focus-ring"
                  >
                    Simulate incoming test deposit (
                    {Number(requestAmount) > 0 ? requestAmount : requestSymbol === 'ETH' ? '0.5' : '500'}{' '}
                    {requestSymbol} on {NETWORKS[receiveNetwork].shortName})
                  </button>
                </div>
              )}
          </motion.div>
        )}
      </div>
    </SlideOverSheet>
  );
}
