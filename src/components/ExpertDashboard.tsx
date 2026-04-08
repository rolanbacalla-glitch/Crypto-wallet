import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Activity, 
  Shield, 
  Cpu, 
  Globe, 
  Terminal, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Layers,
  Code,
  Hexagon,
  ChevronRight,
  Wifi,
  Database
} from 'lucide-react';
import { GlassCard, CoinIcon, cn } from './Shared';

export function ExpertDashboard() {
  const [logs, setLogs] = useState<string[]>([
    '> INITIALIZING SENTINEL_V4_ENGINE...',
    '> CONNECTING TO ETHEREUM_MAINNET_RPC...',
    '> LOADED 14_SECURE_RELAYS',
    '> MEV_PROTECTION: ACTIVE',
    '> SYSTEM_INTEGRITY: 100%',
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLogs = [
        `> TICK [${Date.now()}] MEMPOOL_SIZE: ${Math.floor(Math.random() * 1000)} txs`,
        `> BLOCK_SYNC: ${Math.floor(Math.random() * 10000000)}`,
        `> GAS_ESTIMATE: ${Math.floor(Math.random() * 50) + 10} gwei`,
      ];
      setLogs(prev => [...prev.slice(-10), newLogs[Math.floor(Math.random() * newLogs.length)]]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:p-8 pt-4 pb-12 font-mono">
      
      {/* Top Protocol Status Bar */}
      <div className="col-span-1 md:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        {[
          { label: 'NETWORK_SYNC', val: 'ETHEREUM_L1', status: 'SYNCED', icon: Wifi, color: 'text-blue-400' },
          { label: 'MEV_ENGINE', val: 'PRIVATE_RPC', status: 'CLOCKED', icon: Shield, color: 'text-blue-400' },
          { label: 'GAS_OPTIMIZER', val: 'ENABLED_V2', status: 'AUTO', icon: Zap, color: 'text-lime-400' },
          { label: 'SECURE_STORAGE', val: 'FROZEN_VAULT', status: 'LOCKED', icon: Database, color: 'text-purple-400' },
        ].map((s, i) => (
          <div key={i} className="glass p-4 rounded-xl border-white/5 flex items-center gap-4">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center bg-white/5", s.color.replace('text', 'bg').replace('400', '400/10'))}>
              <s.icon className={cn("w-5 h-5", s.color)} />
            </div>
            <div>
              <p className="text-[8px] text-white/40 uppercase tracking-tighter">{s.label}</p>
              <p className="text-xs font-bold text-white tracking-widest">{s.val}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <div className={cn("w-1 h-1 rounded-full animate-pulse", s.label === 'NETWORK_SYNC' ? "bg-blue-400" : "bg-lime-400")} />
                <span className="text-[8px] text-white/20">{s.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Terminal Column */}
      <div className="col-span-1 md:col-span-12 lg:col-span-8 space-y-4">
        
        {/* Simulation Hub */}
        <GlassCard className="border-blue-500/20 bg-blue-500/5" glow persona="advanced">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                <Terminal className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-400 tracking-wider">SIMULATION_TERMINAL_V3</h3>
                <p className="text-[10px] text-white/40">PRE-EXECUTION_TRACE_ENVIRONMENT</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-blue-400/60 animate-pulse">SYSTEM_ACTIVE</span>
              <div className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-[10px] text-white/40 uppercase">INPUT_BUFFER</span>
                <span className="text-[10px] text-blue-400 font-bold">BLOCKLINK_ETH_SWAP</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <CoinIcon symbol="USDC" size={24} />
                   <span className="text-sm font-bold">24,500.00</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20" />
                <div className="flex items-center gap-3">
                   <CoinIcon symbol="ETH" size={24} />
                   <span className="text-sm font-bold">10.245</span>
                </div>
              </div>
              <p className="text-[10px] text-white/30 leading-relaxed italic">
                * Path: [USDC] {'->'} [WETH] {'->'} [ETH] (Direct Relay via Uniswap V3 Pool 0.05%)
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-between">
              <div className="flex justify-between items-center pb-2 border-b border-white/5 text-blue-400">
                <span className="text-[10px] uppercase">Safety_Audit</span>
                <span className="text-[10px] font-bold tracking-widest">MINIMAL_RISK</span>
              </div>
              <div className="space-y-2 mt-2">
                <div className="flex justify-between text-[10px]">
                  <span className="text-white/40">SLIPPAGE_TOLERANCE</span>
                  <span className="text-white">0.50%</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-white/40">MEV_FRONT_RUN_P</span>
                  <span className="text-lime-400">BLOCKED</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-white/40">CONTRACT_BYTECODE</span>
                  <span className="text-blue-400">VERIFIED_SRC</span>
                </div>
              </div>
            </div>
          </div>

          {/* Raw Trace Log */}
          <div className="mt-4 p-4 bg-[#0a0a0a] rounded-xl border border-white/5 text-[10px] leading-relaxed group relative">
            <div className="absolute top-4 right-4 text-[8px] text-white/10 uppercase font-bold group-hover:text-blue-500/40 transition-colors">RAW_EVM_TRACE</div>
            <div className="space-y-1 font-mono">
              <p className="text-blue-500/60"><span className="text-white/10">[0x00]</span> PUSH1 0x80 PUSH1 0x40 MSTORE CALLER ADDRESSES_MATCH</p>
              <p className="text-blue-500/60"><span className="text-white/10">[0x14]</span> DELEGATECALL RETURNDATASIZE ISZERO DUP DUP DUP</p>
              <p className="text-white/80 animate-pulse"><span className="text-blue-400">[TRACE]</span> VALIDATING_SWAP_PATH: [0xA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48]...</p>
              <p className="text-lime-400"><span className="text-white/10">[SUCCESS]</span> SIMULATED_OUT: 10.245231 ETH | {'GAS_COST: 124,532 units'}</p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
             <button className="flex-1 py-4 bg-blue-500 text-black font-black text-xs tracking-widest uppercase rounded-2xl hover:bg-blue-400 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)]">
               SIMULATE_&_SIGN_X1
             </button>
             <button className="px-6 py-4 glass border-blue-500/20 text-blue-400 font-bold text-xs rounded-2xl hover:bg-blue-500/10 transition-all">
               TRACE_ARGS
             </button>
          </div>
        </GlassCard>

        {/* Dense Asset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard className="h-64 border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[10px] font-black tracking-widest text-white/40 uppercase">Liquidity_Nodes</h4>
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <div className="space-y-3">
               {[
                 { p: 'Uniswap V3', val: '£84.2k', health: '100%', status: 'active' },
                 { p: 'Aave V3', val: '£12.5k', health: '98%', status: 'stable' },
                 { p: 'RocketPool', val: '£27.9k', health: '100%', status: 'staking' },
               ].map((item, i) => (
                 <div key={i} className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5 transition-all">
                    <span className="text-xs font-bold">{item.p}</span>
                    <div className="flex items-center gap-4">
                       <span className="text-xs text-white/60">{item.val}</span>
                       <span className="text-[10px] text-lime-400 font-bold">{item.health}</span>
                    </div>
                 </div>
               ))}
            </div>
          </GlassCard>

          <GlassCard className="h-64 border-white/5 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <h4 className="text-[10px] font-black tracking-widest text-white/40 uppercase">Gwei_Tracker</h4>
              <Layers className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1 flex items-end gap-1 px-4 py-8">
               {[20, 45, 30, 60, 25, 40, 55, 30, 45, 20].map((h, i) => (
                 <div key={i} className="flex-1 bg-blue-500/20 rounded-sm hover:bg-blue-400/50 transition-all" style={{ height: `${h}%` }} />
               ))}
            </div>
            <div className="flex justify-between items-center border-t border-white/5 pt-4">
               <div>
                  <p className="text-[8px] text-white/30 uppercase tracking-tighter">Current_Base</p>
                  <p className="text-xs font-bold text-blue-400">12.42 GWEI</p>
               </div>
               <button className="px-3 py-1.5 glass rounded-lg text-[8px] font-bold hover:bg-white/5 transition-all">GAS_CHART</button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Side Intelligence Column */}
      <div className="col-span-1 md:col-span-12 lg:col-span-4 space-y-4">
        
        {/* Real-time System Logs */}
        <GlassCard className="h-[432px] flex flex-col border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <Cpu className="w-5 h-5 text-blue-400" />
            <h4 className="text-xs font-black tracking-widest uppercase">System_Output</h4>
          </div>
          <div className="flex-1 bg-black/40 rounded-xl p-4 font-mono text-[9px] overflow-hidden space-y-2 border border-white/5">
            <AnimatePresence>
              {logs.map((log, i) => (
                <motion.p 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "whitespace-nowrap transition-colors",
                    log.includes('ACTIVE') || log.includes('100%') ? 'text-lime-400' : 
                    log.includes('TICK') ? 'text-white/20' : 'text-blue-400'
                  )}
                >
                  {log}
                </motion.p>
              ))}
            </AnimatePresence>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
             <button className="p-3 bg-white/5 rounded-xl text-[10px] font-bold hover:bg-white/10 transition-all">EXPORT_JSON</button>
             <button className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl text-[10px] font-bold hover:bg-blue-500/20 transition-all">CLEAR_CACHE</button>
          </div>
        </GlassCard>

        {/* Network Heat Tile */}
        <GlassCard className="h-64 border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-purple-400" />
            <h4 className="text-xs font-black tracking-widest uppercase">Node_Liveness</h4>
          </div>
          <div className="grid grid-cols-6 gap-1">
             {Array.from({ length: 30 }).map((_, i) => (
               <motion.div 
                 key={i}
                 animate={{ opacity: [0.4, 1, 0.4] }}
                 transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                 className={cn(
                   "w-full pt-[100%] rounded-sm",
                   Math.random() > 0.8 ? 'bg-purple-500' : 'bg-blue-500/20'
                 )}
               />
             ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
             <span className="text-[10px] text-white/40">LATENCY: 12ms</span>
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                <span className="text-[10px] font-bold">OPTIMAL</span>
             </div>
          </div>
        </GlassCard>

      </div>

    </div>
  );
}
