import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, ShieldAlert, AlertOctagon, RefreshCw, XCircle, CheckCircle2, Lock, ChevronRight, Fingerprint, Zap } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const EmergencyShutdown: React.FC = () => {
  const { setSafeMode } = useSettings();
  const [isArmed, setIsArmed] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [shutdownComplete, setShutdownComplete] = useState(false);

  const startShutdown = () => {
    setIsShuttingDown(true);
    setTimeout(() => {
       setIsShuttingDown(false);
       setShutdownComplete(true);
       setSafeMode(true);
    }, 4500);
  };

  return (
    <div className="bg-[#1e1e2d]/60 border border-rose-500/10 rounded-3xl p-6 backdrop-blur-2xl relative overflow-hidden group">
      {/* Background Warning Effect */}
       <div className={`absolute top-0 right-0 w-32 h-32 blur-[100px] transition-colors duration-1000 ${
         isArmed ? 'bg-rose-500/40' : 'bg-amber-500/10'
       }`} />
       
       <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-rose-500/10 rounded-xl relative">
                <Power className={`w-5 h-5 transition-colors ${isArmed ? 'text-rose-400' : 'text-slate-400'}`} />
                {isArmed && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-xl bg-rose-500/50"
                  />
                )}
             </div>
             <div>
                <h3 className="text-white font-bold tracking-tight">Rapid Response Protocol</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Emergency Asset Freeze</p>
             </div>
          </div>
          
          <div className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border transition-all ${
            isArmed ? 'bg-rose-500/20 border-rose-500/30 text-rose-400' : 'bg-slate-900 border-slate-700 text-slate-500'
          }`}>
             {isArmed ? 'ARMED' : 'STANDBY'}
          </div>
       </div>

       <div className="relative z-10 space-y-6">
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-white/5 space-y-3">
             <p className="text-xs text-slate-400 leading-relaxed font-medium">
               Execution of <span className="text-rose-400 font-bold">Protocol Gamma</span> will immediately:
             </p>
             <ul className="space-y-2">
                {[
                  'Revoke all smart contract allowances',
                  'Trigger 24h withdrawal lockdown',
                  'Signal active threat to connected relays',
                ].map((item, id) => (
                  <li key={id} className="flex items-center gap-2 text-[11px] text-slate-500">
                    <div className="w-1 h-1 rounded-full bg-rose-500/50" />
                    {item}
                  </li>
                ))}
             </ul>
          </div>

          {!shutdownComplete && !isShuttingDown && (
            <div className="flex flex-col gap-4">
               {/* Arming Slide */}
               <div className="relative h-14 bg-slate-950 rounded-2xl border border-white/5 overflow-hidden flex items-center p-1.5 ring-1 ring-white/5 select-none touch-none">
                  <motion.div 
                    drag="x"
                    dragConstraints={{ left: 0, right: 240 }}
                    dragElastic={0}
                    onDragEnd={(_, info) => {
                       if (info.offset.x > 200) setIsArmed(true);
                       else setIsArmed(false);
                    }}
                    className={`h-full aspect-square rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing z-20 transition-all duration-300 shadow-xl ${
                      isArmed ? 'bg-rose-600 shadow-rose-900/40 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                     {isArmed ? <Lock className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </motion.div>
                  
                  <div className="absolute inset-x-0 inset-y-0 flex items-center justify-center pointer-events-none">
                     <span className={`text-[10px] font-black tracking-[0.2em] transition-all uppercase ${
                       isArmed ? 'text-rose-400/30' : 'text-slate-600'
                     }`}>
                       {isArmed ? 'RELEASE TO ABORT' : 'SLIDE TO ARM SYSTEM'}
                     </span>
                  </div>
               </div>

               {/* Activate Button */}
               <AnimatePresence>
                 {isArmed && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={startShutdown}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black text-sm tracking-widest shadow-xl shadow-rose-600/30 border-t-2 border-rose-400/50 uppercase transition-all"
                    >
                      ENGAGE EMERGENCY STOP
                    </motion.button>
                 )}
               </AnimatePresence>
            </div>
          )}

          {isShuttingDown && (
            <div className="space-y-6 py-4 text-center">
               <div className="relative w-20 h-20 mx-auto">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-4 border-rose-500/20 border-t-rose-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldAlert className="w-8 h-8 text-rose-500" />
                  </div>
               </div>
               <div>
                  <h4 className="text-rose-400 text-sm font-black uppercase tracking-widest mb-1">Lockdown in Progress</h4>
                  <p className="text-[10px] text-slate-500 font-bold animate-pulse">REVOKING APPROVALS: BSC_0X823...A920</p>
               </div>
            </div>
          )}

          {shutdownComplete && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-center space-y-4"
            >
               <div className="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto text-rose-500">
                  <CheckCircle2 className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="text-white text-lg font-black uppercase tracking-tight">Vault Secured</h4>
                  <p className="text-xs text-rose-400 font-medium">Wait 24h before re-activation.</p>
               </div>
               <button 
                  onClick={() => setShutdownComplete(false)}
                  className="px-4 py-2 bg-slate-900 border border-slate-700 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
               >
                  Reset Module
               </button>
            </motion.div>
          )}
       </div>

       {/* Decorative Details */}
       <div className="absolute bottom-4 left-4 flex gap-2">
          <div className="w-2 h-2 rounded-full border border-slate-800" />
          <div className="w-2 h-2 rounded-full border border-slate-800" />
          <div className="w-2 h-2 rounded-full border border-slate-800" />
       </div>
    </div>
  );
};

export default EmergencyShutdown;
