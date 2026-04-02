import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';

interface ConfirmButtonProps {
  onConfirm: () => void;
  label: string;
  loadingLabel?: string;
  isPerforming?: boolean;
  disabled?: boolean;
  className?: string; // Optional CSS classes
  risk?: 'low' | 'medium' | 'high' | 'critical' | 'inconclusive';
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({ 
  onConfirm, 
  label, 
  loadingLabel = 'Processing...', 
  isPerforming = false,
  disabled = false,
  className = '',
  risk = 'low'
}) => {
  const { persona } = useSettings();
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasDoubleChecked, setHasDoubleChecked] = useState(false);
  const holdTimerRef = useRef<any>(null);

  const startHold = () => {
    if (disabled || isPerforming || persona !== 'beginner') return;
    setIsHolding(true);
    const startTime = Date.now();
    const durationTotal = 2500; // 2.5 seconds hold per spec

    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / durationTotal, 1);
      setProgress(p);

      if (p === 1) {
        if (holdTimerRef.current) clearInterval(holdTimerRef.current);
        onConfirm();
        setIsHolding(false);
        setProgress(0);
      }
    }, 10);
  };

  const cancelHold = () => {
    if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    setIsHolding(false);
    setProgress(0);
  };

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    };
  }, []);

  if (persona === 'advanced') {
    return (
      <div className={`flex flex-col gap-4 ${className}`}>
        {risk !== 'low' && (
          <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all">
            <input 
              type="checkbox" 
              checked={hasDoubleChecked}
              onChange={(e) => setHasDoubleChecked(e.target.checked)}
              className="w-5 h-5 accent-primary"
            />
            <span className="text-[10px] font-black text-text-dim uppercase tracking-wider">
              I have audited the protocol simulation logs
            </span>
          </label>
        )}
        <button
          onClick={onConfirm}
          disabled={disabled || isPerforming || (risk !== 'low' && !hasDoubleChecked)}
          className={`
            w-full py-4 rounded-full font-black text-sm tracking-widest uppercase transition-all
            ${disabled || (risk !== 'low' && !hasDoubleChecked) ? 'bg-white/10 text-text-muted cursor-not-allowed' : 'bg-primary text-black hover:shadow-[0_0_20px_rgba(212,255,59,0.3)]'}
          `}
        >
          {isPerforming ? loadingLabel : label}
        </button>
      </div>
    );
  }

  // Beginner UI
  return (
    <div className={`relative ${className}`}>
      <button
        onMouseDown={startHold}
        onMouseUp={cancelHold}
        onMouseLeave={cancelHold}
        onTouchStart={startHold}
        onTouchEnd={cancelHold}
        disabled={disabled || isPerforming}
        className={`
          w-full py-4 rounded-full font-black text-sm tracking-widest uppercase transition-all relative overflow-hidden
          ${disabled ? 'bg-white/10 text-text-muted cursor-not-allowed' : 'bg-white text-black active:scale-[0.98]'}
        `}
      >
        <span className="relative z-10">
          {isPerforming ? loadingLabel : isHolding ? 'Hold to Sign...' : label}
        </span>
        
        {/* Progress Bar Background */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.1 }}
          className="absolute inset-0 bg-primary z-0 pointer-events-none"
        />
      </button>
      
      {isHolding && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-10 left-0 right-0 text-center text-[10px] font-black text-primary uppercase tracking-widest"
        >
          Decision assurance active...
        </motion.p>
      )}
    </div>
  );
};

export default ConfirmButton;
