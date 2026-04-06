import React, { useState } from 'react';

const NetworkIndicator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState({
    id: 'eth',
    name: 'Ethereum',
    icon: 'token',
    color: '#627EEA',
    status: 'Connected'
  });

  const networks = [
    { id: 'eth', name: 'Ethereum', icon: 'token', color: '#627EEA' },
    { id: 'base', name: 'Base', icon: 'blur_on', color: '#0052FF' },
    { id: 'arb', name: 'Arbitrum', icon: 'Waves', color: '#28A0F0' },
    { id: 'opt', name: 'Optimism', icon: 'auto_awesome', color: '#FF0420' }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full py-2 px-4 hover:bg-white/10 hover:border-primary/30 transition-all duration-300 group"
      >
        <div className="relative">
          <span 
            className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform duration-300"
            style={{ color: currentNetwork.color }}
          >
            {currentNetwork.icon}
          </span>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping opacity-75" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
        </div>
        
        <div className="flex flex-col items-start leading-none">
          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-0.5">Network</span>
          <span className="text-sm font-bold text-white">{currentNetwork.name}</span>
        </div>
        
        <span className={`material-symbols-outlined text-sm text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-3 w-56 glass-frosted border border-white/10 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="px-3 py-2 border-b border-white/5 mb-1 text-[10px] font-black uppercase tracking-widest text-text-muted">
              Select Network
            </div>
            {networks.map((net) => (
              <button
                key={net.id}
                onClick={() => {
                  setCurrentNetwork({ ...net, status: 'Connected' });
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                  ${currentNetwork.id === net.id ? 'bg-primary/10 text-primary' : 'hover:bg-white/5 text-text-dim hover:text-white'}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-lg" style={{ color: net.color }}>
                    {net.icon}
                  </span>
                  <span className="text-sm font-bold">{net.name}</span>
                </div>
                {currentNetwork.id === net.id && (
                  <span className="material-symbols-outlined text-sm">check</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default NetworkIndicator;
