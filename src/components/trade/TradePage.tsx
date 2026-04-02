import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCopilot } from '../../hooks/useCopilot';
import SafetyPreview from '../safety/SafetyPreview';

const TradePage: React.FC = () => {
  const { isAnalysing, report, analyse } = useCopilot();
  const [fromAmount, setFromAmount] = useState('1.0');
  const [hasStartedSimulation, setHasStartedSimulation] = useState(false);

  const startTradeSim = () => {
    setHasStartedSimulation(true);
    analyse('uniswap_v3_swap', 'advanced');
  };

  return (
    <div className="flex flex-col gap-10 items-center py-6">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight mb-1">Secure Swap</h1>
        <p className="text-text-dim font-medium max-w-md mx-auto">Trade assets with institutional-grade pre-trade verification</p>
      </div>

      <div className="w-full max-w-[500px] flex flex-col gap-6">
        {/* Swap Widget */}
        <div className="glass-frosted border border-white/10 rounded-[48px] p-8 flex flex-col gap-4 shadow-2xl">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted px-4">From Asset</span>
            <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-3xl p-4 hover:bg-white/10 transition-all group">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-black text-xs text-primary shadow-[0_0_15px_rgba(212,255,59,0.2)]">E</div>
              <div className="flex flex-col flex-1">
                <span className="text-xs font-black uppercase tracking-widest text-text-muted">Ethereum</span>
                <input
                  type="text"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="bg-transparent border-none text-2xl font-black italic tracking-tighter focus:outline-none w-full"
                  aria-label="Swap Amount"
                />
              </div>
              <span className="text-sm font-black italic text-text-dim">ETH</span>
            </div>
          </div>

          <div className="flex justify-center -my-6 relative z-10">
            <div className="w-12 h-12 glass-frosted rounded-full flex items-center justify-center border border-white/10 hover:border-primary/50 transition-all cursor-pointer group shadow-xl">
              <span className="material-symbols-outlined text-text-dim group-hover:text-primary transition-colors">swap_vert</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted px-4">To Asset</span>
            <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-3xl p-4 hover:bg-white/10 transition-all group cursor-pointer border-dashed">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-black text-xs">?</div>
              <div className="flex flex-col flex-1">
                <span className="text-xs font-black uppercase tracking-widest text-text-muted">Select Target Asset</span>
                <span className="text-2xl font-black italic tracking-tighter text-text-muted">Select...</span>
              </div>
              <span className="material-symbols-outlined text-text-muted">expand_more</span>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-muted px-2">
              <span>Slippage Tolerance</span>
              <span className="text-primary">0.5% (Auto)</span>
            </div>
            <button
              onClick={startTradeSim}
              className="w-full bg-primary text-black h-14 rounded-full font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(212,255,59,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              disabled={isAnalysing}
            >
              {isAnalysing ? 'Analysing...' : 'Run Safety Simulation'}
            </button>
          </div>
        </div>

        {/* Safety Intelligence Integration */}
        {hasStartedSimulation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-frosted border border-primary/20 rounded-[48px] p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-primary text-2xl drop-shadow-[0_0_8px_rgba(212,255,59,0.5)]">security</span>
              <h3 className="text-lg font-black tracking-tight">Pre-Trade Intelligence</h3>
            </div>

            <SafetyPreview
              report={report}
              isAnalysing={isAnalysing}
              profile="advanced"
            />

            {!isAnalysing && report && report.riskLevel === 'low' && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full mt-10 bg-white/5 border border-primary/40 text-primary h-12 rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary/10 transition-all"
              >
                Sign Secure Transaction
              </motion.button>
            )}

            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[64px] rounded-full" />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TradePage;
