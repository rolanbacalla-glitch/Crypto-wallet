import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VaultManagement: React.FC = () => {
  const [isLocked, setIsLocked] = useState(true);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-10"
    >
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-safe/20 border border-safe/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-sm text-safe">encrypted</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">High-Security Custody</span>
        </div>
        <h3 className="text-2xl font-black tracking-tight leading-snug">
          Neural Vault Infrastructure
        </h3>
      </div>

      {/* Main Vault UI */}
      <div className="relative aspect-square max-w-[320px] mx-auto group">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-white/5 shadow-inner" />
        <motion.div 
          animate={{ rotate: isLocked ? 0 : 90 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="absolute inset-[15%] rounded-full border-2 border-primary/20 border-dashed"
        />

        {/* Inner Hub */}
        <div className="absolute inset-[30%] glass-frosted rounded-full border border-white/10 flex items-center justify-center z-10 overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
          
          <AnimatePresence mode="wait">
            {isLocked ? (
              <motion.div
                key="locked"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                className="flex flex-col items-center gap-2"
              >
                <span className="material-symbols-outlined text-5xl text-primary text-glow-primary">lock</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Encrypted</span>
              </motion.div>
            ) : (
              <motion.div
                key="unlocked"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                className="flex flex-col items-center gap-2"
              >
                <span className="material-symbols-outlined text-5xl text-safe text-glow-safe">lock_open</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Accessible</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Interaction Particles / Lines */}
        <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.line
              key={i}
              x1="50%"
              y1="50%"
              x2={`${50 + 40 * Math.cos((i * 45 * Math.PI) / 180)}%`}
              y2={`${50 + 40 * Math.sin((i * 45 * Math.PI) / 180)}%`}
              stroke="var(--color-primary)"
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ opacity: 0.1 }}
              animate={{ opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </svg>

        {/* Toggle Button Over the Vault */}
        <button 
          onClick={() => setIsLocked(!isLocked)}
          className="absolute inset-0 rounded-full z-20 cursor-pointer focus:outline-none"
          title="Toggle Vault Accessibility"
        />
      </div>

      {/* Vault Status/Control Card */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Active Protocol</span>
              <span className="text-sm font-bold text-white/90">Eschaton Time-Lock v4.2</span>
            </div>
            <div className="h-6 px-3 rounded-full bg-primary/10 border border-primary/20 flex items-center">
              <span className="text-[8px] font-black uppercase tracking-widest text-primary">Quantum-Proof</span>
            </div>
          </div>
          
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <p className="text-xs font-bold leading-relaxed text-text-dim">
            Your assets are distributed across {isLocked ? 'sealed' : 'thawing'} neural nodes. 
            Final transaction propagation requires {isLocked ? 'primary biometric' : 'secondary lattice'} verification.
          </p>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-4">
          <button className="h-16 glass-frosted border border-white/5 rounded-3xl flex flex-col items-center justify-center gap-1 group hover:border-primary/40 transition-all active:scale-[0.98]">
            <span className="material-symbols-outlined text-sm text-text-muted group-hover:text-primary transition-colors">history</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Logs</span>
          </button>
          <button className="h-16 glass-frosted border border-white/5 rounded-3xl flex flex-col items-center justify-center gap-1 group hover:border-primary/40 transition-all active:scale-[0.98]">
            <span className="material-symbols-outlined text-sm text-text-muted group-hover:text-primary transition-colors">settings_input_composite</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Resync</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default VaultManagement;
