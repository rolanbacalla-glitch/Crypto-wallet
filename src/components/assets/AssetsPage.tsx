import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssets } from '../../hooks/useAssets';
import { type Asset } from '../../types/asset';

const CustomAssetModal: React.FC<{ isOpen: boolean; onClose: () => void; onAdd: (asset: Asset) => void }> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    contract: '',
    balance: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.symbol) return;

    const newAsset: Asset = {
      name: formData.name,
      symbol: formData.symbol.toUpperCase(),
      balance: `${formData.balance || '0'} ${formData.symbol.toUpperCase()}`,
      value: formData.balance ? `£${(parseFloat(formData.balance) * 1.25).toLocaleString()}` : '£0.00', // Mock value calculation
      price: '£1.25', // Mock price
      score: 45, // Default/Unverified score
      icon: `https://ui-avatars.com/api/?name=${formData.symbol}&background=random`,
      contractAddress: formData.contract,
      isCustom: true
    };

    onAdd(newAsset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-0">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-lg glass-frosted border border-white/20 rounded-[48px] overflow-hidden shadow-2xl"
      >
        <div className="p-10 flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-black tracking-tight">Add Custom Asset</h3>
              <p className="text-[10px] uppercase font-black tracking-widest text-text-muted mt-1">Register unverified tokens manually</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-dim px-2">Asset Name</label>
              <input 
                autoFocus
                placeholder="e.g. My Custom Coin"
                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold tracking-tight focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-dim px-2">Symbol</label>
              <input 
                placeholder="e.g. MCC"
                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold tracking-tight focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/20 uppercase"
                value={formData.symbol}
                onChange={e => setFormData({ ...formData, symbol: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-dim px-2">Contract Address (Optional)</label>
              <input 
                placeholder="0x..."
                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-mono tracking-tight focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                value={formData.contract}
                onChange={e => setFormData({ ...formData, contract: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-dim px-2">Initial Balance</label>
              <input 
                type="number"
                placeholder="0.00"
                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold tracking-tight focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                value={formData.balance}
                onChange={e => setFormData({ ...formData, balance: e.target.value })}
              />
            </div>

            <button type="submit" className="bg-primary text-black w-full py-5 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(212,255,59,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all mt-4">
              Add Asset to Portfolio
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const AssetsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { assets, addAsset } = useAssets();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-1">Asset Inventory</h1>
          <p className="text-text-dim font-medium">Full breakdown of your verified on-chain assets</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-black px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(212,255,59,0.3)] hover:scale-105 transition-all"
        >
          Add Custom Asset
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <CustomAssetModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onAdd={addAsset} 
          />
        )}
      </AnimatePresence>

      <div className="glass-frosted border border-white/10 rounded-[48px] overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/2 flex justify-between items-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
            <span className="material-symbols-outlined text-sm">verified</span>
            Safe Portfolio
          </div>
          <div className="text-sm font-black italic tracking-tighter">Total Assets: {assets.length}</div>
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
            {assets.map((asset, i) => (
              <motion.tr 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                key={asset.symbol + i} 
                className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-default group"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
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
                      {asset.isCustom && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-warning flex items-center justify-center text-[8px] text-black font-black shadow-sm">
                          ?
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black tracking-tight">{asset.name}</span>
                        {asset.isCustom && (
                          <span className="text-[8px] px-1.5 py-0.5 bg-white/10 rounded-full text-text-dim uppercase tracking-widest">Custom</span>
                        )}
                      </div>
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
