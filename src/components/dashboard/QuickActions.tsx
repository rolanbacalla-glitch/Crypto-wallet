import React from 'react';
import { 
  Plus, 
  SendHorizontal, 
  ArrowDownLeft, 
  RotateCw, 
  CreditCard,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';

const QuickActions = () => {
  const actions = [
    { id: 1, label: 'Buy Crypto', sub: 'Instant deposit', icon: <Plus size={20} />, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { id: 2, label: 'Send Assets', sub: 'Global transfer', icon: <SendHorizontal size={20} />, color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    { id: 3, label: 'Receive', sub: 'QR or address', icon: <ArrowDownLeft size={20} />, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { id: 4, label: 'Swap', sub: '0.1% fee', icon: <RotateCw size={20} />, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action, idx) => (
        <motion.button
          key={action.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex flex-col items-start p-5 rounded-2xl border ${action.color} shadow-lg transition-all duration-300 group`}
        >
          <span className="p-2.5 rounded-xl bg-black/20 group-hover:bg-black/40 transition-colors mb-4">
            {action.icon}
          </span>
          <div className="text-left">
            <p className="font-bold text-sm tracking-tight">{action.label}</p>
            <p className="text-[10px] opacity-60 font-medium uppercase tracking-widest mt-1">{action.sub}</p>
          </div>
        </motion.button>
      ))}
      
      {/* Dynamic Promotion or Info card */}
      <div className="col-span-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-6 relative overflow-hidden group shadow-2xl shadow-indigo-500/20 mt-2">
        <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-white/10 blur-[40px] rounded-full -mr-12 -mt-12 group-hover:bg-white/20 transition-all duration-700" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white/70 mb-2">
            <Target size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-100">Smart Yield Optimization</span>
          </div>
          <h4 className="text-xl font-bold text-white mb-2 leading-tight">Earn up to 14.5% APY on USDC</h4>
          <p className="text-indigo-100/70 text-[11px] mb-4 max-w-[80%] font-medium">Auto-compound your stablecoin yields daily using our secure DeFi vaults.</p>
          <button className="px-5 py-2.5 bg-white text-indigo-600 rounded-xl text-xs font-bold shadow-xl shadow-black/10 hover:shadow-2xl hover:scale-105 transition-all">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
