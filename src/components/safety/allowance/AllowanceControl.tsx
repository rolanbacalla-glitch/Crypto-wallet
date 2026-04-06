import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ExternalLink, XCircle } from 'lucide-react';

const allowances = [
  {
    id: '1',
    token: 'USDT',
    tokenIcon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    dApp: 'Uniswap V3',
    dAppIcon: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
    amount: 'Unlimited',
    risk: 'Medium',
    lastActive: '2 days ago'
  },
  {
    id: '2',
    token: 'WETH',
    tokenIcon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    dApp: 'OpenSea',
    dAppIcon: 'https://storage.googleapis.com/opensea-static/logos/opensea-logo.png',
    amount: '10.0',
    risk: 'Low',
    lastActive: '1 week ago'
  },
  {
    id: '3',
    token: 'PEPE',
    tokenIcon: 'https://cryptologos.cc/logos/pepe-pepe-logo.png',
    dApp: 'Unknown DApp',
    dAppIcon: '',
    amount: 'Unlimited',
    risk: 'High',
    lastActive: 'Just now'
  }
];

const AllowanceControl = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black tracking-tight mb-2">Token Allowances</h2>
            <p className="text-text-dim text-sm">Manage which dApps can spend your tokens</p>
          </div>
          <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center gap-2">
            <ShieldAlert size={16} className="text-yellow-500" />
            <span className="text-yellow-500 text-xs font-bold uppercase tracking-wider">3 Active Risks</span>
          </div>
        </div>

        <div className="grid gap-4">
          {allowances.map((allowance) => (
            <motion.div 
              key={allowance.id}
              whileHover={{ scale: 1.01 }}
              className="group bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20"
            >
              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center p-2 border border-white/10 shadow-xl overflow-hidden">
                    <img src={allowance.tokenIcon} alt={allowance.token} className="w-full h-full object-contain" />
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center p-2 border border-white/10 backdrop-blur-md shadow-xl overflow-hidden">
                    {allowance.dAppIcon ? (
                      <img src={allowance.dAppIcon} alt={allowance.dApp} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full bg-white/5 flex items-center justify-center rounded-lg">
                        <span className="text-xs font-black text-white/20">?</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black">{allowance.token}</span>
                    <span className="text-text-dim text-sm">on</span>
                    <span className="text-white font-bold">{allowance.dApp}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white/5 text-[10px] text-text-dim font-bold uppercase tracking-wider">
                      Amount: <span className="text-white">{allowance.amount}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      allowance.risk === 'High' ? 'bg-red-500/10 text-red-500' :
                      allowance.risk === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-green-500/10 text-green-500'
                    }`}>
                      {allowance.risk} Risk
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-colors">
                  <ExternalLink size={14} />
                  Details
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-colors">
                  <XCircle size={14} />
                  Revoke
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <ShieldCheck size={120} />
          </div>
          <h3 className="text-green-500 text-sm font-black uppercase tracking-widest mb-2">Safe Browsing</h3>
          <p className="text-white/80 text-lg font-bold leading-tight max-w-[200px]">No signature-less approval detected in 30 days.</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-primary text-sm font-black uppercase tracking-widest mb-1">Bulk Revoke</h3>
            <p className="text-white/60 text-xs font-medium">Clean up all inactive high-risk approvals in one click.</p>
          </div>
          <button className="mt-4 w-full py-3 bg-primary text-black font-black uppercase text-[10px] tracking-widest rounded-xl shadow-glow active:scale-95 transition-transform">
            Execute Bulk Clean
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllowanceControl;
