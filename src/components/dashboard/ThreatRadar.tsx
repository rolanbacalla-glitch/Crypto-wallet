import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLiveThreats, type ThreatAlert } from '../../services/ThreatIntelService';

const ThreatRadar: React.FC = () => {
  const [threats, setThreats] = useState<ThreatAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchThreats = async () => {
      const data = await getLiveThreats();
      setThreats(data);
      setIsLoading(false);
    };
    fetchThreats();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-danger shadow-[0_0_15px_rgba(255,82,82,0.3)]';
      case 'high': return 'text-warning';
      case 'medium': return 'text-text-muted';
      default: return 'text-text-dim opacity-40';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'phishing': return 'person_search';
      case 'exploit': return 'terminal';
      case 'scam': return 'dangerous';
      default: return 'warning';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 glass-frosted animate-pulse rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-danger text-sm animate-pulse">radar</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-black uppercase tracking-widest">Global Threat Feed</h3>
            <span className="text-[9px] font-black italic text-text-dim uppercase tracking-widest">Live Monitoring • Active</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[9px] font-black text-text-dim uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-1" />
            V3 Security layer
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {threats.map((threat, index) => (
            <motion.div
              layout
              key={threat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-frosted border border-white/5 p-5 rounded-[32px] flex items-center gap-6 group hover:border-white/15 transition-all relative overflow-hidden"
            >
              <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center relative ${getSeverityColor(threat.severity)}`}>
                <span className="material-symbols-outlined text-2xl">{getTypeIcon(threat.type)}</span>
                {threat.severity === 'critical' && (
                  <div className="absolute inset-0 bg-danger/5 animate-ping rounded-2xl" />
                )}
              </div>

              <div className="flex flex-col flex-1 gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-tight">{threat.title}</span>
                  <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">{threat.timestamp}</span>
                </div>
                <p className="text-[10px] font-medium text-text-dim line-clamp-1">{threat.description}</p>
                <div className="flex items-center gap-3 mt-1">
                   <span className="text-[8px] px-2 py-0.5 bg-white/5 rounded-md font-black uppercase text-text-muted tracking-widest border border-white/5">
                      {threat.network}
                   </span>
                   <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 bg-white/10 rounded-full" />
                      <span className="text-[8px] font-black uppercase text-text-muted tracking-widest opacity-60">Impact: {threat.impactScore}%</span>
                   </div>
                </div>
              </div>

              <div className="material-symbols-outlined text-text-muted opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-primary">arrow_forward_ios</div>
              
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button className="w-full h-12 bg-white/5 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-white hover:bg-white/10 transition-all mt-2">
        Full Threat Intelligence Report
      </button>
    </div>
  );
};

export default ThreatRadar;
