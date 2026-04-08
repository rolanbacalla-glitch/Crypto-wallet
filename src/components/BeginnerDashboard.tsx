import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Zap, 
  Plus, 
  AlertCircle,
  Shield,
  Star,
  Lock,
  Heart
} from 'lucide-react';
import { GlassCard, CoinIcon, cn } from './Shared';

export function BeginnerDashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1] // Custom quintic ease for premium feel
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4 md:p-8 pt-4 pb-12"
    >
      
      {/* Safety Hero - Central Piece */}
      <motion.div variants={itemVariants} className="col-span-1 md:col-span-12 lg:col-span-8 flex flex-col md:flex-row">
        <GlassCard className="w-full flex flex-col md:flex-row items-center gap-8 py-10 px-8 bg-gradient-to-br from-lime-500/10 to-transparent border-lime-500/20" glow persona="normal">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Animated Gauge Background */}
            <svg className="w-full h-full -rotate-90 transform">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-white/5"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray="552.92"
                initial={{ strokeDashoffset: 552.92 }}
                animate={{ strokeDashoffset: 552.92 * (1 - 0.98) }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.8 }}
                className="text-lime-500 shadow-[0_0_20px_rgba(132,204,22,0.5)]"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <motion.span 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-5xl font-serif font-black text-glow-lime"
              >
                98
              </motion.span>
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Safety Score</span>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-lime-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Ultra Secure</span>
                <span className="text-lime-400/60 text-xs font-medium">Updated 2m ago</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight">Your digital assets are <span className="text-lime-400">fully shielded</span>.</h2>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-md">
              All 4 protection layers are active. We've automatically blocked 2 suspicious connection attempts today.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-white text-black font-bold rounded-2xl hover:scale-105 transition-transform flex items-center gap-2">
                <Shield className="w-4 h-4" /> Run Deep Scan
              </button>
              <button className="px-6 py-3 glass rounded-2xl font-bold hover:bg-white/10 transition-colors">
                Security Logs
              </button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Quick Access Tiles */}
      <motion.div variants={itemVariants} className="col-span-1 md:col-span-6 lg:col-span-4">
        <GlassCard className="h-full flex flex-col justify-between border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl font-bold">Total Savings</h3>
            <div className="w-10 h-10 rounded-xl bg-lime-500/10 flex items-center justify-center border border-lime-500/30">
              <TrendingUp className="w-5 h-5 text-lime-400" />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-serif font-bold tracking-tight mb-2">£124,592.40</h2>
            <div className="flex items-center gap-2">
              <span className="text-lime-400 font-bold text-sm">+£1,420.00 today</span>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-white/40 text-sm">Up 12.5% this month</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-8">
            <button className="py-4 bg-lime-500/10 border border-lime-500/20 rounded-2xl text-lime-400 font-bold text-sm hover:bg-lime-500/20 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Funds
            </button>
            <button className="py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              Withdraw
            </button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Assets Tile - Simplified */}
      <motion.div variants={itemVariants} className="col-span-1 md:col-span-6 lg:col-span-7">
        <GlassCard className="h-full">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-xl font-bold">Your Coins</h3>
            <button className="text-lime-400 text-xs font-bold hover:underline">Manage All</button>
          </div>
          <div className="space-y-2">
            {[
              { name: 'Ethereum', symbol: 'ETH', bal: '45.2', val: '112,450.00', status: 'Safe' },
              { name: 'USD Coin', symbol: 'USDC', bal: '10,200.00', val: '10,200.00', status: 'Verified' },
              { name: 'Rocket Pool', symbol: 'rETH', bal: '1.5', val: '4,152.40', status: 'Protected' },
            ].map((token, i) => (
              <motion.div 
                key={i}
                whileHover={{ x: 5 }}
                className="flex items-center justify-between p-4 rounded-3xl hover:bg-white/5 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-all">
                    <CoinIcon symbol={token.symbol} size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{token.name}</p>
                      <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-lime-500/10 text-lime-400 rounded-md border border-lime-500/20">{token.status}</span>
                    </div>
                    <p className="text-xs text-white/40">{token.bal} {token.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">£{token.val}</p>
                  <p className="text-[10px] text-lime-400 font-bold">Insured</p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Safety Insights Activity */}
      <motion.div variants={itemVariants} className="col-span-1 md:col-span-12 lg:col-span-5">
        <GlassCard className="h-full flex flex-col">
          <h3 className="font-serif text-xl font-bold mb-8">Safety Log</h3>
          <div className="space-y-6 flex-1">
            {[
              { type: 'Protection', title: 'Wallet Shield Active', desc: 'Secure connection verified for Uniswap.', icon: Lock, color: 'text-lime-400' },
              { type: 'Growth', title: 'Earnings Compound', desc: 'Your ETH stake earned £42.30 today.', icon: TrendingUp, color: 'text-blue-400' },
              { type: 'Update', title: 'New Protection Layer', desc: 'Quantum-safe signing enabled by default.', icon: ShieldCheck, color: 'text-purple-400' },
            ].map((log, i) => (
              <div key={i} className="flex gap-4 group">
                <div className={cn("w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0", log.color.replace('text', 'bg').replace('400', '400/10'))}>
                  <log.icon className={cn("w-6 h-6", log.color)} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/30">{log.type}</span>
                    <div className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/30">Just Now</span>
                  </div>
                  <h4 className="font-bold text-sm text-white group-hover:text-lime-400 transition-colors">{log.title}</h4>
                  <p className="text-xs text-white/40 leading-relaxed mt-1">{log.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-4 mt-10 rounded-2xl bg-white/5 border border-white/10 text-white/40 font-bold text-sm hover:bg-white/10 hover:text-white transition-all">
            View Detail Reports
          </button>
        </GlassCard>
      </motion.div>

    </motion.div>

  );
}
