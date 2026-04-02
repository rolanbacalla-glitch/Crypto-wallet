import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
  const { login, isLoggingIn } = useAuth();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const handleWalletSelect = (wallet: string) => {
    setSelectedWallet(wallet);
    login('0x71C7656EC7ab88b098defB751B7401B5f6d8976F', 'johndoe.eth');
  };

  const WALLETS = [
    { id: 'metamask', name: 'MetaMask', icon: '🦊' },
    { id: 'coinbase', name: 'Coinbase Wallet', icon: '🛡️' },
    { id: 'walletconnect', name: 'WalletConnect', icon: '🌐' },
    { id: 'ledger', name: 'Ledger Live', icon: '💎' },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden p-6 selection:bg-primary selection:text-black">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full -mr-48 -mt-48" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-[480px] relative z-10"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6 shadow-glow"
          >
            Vault Security V4.0
          </motion.div>
          <h1 className="text-6xl font-black tracking-tighter mb-4">nest</h1>
          <p className="text-text-dim font-medium text-lg">Secure your assets with the world's first AI Wallet Safety Copilot.</p>
        </div>

        <div className="glass-frosted border border-white/10 rounded-[48px] p-10 flex flex-col gap-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-black tracking-tight">Connect Identity</h2>
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest leading-relaxed">
              Sign a secure message to authorize your vault access. No private keys are shared.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {WALLETS.map((wallet, i) => (
              <motion.button
                key={wallet.id}
                onClick={() => handleWalletSelect(wallet.id)}
                disabled={isLoggingIn}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`
                  flex items-center justify-between p-6 rounded-3xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all group
                  ${isLoggingIn && selectedWallet === wallet.id ? 'ring-2 ring-primary animate-pulse' : ''}
                `}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{wallet.icon}</span>
                  <span className="text-sm font-black tracking-tight">{wallet.name}</span>
                </div>
                <span className="material-symbols-outlined text-text-muted group-hover:text-primary transition-colors">arrow_forward</span>
              </motion.button>
            ))}
          </div>

          <div className="pt-4 border-t border-white/5">
            <p className="text-[11px] font-medium text-text-muted text-center leading-relaxed">
              By connecting, you agree to Nest's safety algorithms and <br /> <span className="text-white hover:underline cursor-pointer">Terms of Protection</span>.
            </p>
          </div>

          {isLoggingIn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center"
            >
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-6" />
              <h3 className="text-2xl font-black tracking-tighter mb-2">Requesting Signature</h3>
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest leading-relaxed">
                Check your crypto wallet and authorize the secure login request.
              </p>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 flex items-center justify-center gap-12 text-[10px] font-black uppercase tracking-widest text-text-muted"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">lock</span>
            End-to-End Encryption
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">security</span>
            AI Monitored
          </div>
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-sm">verified</span>
            Vetted by Trail of Bits
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
