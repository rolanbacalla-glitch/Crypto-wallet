import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SafetyReport } from '../../services/SafetyEngine';

interface SafetyPreviewProps {
  report: SafetyReport | null;
  isAnalyzing: boolean;
  profile: 'beginner' | 'advanced';
}

const SafetyPreview: React.FC<SafetyPreviewProps> = ({ report, isAnalyzing, profile }) => {
  const [showTechnical, setShowTechnical] = useState(profile === 'advanced');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-safe';
    if (score >= 50) return 'text-warning';
    return 'text-danger';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-safe';
      case 'medium': return 'text-warning';
      default: return 'text-danger';
    }
  };

  if (!isAnalyzing && !report) return null;

  return (
    <div className="flex flex-col gap-6">
      {isAnalyzing ? (
        <div className="flex flex-col gap-8">
          <div className="h-[200px] glass-frosted rounded-[32px] relative overflow-hidden p-6 border border-white/5">
            <motion.div 
              className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_15px_#d4ff3b,0_0_30px_#d4ff3b] z-20"
              animate={{ top: ['0%', '98%', '0%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(212,255,59,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,255,59,0.03)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
            
            <div className="flex flex-col gap-3 relative z-10">
              <div className="w-1/3 h-5 bg-white/5 animate-pulse rounded-md" />
              <div className="w-full h-14 bg-white/5 animate-pulse rounded-xl" />
              <div className="w-1/2 h-3 bg-white/5 animate-pulse rounded-full" />
            </div>

            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-primary/40 rounded-tl-sm" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-primary/40 rounded-tr-sm" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-primary/40 rounded-bl-sm" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-primary/40 rounded-br-sm" />
          </div>
          
          <div className="flex items-center gap-5 p-5 glass-frosted border border-white/10 rounded-2xl">
            <div className="relative w-11 h-11 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-core-pulse" />
              <span className="material-symbols-outlined text-primary text-2xl relative z-10">monitoring</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-primary tracking-widest uppercase mb-0.5">Engine Analyzing</span>
              <span className="text-sm font-bold text-text-dim">Simulating portfolio state changes...</span>
            </div>
          </div>
        </div>
      ) : report && (
        <div className="flex flex-col gap-8">
          {/* Risk Header */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center pb-6 border-b border-white/5"
          >
            <div className="flex items-center gap-5">
              <span className={`material-symbols-outlined text-4xl ${getRiskColor(report.riskLevel)}`}>
                {report.riskLevel === 'low' ? 'verified_user' : 'report_problem'}
              </span>
              <div className="flex flex-col">
                <span className={`text-[10px] font-black uppercase tracking-widest ${getRiskColor(report.riskLevel)}`}>
                  {report.riskLevel} Risk Detected
                </span>
                <h3 className="text-2xl font-black tracking-tighter">
                  {report.riskLevel === 'low' ? 'Safety Verification' : 'Threat Assessment'}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[10px] font-black text-text-dim">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              LIVE SIM
            </div>
          </motion.div>

          {/* AI Explanation */}
          <div className="px-1">
            <p className="text-lg font-bold leading-relaxed tracking-tight">
              {report.explanation || "Safety analysis complete. No threats detected in this transaction flow."}
            </p>
          </div>

          {/* Risk Checklist */}
          <div className="flex flex-col gap-4">
            {report.recipientIdentity?.label === 'verified' && (
              <div className="flex items-start gap-4 p-4 bg-primary/10 border border-primary/20 rounded-2xl animate-in fade-in slide-in-from-left-4">
                <span className="material-symbols-outlined text-primary text-xl">verified</span>
                <span className="text-sm font-bold">Interacting with verified entity: <strong className="text-primary">{report.recipientIdentity.name}</strong></span>
              </div>
            )}
            {report.warnings.map((warning, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-4 px-1"
              >
                <span className={`material-symbols-outlined text-lg ${getRiskColor(report.riskLevel)}`}>
                  {report.riskLevel === 'low' ? 'check_circle' : 'warning'}
                </span>
                <span className="text-sm font-medium text-text-dim">{warning}</span>
              </motion.div>
            ))}
          </div>

          {/* Expert Panel */}
          <div className="pt-6 border-t border-white/5">
            <button 
              className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full text-xs font-black text-primary hover:bg-white/10 transition-all group"
              onClick={() => setShowTechnical(!showTechnical)}
            >
              <span className="material-symbols-outlined text-lg">analytics</span>
              {showTechnical ? 'Hide' : 'Show'} Expert Intelligence
              <span className={`material-symbols-outlined text-lg transition-transform duration-300 ${showTechnical ? 'rotate-180' : ''}`}>expand_more</span>
            </button>

            <AnimatePresence>
              {showTechnical && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="grid grid-cols-2 gap-4 mt-6 overflow-hidden"
                >
                  {/* Intel Cards */}
                  <div className="glass-frosted border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-widest">
                      <span className="material-symbols-outlined text-sm">fingerprint</span>
                      Target Identity
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-base font-black tracking-tight">{report.recipientIdentity?.name || 'Unknown'}</span>
                      <div className="flex flex-wrap gap-2">
                        {report.recipientIdentity?.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded-md text-[9px] font-black tracking-widest text-text-muted uppercase">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-auto text-[10px] font-bold text-text-muted italic">
                      Type: {report.recipientIdentity?.isContract ? 'Contract Proxy' : 'Legacy Wallet'}
                    </div>
                  </div>

                  <div className="glass-frosted border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-widest">
                      <span className="material-symbols-outlined text-sm">star_half</span>
                      Reputation Score
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-4xl font-black italic ${getScoreColor(report.recipientIdentity?.reputationScore || 0)}`}>
                          {report.recipientIdentity?.reputationScore || 0}
                        </span>
                        <span className="text-xs font-bold text-text-muted">/100</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full rounded-full ${report.recipientIdentity?.reputationScore && report.recipientIdentity.reputationScore >= 50 ? 'bg-primary' : 'bg-danger'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${report.recipientIdentity?.reputationScore || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={`col-span-2 glass-frosted border border-white/10 rounded-2xl p-5 flex flex-col gap-5 ${report.simulationResults?.success ? 'border-primary/20' : 'border-danger/20'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">bolt</span>
                        Estimated Asset Flows
                      </div>
                      <span className={`text-[10px] font-black px-2 py-1 rounded-md ${report.simulationResults?.success ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'}`}>
                        {report.simulationResults?.success ? 'Simulated: PASS' : 'Simulated: REVERT'}
                      </span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {report.simulationResults?.changes.map((change, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-black/40 border border-white/5 rounded-xl">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${change.isIncoming ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'}`}>
                            <span className="material-symbols-outlined text-xl">
                              {change.isIncoming ? 'south_east' : 'north_east'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="text-[11px] font-black text-text-dim uppercase tracking-widest mb-0.5">{change.asset}</div>
                            <div className="text-sm font-black italic">{change.amount}</div>
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${change.isIncoming ? 'text-primary' : 'text-danger'}`}>
                            {change.isIncoming ? 'Incoming' : 'Outgoing'}
                          </span>
                        </div>
                      ))}
                      {(!report.simulationResults?.changes || report.simulationResults.changes.length === 0) && (
                        <div className="text-center py-4 text-xs font-bold text-text-muted italic">No net balance changes detected</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyPreview;
