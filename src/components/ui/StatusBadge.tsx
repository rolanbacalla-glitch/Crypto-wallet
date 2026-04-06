import React from 'react';
import { motion } from 'framer-motion';

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'pending';
  label: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  label, 
  className = '' 
}) => {
  const getColors = () => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'error':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'pending':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-white/5 text-text-dim border-white/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        px-3 py-1 text-[10px] font-black uppercase tracking-widest border rounded-full inline-flex
        ${getColors()}
        ${className}
      `}
    >
      {label}
    </motion.div>
  );
};

export default StatusBadge;
