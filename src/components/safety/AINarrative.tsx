import React from 'react';
import { motion } from 'framer-motion';
import type { AINarrative as NarrativeType } from '../../services/geminiService';

interface AINarrativeProps {
  narrative: NarrativeType;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

const AINarrative: React.FC<AINarrativeProps> = ({ narrative, riskLevel }) => {
  const getVerdictStyles = () => {
    switch (riskLevel) {
      case 'low': return 'bg-primary/10 border-primary/30 text-primary shadow-primary/10';
      case 'medium': return 'bg-warning/10 border-warning/30 text-warning shadow-warning/10';
      case 'high': return 'bg-danger/10 border-danger/30 text-danger shadow-danger/10';
      case 'critical': return 'bg-danger/20 border-danger/50 text-danger shadow-danger/20 animate-pulse';
      default: return 'bg-white/10 border-white/20 text-white';
    }
  };

  const getIcon = () => {
    switch (riskLevel) {
      case 'low': return 'verified_user';
      case 'medium': return 'shield_with_heart';
      case 'high': return 'gpp_maybe';
      case 'critical': return 'gpp_bad';
      default: return 'security';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Narrative Summary */}
      <div className="relative">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex -space-x-1.5">
            <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[10px] text-primary">psychology</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[10px] text-white">auto_awesome</span>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">AI Synthesis Layer</span>
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-black  tracking-tight leading-snug"
        >
          {narrative.summary}
        </motion.p>
      </div>

      {/* Security Verdict Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-6 rounded-[32px] border ${getVerdictStyles()} flex flex-col gap-4 shadow-2xl relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[40px] rounded-full -mr-16 -mt-16" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Security Verdict</span>
            <span className="text-lg font-black uppercase tracking-tighter ">{narrative.securityVerdict}</span>
          </div>
          <span className="material-symbols-outlined text-3xl opacity-80">{getIcon()}</span>
        </div>

        <div className="pt-4 border-t border-white/10 relative z-10">
          <p className="text-xs font-bold leading-relaxed text-white/90">
            {narrative.threatAssessment}
          </p>
        </div>

        <div className="flex items-center gap-3 mt-2 relative z-10 px-4 py-3 bg-black/20 rounded-2xl border border-white/5">
          <span className="material-symbols-outlined text-sm text-primary">lightbulb</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
            Recommendation: <span className="text-primary ">{narrative.recommendation}</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default AINarrative;
