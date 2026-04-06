import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';

const RapidResponseHub: React.FC = () => {
  const { isMEVShieldEnabled, setMEVShieldEnabled } = useSettings();
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleEmergencyTrigger = () => {
    setIsEmergencyActive(true);
    setShowConfirm(false);
    // In a real app, this would call an API to revoke contract allowances and pause transactions
    console.log("ZENITH PROTOCOL: EMERGENCY SHUTDOWN INITIATED");
  };

  return (
    <div className="glass-frosted border border-red-500/20 bg-red-500/5 rounded-[48px] p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden group">
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <span className="material-symbols-outlined text-2xl drop-shadow-[0_0_12px_rgba(239,68,68,0.4)]">emergency_home</span>
          </div>
          <h3 className="text-white text-lg font-black tracking-tight uppercase">Rapid Response Hub</h3>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
            <span className="text-[9px] font-black uppercase tracking-widest text-text-muted leading-none">Node Status</span>
            <div className={`w-1.5 h-1.5 rounded-full ${isEmergencyActive ? 'bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.6)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'}`} />
        </div>
      </div>

      <div className="flex flex-col gap-4 relative z-10">
        {/* MEV Protection Toggle */}
        <div className="flex flex-col gap-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">MEV Protection Layer</h4>
            <div 
              className="flex items-center justify-between bg-white/5 border border-white/10 rounded-3xl p-5 hover:border-white/20 transition-all cursor-pointer group/toggle"
              onClick={() => setMEVShieldEnabled(!isMEVShieldEnabled)}
            >
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-black text-white tracking-tight">Shielded RPC Routing</span>
                    <span className="text-[10px] font-medium text-text-dim leading-normal">Bypass mempool to prevent frontrunning</span>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-all duration-300 flex items-center ${isMEVShieldEnabled ? 'bg-primary shadow-glow-sm' : 'bg-white/10'}`}>
                    <motion.div 
                        animate={{ x: isMEVShieldEnabled ? 24 : 0 }}
                        className="w-4 h-4 bg-white rounded-full shadow-xl"
                    />
                </div>
            </div>
        </div>

        {/* Fail-Safe Trigger */}
        <div className="flex flex-col gap-3 mt-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Critical Safeguards</h4>
            <button 
                disabled={isEmergencyActive}
                onClick={() => setShowConfirm(true)}
                className={`w-full py-5 rounded-[28px] font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 active:scale-95 border ${isEmergencyActive ? 'bg-red-500/20 border-red-500/40 text-red-500' : 'bg-red-500 text-white border-transparent hover:bg-red-600 shadow-2xl shadow-red-500/20'}`}
            >
                {isEmergencyActive ? (
                    <>
                        <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                        Lockout Sequence Active
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined text-sm">lock_person</span>
                        Trigger Emergency Shutdown
                    </>
                )}
            </button>
            <div className="flex items-start gap-2 px-2">
              <span className="material-symbols-outlined text-[10px] text-red-400 mt-0.5">info</span>
              <p className="text-[9px] text-text-muted font-bold leading-relaxed uppercase tracking-tighter italic">
                Revokes all smart contract permissions & forces session key rotation.
              </p>
            </div>
        </div>
      </div>

      <AnimatePresence>
        {showConfirm && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center gap-8"
            >
                <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-2 relative">
                    <span className="material-symbols-outlined text-5xl">warning</span>
                    <div className="absolute inset-0 bg-red-500/20 blur-2xl -z-10 animate-pulse" />
                </div>
                <div className="flex flex-col gap-3">
                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Confirm Protocol?</h4>
                    <p className="text-[11px] text-text-dim leading-relaxed font-bold uppercase tracking-tight">
                        This initiates a global system lockout. <br/> Access restoration requires hardware key verification.
                    </p>
                </div>
                <div className="flex flex-col w-full gap-4">
                    <button 
                        onClick={handleEmergencyTrigger}
                        className="w-full py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
                    >
                        Execute Lockdown
                    </button>
                    <button 
                        onClick={() => setShowConfirm(false)}
                        className="w-full py-4 bg-white/5 border border-white/10 text-text-muted rounded-2xl font-black uppercase tracking-widest text-[11px] hover:text-white transition-all"
                    >
                        Abort Sequence
                    </button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Background aesthetics */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/5 blur-[64px] -ml-16 -mb-16 pointer-events-none" />
    </div>
  );
};

export default RapidResponseHub;
