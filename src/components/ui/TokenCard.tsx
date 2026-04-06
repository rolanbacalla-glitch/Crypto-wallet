import React from 'react';
import { motion } from 'framer-motion';
import type { TokenSymbol } from '../../types/types';

interface TokenCardProps {
  token: TokenSymbol;
  balance: string;
  usdValue: string;
  logoUrl?: string; // Optional image URL for token logo
  onClick?: () => void;
}

const TokenCard: React.FC<TokenCardProps> = ({ 
  token, 
  balance, 
  usdValue, 
  logoUrl, 
  onClick 
}) => {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`
        flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl 
        cursor-pointer hover:bg-white/10 transition-all group
      `}
    >
      <div className="flex items-center gap-4">
        {logoUrl ? (
          <img src={logoUrl} alt={token} className="w-10 h-10 rounded-full" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-black text-black text-xs">
            {token.substring(0, 2).toUpperCase()}
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-black tracking-widest uppercase text-white group-hover:text-primary transition-colors">
            {token}
          </span>
          <span className="text-[10px] font-black text-text-dim uppercase tracking-wider">
            Balance: {balance}
          </span>
        </div>
      </div>
      <div className="text-right">
        <span className="text-sm font-black text-white">
          £{usdValue}
        </span>
      </div>
    </motion.div>
  );
};

export default TokenCard;
