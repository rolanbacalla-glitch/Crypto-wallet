import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Approval = {
  id: string;
  contractName: string;
  contractAddress: string;
  assetSymbol: string;
  allowance: string;
  lastUsed: string;
  riskLevel: 'low' | 'medium' | 'high';
  reason?: string;
  icon?: string;
};

const MOCK_APPROVALS: Approval[] = [
  { 
    id: '1', 
    contractName: 'Uniswap V3', 
    contractAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984', 
    assetSymbol: 'USDC', 
    allowance: 'Unlimited', 
    lastUsed: '2 hours ago', 
    riskLevel: 'medium',
    reason: 'Broad permission for potential vault drain risk.',
    icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png'
  },
  { 
    id: '2', 
    contractName: 'Lido Staking', 
    contractAddress: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', 
    assetSymbol: 'ETH', 
    allowance: '12.0 ETH', 
    lastUsed: '4 days ago', 
    riskLevel: 'low',
    reason: 'Specific allowance for staking principal.',
    icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84/logo.png'
  },
  { 
    id: '3', 
    contractName: 'Unknown Contract (Scam Suspect)', 
    contractAddress: '0xdeadbeef942e0a5213c1d19D4a2e9Eb0cE3606eB48', 
    assetSymbol: 'USDT', 
    allowance: 'Unlimited', 
    lastUsed: 'Never', 
    riskLevel: 'high',
    reason: 'Contract flagged for phishing and zero interaction history.',
    icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png'
  },
  { 
    id: '4', 
    contractName: 'OpenSea Seaport', 
    contractAddress: '0x00000000006c3852cbEf3e08E8dF289169EdE581', 
    assetSymbol: 'APE', 
    allowance: 'Unlimited', 
    lastUsed: '1 month ago', 
    riskLevel: 'medium',
    reason: 'Marketplace approval for broad NFT interactions.',
    icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4d224452801ACEd8B2F0aebE155379bb5D594381/logo.png'
  },
];

const AuditPage: React.FC = () => {
  const [approvals, setApprovals] = useState<Approval[]>(MOCK_APPROVALS);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const healthScore = useMemo(() => {
    const highRiskCount = approvals.filter(a => a.riskLevel === 'high').length;
    const medRiskCount = approvals.filter(a => a.riskLevel === 'medium').length;
    return Math.max(0, 100 - (highRiskCount * 40) - (medRiskCount * 10));
  }, [approvals]);

  const revokeApproval = (id: string) => {
    setApprovals(prev => prev.filter(a => a.id !== id));
  };

  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-primary';
    if (score > 50) return 'text-warning';
    return 'text-danger';
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-1">Approval Guard</h1>
          <p className="text-text-dim font-medium ">Audit and revoke dApp permissions to secure your vault</p>
        </div>
        
        <div className="flex gap-4">
          <div className="glass-frosted border border-white/10 px-8 py-4 rounded-[32px] flex flex-col items-center shadow-2xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Security Health Score</span>
            <span className={`text-4xl font-black  tracking-tighter ${getScoreColor(healthScore)}`}>
              {healthScore}
            </span>
          </div>
          <button 
            onClick={() => { setIsSummarizing(true); setTimeout(() => setIsSummarizing(false), 2000); }}
            className="glass-frosted border border-primary/30 h-14 px-8 rounded-full flex items-center gap-3 hover:bg-primary/10 transition-all group shadow-xl"
          >
            <span className={`material-symbols-outlined text-primary group-hover:rotate-180 transition-transform duration-700 ${isSummarizing ? 'animate-spin' : ''}`}>refresh</span>
            <span className="text-xs font-black uppercase tracking-widest text-primary">Run Detailed Audit</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {approvals.map((approval) => (
            <motion.div
              layout
              key={approval.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              className={`
                glass-frosted border p-8 rounded-[40px] flex items-center gap-8 group relative overflow-hidden transition-all
                ${approval.riskLevel === 'high' ? 'border-danger/30 hover:border-danger/50' : 'border-white/10 hover:border-white/20'}
              `}
            >
              {/* Risk Glow Background */}
              {approval.riskLevel === 'high' && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-danger/5 blur-[80px] -mr-32 -mt-32 pointer-events-none" />
              )}
              
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center relative shadow-lg">
                <img src={approval.icon} alt={approval.assetSymbol} className="w-10 h-10 object-contain" />
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-black
                  ${approval.riskLevel === 'high' ? 'bg-danger' : approval.riskLevel === 'medium' ? 'bg-warning' : 'bg-primary'}
                `}>
                  <span className="material-symbols-outlined text-[10px] text-black font-black">
                    {approval.riskLevel === 'high' ? 'priority_high' : approval.riskLevel === 'medium' ? 'warning' : 'check'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col flex-1 gap-1">
                <div className="flex items-center gap-3 text-lg font-black tracking-tight">
                  {approval.contractName}
                  <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-text-muted font-bold tracking-widest uppercase">
                    {approval.contractAddress.slice(0, 6)}...{approval.contractAddress.slice(-4)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-text-dim">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                    {approval.allowance} {approval.assetSymbol}
                  </span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">history</span>
                    Last used {approval.lastUsed}
                  </span>
                </div>
                {approval.reason && (
                  <p className="text-[11px] font-black  text-primary/60 mt-1 uppercase tracking-tighter">
                    {approval.reason}
                  </p>
                )}
              </div>

              <div className="flex gap-3 items-center">
                <button className="h-12 px-8 rounded-full font-black text-[10px] uppercase tracking-widest text-text-muted hover:text-white glass-frosted border border-white/10 hover:border-white/20 transition-all">
                  Edit Limit
                </button>
                <button 
                  onClick={() => revokeApproval(approval.id)}
                  className={`
                    px-8 h-12 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-xl
                    ${approval.riskLevel === 'high' 
                      ? 'bg-danger text-white hover:bg-danger/80 shadow-danger/20' 
                      : 'bg-white text-black hover:bg-white/90 shadow-white/10'}
                  `}
                >
                  Revoke Now
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {approvals.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 flex flex-col items-center gap-6"
          >
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-5xl animate-bounce">security</span>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black  tracking-tighter">Vault Fully Secure</h3>
              <p className="text-text-dim font-bold">No active dangerous permissions found in your wallet.</p>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Background info */}
      <div className="mt-4 p-8 glass-frosted border border-white/5 rounded-[40px] flex items-start gap-6">
        <span className="material-symbols-outlined text-primary text-3xl">lightbulb</span>
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-black uppercase tracking-widest">Why revoke approvals?</h4>
          <p className="text-xs font-medium text-text-dim leading-relaxed">
            In crypto, "approvals" allow smart contracts to take assets from your wallet. If a contract is 
            vulnerable or malicious, an "Unlimited" approval can be used to drain your entire balance 
            without your signature. Nest's Approval Guard helps you maintain the principle of least privilege.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuditPage;
