import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, CheckCircle2, Circle, AlertTriangle, ArrowRight, Zap, ListChecks, History, Info, Lock } from 'lucide-react';

const SecurityChecklist: React.FC = () => {
  const [items, setItems] = useState([
    { id: 1, label: 'Cloud-Sync Backup Enabled', status: 'completed', complexity: 'Critical' },
    { id: 2, label: 'Biometric 2FA Configured', status: 'completed', complexity: 'Critical' },
    { id: 3, label: 'Hardware Key Linked (YubiKey)', status: 'pending', complexity: 'High' },
    { id: 4, label: 'Whitelist Unknown Addresses', status: 'pending', complexity: 'High' },
    { id: 5, label: 'Enable Spam-Token AutoHide', status: 'completed', complexity: 'Low' },
    { id: 6, label: 'Seed Phrase Paper Backup', status: 'pending', complexity: 'Critical' }
  ]);

  const toggleItem = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, status: item.status === 'completed' ? 'pending' : 'completed' } : item
    ));
  };

  const completedCount = items.filter(i => i.status === 'completed').length;
  const totalCount = items.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <div className="bg-[#0f172a]/40 border border-white/5 rounded-3xl p-6 backdrop-blur-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-indigo-500/10 rounded-xl">
             <ListChecks className="w-5 h-5 text-indigo-400" />
           </div>
           <div>
              <h3 className="text-white font-bold tracking-tight">Hardening Tasks</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Fortification Roadmap</p>
           </div>
        </div>
        
        <div className="flex items-center gap-2">
           <div className="text-right">
              <span className="text-[10px] text-slate-500 font-black tracking-widest block uppercase">Progress</span>
              <span className="text-xs text-white font-bold">{completedCount}/{totalCount}</span>
           </div>
           <div className="w-12 h-12 relative flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                 <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#1e293b" strokeWidth="4" />
                 <motion.circle 
                    cx="50%" cy="50%" r="40%" 
                    fill="none" 
                    stroke="#6366f1" 
                    strokeWidth="4"
                    strokeDasharray="100"
                    strokeDashoffset={100 - progress}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                 />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                 <ShieldCheck className="w-4 h-4 text-indigo-400" />
              </div>
           </div>
        </div>
      </div>

      <div className="space-y-2">
         {items.map((item, i) => (
           <motion.div
             key={item.id}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.05 }}
             onClick={() => toggleItem(item.id)}
             className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
               item.status === 'completed' 
                 ? 'bg-slate-900/40 border-indigo-500/10' 
                 : 'bg-slate-900/10 border-white/5 hover:border-indigo-500/30'
             }`}
           >
             <div className="flex items-center gap-3">
               <div className={`p-1 rounded-lg transition-colors ${
                 item.status === 'completed' ? 'text-emerald-400' : 'text-slate-600'
               }`}>
                 {item.status === 'completed' ? <CheckCircle2 className="w-5 h-5 shadow-emerald-500/20" /> : <Circle className="w-5 h-5" />}
               </div>
               <div>
                  <span className={`text-[13px] font-semibold transition-all tracking-tight ${
                    item.status === 'completed' ? 'text-slate-400 line-through' : 'text-white'
                  }`}>
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                     <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm border ${
                       item.complexity === 'Critical' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                       item.complexity === 'High' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                       'bg-slate-500/10 border-slate-500/20 text-slate-500'
                     }`}>
                        {item.complexity}
                     </span>
                  </div>
               </div>
             </div>
             
             <button className="p-1 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
               <Info className={`w-4 h-4 `} />
             </button>
           </motion.div>
         ))}
      </div>

      <div className="mt-6 flex flex-col gap-3">
         <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
            <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <p className="text-[11px] text-emerald-400 font-bold leaging-tight">
              Completing Critical tasks increases potential yield cap by <span className="underline">+12.4%</span>.
            </p>
         </div>
         
         <button className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            <History className="w-3.5 h-3.5" />
            View Audit History
         </button>
      </div>
    </div>
  );
};

export default SecurityChecklist;
