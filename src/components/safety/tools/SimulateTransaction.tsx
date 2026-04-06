import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  Terminal, 
  ArrowRight,
  Fingerprint,
  Cpu,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

interface SimulationStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  details?: string;
}

const SimulateTransaction: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('low');

  const [steps, setSteps] = useState<SimulationStep[]>([
    { id: '1', label: 'Dynamic Contract Parsing', status: 'pending' },
    { id: '2', label: 'Bytecode Decompilation', status: 'pending' },
    { id: '3', label: 'State Access Simulation', status: 'pending' },
    { id: '4', label: 'Value Flow Verification', status: 'pending' },
    { id: '5', label: 'Honey-Pot Detection', status: 'pending' },
    { id: '6', label: 'Front-Run Risk Analysis', status: 'pending' }
  ]);

  const startSimulation = () => {
    setIsSimulating(true);
    setSimulationComplete(false);
    setActiveStep(0);
    setSteps(s => s.map(step => ({ ...step, status: 'pending' })));
    
    // Randomize risk for demo
    const risks: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    setRiskLevel(risks[Math.floor(Math.random() * risks.length)]);
  };

  useEffect(() => {
    if (!isSimulating || activeStep >= steps.length) {
      if (activeStep >= steps.length) {
        setIsSimulating(false);
        setSimulationComplete(true);
      }
      return;
    }

    const timer = setTimeout(() => {
      setSteps(prev => prev.map((step, idx) => {
        if (idx === activeStep) return { ...step, status: 'completed' };
        return step;
      }));
      setActiveStep(prev => prev + 1);
    }, 800 + Math.random() * 1200);

    return () => clearTimeout(timer);
  }, [isSimulating, activeStep, steps.length]);

  return (
    <div className="bg-[#0f172a]/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Zap className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Hyper-Simulation Engine</h3>
            <p className="text-slate-400 text-xs">Real-time predictive transaction modelling</p>
          </div>
        </div>
        
        {!isSimulating && !simulationComplete && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startSimulation}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            Run Simulation
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        )}
        
        {simulationComplete && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startSimulation}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors"
          >
            Reset
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Col: Logic Flow */}
        <div className="space-y-3">
          {steps.map((step, idx) => (
            <div 
              key={step.id}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                idx === activeStep && isSimulating
                  ? 'bg-indigo-500/10 border-indigo-500/30 ring-1 ring-indigo-500/20'
                  : step.status === 'completed'
                  ? 'bg-slate-900/40 border-emerald-500/20 opacity-80'
                  : 'bg-slate-900/20 border-slate-800/50 opacity-40'
              }`}
            >
              <div className="relative">
                {idx === activeStep && isSimulating ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent"
                  />
                ) : step.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-700" />
                )}
              </div>
              <span className={`text-sm font-medium ${
                idx === activeStep && isSimulating ? 'text-indigo-400' : 'text-slate-300'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Right Col: Console & Results */}
        <div className="bg-[#020617] rounded-xl border border-slate-800/50 p-4 relative overflow-hidden flex flex-col min-h-[300px]">
          <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
            <Terminal className="w-4 h-4 text-slate-500" />
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Safe-Sim Console v2.0.4</span>
          </div>

          <div className="flex-1 font-mono text-[11px] space-y-1.5 overflow-hidden">
            <AnimatePresence>
              {isSimulating && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-slate-400"
                >
                  <p className="text-indigo-400">&gt; initialising sandbox environment...</p>
                  <p className="text-indigo-400">&gt; snapshotting mainnet state @block#19823482</p>
                  {activeStep > 0 && <p className="text-white">&gt; parsing calldata: 0x4523...ff01</p>}
                  {activeStep > 1 && <p className="text-white">&gt; trace: sload(addr: 0x..., slot: 0x...)</p>}
                  {activeStep > 2 && <p className="text-white">&gt; mock transfer: 1.5 ETH from user to vault</p>}
                  {activeStep > 3 && <p className="text-white">&gt; verification: no recursive calls detected</p>}
                  {activeStep > 4 && <p className="text-amber-400">&gt; warning: high slippage tolerance found</p>}
                </motion.div>
              )}

              {!isSimulating && !simulationComplete && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <Cpu className="w-10 h-10 text-slate-700 mb-3" />
                  <p className="text-slate-500">Awaiting transaction payload</p>
                </div>
              )}

              {simulationComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className={`p-4 rounded-xl border-2 ${
                    riskLevel === 'low' 
                      ? 'bg-emerald-500/10 border-emerald-500/30' 
                      : riskLevel === 'medium'
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-rose-500/10 border-rose-500/30'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                       {riskLevel === 'low' ? (
                         <ShieldCheck className="w-6 h-6 text-emerald-400" />
                       ) : <ShieldAlert className="w-6 h-6 text-rose-400" />}
                       <span className={`text-lg font-bold tracking-tight ${
                         riskLevel === 'low' ? 'text-emerald-400' : 'text-rose-400'
                       }`}>
                         {riskLevel.toUpperCase()} RISK DETECTED
                       </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {riskLevel === 'low' 
                        ? 'Simulation verified. Transaction flows align with expected behavior. No malicious vectors identified.' 
                        : riskLevel === 'medium'
                        ? 'Caution: Abnormal gas consumption and slippage parameters. Manual review recommended.'
                        : 'CRITICAL: Signature overlaps with known phishing patterns. Execution will result in potential asset drain.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="block text-[10px] text-slate-500 mb-1">Asset Change</span>
                      <span className="text-emerald-400 font-bold">+1,240.50 USDC</span>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="block text-[10px] text-slate-500 mb-1">Max Slippage</span>
                      <span className="text-white font-bold">0.15%</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Decorative scanner effect */}
          {isSimulating && (
            <motion.div 
              animate={{ bottom: ['100%', '0%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent z-10 blur-sm"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulateTransaction;
