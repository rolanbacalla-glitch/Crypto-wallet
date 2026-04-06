import React from 'react';
import { motion } from 'framer-motion';
import { safetyEngine } from '../../services/SafetyEngine';

interface IntelligenceEventLogProps {
  className?: string;
}

const IntelligenceEventLog: React.FC<IntelligenceEventLogProps> = ({ className }) => {
  const { events } = safetyEngine.getStats();

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'blocked': return 'shield_lock';
      case 'verified': return 'verified_user';
      case 'warning': return 'warning_amber';
      case 'revoke': return 'history_edu';
      case 'login': return 'login';
      default: return 'info';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'blocked': return 'text-danger bg-danger/10';
      case 'verified': return 'text-primary bg-primary/10';
      case 'warning': return 'text-warning bg-warning/10';
      default: return 'text-text-dim bg-white/5';
    }
  };

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-text-dim">
          Intelligence Event Log
        </h3>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Context Monitoring</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {events.length === 0 ? (
          <div className="glass-frosted border border-white/10 rounded-[32px] p-12 flex flex-col items-center justify-center text-center gap-4">
            <span className="material-symbols-outlined text-4xl text-white/20">history</span>
            <p className="text-sm font-bold text-text-dim">No historical threat intel detected.</p>
          </div>
        ) : (
          events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-frosted border border-white/10 rounded-[32px] p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:border-white/20 transition-all group hover:bg-white/5 relative overflow-hidden"
            >
              <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-2xl ${getEventColor(event.type)}`}>
                <span className="material-symbols-outlined text-3xl">
                  {getEventIcon(event.type)}
                </span>
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center flex-wrap gap-3">
                  <h4 className="font-black tracking-tight text-white">{event.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-text-dim px-2.5 py-1 rounded-full bg-white/5 uppercase tracking-widest">
                      {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${getEventColor(event.type)}`}>
                      {event.type}
                    </span>
                  </div>
                </div>
                <p className="text-sm font-bold text-text-dim leading-relaxed max-w-2xl">
                  {event.description}
                </p>
                {event.value > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-dim">Value Protected</span>
                    <span className="text-xs font-black text-primary">£{event.value.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="w-full sm:w-auto flex justify-end gap-3 shrink-0">
                <button className="h-10 px-6 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 hover:border-white/20 transition-all">
                  Details
                </button>
              </div>

              {/* Decorative element */}
              <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] -mr-16 -mt-16 opacity-0 group-hover:opacity-20 transition-opacity duration-700
                ${event.type === 'blocked' ? 'bg-danger' : 'bg-primary'}
              `} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default IntelligenceEventLog;
