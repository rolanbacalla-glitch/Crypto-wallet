import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  ChevronRight, 
  PlusCircle,
  ArrowRightLeft
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const assets = [
  { id: 1, name: 'Bitcoin', symbol: 'BTC', price: '£64,520.12', balance: '1.24 BTC', valUsd: '£80,005.12', change: '+2.4%', up: true, trend: [42, 45, 43, 48, 47, 52, 51] },
  { id: 2, name: 'Ethereum', symbol: 'ETH', price: '£3,420.45', balance: '14.50 ETH', valUsd: '£49,596.52', change: '-1.2%', up: false, trend: [51, 48, 49, 45, 46, 43, 44] },
  { id: 3, name: 'Solana', symbol: 'SOL', price: '£145.20', balance: '124.0 SOL', valUsd: '£18,004.80', change: '+12.5%', up: true, trend: [30, 35, 38, 42, 45, 52, 60] },
  { id: 4, name: 'Polkadot', symbol: 'DOT', price: '£7.45', balance: '1,200.0 DOT', valUsd: '£8,940.00', change: '+0.4%', up: true, trend: [40, 42, 41, 43, 42, 44, 43] },
  { id: 5, name: 'Chainlink', symbol: 'LINK', price: '£18.12', balance: '450.0 LINK', valUsd: '£8,154.00', change: '-3.2%', up: false, trend: [45, 43, 40, 38, 35, 33, 31] },
];

const AssetList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden flex flex-col shadow-xl">
      <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">My Assets</h3>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Managing 12 individual holdings</p>
        </div>
        
        <div className="relative group max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search assets..." 
            className="w-full bg-[#121212] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left bg-white/[0.02]">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Asset Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Price</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Balance</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last 24h</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence>
              {assets.map((asset, idx) => (
                <motion.tr 
                  key={asset.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group hover:bg-white/[0.03] transition-colors duration-300"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shadow-lg ${
                        asset.symbol === 'BTC' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 
                        asset.symbol === 'ETH' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 
                        'bg-slate-500/10 text-slate-400 border border-white/5'
                      }`}>
                        {asset.symbol}
                      </div>
                      <div>
                        <p className="font-bold text-slate-100 group-hover:text-white transition-colors">{asset.name}</p>
                        <p className="text-[10px] font-bold text-slate-500 tracking-wider">NETWORK: {asset.symbol === 'SOL' ? 'SOLANA' : 'ETHEREUM'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-bold text-slate-200">{asset.price}</p>
                    <p className={`text-[10px] font-bold flex items-center justify-end gap-1 ${asset.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {asset.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {asset.change}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-bold text-slate-200">{asset.balance}</p>
                    <p className="text-[10px] text-slate-500 font-bold tracking-tight uppercase">{asset.valUsd}</p>
                  </td>
                  <td className="px-6 py-4 min-w-[120px]">
                    <div className="h-8 w-full max-w-[100px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={asset.trend.map(v => ({ v }))}>
                          <Area 
                            type="monotone" 
                            dataKey="v" 
                            stroke={asset.up ? '#10b981' : '#f43f5e'} 
                            fill={asset.up ? '#10b981' : '#f43f5e'} 
                            fillOpacity={0.05} 
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-[#121212] hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-white/5 shadow-md">
                        <ArrowRightLeft size={14} />
                      </button>
                      <button className="p-2 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white rounded-lg border border-indigo-500/20 shadow-md">
                        <PlusCircle size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      <div className="p-6 bg-white/[0.01] border-t border-white/5">
        <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#121212] hover:bg-[#181818] border border-white/5 rounded-xl text-xs font-bold text-slate-400 hover:text-white group transition-all">
          View All Portfolio Assets
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default AssetList;
