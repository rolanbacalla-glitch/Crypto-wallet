import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Lock, AlertTriangle, RefreshCw, Undo2 } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const SafeModeOverlay: React.FC = () => {
  const { isSafeMode, setSafeMode } = useSettings();

  if (!isSafeMode) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto"
      >
        {/* Backdrop with aggressive blur */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[40px]" />
        
        {/* Pulsing Alert Borders */}
        <div className="absolute inset-0 border-[24px] border-red-500/10 pointer-events-none animate-pulse" />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="relative max-w-lg w-full p-12 text-center"
        >
          {/* Neon Glow Icon */}
          <div className="mb-8 relative inline-block">
            <div className="absolute inset-0 bg-red-500 rounded-full blur-[40px] opacity-20 animate-pulse" />
            <div className="relative w-24 h-24 bg-red-500/10 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(239,68,68,0.4)]">
              <Lock className="w-10 h-10 text-red-500" strokeWidth={2.5} />
            </div>
          </div>

          <h1 className="text-4xl font-extrabold mb-4 tracking-tight drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">
            PROTOCOL <span className="text-red-500">FROZEN</span>
          </h1>
          
          <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-sm mx-auto">
            Zenith Emergency Protocol is active. All approvals have been simulated as <span className="text-white font-bold">Revoked</span> and outgoing transactions are blocked.
          </p>

          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => setSafeMode(false)}
              className="group relative flex items-center justify-center gap-3 w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[45deg]" />
              <Undo2 className="w-5 h-5" />
              <span className="font-bold tracking-wide">Deactivate Emergency Protocol</span>
            </button>
            <button 
              className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-red-500 text-black font-black uppercase tracking-widest text-xs rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:shadow-[0_0_50px_rgba(239,68,68,0.6)] transition-all"
            >
              Withdraw to Cold Vault
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-red-500/50">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Monitoring Threats</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span>Encrypted Session</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SafeModeOverlay;
