import React from 'react';
import { motion } from 'framer-motion';

const ASSETS = [
  { symbol: 'ETH', name: 'Ethereum', balance: '12.42 ETH', value: '£17,688.14', price: '£1,424.12', score: 98, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
  { symbol: 'USDC', name: 'USD Coin', balance: '14,204.30 USDC', value: '£14,204.30', price: '£1.00', score: 99, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png' },
  { symbol: 'SOL', name: 'Solana', balance: '42.15 SOL', value: '£5,992.42', price: '£142.15', score: 72, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png' },
  { symbol: 'LINK', name: 'Chainlink', balance: '184.20 LINK', value: '£3,392.80', price: '£18.42', score: 94, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png' },
  { symbol: 'PEPE', name: 'Pepe', balance: '1.2B PEPE', value: '£534.48', price: '£0.00000044', score: 24, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6982508145454Ce325dDbE47a25d4ec3d2311933/logo.png' },
];

const AssetsPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-1">Asset Inventory</h1>
          <p className="text-text-dim font-medium">Full breakdown of your verified on-chain assets</p>
        </div>
        
        <button className="bg-primary text-black px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(212,255,59,0.3)] hover:scale-105 transition-all">
          Add Custom Asset
        </button>
      </div>

      <div className="glass-frosted border border-white/10 rounded-[48px] overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/2 flex justify-between items-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
            <span className="material-symbols-outlined text-sm">verified</span>
            Safe Portfolio
          </div>
          <div className="text-sm font-black italic tracking-tighter">Total Assets: 5</div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Asset Name</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Balance</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Value (GBP)</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Market Price</th>
              <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ASSETS.map((asset, i) => (
              <motion.tr 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                key={asset.symbol} 
                className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-default group"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    {/* Brand Logo Integration */}
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-1.5 overflow-hidden group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                      <img 
                        src={asset.icon} 
                        alt={asset.symbol} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${asset.symbol}&background=random`;
                        }}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black tracking-tight">{asset.name}</span>
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{asset.symbol}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 font-black tracking-tight text-sm italic">{asset.balance}</td>
                <td className="px-8 py-6 font-black tracking-tight text-sm italic text-primary">{asset.value}</td>
                <td className="px-8 py-6 font-black tracking-tight text-sm italic text-text-dim/60 group-hover:text-text-dim transition-all">{asset.price}</td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-dim hover:text-primary transition-all">
                      <span className="material-symbols-outlined text-sm">analytics</span>
                    </button>
                    <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-dim hover:text-primary transition-all">
                      <span className="material-symbols-outlined text-sm">send</span>
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetsPage;
