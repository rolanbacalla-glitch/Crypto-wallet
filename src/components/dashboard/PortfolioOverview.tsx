import { 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart 
} from 'recharts';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Briefcase, 
  ShieldCheck 
} from 'lucide-react';
import { motion } from 'framer-motion';

const data = [
  { time: '00:00', value: 42300 },
  { time: '04:00', value: 45200 },
  { time: '08:00', value: 43800 },
  { time: '12:00', value: 48900 },
  { time: '16:00', value: 47100 },
  { time: '20:00', value: 52400 },
  { time: '23:59', value: 51200 },
];

const PortfolioOverview = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-1 lg:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 lg:p-8 relative overflow-hidden group shadow-2xl shadow-indigo-500/5 hover:shadow-indigo-500/10 transition-shadow duration-500"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -mr-48 -mt-48 group-hover:bg-indigo-500/10 transition-colors duration-700" />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <span className="p-1.5 bg-indigo-500/10 rounded-lg">
                <Briefcase size={16} className="text-indigo-400" />
              </span>
              <span className="text-sm font-medium uppercase tracking-wider">Total Net Worth</span>
            </div>
            
            <div className="flex items-baseline gap-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">£142,568.24</h1>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold border border-emerald-500/20">
                <TrendingUp size={12} />
                <span>+12.4%</span>
              </div>
            </div>
            
            <p className="text-slate-500 text-sm mt-2 flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500/60" />
              Fully verified & secure • 24h change: <span className="text-emerald-400">+£15,640.12</span>
            </p>
          </div>
          
          <div className="flex bg-[#121212] p-1 rounded-xl border border-white/5 shadow-inner">
            {['1D', '1W', '1M', '1Y', 'ALL'].map((period) => (
              <button 
                key={period} 
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                  period === '1D' 
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 ring-1 ring-white/20' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-[320px] w-full mt-4 -ml-4 lg:-ml-6 pr-0 overflow-visible">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} 
                dy={10}
              />
              <YAxis 
                hide 
                domain={['dataMin - 2000', 'dataMax + 2000']} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
                  padding: '12px'
                }}
                itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}
                labelStyle={{ color: '#64748b', fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase' }}
                cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#6366f1" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#chartGradient)" 
                animationDuration={2000}
                activeDot={{ r: 6, fill: '#fff', stroke: '#6366f1', strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {[
            { label: 'Market Cap', val: '£5.4B', trend: '+2.1%', icon: <ArrowUpRight className="text-emerald-400" /> },
            { label: '24h Volume', val: '£812M', trend: '-0.4%', icon: <ArrowDownRight className="text-rose-400" /> },
            { label: 'Available', val: '£12,401', trend: '+1.5%', icon: <ArrowUpRight className="text-emerald-400" /> },
            { label: 'Staked', val: '£31,520', trend: '+8.2%', icon: <ArrowUpRight className="text-emerald-400" /> },
          ].map((stat, idx) => (
            <div key={idx} className="group/stat">
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1 group-hover/stat:text-slate-400 transition-colors">{stat.label}</p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-100">{stat.val}</span>
                <span className={`text-[10px] font-bold flex items-center ${stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stat.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioOverview;
