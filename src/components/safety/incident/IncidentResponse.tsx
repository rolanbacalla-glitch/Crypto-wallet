import { motion } from 'framer-motion';
import { AlertCircle, ShieldAlert, Lock, Zap, Smartphone, HardDrive, RefreshCw } from 'lucide-react';

const IncidentResponse = () => {
  return (
    <div className="flex flex-col gap-10">
      <div className="bg-red-500/5 border border-red-500/20 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden flex flex-col items-center text-center gap-6">
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform duration-1000">
          <ShieldAlert size={300} className="text-red-500" />
        </div>

        <div className="w-20 h-20 rounded-[1.5rem] bg-red-500/10 flex items-center justify-center mb-4">
          <AlertCircle size={40} className="text-red-500" />
        </div>

        <h2 className="text-4xl font-black tracking-tighter">Emergency Shutdown</h2>
        <p className="text-text-dim max-w-xl leading-relaxed text-lg">
          If you suspect your wallet has been compromised, use the tools below to secure your assets immediately.
        </p>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-12 py-5 bg-red-500 text-white font-black uppercase text-sm tracking-[0.3em] rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.3)] active:scale-95 transition-all hover:bg-red-600"
        >
          Activate Kill Switch
        </motion.button>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col gap-6 relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:scale-150 transition-transform duration-700">
            <Lock size={120} />
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Lock size={24} className="text-orange-500" />
          </div>
          <h3 className="text-xl font-black tracking-tight">Lock Private Keys</h3>
          <p className="text-text-dim text-sm leading-relaxed">
            Immediately disable all transaction signing on this device and connected hardware.
          </p>
          <button className="mt-auto px-4 py-3 bg-white/10 rounded-xl border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-colors">
            Lock Now
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col gap-6 relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:scale-150 transition-transform duration-700">
            <Zap size={120} />
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Zap size={24} className="text-primary" />
          </div>
          <h3 className="text-xl font-black tracking-tight">Sweep Funds</h3>
          <p className="text-text-dim text-sm leading-relaxed">
            Instantly move all available funds to your pre-configured cold storage address.
          </p>
          <button className="mt-auto px-4 py-3 bg-white/10 rounded-xl border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-colors">
            Start Sweep
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col gap-6 relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:scale-150 transition-transform duration-700">
            <RefreshCw size={120} />
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <RefreshCw size={24} className="text-blue-500" />
          </div>
          <h3 className="text-xl font-black tracking-tight">Rotate Credentials</h3>
          <p className="text-text-dim text-sm leading-relaxed">
            Update your 2FA, biometric data, and encryption keys for all wallet accounts.
          </p>
          <button className="mt-auto px-4 py-3 bg-white/10 rounded-xl border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-colors">
            Rotate Now
          </button>
        </div>
      </div>

      <div className="p-8 bg-black/40 border border-white/10 rounded-[2rem] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex -space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl">
              <Smartphone size={24} className="text-text-dim" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-xl">
              <HardDrive size={24} className="text-primary" />
            </div>
          </div>
          <div>
            <div className="text-white font-bold mb-0.5">Cold Storage: Ledger Nano X</div>
            <div className="text-text-dim text-xs">Last verified: 2 minutes ago via Bluetooth</div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest">
          Active Connection
        </div>
      </div>
    </div>
  );
};

export default IncidentResponse;
