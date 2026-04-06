import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Fingerprint, Activity, Search, ChevronRight, AlertTriangle } from 'lucide-react';

const SecurityScore: React.FC = () => {
  const score = 94.8;
  const grade = 'A+';
  const status = 'OPTIMAL';
  
  const factors = [
    { label: 'Key Isolation', value: '100%', status: 'SECURE', icon: Lock, color: 'var(--ag-primary)' },
    { label: '2FA Coverage', value: '100%', status: 'SECURE', icon: Fingerprint, color: 'var(--ag-primary)' },
    { label: 'Allowance Hygiene', value: '84%', status: 'RISK', icon: Activity, color: 'var(--ag-danger)' },
    { label: 'Vault Lockdown', value: '100%', status: 'SECURE', icon: ShieldCheck, color: 'var(--ag-primary)' }
  ];

  return (
    <div className="ag-card p-8 group">
      <div className="flex flex-col xl:flex-row gap-12 items-center">
        {/* Main Score Radial */}
        <div className="relative flex-shrink-0">
          <div className="w-56 h-56 rounded-full border-[1.5px] border-white/[0.03] flex items-center justify-center relative bg-black/20">
            {/* Animated Glow Backlight */}
            <div className="absolute inset-4 rounded-full bg-[var(--ag-primary)]/5 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
            
            {/* SVG Radial */}
             <svg className="absolute -rotate-90 w-full h-full transform scale-[0.85]">
                {/* Track */}
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="6"
                />
                {/* Progress */}
                <motion.circle
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * score) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="var(--ag-primary)"
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_8px_rgba(212,255,59,0.4)]"
                />
             </svg>

             <div className="text-center z-10">
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="flex flex-col items-center"
               >
                 <span className="text-6xl font-black text-white block tracking-tighter leading-none" style={{ fontFamily: 'var(--font-headline)' }}>
                   {score}
                 </span>
                 <div className="mt-2 px-3 py-0.5 rounded-full bg-[var(--ag-primary)] text-black text-[10px] font-black uppercase tracking-[0.2em]">
                   {grade}
                 </div>
               </motion.div>
             </div>

             {/* Status Badge */}
             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[var(--ag-primary)]/10 border border-[var(--ag-primary)]/20 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 shadow-2xl">
                <div className="w-2 h-2 bg-[var(--ag-primary)] rounded-full animate-pulse shadow-[0_0_8px_var(--ag-primary)]" />
                <span className="text-[10px] font-black text-[var(--ag-primary)] uppercase tracking-[0.15em]">{status}</span>
             </div>
          </div>
        </div>

        {/* Factors Grid */}
        <div className="flex-1 w-full flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {factors.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 bg-black/40 border border-white/[0.05] hover:border-white/[0.1] rounded-2xl transition-all relative overflow-hidden group/item"
              >
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                     <div className="p-2 rounded-xl bg-white/[0.03] group-hover/item:bg-[var(--ag-primary)]/10 transition-colors">
                       <f.icon className="w-5 h-5 text-white/40 group-hover/item:text-[var(--ag-primary)] transition-colors" />
                     </div>
                     <span className="text-[11px] font-medium text-white/50 tracking-wider uppercase">{f.label}</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                     {f.status === 'RISK' && <AlertTriangle className="w-3 h-3 text-[var(--ag-danger)]" />}
                     <span className="text-[10px] font-black uppercase tracking-tighter" style={{ color: f.color }}>
                       {f.status}
                     </span>
                   </div>
                </div>
                
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-headline)' }}>{f.value}</span>
                  <div className="w-24 h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: f.value }}
                      transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: f.color }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="p-4 bg-[var(--ag-primary)]/5 hover:bg-[var(--ag-primary)]/10 border border-[var(--ag-primary)]/20 rounded-2xl flex items-center justify-between cursor-pointer group/audit transition-all"
          >
             <div className="flex items-center gap-4">
                <div className="p-2 bg-[var(--ag-primary)]/20 rounded-xl">
                  <Search className="w-4 h-4 text-[var(--ag-primary)]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Execute Protocol Audit</span>
                  <span className="text-[10px] text-white/40">Powered by Antigravity Core 2.0</span>
                </div>
             </div>
             <ChevronRight className="w-5 h-5 text-[var(--ag-primary)]/40 group-hover/audit:text-[var(--ag-primary)] group-hover/audit:translate-x-1 transition-all" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SecurityScore;
