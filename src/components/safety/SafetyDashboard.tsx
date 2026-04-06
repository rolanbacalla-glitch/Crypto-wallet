import React from 'react';
import { motion } from 'framer-motion';
import ThreatRadar from './ThreatRadar';
import { ShieldCheck, ShieldAlert, AlertTriangle, Fingerprint, Eye, Database, Activity, Terminal } from 'lucide-react';

const SafetyDashboard: React.FC = () => {
  return (
    <div className="flex flex-col gap-10">
      {/* Header with Global Score */}
      <section className="flex flex-col items-center">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="84"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="4 8"
              className="opacity-5"
            />
            <motion.circle
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 0.96 }}
              transition={{ duration: 2, ease: "easeOut" }}
              cx="96"
              cy="96"
              r="84"
              fill="none"
              stroke="url(#safetyGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              className="shadow-glow-primary"
            />
            <defs>
              <linearGradient id="safetyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
            </defs>
          </svg>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-black text-white tracking-tighter">96.8</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Neural Score</span>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Neural Threat Radar */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl glass-frosted border border-white/10 flex items-center justify-center shadow-soft">
              <Eye className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">Neural Threat Radar</h2>
              <p className="text-[10px] font-medium text-text-dim uppercase tracking-widest">Active Surveillance System v2.1</p>
            </div>
          </div>
          <div className="p-8 glass-frosted rounded-[40px] border border-white/5 bg-white/2 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:opacity-100 transition-opacity">
              <Activity className="w-4 h-4 text-primary animate-pulse" />
            </div>
            <ThreatRadar />
          </div>
        </section>

        {/* Right: Security Events & Matrix */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl glass-frosted border border-white/10 flex items-center justify-center shadow-soft">
              <Terminal className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">Active Protocols</h2>
              <p className="text-[10px] font-medium text-text-dim uppercase tracking-widest">Neural Firewall Events</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            {[
              { icon: ShieldCheck, label: 'L2 Biometric', status: 'Secured', color: 'text-primary' },
              { icon: Database, label: 'Encrypted Vault', status: 'Isolated', color: 'text-primary' },
              { icon: Fingerprint, label: 'Neural Key', status: 'Active', color: 'text-primary' },
              { icon: ShieldAlert, label: 'Intrusion Detect', status: 'Idle', color: 'text-text-dim' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 glass-frosted rounded-3xl border border-white/5 bg-white/2 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5 text-white/40" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-dim">{item.label}</span>
                    <span className={`text-[11px] font-black uppercase tracking-tight ${item.color}`}>{item.status}</span>
                  </div>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
              </motion.div>
            ))}
          </div>

          <div className="mt-4 p-6 glass-frosted rounded-[32px] border border-white/10 bg-gradient-to-br from-primary/10 to-transparent relative overflow-hidden group cursor-pointer">
            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
              <ShieldCheck className="w-48 h-48 text-primary" />
            </div>
            <div className="relative z-10">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/80 mb-2 block">Neural Health</span>
              <h3 className="text-xl font-black text-white tracking-tighter mb-2">Zero-Knowledge Isolation</h3>
              <p className="text-xs font-medium text-text-dim leading-relaxed mb-4 max-w-[200px]">Your private keys never touch the network, even during neural synchronization.</p>
              <button className="text-[10px] font-black uppercase tracking-widest text-white underline decoration-primary decoration-2 underline-offset-4">Read Security Audit</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SafetyDashboard;
