import { motion } from 'framer-motion';
import { Shield, Brain, Cpu, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';

const AIShield = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden flex flex-col gap-10 min-h-[500px]">
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform duration-1000">
          <Brain size={300} />
        </div>

        <div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <Brain size={24} className="text-primary" />
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-4 text-white">Neural Defense V2</h2>
          <p className="text-text-dim leading-relaxed font-medium">
            Zenith V2's advanced threat detection engine. Using quantum-resistant heuristics and real-time mempool monitoring to shield your assets from the most sophisticated attacks.
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-auto z-10">
          <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex items-center gap-4 group hover:bg-black/60 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Cpu size={20} className="text-primary shadow-glow-sm" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-primary mb-0.5">Neural Core Status</div>
              <div className="text-white text-sm font-bold flex items-center gap-2">
                Zenith 2.0 Engine <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-glow" />
              </div>
            </div>
          </div>
          <button className="w-full py-4 bg-primary text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-glow active:scale-95 transition-transform hover:shadow-glow-strong">
            Configure Defense Parameters
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl flex flex-col gap-8 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <MessageSquare size={20} className="text-purple-500" />
              </div>
              <h3 className="text-xl font-black tracking-tight text-white">AI Insights</h3>
            </div>
            <div className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-widest text-text-dim">Real-time Analysis</div>
          </div>

          <div className="flex flex-col gap-4">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-purple-500/10 border border-purple-500/20 p-5 rounded-2xl flex gap-4"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                <AlertCircle size={16} className="text-purple-500" />
              </div>
              <div>
                <div className="text-white font-bold text-sm mb-1">Contract Risk Detected</div>
                <p className="text-purple-500/80 text-xs font-medium leading-relaxed italic">
                  "The contract you're interacting with has no source code verified on Etherscan and exhibits 'honey-pot' behavior patterns common in rug pulls."
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-cyan-500/10 border border-cyan-500/20 p-5 rounded-2xl flex gap-4"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 size={16} className="text-cyan-400" />
              </div>
              <div>
                <div className="text-white font-bold text-sm mb-1">Zenith V2 MEV Shield Active</div>
                <p className="text-cyan-500/80 text-xs font-medium leading-relaxed">
                  "Private RPC node path secured. Your transaction is hidden from public mempool indices, neutralizing front-running risks."
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-6 text-primary group-hover:scale-125 transition-transform duration-500">
              <Shield size={24} />
            </div>
            <div className="text-4xl font-black mb-2 tracking-tighter text-white">99.9%</div>
            <div className="text-text-dim text-[10px] font-black uppercase tracking-widest leading-tight">Attack<br/>Prevention</div>
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/5 blur-3xl rounded-full" />
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-6 text-purple-500 group-hover:scale-125 transition-transform duration-500">
              <Cpu size={24} />
            </div>
            <div className="text-4xl font-black mb-2 tracking-tighter text-white">4ms</div>
            <div className="text-text-dim text-[10px] font-black uppercase tracking-widest leading-tight">Latency<br/>Optimization</div>
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-purple-500/5 blur-3xl rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIShield;
