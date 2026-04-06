import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowUpRight, 
  ShieldCheck, 
  Settings, 
  ChevronRight, 
  ChevronLeft,
  Gem,
  Activity,
  Layers,
  Fingerprint,
  ExternalLink
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'Terminal', icon: LayoutDashboard, path: '/', color: 'text-indigo-400', badge: 'v2.0' },
    { name: 'Portfolio', icon: Wallet, path: '/portfolio', color: 'text-blue-400' },
    { name: 'Exchange', icon: ArrowUpRight, path: '/trade', color: 'text-amber-400' },
    { name: 'Safety', icon: ShieldCheck, path: '/safety', color: 'text-emerald-400', badge: 'PROTECTED' },
    { name: 'Yield Hub', icon: Gem, path: '/yield', color: 'text-rose-400', promo: true },
    { name: 'Activity', icon: Activity, path: '/activity', color: 'text-slate-400' },
    { name: 'Audit Hub', icon: Layers, path: '/audit', color: 'text-indigo-400' },
  ];

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ 
        width: isCollapsed ? 88 : 280,
        x: 0
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 120 }}
      className="fixed left-6 top-6 bottom-6 hidden lg:flex flex-col ag-glass z-50 overflow-hidden"
    >
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-4 border-b border-white/5">
        <div className="flex-shrink-0 w-10 h-10 bg-[var(--zenith-primary)] rounded-xl flex items-center justify-center relative shadow-lg shadow-[var(--zenith-primary-glow)] group overflow-hidden">
           <span className="text-white font-black text-lg tracking-tighter z-10">Z</span>
           <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
             className="absolute -inset-2 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-50"
           />
        </div>
        
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex-1"
            >
              <h1 className="text-sm font-black text-[var(--zenith-text-primary)] tracking-[0.3em] leading-none uppercase">ZENITH V2</h1>
              <span className="text-[9px] font-bold tracking-[0.15em] text-cyan-400 uppercase mt-1 block drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">Shielded Environment</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto custom-scrollbar overflow-x-hidden">
         {menuItems.map((item) => {
           const isActive = location.pathname === item.path;
           return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`w-full group relative flex items-center h-12 px-3 rounded-[var(--zenith-radius-md)] transition-all ${
                isActive 
                ? 'bg-[var(--zenith-primary)]/10 text-white shadow-sm ring-1 ring-white/10' 
                : 'hover:bg-white/[0.05] text-[var(--zenith-text-muted)] hover:text-white'
              }`}
            >
              <div className={`p-1.5 transition-all ${isActive ? 'scale-110' : ''}`}>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-[var(--zenith-primary)] filter drop-shadow-[0_0_8px_var(--zenith-primary)]' : ''}`} />
              </div>
              
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex-1 text-left flex items-center justify-between ml-3"
                  >
                    <span className="text-xs font-black uppercase tracking-[0.15em] whitespace-nowrap">
                      {item.name}
                    </span>
                    
                    {item.badge && (
                       <span className="text-[8px] font-black px-1.5 py-0.5 bg-white/10 text-white rounded-[4px] border border-white/5">
                          {item.badge}
                       </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {isActive && (
                 <motion.div 
                   layoutId="activeIndicator"
                   className="absolute left-0 top-3 bottom-3 w-1 bg-[var(--zenith-primary)] rounded-full shadow-[0_0_15px_var(--zenith-primary)]"
                 />
              )}
            </NavLink>
           );
         })}
      </nav>

      {/* Account Info and Actions */}
      <div className="mt-auto p-4 space-y-4 border-t border-white/5">
         <AnimatePresence>
           {!isCollapsed && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 10 }}
               className="p-3 bg-white/[0.03] rounded-2xl border border-white/5 group"
             >
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-[1px] border border-white/10 overflow-hidden shadow-lg shadow-indigo-500/20">
                     <img 
                       src="https://api.dicebear.com/7.x/shapes/svg?seed=antigravity&backgroundColor=050505" 
                       alt="User avatar" 
                       className="w-full h-full rounded-[10px] scale-110 group-hover:scale-125 transition-transform duration-500"
                     />
                   </div>
                   <div className="flex-1 overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest truncate">rb_me.eth</span>
                        <ExternalLink className="w-2.5 h-2.5 text-white/20 group-hover:text-[var(--zenith-primary)] transition-colors" />
                      </div>
                      <span className="text-[8px] font-black text-[var(--zenith-success)] uppercase tracking-[0.15em] flex items-center gap-1.5 mt-0.5">
                         <div className="w-1.5 h-1.5 bg-[var(--zenith-success)] rounded-full shadow-[0_0_8px_var(--zenith-success)]" />
                         Encrypted
                      </span>
                   </div>
                   <Fingerprint className="w-3.5 h-3.5 text-white/20 hover:text-[var(--zenith-primary)] cursor-pointer transition-colors" />
                </div>
             </motion.div>
           )}
         </AnimatePresence>

         <div className="flex gap-2">
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex-1 h-10 flex items-center justify-center text-[var(--zenith-text-muted)] hover:text-white transition-all bg-white/[0.03] hover:bg-white/[0.08] lg-glass rounded-xl border border-white/5"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-[var(--zenith-text-muted)] hover:text-white transition-all bg-white/[0.03] hover:bg-white/[0.08] lg-glass rounded-xl border border-white/5">
              <Settings className="w-4 h-4" />
            </button>
         </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
