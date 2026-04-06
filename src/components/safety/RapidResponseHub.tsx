import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const RapidResponseHub: React.FC = () => {
  const actions = [
    {
      id: 'lockdown',
      title: 'Global Lockdown',
      subtitle: 'Pause all approvals',
      icon: 'lock',
      color: 'text-red-400',
      bg: 'bg-red-400/5',
      border: 'border-red-400/20',
      glow: 'shadow-red-400/20',
      path: '/safety/shutdown'
    },
    {
      id: 'revoke',
      title: 'Revoke All',
      subtitle: 'Clear open allowances',
      icon: 'security_update_warning',
      color: 'text-warning',
      bg: 'bg-warning/5',
      border: 'border-warning/20',
      glow: 'shadow-warning/20',
      path: '/safety/allowance'
    },
    {
      id: 'simulate',
      title: 'Hypersimulate',
      subtitle: 'Stress test next trade',
      icon: 'psychology',
      color: 'text-cyan-400',
      bg: 'bg-cyan-400/5',
      border: 'border-cyan-400/20',
      glow: 'shadow-cyan-400/20',
      path: '/safety/simulate'
    },
    {
      id: 'private-rpc',
      title: 'Zenit Private',
      subtitle: 'Toggle RPC shielding',
      icon: 'vps',
      color: 'text-primary',
      bg: 'bg-primary/5',
      border: 'border-primary/20',
      glow: 'shadow-primary/20',
      path: '/settings'
    }
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Rapid Response Hub</h3>
        <span className="flex items-center gap-1.5 text-[8px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
          <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
          Real-time Ready
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, i) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link 
              to={action.path}
              className={`group flex items-center gap-4 p-4 rounded-3xl glass-frosted border ${action.border} ${action.bg} hover:border-white/40 transition-all duration-300 relative overflow-hidden`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${action.border} ${action.color} group-hover:bg-white group-hover:text-black transition-all duration-500`}>
                <span className="material-symbols-outlined text-xl">{action.icon}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-tight text-white group-hover:text-primary transition-colors">{action.title}</span>
                <span className="text-[8px] font-medium text-text-muted">{action.subtitle}</span>
              </div>

              {/* Action decoration */}
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl transform rotate-12 translate-x-4 -translate-y-4">
                  {action.icon}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RapidResponseHub;
