import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssets } from '../../hooks/useAssets';
import { type Asset } from '../../types/asset';

type DataPoint = { label: string; value: number; pnl: string };

const MOCK_SERIES: Record<string, DataPoint[]> = {
  '1W': [
    { label: 'Mon', value: 38000, pnl: '+£420' },
    { label: 'Tue', value: 39500, pnl: '+£1.5k' },
    { label: 'Wed', value: 37000, pnl: '-£2.5k' },
    { label: 'Thu', value: 41000, pnl: '+£4k' },
    { label: 'Fri', value: 42500, pnl: '+£1.5k' },
    { label: 'Sat', value: 41812, pnl: '-£688' },
    { label: 'Sun', value: 41812, pnl: 'Current' },
  ],
  '1M': [
    { label: 'Week 1', value: 32000, pnl: '+£2k' },
    { label: 'Week 2', value: 36000, pnl: '+£4k' },
    { label: 'Week 3', value: 34500, pnl: '-£1.5k' },
    { label: 'Week 4', value: 41812, pnl: '+£7.3k' },
  ],
  '1Y': [
    { label: 'Apr', value: 24000, pnl: '+£1.2k' },
    { label: 'May', value: 28500, pnl: '+£4.5k' },
    { label: 'Jun', value: 26000, pnl: '-£2.5k' },
    { label: 'Jul', value: 31000, pnl: '+£5.0k' },
    { label: 'Aug', value: 34500, pnl: '+£3.5k' },
    { label: 'Sep', value: 32000, pnl: '-£2.5k' },
    { label: 'Oct', value: 38000, pnl: '+£6.0k' },
    { label: 'Nov', value: 36500, pnl: '-£1.5k' },
    { label: 'Dec', value: 42000, pnl: '+£5.5k' },
    { label: 'Jan', value: 45000, pnl: '+£3.0k' },
    { label: 'Feb', value: 41812, pnl: '-£3.2k' },
    { label: 'Mar', value: 41812, pnl: 'Current' },
  ],
  '3M': [
    { label: 'Jan', value: 34000, pnl: '+£12k' },
    { label: 'Feb', value: 38000, pnl: '+£4k' },
    { label: 'Mar', value: 41812, pnl: '+£3.8k' },
  ],
  'ALL': [
    { label: '2023', value: 12000, pnl: 'Genesis' },
    { label: '2024', value: 28000, pnl: '+£16k' },
    { label: '2025', value: 41812, pnl: '+£13.8k' },
  ],
};

const EVENTS = [
  { id: 1, type: 'Savings', label: 'MEV Protection Active', detail: 'Saved £12.40 on Uniswap swap', date: '2 mins ago', icon: 'security' },
  { id: 2, type: 'Growth', label: 'LP Optimization', detail: 'Concentrated liquidity rebalanced (ETH/USDC)', date: '4h ago', icon: 'trending_up' },
  { id: 3, type: 'Safety', label: 'Phishing Attempt Blocked', detail: 'Malicious permit signature rejected', date: '1d ago', icon: 'gpp_maybe' },
  { id: 4, type: 'Profit', label: 'Staking Rewards Claimed', detail: '+0.15 ETH from Lido validators', date: '2d ago', icon: 'account_balance_wallet' },
];

const PortfolioPage: React.FC = () => {
  const { assets } = useAssets();
  const [activeTab, setActiveTab] = useState('1Y');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const currentData = useMemo(() => MOCK_SERIES[activeTab] || MOCK_SERIES['1Y'], [activeTab]);

  const stats = useMemo(() => {
    const max = Math.max(...currentData.map(d => d.value));
    const min = Math.min(...currentData.map(d => d.value));
    return { max, min, range: max - min };
  }, [currentData]);

  const allocationData = useMemo(() => {
    const totalValue = assets.reduce((acc: number, asset: Asset) => {
      const val = parseFloat(asset.value.replace(/[£,]/g, '')) || 0;
      return acc + val;
    }, 0);

    const colors = ['bg-primary', 'bg-white/40', 'bg-white/20', 'bg-white/10', 'bg-white/5'];

    return assets.slice(0, 5).map((asset: Asset, i: number) => {
      const val = parseFloat(asset.value.replace(/[£,]/g, '')) || 0;
      const percent = totalValue > 0 ? Math.round((val / totalValue) * 100) : 0;
      return {
        name: asset.name,
        symbol: asset.symbol,
        percent,
        color: colors[i] || 'bg-white/5'
      };
    });
  }, [assets]);

  // Simple SVG path generator for the area chart
  const generatePath = (data: DataPoint[], isArea = false) => {
    const width = 800;
    const height = 200;
    
    const points = data.map((d, i) => ({
      x: (i / (data.length - 1)) * width,
      y: height - ((d.value - stats.min) / (stats.range || 1)) * height
    }));

    let path = `M ${points[0].x} ${points[0].y}`;
    points.forEach((p, i) => {
      if (i === 0) return;
      const prev = points[i-1];
      const cp1x = prev.x + (p.x - prev.x) / 2;
      path += ` C ${cp1x} ${prev.y}, ${cp1x} ${p.y}, ${p.x} ${p.y}`;
    });

    if (isArea) {
      path += ` L ${width} ${height} L 0 ${height} Z`;
    }
    return path;
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-1">Portfolio Analytics</h1>
          <p className="text-text-dim font-medium">Deep analysis of your on-chain performance and risk exposure</p>
        </div>
        
        <div className="flex gap-4">
          <div className="glass-frosted border border-white/10 px-6 py-3 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Total P&L</span>
            <span className="text-sm font-black tracking-tighter italic text-primary">+£16,424.30 <span className="text-[10px] ml-1 opacity-60">↑ 12%</span></span>
          </div>
          <div className="glass-frosted border border-white/10 px-6 py-3 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Sharpe Ratio</span>
            <span className="text-sm font-black tracking-tighter italic text-primary">2.42</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 glass-frosted border border-white/10 rounded-[48px] p-10 flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black tracking-tight">Performance History</h3>
            <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
              {['1W', '1M', '3M', '1Y', 'ALL'].map(tab => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setHoveredPoint(null); }}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-black' : 'text-text-muted hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 min-h-[350px] relative mt-16 group">
            {/* SVG Container with padding for labels */}
            <svg viewBox="-60 -20 920 280" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4ff3b" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#d4ff3b" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Y-Axis Labels (Values) */}
              {[0, 0.25, 0.5, 0.75, 1].map((p) => {
                const val = stats.min + (stats.range * (1 - p));
                return (
                  <g key={p.toString()}>
                    <line x1="0" y1={p * 200} x2="800" y2={p * 200} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <text x="-15" y={p * 200 + 4} textAnchor="end" className="text-[10px] font-black text-text-muted fill-current tracking-tighter">
                      £{(val / 1000).toFixed(1)}k
                    </text>
                  </g>
                );
              })}

              {/* X-Axis Labels (Time) */}
              {currentData.map((d, i) => (
                <text 
                  key={i} 
                  x={(i / (currentData.length - 1)) * 800} 
                  y="230" 
                  textAnchor="middle" 
                  className="text-[10px] font-black text-text-muted fill-current uppercase tracking-widest"
                >
                  {d.label}
                </text>
              ))}

              {/* Area */}
              <AnimatePresence mode="wait">
                <motion.path 
                  key={activeTab + 'area'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  d={generatePath(currentData, true)} 
                  fill="url(#areaGradient)" 
                />
              </AnimatePresence>

              {/* Line */}
              <AnimatePresence mode="wait">
                <motion.path 
                  key={activeTab + 'line'}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  d={generatePath(currentData)} 
                  fill="none" 
                  stroke="#d4ff3b" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_10px_rgba(212,255,59,0.5)]"
                />
              </AnimatePresence>

              {/* Hover Interaction Areas */}
              {currentData.map((_, i) => (
                <rect
                  key={i}
                  x={(i / (currentData.length - 1)) * 800 - 20}
                  y="0"
                  width="40"
                  height="200"
                  fill="transparent"
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  className="cursor-pointer"
                />
              ))}

              {/* Hover Highlight */}
              <AnimatePresence>
                {hoveredPoint !== null && (
                  <motion.g 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <line 
                      x1={(hoveredPoint / (currentData.length - 1)) * 800} 
                      y1="0" 
                      x2={(hoveredPoint / (currentData.length - 1)) * 800} 
                      y2="200" 
                      stroke="#d4ff3b" 
                      strokeDasharray="4 4" 
                      strokeOpacity="0.5" 
                    />
                    <circle 
                      cx={(hoveredPoint / (currentData.length - 1)) * 800} 
                      cy={200 - ((currentData[hoveredPoint].value - stats.min) / (stats.range || 1)) * 200} 
                      r="6" 
                      fill="#d4ff3b" 
                      className="drop-shadow-[0_0_8px_rgba(212,255,59,0.8)]"
                    />
                  </motion.g>
                )}
              </AnimatePresence>
            </svg>

            {/* Floating Tooltip */}
            <AnimatePresence>
              {hoveredPoint !== null && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute top-[-20px] glass-frosted border border-primary/30 p-4 rounded-2xl pointer-events-none z-20 shadow-2xl"
                  style={{ left: `${(hoveredPoint / (currentData.length - 1)) * 100}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="flex flex-col gap-1 items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{currentData[hoveredPoint].label}</span>
                    <span className="text-sm font-black italic tracking-tighter">£{currentData[hoveredPoint].value.toLocaleString()}</span>
                    <span className={`text-[10px] font-black ${currentData[hoveredPoint].pnl.startsWith('+') ? 'text-primary' : 'text-danger'}`}>{currentData[hoveredPoint].pnl}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="glass-frosted border border-white/10 rounded-[48px] p-10 flex flex-col gap-8">
          <h3 className="text-lg font-black tracking-tight">Asset Allocation</h3>
          <div className="flex flex-col gap-6">
            {allocationData.map((asset, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                  <span className="text-white">{asset.name}</span>
                  <span className="text-text-muted">{asset.percent}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${asset.percent}%` }}
                    className={`h-full rounded-full ${asset.color}`}
                  />
                </div>
              </div>
            ))}
            {assets.length > 5 && (
              <div className="text-[10px] font-black uppercase tracking-widest text-text-muted text-center pt-2 italic">
                + {assets.length - 5} more assets
              </div>
            )}
            {assets.length === 0 && (
              <div className="text-xs font-black uppercase tracking-widest text-text-muted text-center py-10 italic">
                No assets found
              </div>
            )}
          </div>
          
          <div className="mt-auto p-6 rounded-3xl bg-primary/10 border border-primary/20 flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-2xl">info</span>
            <p className="text-[11px] font-black text-primary leading-snug tracking-tight">
              Allocation is based on current market values. Risk score is calculated dynamically.
            </p>
          </div>
        </div>
      </div>

      {/* Intelligence Event Log */}
      <div className="glass-frosted border border-white/10 rounded-[48px] p-10 flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-black tracking-tight">Intelligence Highlights</h3>
          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Last 30 Days</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EVENTS.map((event) => (
            <div key={event.id} className="flex items-center gap-6 p-6 bg-white/5 border border-white/5 rounded-[32px] hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                <span className="material-symbols-outlined text-text-dim group-hover:text-primary transition-colors text-3xl">{event.icon}</span>
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">{event.type}</span>
                  <span className="text-[10px] font-bold text-text-muted italic">{event.date}</span>
                </div>
                <span className="text-sm font-black tracking-tight mb-1">{event.label}</span>
                <p className="text-xs font-medium text-text-dim">{event.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
