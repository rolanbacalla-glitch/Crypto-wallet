import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MOCK_TOKENS = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: '£54,212.80', change: '-0.8%', numericChange: -0.8, safety: 'High', score: 96, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/BTCB-1DE/logo.png' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: '£1,424.12', change: '+2.4%', numericChange: 2.4, safety: 'High', score: 98, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', price: '£142.15', change: '+12.5%', numericChange: 12.5, safety: 'Med', score: 72, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png' },
  { id: 'link', name: 'Chainlink', symbol: 'LINK', price: '£18.42', change: '+4.2%', numericChange: 4.2, safety: 'High', score: 94, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png' },
  { id: 'pepe', name: 'Pepe', symbol: 'PEPE', price: '£0.000008', change: '+42.1%', numericChange: 42.1, safety: 'Low', score: 24, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6982508145454Ce325dDbE47a25d4ec3d2311933/logo.png' },
  { id: 'aave', name: 'Aave', symbol: 'AAVE', price: '£124.50', change: '-2.1%', numericChange: -2.1, safety: 'High', score: 88, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76e0739f717339381F7c988C9996/logo.png' },
  { id: 'uni', name: 'Uniswap', symbol: 'UNI', price: '£8.12', change: '+5.4%', numericChange: 5.4, safety: 'High', score: 92, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png' },
  { id: 'near', name: 'Near Protocol', symbol: 'NEAR', price: '£5.42', change: '+8.2%', numericChange: 8.2, safety: 'Med', score: 78, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/near/info/logo.png' },
  { id: 'matic', name: 'Polygon', symbol: 'MATIC', price: '£0.82', change: '+1.4%', numericChange: 1.4, safety: 'High', score: 90, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png' },
  { id: 'shib', name: 'Shiba Inu', symbol: 'SHIB', price: '£0.000024', change: '+15.2%', numericChange: 15.2, safety: 'Low', score: 38, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE/logo.png' },
  { id: 'ada', name: 'Cardano', symbol: 'ADA', price: '£0.42', change: '-1.8%', numericChange: -1.8, safety: 'High', score: 85, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cardano/info/logo.png' },
  { id: 'dot', name: 'Polkadot', symbol: 'DOT', price: '£7.12', change: '+3.2%', numericChange: 3.2, safety: 'High', score: 82, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polkadot/info/logo.png' },
  { id: 'doge', name: 'Dogecoin', symbol: 'DOGE', price: '£0.16', change: '+22.4%', numericChange: 22.4, safety: 'Low', score: 45, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/doge/info/logo.png' },
  { id: 'avax', name: 'Avalanche', symbol: 'AVAX', price: '£38.42', change: '+9.1%', numericChange: 9.1, safety: 'High', score: 88, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png' },
  { id: 'render', name: 'Render', symbol: 'RENDER', price: '£9.24', change: '+18.4%', numericChange: 18.4, safety: 'Med', score: 68, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6De037ef9aD2725EB40118Bb1702EBf27e4Aeb22/logo.png' },
  { id: 'apt', name: 'Aptos', symbol: 'APT', price: '£12.14', change: '-4.2%', numericChange: -4.2, safety: 'Med', score: 74, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/aptos/info/logo.png' },
  { id: 'op', name: 'Optimism', symbol: 'OP', price: '£3.42', change: '+6.8%', numericChange: 6.8, safety: 'High', score: 91, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png' },
  { id: 'arb', name: 'Arbitrum', symbol: 'ARB', price: '£1.12', change: '+2.1%', numericChange: 2.1, safety: 'High', score: 94, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png' },
  { id: 'floki', name: 'Floki', symbol: 'FLOKI', price: '£0.00018', change: '+34.2%', numericChange: 34.2, safety: 'Low', score: 22, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xcf0C122c6b53db68882d92D1D9232a433a466AC9/logo.png' },
  { id: 'ldo', name: 'Lido DAO', symbol: 'LDO', price: '£2.14', change: '-0.4%', numericChange: -0.4, safety: 'High', score: 88, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32/logo.png' },
];

const MarketPage: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  // Sorting by 24h change (descending) as requested
  const sortedTokens = useMemo(() => {
    return [...MOCK_TOKENS].sort((a, b) => b.numericChange - a.numericChange);
  }, []);

  const displayedTokens = isExpanded ? sortedTokens : sortedTokens.slice(0, 10);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-1">Market Intelligence</h1>
          <p className="text-text-dim font-medium">Verified liquidity and safety scores for trending assets</p>
        </div>
        
        <div className="flex gap-4">
          <div className="glass-frosted border border-white/10 px-6 py-3 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Global Cap</span>
            <span className="text-sm font-black tracking-tight tracking-tighter ">£2.42T</span>
          </div>
          <div className="glass-frosted border border-white/10 px-6 py-3 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">24h Vol</span>
            <span className="text-sm font-black tracking-tight tracking-tighter  text-primary">£84.2B</span>
          </div>
        </div>
      </div>

      <div className="glass-frosted border border-white/10 rounded-[48px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/2">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Asset</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Price</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">24h Change</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Safety Score</th>
              <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-text-muted">Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode='popLayout'>
              {displayedTokens.map((token, i) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03, duration: 0.2 }}
                  key={token.id} 
                  className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      {/* Brand Logo Integration */}
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-1.5 overflow-hidden">
                        <img 
                          src={token.icon} 
                          alt={token.symbol} 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${token.symbol}&background=random`;
                          }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black tracking-tight">{token.name}</span>
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{token.symbol}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-black tracking-tight text-sm ">{token.price}</td>
                  <td className="px-8 py-6 font-black tracking-tight text-sm ">
                    <span className={token.change.startsWith('+') ? 'text-primary drop-shadow-[0_0_8px_rgba(212,255,59,0.3)]' : 'text-danger'}>
                      {token.change}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${token.score >= 80 ? 'bg-primary shadow-[0_0_10px_rgba(212,255,59,0.5)]' : token.score >= 50 ? 'bg-warning' : 'bg-danger'}`}
                          style={{ width: `${token.score}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${token.score >= 80 ? 'text-primary' : token.score >= 50 ? 'text-warning' : 'text-danger'}`}>
                        {token.score >= 80 ? 'Safe' : token.score >= 50 ? 'Medium' : 'Risky'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => navigate(`/trade?asset=${token.symbol}`)}
                      className="bg-white/5 border border-white/10 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-black transition-all"
                    >
                      Trade
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        
        {/* Expansion Toggle */}
        <div className="p-6 flex justify-center bg-white/[0.02]">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 bg-white/5 border border-white/10 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-primary hover:border-primary/50 transition-all group"
          >
            {isExpanded ? 'Show Top 10' : 'View All Assets'}
            <span className={`material-symbols-outlined text-sm transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketPage;
