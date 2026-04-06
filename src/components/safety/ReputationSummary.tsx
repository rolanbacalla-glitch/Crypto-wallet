import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Info, 
  ExternalLink, 
  Activity, 
  Search,
  Radar,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Globe,
  Flag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SafetyReport } from '../../services/geminiService';

interface ReputationSummaryProps {
  report: SafetyReport | null;
}

const ReputationSummary: React.FC<ReputationSummaryProps> = ({ report }) => {
  const reputation = report?.reputationContext?.reputation;
  const feed = report?.reputationContext?.intelligenceFeed;
  const [activeFeedIndex, setActiveFeedIndex] = useState(0);

  // Rotate through intelligence feed items for immersion
  useEffect(() => {
    if (feed && feed.length > 0) {
      const interval = setInterval(() => {
        setActiveFeedIndex((prev) => (prev + 1) % feed.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [feed]);

  if (!reputation) return null;

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-400';
    if (score < 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskBg = (score: number) => {
    if (score < 30) return 'bg-green-500/10 border-green-500/20';
    if (score < 70) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  const riskScore = reputation.riskScore;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header with Risk Level */}
      <div className={`p-4 rounded-2xl border backdrop-blur-md ${getRiskBg(riskScore)} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-white/5 ${getRiskColor(riskScore)}`}>
            {riskScore > 70 ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Web Reputation Analysis</div>
            <div className={`text-sm font-black ${getRiskColor(riskScore)}`}>
              {riskScore > 70 ? 'High Risk Detected' : riskScore > 30 ? 'Moderate Caution' : 'Validated Neutral/Safe'}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Safety Index</div>
          <div className={`text-xl font-black ${getRiskColor(riskScore)}`}>{100 - riskScore}%</div>
        </div>
      </div>

      {/* Main Intelligence Feed (Animated) */}
      {feed && feed.length > 0 && (
        <div className="relative h-16 bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-1 bg-primary/40 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeedIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute inset-0 px-4 flex items-center gap-3"
            >
              <Activity size={14} className="text-primary shrink-0 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase text-white/30 tracking-tight">Real-time Intelligence Stream</span>
                <span className="text-[11px] font-bold text-white/80 line-clamp-1 italic">
                  "{feed[activeFeedIndex]}"
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Summary Context */}
      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Search size={40} />
        </div>
        <p className="text-[13px] leading-relaxed text-white/70 font-medium italic relative z-10">
          {reputation.sourceContext}
        </p>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-white/40 mb-1">
            <TrendingUp size={12} />
            <span className="text-[9px] font-black uppercase tracking-wider">Mentions</span>
          </div>
          <span className="text-sm font-black text-white">{reputation.mentions}</span>
        </div>
        <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-white/40 mb-1">
            <Globe size={12} />
            <span className="text-[9px] font-black uppercase tracking-wider">Visibility</span>
          </div>
          <span className="text-sm font-black text-white">{reputation.isVerified ? 'High Content Density' : 'Low Evidence Trace'}</span>
        </div>
      </div>

      {/* Source Links */}
      {reputation.sourceLinks && reputation.sourceLinks.length > 0 && (
        <div className="space-y-2">
          <div className="text-[9px] font-black uppercase tracking-widest text-white/30 px-1">Verified Data Sources</div>
          <div className="flex flex-wrap gap-2">
            {reputation.sourceLinks.map((link, idx) => (
              <motion.a 
                key={idx}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full transition-colors"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                <span className="text-[10px] font-bold text-white/70">{link.label}</span>
                <ExternalLink size={10} className="text-white/30" />
              </motion.a>
            ))}
          </div>
        </div>
      )}

      {/* Warnings / Flags */}
      {reputation.flags.length > 0 && (
        <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 space-y-2">
          <div className="flex items-center gap-2 text-red-400 mb-1">
            <Flag size={14} />
            <span className="text-[10px] font-black uppercase tracking-wider">Negative Reputation Flags</span>
          </div>
          <div className="flex flex-col gap-2">
            {reputation.flags.map((flag, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <AlertCircle size={10} className="text-red-400" />
                <span className="text-[11px] font-bold text-red-200/80">{flag}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ReputationSummary;
