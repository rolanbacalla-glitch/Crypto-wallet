import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RadarDot {
  id: number;
  x: number;
  y: number;
  type: 'threat' | 'safe';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
}

const ThreatRadar: React.FC = () => {
  const [dots, setDots] = useState<RadarDot[]>(() => 
    Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      type: Math.random() > 0.8 ? 'threat' : 'safe',
      severity: (['low', 'medium', 'high', 'critical'] as const)[Math.floor(Math.random() * 4)],
      timestamp: Date.now()
    }))
  );

  const threatCount = useMemo(() => dots.filter(d => d.type === 'threat').length, [dots]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prevDots => {
        const newDots = [...prevDots];
        const indexToUpdate = Math.floor(Math.random() * newDots.length);
        newDots[indexToUpdate] = {
          ...newDots[indexToUpdate],
          x: Math.max(15, Math.min(85, newDots[indexToUpdate].x + (Math.random() - 0.5) * 10)),
          y: Math.max(15, Math.min(85, newDots[indexToUpdate].y + (Math.random() - 0.5) * 10)),
          timestamp: Date.now()
        };
        return newDots;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-8">
      {/* Radar Container */}
      <div className="relative w-full aspect-square rounded-full border-2 border-white/5 bg-[#0A0A0A] shadow-2xl overflow-hidden flex items-center justify-center">
        {/* Radar Background Grids */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20" />
          <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/20" />
          {[20, 40, 60, 80].map((size) => (
            <div 
              key={size}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/10 rounded-full"
              style={{ width: `${size}%`, height: `${size}%` }}
            />
          ))}
          {/* Degree Markers */}
          <div className="absolute inset-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute w-[2px] h-[5%] bg-primary/30"
                style={{ 
                  left: 'calc(50% - 1px)', 
                  top: '0', 
                  transformOrigin: '50% 1000%', 
                  transform: `rotate(${i * 30}deg)` 
                }}
              />
            ))}
          </div>
        </div>

        {/* Dots */}
        <AnimatePresence>
          {dots.map((dot) => (
            <motion.div
              key={dot.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                left: `${dot.x}%`, 
                top: `${dot.y}%`,
                scale: 1,
                opacity: 1 
              }}
              className={`absolute w-1.5 h-1.5 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 ${
                dot.type === 'threat' ? 'bg-danger shadow-glow-danger' : 'bg-green-400/50'
              }`}
            />
          ))}
        </AnimatePresence>

        {/* Rotating Sweep */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none origin-center"
        >
          <div 
            className="w-[50%] h-[50%] bg-gradient-to-tr from-primary/30 via-primary/10 to-transparent rounded-tr-full opacity-60 blur-[1px]" 
            style={{ 
              clipPath: 'polygon(50% 50%, 100% 0, 100% 50%)',
              transform: 'translate(50%, -50%) rotate(-45deg)'
            }} 
          />
          <div className="absolute top-1/2 left-1/2 w-full h-[1px] bg-primary/50 shadow-glow origin-left rotate-0" />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 shadow-inner rounded-full pointer-events-none" />
      </div>

      {/* Stats Below Radar */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 glass-frosted rounded-3xl border border-white/5 bg-white/2">
            <span className="text-[8px] font-black uppercase tracking-widest text-text-dim block mb-1">Status</span>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${threatCount > 0 ? 'bg-danger shadow-glow-danger' : 'bg-green-500 shadow-glow-green'} animate-pulse`} />
              <span className="text-xs font-black tracking-tight text-white">{threatCount > 0 ? 'THREATS DETECTED' : 'SECURE SCAN'}</span>
            </div>
          </div>
          <div className="p-4 glass-frosted rounded-3xl border border-white/5 bg-white/2">
            <span className="text-[8px] font-black uppercase tracking-widest text-text-dim block mb-1">Protection</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-tight text-white">99.8% Neural</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-text-dim">
            <span>Neural Integrity</span>
            <span className="text-primary tracking-normal">99.9%</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '99.9%' }}
              className="h-full bg-primary shadow-glow"
            />
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full h-12 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all shadow-glow-primary/20"
        >
          Initiate Deep Shield Scan
        </motion.button>
      </div>
    </div>
  );
};

export default ThreatRadar;
