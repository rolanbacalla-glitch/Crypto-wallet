import React from 'react';
import { motion } from 'framer-motion';

interface HyperSimulationProps {
  growth: number;
}

const HyperSimulation: React.FC<HyperSimulationProps> = ({ growth }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8"
    >
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-sm text-primary">auto_graph</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Temporal Synthesis Engine</span>
        </div>
        <h3 className="text-2xl font-black tracking-tight leading-snug">
          30-Day Predictive Analysis
        </h3>
      </div>

      {/* Futuristic Chart Area */}
      <div className="h-[240px] glass-frosted rounded-[48px] relative overflow-hidden p-8 border border-white/5 group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-primary-soft)_0%,transparent_60%)] opacity-20" />
        
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
        
        {/* The "Chart" - animated path */}
        <svg className="absolute inset-0 w-full h-full p-8 overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="1" />
            </linearGradient>
          </defs>
          <motion.path
            d="M 0 160 Q 40 150, 80 140 T 160 110 T 240 80 T 320 40"
            fill="transparent"
            stroke="url(#chartGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          {/* Glowing dot at the end */}
          <motion.circle
            cx="320"
            cy="40"
            r="6"
            fill="var(--color-primary)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="shadow-[0_0_20px_var(--color-primary)]"
          />
        </svg>

        {/* Floating Metrics */}
        <div className="flex flex-col justify-end h-full relative z-10 gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-primary">+{growth}%</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Estimated ROI</span>
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-text-dim mb-1">Confidence</span>
              <span className="text-xs font-bold">92.4% Neural Fit</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-text-dim mb-1">Timeline</span>
              <span className="text-xs font-bold">May 05, 2026</span>
            </div>
          </div>
        </div>

        {/* Scanning Line */}
        <motion.div 
          className="absolute top-0 bottom-0 w-1 bg-primary/20 backdrop-blur-sm shadow-[0_0_15px_var(--color-primary)] z-20"
          animate={{ left: ['0%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Narrative Summary */}
      <div className="flex flex-col gap-4">
        <p className="text-sm font-bold leading-relaxed text-text">
          Hyper-Simulation indicates that following this protocol will increase your exposure to low-risk algorithmic yields. 
          By the 30-day mark, your portfolio volatility index is expected to drop by 14% while maintains current growth trajectory.
        </p>
        
        {/* Risk Check */}
        <div className="flex items-center gap-4 p-5 glass-frosted border border-white/5 rounded-3xl">
          <div className="w-10 h-10 rounded-full bg-safe/10 border border-safe/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-safe">verified</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-safe">Protocol Verified</span>
            <span className="text-xs font-black text-white/90">No black swan events detected in current time-window.</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HyperSimulation;
