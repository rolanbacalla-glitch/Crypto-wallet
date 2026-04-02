import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCopilot } from '../../hooks/useCopilot';
import SafetyPreview from '../safety/SafetyPreview';

interface DashboardProps {
  profile: 'beginner' | 'advanced';
}

const DashboardPage: React.FC<DashboardProps> = ({ profile }) => {
  const { isAnalysing, report, analyse, availableScenarios } = useCopilot();
  const [selectedScenario, setSelectedScenario] = useState(availableScenarios[0].id);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('1W');

  useEffect(() => {
    analyse(selectedScenario, profile);
  }, [selectedScenario, profile, analyse]);

  return (
    <div className="flex flex-col gap-10">
      {/* Top Banner - Controls & Context */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-1">Dashboard</h1>
          <p className="text-text-dim font-medium">Overview of your protected portfolio</p>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
            Live Safety Simulation:
          </span>
          <div className="relative min-w-[260px]">
            <button 
              className="w-full bg-white/5 border border-white/10 glass-frosted px-5 py-2.5 rounded-full flex justify-between items-center group hover:border-primary/50 transition-all"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="font-bold text-sm tracking-tight">
                {availableScenarios.find(s => s.id === selectedScenario)?.name || selectedScenario}
              </span>
              <span className={`material-symbols-outlined text-primary transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  className="absolute top-full left-0 right-0 mt-3 p-2 glass-frosted border border-white/10 rounded-2xl z-50 shadow-2xl"
                >
                  {availableScenarios.map(s => (
                    <div 
                      key={s.id} 
                      className={`
                        px-4 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all
                        ${s.id === selectedScenario 
                          ? 'bg-primary/20 text-primary' 
                          : 'text-text-dim hover:bg-white/5 hover:text-white'}
                      `}
                      onClick={() => {
                        setSelectedScenario(s.id);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {s.name || s.id}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-10">
        {/* LEFT COLUMN - Wallet & Chart */}
        <div className="flex flex-col gap-10">
          <div className="glass-frosted border border-white/10 rounded-[48px] p-10 flex flex-col gap-12 min-h-[520px]">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Total Wallet Value</span>
                <div className="flex items-center gap-6">
                  <h2 className="text-6xl font-black tracking-tighter italic">£41,812.14</h2>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-black shadow-[0_0_15px_rgba(212,255,59,0.15)]">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    +12.4%
                  </div>
                </div>
              </div>
              
              <div className="flex bg-white/5 border border-white/10 p-1 rounded-full">
                {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map(range => (
                  <button 
                    key={range}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${timeRange === range ? 'bg-primary text-black' : 'text-text-muted hover:text-white'}`}
                    onClick={() => setTimeRange(range)}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 relative group">
              {/* Mock Chart Visualization */}
              <div className="h-full w-full flex items-end gap-1 pb-10">
                {[...Array(32)].map((_, i) => (
                  <motion.div 
                    initial={{ height: '20%' }}
                    animate={{ height: `${25 + Math.random() * 65}%` }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', delay: i * 0.05 }}
                    key={i} 
                    className="flex-1 bg-primary/10 rounded-t-sm group-hover:bg-primary/20 transition-all"
                  />
                ))}
              </div>
              
              <svg className="absolute inset-0 w-full h-full overflow-visible z-10 pointer-events-none" viewBox="0 0 1000 200">
                <path 
                  d="M0,150 Q100,120 200,160 T400,100 T600,140 T800,60 T1000,80" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="4"
                  className="text-primary drop-shadow-[0_0_15px_rgba(212,255,59,0.5)]"
                />
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4ff3b" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#d4ff3b" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path 
                  d="M0,150 Q100,120 200,160 T400,100 T600,140 T800,60 T1000,80 L1000,200 L0,200 Z" 
                  fill="url(#chartGradient)"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col justify-between pb-10 pointer-events-none opacity-20">
                {[...Array(5)].map((_, i) => <div key={i} className="h-px bg-white/20 w-full" />)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { label: 'Realised PL', value: '+£2,450.00', color: 'text-primary' },
              { label: 'Unrealised PL', value: '£14,204.30', color: 'text-primary' },
              { label: 'Total Volume', value: '£1.2M', color: 'text-white' },
              { label: 'Safeguarded', value: '£412K', color: 'text-primary shadow-glow' }
            ].map((stat, i) => (
              <div key={i} className="glass-frosted border border-white/10 rounded-3xl p-6 flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{stat.label}</span>
                <span className={`text-xl font-black tracking-tight ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN - Risk & Safety Engine */}
        <div className="flex flex-col gap-10">
          <div className="glass-frosted border border-white/10 rounded-[48px] p-8 flex flex-col gap-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3 relative z-10">
              <span className="material-symbols-outlined text-primary text-2xl drop-shadow-[0_0_8px_rgba(212,255,59,0.5)]">security</span>
              <h3 className="text-lg font-black tracking-tight">Safety Intelligence</h3>
            </div>
            
            <div className="relative z-10">
              <SafetyPreview 
                report={report} 
                isAnalysing={isAnalysing} 
                profile={profile} 
              />
            </div>

            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[64px] rounded-full" />
          </div>

          <div className="glass-frosted border border-white/10 rounded-[48px] p-8 flex flex-col gap-8 flex-1">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-text-dim text-2xl">receipt_long</span>
              <h3 className="text-lg font-black tracking-tight">Protected History</h3>
            </div>
            
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="group flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-text-dim group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-2xl">swap_horiz</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold tracking-tight">Uniswap V3 Swap</div>
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">2 mins ago</div>
                  </div>
                  <div className="text-sm font-black text-right">-£124.50</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
