import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type SecurityEvent = {
  id: string;
  type: 'blocked' | 'warning' | 'revoke' | 'login';
  title: string;
  timestamp: string;
  status: 'passed' | 'failed' | 'ignored' | 'actioned';
  details: string;
};

const MOCK_EVENTS: SecurityEvent[] = [
  { id: '1', type: 'revoke', title: 'Uniswap V3 Revoke', timestamp: '2 mins ago', status: 'actioned', details: 'Unlimited approval removed for security audit.' },
  { id: '2', type: 'blocked', title: 'Phishing Attempt Blocked', timestamp: 'Yesterday', status: 'passed', details: 'Blocked connection to malicious domain "ethereun-staker.io".' },
  { id: '3', type: 'warning', title: 'Suspicious Approval Requested', timestamp: '3 days ago', status: 'ignored', details: 'User ignored warning for unknown contract approval.' },
  { id: '4', type: 'login', title: 'New Device Authorised', timestamp: '1 week ago', status: 'passed', details: 'Login from "MacBook Pro (London, UK)".' },
];

const SafetyCentrePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'activity' | 'tools' | 'education'>('activity');

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-1">Safety Centre</h1>
          <p className="text-text-dim font-medium italic">Your command hub for vault integrity and recovery</p>
        </div>
        
        <div className="flex bg-white/5 border border-white/10 p-1 rounded-full">
          {['Activity', 'Tools', 'Education'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase() as 'activity' | 'tools' | 'education')}
              className={`px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.toLowerCase() ? 'bg-primary text-black shadow-glow' : 'text-text-dim hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-10">
        <div className="flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {activeTab === 'activity' && (
              <motion.div 
                key="activity"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col gap-4"
              >
                {MOCK_EVENTS.map(event => (
                  <div key={event.id} className="glass-frosted border border-white/10 rounded-[32px] p-6 flex items-center gap-6 hover:border-white/20 transition-all group">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 text-2xl
                      ${event.type === 'blocked' ? 'text-danger' : event.type === 'revoke' ? 'text-primary' : 'text-warning'}
                    `}>
                      <span className="material-symbols-outlined">
                        {event.type === 'blocked' ? 'gpp_bad' : event.type === 'revoke' ? 'security' : 'warning'}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-0.5">
                        <h3 className="font-black tracking-tight">{event.title}</h3>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full
                          ${event.status === 'passed' || event.status === 'actioned' ? 'bg-primary/20 text-primary' : 'bg-danger/20 text-danger'}
                        `}>
                          {event.status}
                        </span>
                      </div>
                      <p className="text-xs text-text-dim font-medium">{event.details}</p>
                    </div>
                    
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest italic">{event.timestamp}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'tools' && (
              <motion.div 
                key="tools"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-2 gap-6"
              >
                {[
                  { name: 'Emergency Lockdown', icon: 'lock_reset', desc: 'Immediately pause all outgoing transactions.', color: 'border-danger/30 text-danger' },
                  { name: 'Asset Rescue', icon: 'healing', desc: 'Transfer all holdings to a secure backup vault.', color: 'border-primary/30 text-primary' },
                  { name: 'Approval Flush', icon: 'cleaning_services', desc: 'Wipe all dApp permissions in one click.', color: 'border-warning/30 text-warning' },
                  { name: 'Audit History', icon: 'history', desc: 'Full log of every safety simulation run.', color: 'border-white/10 text-white' }
                ].map((tool, i) => (
                  <div key={i} className={`glass-frosted border p-8 rounded-[40px] flex flex-col gap-4 cursor-pointer hover:scale-[1.02] transition-all ${tool.color}`}>
                    <span className="material-symbols-outlined text-4xl">{tool.icon}</span>
                    <div>
                      <h3 className="text-lg font-black tracking-tight mb-1">{tool.name}</h3>
                      <p className="text-xs font-medium text-text-dim">{tool.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'education' && (
              <motion.div 
                key="edu"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 gap-6"
              >
                {[
                  { title: 'The Anatomy of a Phishing Site', time: '5 min read', icon: 'find_in_page' },
                  { title: 'Why "Unlimited Approval" is a Risk', time: '3 min read', icon: 'encrypted' },
                  { title: 'Choosing the Right Security Profile', time: '4 min read', icon: 'settings_suggest' },
                ].map((edu, i) => (
                  <div key={i} className="glass-frosted border border-white/10 p-8 rounded-[40px] flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-all shadow-xl">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-all">
                        <span className="material-symbols-outlined text-3xl">{edu.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-black italic tracking-tighter mb-1">{edu.title}</h3>
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{edu.time}</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-text-muted group-hover:text-primary group-hover:translate-x-2 transition-all">arrow_forward</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-10">
          <div className="glass-frosted border border-white/10 rounded-[48px] p-8 flex flex-col gap-8 shadow-2xl relative overflow-hidden bg-white/5">
            <h3 className="text-lg font-black tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-primary shadow-glow">verified_user</span>
              Vault Protection Status
            </h3>
            
            <div className="flex flex-col gap-6">
              {[
                { label: 'Cloud Safe Guard', status: 'Enabled', active: true },
                { label: 'Real-time Simulation', status: 'Enabled', active: true },
                { label: 'Address Screener', status: 'Offline', active: false },
                { label: 'Approval Guard', status: 'Enabled (85)', active: true },
              ].map((guard, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-xs font-bold text-text-dim">{guard.label}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${guard.active ? 'bg-primary shadow-glow' : 'bg-white/20'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${guard.active ? 'text-primary' : 'text-text-muted'}`}>{guard.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full h-12 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-white hover:bg-white/10 transition-all">
              Manage Security Plugins
            </button>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] -mr-16 -mt-16" />
          </div>

          <div className="glass-frosted border border-danger/20 rounded-[48px] p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden bg-danger/5">
             <h3 className="text-lg font-black tracking-tight flex items-center gap-3 text-danger">
              <span className="material-symbols-outlined">privacy_tip</span>
              Recovery Assistance
            </h3>
            <p className="text-xs font-medium text-text-dim leading-relaxed">
              If you suspect your keys are compromised, use the Emergency Lockdown immediately. We will help you migrate your assets to a fresh vault.
            </p>
            <button className="w-full h-14 bg-danger text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-danger/20 hover:scale-[1.02] transition-all">
              Initiate Asset Rescue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyCentrePage;
