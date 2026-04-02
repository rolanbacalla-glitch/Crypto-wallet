import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';

interface StepData {
  profile?: 'beginner' | 'advanced';
  oncomplete?: boolean;
}

interface StepProps {
  onNext: (data?: StepData) => void;
  profile?: 'beginner' | 'advanced';
}

const WelcomeStep: React.FC<StepProps> = ({ onNext }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.05 }}
    className="step-content"
  >
    <div className="premium-badge">
      <div className="badge-ring"></div>
      <span className="material-symbols-outlined logo-icon">verified_user</span>
    </div>
    <motion.h1
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="display-title"
    >
      nest <span className="text-primary">wallet</span>
    </motion.h1>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="lead-text"
    >
      The intelligent safety layer for your assets. We simulate every transaction and decode protocol risks before you sign.
    </motion.p>
    <motion.button
      whileHover={{ scale: 1.02, boxShadow: '0 0 20px var(--color-primary)' }}
      whileTap={{ scale: 0.98 }}
      className="btn-premium"
      onClick={() => onNext()}
    >
      Initialise Wallet <span className="material-symbols-outlined">arrow_forward</span>
    </motion.button>
  </motion.div>
);

const ProfileStep: React.FC<StepProps> = ({ onNext }) => {
  const [selected, setSelected] = useState<'beginner' | 'advanced'>('beginner');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="step-content"
    >
      <h2 className="step-subtitle">Configuration</h2>
      <h1 className="display-title small">Choose Your <span className="text-primary">Experience</span></h1>
      <p className="text-dim">Our safety engine adapts its intelligence depth to your expertise.</p>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="bento-selection"
      >
        <motion.div
          variants={item}
          className={`selection-card ${selected === 'beginner' ? 'active' : ''}`}
          onClick={() => setSelected('beginner')}
        >
          <div className="card-top">
            <div className="icon-box">
              <span className="material-symbols-outlined">shield</span>
            </div>
            <div className="status-dot"></div>
          </div>
          <h3>Beginner</h3>
          <p>Clear, direct risk warnings. Translates technical data into simple actions.</p>
        </motion.div>

        <motion.div
          variants={item}
          className={`selection-card ${selected === 'advanced' ? 'active' : ''}`}
          onClick={() => setSelected('advanced')}
        >
          <div className="card-top">
            <div className="icon-box">
              <span className="material-symbols-outlined">bolt</span>
            </div>
            <div className="status-dot"></div>
          </div>
          <h3>Advanced</h3>
          <p>Technical transparency. Native simulation logs and protocol audit data.</p>
        </motion.div>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="btn-premium secondary"
        onClick={() => {
          onNext({ profile: selected });
        }}
      >
        Set Experience Mode
      </motion.button>
    </motion.div>
  );
};

const SuccessStep: React.FC<StepProps> = ({ onNext, profile }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="step-content"
  >
    <div className="success-visual">
      <div className="success-ring outer"></div>
      <div className="success-ring inner"></div>
      <span className="material-symbols-outlined success-icon text-safe">check_circle</span>
    </div>
    <h1 className="display-title">Systems <span className="text-safe">Protected</span></h1>
    <div className="status-stack">
      <div className="status-row">
        <span className="material-symbols-outlined text-dim">person</span>
        <span>Profile: <strong className="text-primary">{profile?.toUpperCase()}</strong></span>
      </div>
      <div className="status-row">
        <span className="material-symbols-outlined text-dim">security</span>
        <span>Safety Engine: <strong className="text-safe">ARMED</strong></span>
      </div>
    </div>
    <button className="btn-premium" onClick={() => onNext()}>
      Launch Dashboard
    </button>
  </motion.div>
);

interface OnboardingProps {
  onComplete: (data?: StepData) => void;
}

const OnboardingWizard: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { setPersona } = useSettings();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<StepData>({});

  const next = (stepData?: StepData) => {
    if (stepData) setData(prev => ({ ...prev, ...stepData }));
    setStep(s => s + 1);
  };

  return (
    <div className="onboarding-master">
      <div className="ambient-glow"></div>
      <div className="grid-overlay"></div>

      <div className="wizard-frame">
        <AnimatePresence mode="wait">
          {step === 0 && <WelcomeStep key="welcome" onNext={next} />}
          {step === 1 && <ProfileStep key="profile" onNext={next} />}
          {step === 2 && (
            <SuccessStep 
              key="success" 
              onNext={() => {
                if (data.profile) setPersona(data.profile);
                onComplete(data);
              }} 
              profile={data.profile} 
            />
          )}
        </AnimatePresence>

        <div className="step-indicator">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className={`indicator-segment ${i === step ? 'active' : ''} ${i < step ? 'complete' : ''}`}
              initial={false}
              animate={{
                width: i === step ? 40 : 8,
                backgroundColor: i === step ? 'var(--color-primary)' : i < step ? 'var(--color-safe)' : 'rgba(255,255,255,0.1)'
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        .onboarding-master {
          height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #050505;
          position: relative;
          overflow: hidden;
          color: #F8F5F1;
          font-family: var(--sans);
        }

        .ambient-glow {
          position: absolute;
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, var(--color-primary-soft) 0%, transparent 70%);
          filter: blur(140px);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 0;
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px);
          background-size: 60px 60px;
          z-index: 1;
        }

        .wizard-frame {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 540px;
          background: #050505;
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 4.5rem 3.5rem;
          border-radius: var(--radius-xl);
          box-shadow: 0 50px 100px rgba(0,0,0,0.8);
          text-align: center;
          backdrop-filter: blur(40px);
        }

        .premium-badge {
          width: 80px;
          height: 80px;
          background: #0a0a0a;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          position: relative;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .logo-icon {
          font-size: 2.5rem;
          color: var(--color-primary);
          z-index: 2;
        }

        .badge-ring {
          position: absolute;
          inset: -6px;
          border: 1px solid rgba(212, 255, 59, 0.2);
          border-radius: var(--radius-xl);
          animation: spin 15s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .display-title {
          font-family: var(--serif);
          font-size: 4rem;
          font-weight: 700;
          margin: 2.5rem 0 1.5rem;
          letter-spacing: -0.02em;
          line-height: 1;
        }

        .display-title.small { font-size: 3rem; }

        .lead-text {
          font-size: 1.15rem;
          color: var(--color-text-dim);
          line-height: 1.6;
          margin-bottom: 3.5rem;
          font-weight: 400;
        }

        .step-subtitle {
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--color-primary);
          margin-bottom: 0.5rem;
        }

        .btn-premium {
          width: 100%;
          background: var(--color-primary);
          color: #000;
          padding: 1.35rem;
          border-radius: var(--radius-pill);
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          border: none;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: 0 10px 30px -10px rgba(224, 199, 154, 0.3);
        }

        .btn-premium:hover {
          background: #EED7B0;
          color: #000;
          transform: translateY(-2px);
          box-shadow: 0 15px 40px -10px rgba(224, 199, 154, 0.4);
        }

        .btn-premium.secondary {
           background: #111;
           color: #fff;
           border: 1px solid rgba(255,255,255,0.1);
        }

        .btn-premium.secondary:hover {
           background: #1a1a1a;
           border-color: var(--color-primary);
        }

        .bento-selection {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin: 3rem 0;
        }

        .selection-card {
           background: #0a0a0a;
           border: 1px solid rgba(255,255,255,0.05);
           padding: 1.75rem;
           border-radius: var(--radius-lg);
           text-align: left;
           cursor: pointer;
           transition: var(--transition);
        }

        .selection-card:hover {
           border-color: rgba(255,255,255,0.15);
           transform: translateY(-4px);
        }

        .selection-card.active {
           border-color: var(--color-primary);
           background: var(--color-primary-soft);
        }

        .card-top {
           display: flex;
           justify-content: space-between;
           align-items: center;
           margin-bottom: 1.5rem;
        }

        .icon-box {
           width: 44px;
           height: 44px;
           background: #1a1a1a;
           border-radius: var(--radius-md);
           display: flex;
           align-items: center;
           justify-content: center;
           color: #fff;
           transition: var(--transition);
        }

        .selection-card.active .icon-box {
           background: var(--color-primary);
           color: #000;
        }

        .status-dot {
           width: 8px;
           height: 8px;
           background: rgba(255,255,255,0.1);
           border-radius: 50%;
        }

        .selection-card.active .status-dot {
           background: var(--color-primary);
           box-shadow: 0 0 10px var(--color-primary);
        }

        .selection-card h3 {
           font-family: var(--serif);
           font-size: 1.35rem;
           font-weight: 600;
           margin-bottom: 0.5rem;
        }

        .selection-card p {
           font-size: 0.825rem;
           line-height: 1.4;
           color: var(--color-text-dim);
           margin: 0;
        }

        .success-visual {
           width: 120px;
           height: 120px;
           margin: 0 auto 2.5rem;
           position: relative;
           display: flex;
           align-items: center;
           justify-content: center;
        }

        .success-icon { font-size: 4rem; z-index: 2; }

        .success-ring {
           position: absolute;
           border-radius: 50%;
           border: 1px solid rgba(212, 255, 59, 0.1);
        }

        .success-ring.outer { inset: -20px; animation: pulse 3s infinite; }
        .success-ring.inner { inset: -8px; animation: pulse 3s infinite 0.5s; }

        @keyframes pulse {
           0% { opacity: 0; transform: scale(0.8); }
           50% { opacity: 0.5; transform: scale(1); }
           100% { opacity: 0; transform: scale(1.3); }
        }

        .status-stack {
           display: flex;
           flex-direction: column;
           gap: 1rem;
           background: #0a0a0a;
           padding: 1.75rem;
           border-radius: var(--radius-lg);
           margin-bottom: 3rem;
           border: 1px solid rgba(255,255,255,0.05);
        }

        .status-row {
           display: flex;
           align-items: center;
           gap: 1rem;
           font-size: 0.95rem;
           color: var(--color-text-dim);
        }

        .step-indicator {
           display: flex;
           justify-content: center;
           gap: 0.75rem;
           margin-top: 3.5rem;
        }

        .indicator-segment {
           height: 4px;
           border-radius: 4px;
        }

        .text-primary { color: var(--color-primary); }
        .text-safe { color: var(--color-safe); }
        .text-dim { color: var(--color-text-muted); }
      `}</style>
    </div>
  );
};

export default OnboardingWizard;
