import React from 'react';

const MOCK_TRANSACTIONS = [
  { id: '1', type: 'receive', asset: 'ETH', amount: '0.421 ETH', status: 'completed', date: 'Oct 23, 14:15', txHash: '0x12a...78b' },
  { id: '2', type: 'send', asset: 'SOL', amount: '12.5 SOL', status: 'completed', date: 'Oct 22, 11:21', txHash: '0xa4c...c5e' },
  { id: '3', type: 'swap', asset: 'PEPE', amount: '24.1M PEPE', status: 'pending', date: 'Oct 22, 10:45', txHash: '0xb23...91a' },
  { id: '4', type: 'approve', asset: 'USDC', amount: 'Unlimited', status: 'completed', date: 'Oct 21, 16:32', txHash: '0xe51...3f4' }
];

const TransactionOverview: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black">History Overview</h3>
        <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All</button>
      </div>

      <div className="flex flex-col gap-4">
        {MOCK_TRANSACTIONS.map((tx) => (
          <div key={tx.id} className="glass-frosted border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:border-white/10 transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                tx.type === 'receive' ? 'bg-primary/20 text-primary' : 
                tx.type === 'send' ? 'bg-error/20 text-error' : 
                'bg-white/10 text-text-dim'
              }`}>
                <span className="material-symbols-outlined text-xl">
                  {tx.type === 'receive' ? 'arrow_downward' : 
                   tx.type === 'send' ? 'arrow_upward' : 
                   tx.type === 'swap' ? 'swap_horiz' : 'verified_user'}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold capitalize text-white">{tx.type} {tx.asset}</span>
                <span className="text-[10px] uppercase font-black tracking-widest text-text-muted transition-colors group-hover:text-text-dim">{tx.txHash}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-xs font-bold text-white transition-colors group-hover:text-primary">{tx.amount}</span>
              <span className="text-[10px] uppercase font-black tracking-[0.2em] text-text-muted">{tx.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionOverview;
