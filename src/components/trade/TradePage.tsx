import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCopilot } from '../../hooks/useCopilot';
import SafetyPreview from '../safety/SafetyPreview';
import { useSettings } from '../../context/SettingsContext';
import ConfirmButton from '../ui/ConfirmButton';
import { TOP_10_ASSETS, type Asset } from '../../data/assets';

const TradePage: React.FC = () => {
  const { persona, settings } = useSettings();
  const { isAnalysing, report, analyse } = useCopilot();
  const [fromAmount, setFromAmount] = useState('1.0');
  const [hasStartedSimulation, setHasStartedSimulation] = useState(false);

  const [fromAsset, setFromAsset] = useState<Asset>(() => {
    const defaultEth = TOP_10_ASSETS.find(a => a.symbol === 'ETH') || TOP_10_ASSETS[1];
    return defaultEth;
  });
  const [toAsset, setToAsset] = useState<Asset>(() => {
    const assetSymbol = new URLSearchParams(window.location.search).get('asset');
    const selected = assetSymbol ? TOP_10_ASSETS.find(a => a.symbol === assetSymbol) : null;
    const defaultUsdc = TOP_10_ASSETS.find(a => a.symbol === 'USDC') || TOP_10_ASSETS[5];

    if (selected && selected.symbol !== fromAsset.symbol) {
      return selected;
    }
    return defaultUsdc;
  });
  const [selectorTarget, setSelectorTarget] = useState<'from' | 'to' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAssets = useMemo(() => {
    return TOP_10_ASSETS.filter(a =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const swapAssets = useCallback(() => {
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
    setHasStartedSimulation(false);
  }, [fromAsset, toAsset]);

  const selectAsset = useCallback((asset: Asset) => {
    if (selectorTarget === 'from') {
      setFromAsset(asset);
    } else {
      setToAsset(asset);
    }
    setSelectorTarget(null);
    setHasStartedSimulation(false);
  }, [selectorTarget]);

  const startTradeSim = useCallback(() => {
    setHasStartedSimulation(true);
    analyse('uniswap_v3_swap', persona);
  }, [analyse, persona]);

  const exchangeRate = useMemo(() => {
    return fromAsset.price / toAsset.price;
  }, [fromAsset.price, toAsset.price]);

  const toAmount = useMemo(() => {
    const amount = parseFloat(fromAmount) || 0;
    const result = amount * exchangeRate;
    return result.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  }, [fromAmount, exchangeRate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-10 items-center py-6 relative"
    >
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight mb-1">Secure Swap</h1>
        <p className="text-text-dim font-medium max-w-md mx-auto">Trade assets with institutional-grade pre-trade verification</p>
      </div>

      <div className="w-full max-w-[500px] flex flex-col gap-6">
        {/* Swap Widget */}
        <div className="glass-frosted border border-white/10 rounded-[48px] p-8 flex flex-col gap-4 shadow-2xl relative">

          {/* From Asset */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted px-4">From Asset</span>
            <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-3xl p-4 hover:bg-white/10 transition-all group">
              <button
                onClick={() => setSelectorTarget('from')}
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 p-2 pr-4 rounded-2xl transition-colors border border-white/5"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-primary/10">
                  <img src={fromAsset.logo} alt={fromAsset.symbol} className="w-full h-full object-contain p-1" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-black uppercase tracking-tight">{fromAsset.symbol}</span>
                  <span className="material-symbols-outlined text-text-muted text-xs">expand_more</span>
                </div>
              </button>

              <div className="flex flex-col flex-1">
                <input
                  type="text"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="bg-transparent border-none text-2xl font-black tracking-tighter focus:outline-none w-full text-right"
                  placeholder="0.0"
                />
                <span className="text-[10px] text-text-muted font-medium text-right lowercase italic">
                  ≈ ${(parseFloat(fromAmount || '0') * fromAsset.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center -my-6 relative z-10">
            <button
              onClick={swapAssets}
              className="w-12 h-12 glass-frosted rounded-full flex items-center justify-center border border-white/10 hover:border-primary/50 transition-all cursor-pointer group shadow-xl active:scale-95"
            >
              <span className="material-symbols-outlined text-text-dim group-hover:text-primary transition-colors">swap_vert</span>
            </button>
          </div>

          {/* To Asset */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted px-4">To Asset</span>
            <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-3xl p-4 hover:bg-white/10 transition-all group">
              <button
                onClick={() => setSelectorTarget('to')}
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 p-2 pr-4 rounded-2xl transition-colors border border-white/5"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-primary/10">
                  <img src={toAsset.logo} alt={toAsset.symbol} className="w-full h-full object-contain p-1" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-black uppercase tracking-tight">{toAsset.symbol}</span>
                  <span className="material-symbols-outlined text-text-muted text-xs">expand_more</span>
                </div>
              </button>

              <div className="flex flex-col flex-1 text-right">
                <span className="text-2xl font-black tracking-tighter min-h-[32px]">
                  {toAmount}
                </span>
                <span className="text-[10px] text-text-muted font-medium lowercase italic">
                  1 {fromAsset.symbol} = {exchangeRate.toFixed(4)} {toAsset.symbol}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-muted px-2">
              <span>Slippage Tolerance</span>
              <span className="text-primary tabular-numbers">{settings.slippage}% (Auto)</span>
            </div>
            <button
              onClick={startTradeSim}
              className="w-full bg-primary text-black h-14 rounded-full font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(224,199,154,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              disabled={isAnalysing}
            >
              {isAnalysing ? 'Analysing...' : 'Run Safety Simulation'}
            </button>
          </div>

          {/* Asset Selector Overlay - FIXED SOLID BACKGROUND */}
          <AnimatePresence>
            {selectorTarget && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-sm border border-white/10 rounded-[48px] p-6 flex flex-col gap-4 overflow-hidden shadow-2xl"
              >
                <div className="flex justify-between items-center px-2">
                  <span className="text-xs font-black uppercase tracking-widest text-text-muted">Select Asset</span>
                  <button onClick={() => { setSelectorTarget(null); setSearchTerm(''); }} className="material-symbols-outlined text-text-muted hover:text-white">close</button>
                </div>

                <div className="px-2">
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors text-sm">search</span>
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search name or address..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-800/90 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-xs font-black tracking-tight focus:outline-none focus:border-primary/50 focus:bg-slate-800/100 transition-all placeholder:text-text-muted"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 overflow-y-auto max-h-full pr-2 custom-scrollbar">
                  {filteredAssets.map((asset, index) => (
                    <motion.button
                      key={asset.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.1)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectAsset(asset)}
                      className="flex items-center gap-4 p-4 rounded-3xl transition-all border border-transparent hover:border-white/20 bg-slate-800/80 text-left group"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                        <img src={asset.logo} alt={asset.name} className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-sm font-black tracking-tight">{asset.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium text-text-muted uppercase">{asset.symbol}</span>
                          <span className="text-[10px] font-black text-primary/80 lowercase italic">
                            bal: {asset.balance.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-black">${asset.price.toLocaleString()}</span>
                      </div>
                    </motion.button>
                  ))}
                  {filteredAssets.length === 0 && (
                    <div className="p-8 text-center flex flex-col items-center gap-3 bg-slate-800/50 rounded-2xl">
                      <span className="material-symbols-outlined text-text-muted text-4xl">search_off</span>
                      <span className="text-sm font-black text-text-muted italic uppercase">No assets found</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Safety Intelligence Integration */}
        {hasStartedSimulation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-frosted border border-primary/20 rounded-[48px] p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-primary text-2xl drop-shadow-[0_0_8px_rgba(224,199,154,0.5)]">security</span>
              <h3 className="text-lg font-black tracking-tight">Pre-Trade Intelligence</h3>
            </div>

            <SafetyPreview
              report={report}
              isAnalysing={isAnalysing}
              profile={persona}
            />

            {!isAnalysing && report && (
              <ConfirmButton
                onConfirm={() => alert('Transaction Signed Safely!')}
                label="Sign Secure Transaction"
                risk={report.riskLevel}
                className="mt-10"
              />
            )}

            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[64px] rounded-full" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TradePage;