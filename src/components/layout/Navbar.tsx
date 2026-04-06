import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Bell, 
  Command, 
  Menu, 
  Zap, 
  Globe, 
  Cpu, 
  Wallet,
  Settings,
  X,
  CreditCard,
  ShieldCheck,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';

const NavbarValue: React.FC<{ label: string; value: string; trend?: string; color: string }> = ({ label, value, trend, color }) => (
  <div className="flex flex-col text-right group cursor-pointer lg:px-4 lg:border-l border-white/5 last:pr-0">
    <span className="text-[9px] font-black tracking-[0.2em] text-slate-500 uppercase leading-none mb-1 group-hover:text-slate-300 transition-colors">
      {label}
    </span>
    <div className="flex items-center gap-1.5 justify-end">
       <span className={`text-xs font-black tracking-tight ${color}`}>{value}</span>
       {trend && <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded-sm">{trend}</span>}
    </div>
  </div>
);

const Navbar: React.FC = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="sticky top-0 left-0 right-0 h-16 bg-[#050505]/40 backdrop-blur-3xl border-b border-white/5 px-6 flex items-center justify-between z-40 select-none">
       {/* Breadcrumbs / View Title Area */}
       <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 group cursor-pointer px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all">
             <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)] group-hover:animate-ping" />
             <span className="text-xs font-black text-white uppercase tracking-widest">Mainnet-alpha</span>
             <ChevronDown className="w-3.5 h-3.5 text-slate-500 transition-transform group-hover:translate-y-0.5" />
          </div>
          
          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
          
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest hidden md:block">Zenith Wallet Console</span>
       </div>

       {/* Centered Integrated Search */}
       <div className="flex-1 max-w-lg mx-8 hidden lg:block">
          <div className={`relative flex items-center h-10 px-4 bg-slate-950/60 rounded-2xl border transition-all duration-300 ${
            isSearchActive ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)] ring-2 ring-indigo-500/10' : 'border-white/5 hover:border-white/10'
          }`}>
             <Search className={`w-4 h-4 mr-3 transition-colors ${isSearchActive ? 'text-indigo-400' : 'text-slate-600'}`} />
             <input 
                type="text" 
                placeholder="Search assets, contracts, or ENS..."
                onFocus={() => setIsSearchActive(true)}
                onBlur={() => setIsSearchActive(false)}
                className="bg-transparent border-none outline-none text-sm font-medium text-slate-200 placeholder:text-slate-700 w-full"
             />
             <div className="flex items-center gap-1 ml-auto">
                <Command className="w-3 h-3 text-slate-600" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">K</span>
             </div>
          </div>
       </div>

       {/* Performance & Account Metrics */}
       <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-6">
             <NavbarValue label="Gas Price" value="12 Gwei" trend="-4%" color="text-emerald-400" />
             <NavbarValue label="Sync Score" value="0.99ms" color="text-blue-400" />
             <NavbarValue label="Relay Latency" value="28ms" color="text-amber-400" />
          </div>

          <div className="flex items-center gap-3">
             <div className="h-8 w-[1px] bg-white/10 mx-2 hidden sm:block" />
             
             {/* Notification Panel Button */}
             <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 bg-slate-900/60 hover:bg-slate-800 border border-white/5 hover:border-white/10 rounded-xl transition-all group"
             >
                <Bell className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#050505] shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
             </button>

             {/* Network Config Quick Access */}
             <button className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all border-t border-indigo-400/30 flex items-center gap-2 group overflow-hidden">
                <Zap className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:inline-block">Hardened</span>
                <ChevronDown className="w-3 h-3 hidden lg:inline-block opacity-60" />
             </button>
          </div>
       </div>

       {/* Notifications Dropdown (Floating) */}
       <AnimatePresence>
          {showNotifications && (
            <>
              <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setShowNotifications(false)}
                 className="fixed inset-0 bg-transparent z-40"
              />
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                className="absolute top-20 right-6 w-96 bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl z-50 shadow-black/80 ring-1 ring-white/5"
              >
                 <div className="flex items-center justify-between mb-10">
                    <div>
                       <h4 className="text-white text-lg font-black tracking-tight leading-none mb-1">Updates</h4>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active safety relays</p>
                    </div>
                    <button onClick={() => setShowNotifications(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white">
                       <X className="w-5 h-5" />
                    </button>
                 </div>

                 <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {[
                      { icon: ShieldCheck, title: 'Vault Fully Synced', desc: 'Backup node redundancy at 100%', time: '2m ago', color: 'text-emerald-500' },
                      { icon: Cpu, title: 'Relay System Optimized', desc: 'New faster paths located for ETH relay', time: '14m ago', color: 'text-indigo-500' },
                      { icon: AlertTriangle, title: 'Insecure Contract Discovered', desc: 'Uniswap adapter outdated check', time: '1h ago', color: 'text-amber-500' },
                    ].map((notify, id) => (
                      <div key={id} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                         <div className={`p-2.5 rounded-xl bg-slate-900/80 ${notify.color}`}>
                            <notify.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                         </div>
                         <div className="flex-1">
                            <h5 className="text-xs font-black text-white tracking-widest uppercase mb-1">{notify.title}</h5>
                            <p className="text-[11px] text-slate-500 leading-tight mb-2 font-medium">{notify.desc}</p>
                            <span className="text-[10px] text-slate-700 font-bold tracking-widest uppercase">{notify.time}</span>
                         </div>
                      </div>
                    ))}
                 </div>
                 
                 <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-3">
                    <button className="w-full py-3 bg-white hover:bg-slate-200 text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all">
                       Clear All
                    </button>
                    <button className="w-full py-3 bg-slate-900 border border-slate-700 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all">
                       Audit Archive
                    </button>
                 </div>
              </motion.div>
            </>
          )}
       </AnimatePresence>
    </nav>
  );
};

export default Navbar;
