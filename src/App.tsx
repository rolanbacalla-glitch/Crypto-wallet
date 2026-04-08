import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Zap, 
  Plus, 
  AlertCircle,
  LayoutDashboard,
  Wallet,
  History,
  Settings as SettingsIcon,
  Shield,
  Activity,
  Terminal as TerminalIcon,
  Menu,
  X,
  Search,
  Bell
} from 'lucide-react';
import { 
  cn, 
  AppState, 
  UserPersona, 
  SidebarItem 
} from './components/Shared';
import { BeginnerDashboard } from './components/BeginnerDashboard';
import { ExpertDashboard } from './components/ExpertDashboard';

function App() {
  const [appState, setAppState] = useState<AppState>('onboarding');
  const [userPersona, setUserPersona] = useState<UserPersona>('normal');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  // --- Render Helpers ---

  if (appState === 'auth') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 bg-grid">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass max-w-md w-full p-8 rounded-[2rem] text-center border-white/5"
        >
          <div className="w-20 h-20 bg-lime-500 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-[0_0_50px_rgba(132,204,22,0.3)]">
            <ShieldCheck className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-4xl font-serif font-bold mb-4">Welcome Back</h1>
          <p className="text-white/40 mb-8 font-medium">Verify your identity to access your secure vault.</p>
          <button 
            onClick={() => setAppState('onboarding')}
            className="w-full py-4 bg-white text-black font-black text-sm rounded-2xl hover:bg-lime-400 transition-all active:scale-95"
          >
            UNLOCK WALLET
          </button>
        </motion.div>
      </div>
    );
  }

  if (appState === 'onboarding') {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4 bg-grid">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-serif font-black mb-6 tracking-tight">Tailor your experience</h1>
            <p className="text-white/40 text-lg max-w-xl mx-auto">Choose how you'd like to interact with the Ethereum network.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ y: -10 }}
              onClick={() => { setUserPersona('normal'); setAppState('dashboard'); }}
              className="glass p-8 rounded-[2.5rem] cursor-pointer group border-white/5 hover:border-lime-500/30 transition-all text-left"
            >
              <div className="w-16 h-16 bg-lime-500/10 rounded-2xl mb-8 flex items-center justify-center border border-lime-500/20 group-hover:bg-lime-500 transition-colors">
                <ShieldCheck className="w-8 h-8 text-lime-400 group-hover:text-black" />
              </div>
              <h3 className="text-3xl font-serif font-bold mb-4">I'm a beginner</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-8">Focus on safety, easy transactions, and clear protection alerts. No technical jargon.</p>
              <div className="flex items-center gap-2 text-lime-400 text-xs font-black uppercase tracking-widest">
                <span>Select Guardian Mode</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              onClick={() => { setUserPersona('advanced'); setAppState('dashboard'); }}
              className="glass p-8 rounded-[2.5rem] cursor-pointer group border-white/5 hover:border-blue-500/30 transition-all text-left"
            >
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl mb-8 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500 transition-colors">
                <TerminalIcon className="w-8 h-8 text-blue-400 group-hover:text-black" />
              </div>
              <h3 className="text-3xl font-serif font-bold mb-4">I'm an expert</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-8">Full access to raw traces, mempool monitoring, MEV protection, and multi-chain orchestration.</p>
              <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-widest">
                <span>Select Sentinel Mode</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen bg-[#030303] flex text-white relative",
      userPersona === 'normal' ? "bg-grid" : "bg-grid-blue"
    )}>
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-72 border-r border-white/5 bg-black/50 backdrop-blur-2xl hidden lg:flex flex-col p-6 sticky top-0 h-screen z-50"
          >
            <div className="flex items-center gap-3 mb-12">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg",
                userPersona === 'normal' ? "bg-lime-500 shadow-lime-500/20" : "bg-blue-500 shadow-blue-500/20"
              )}>
                <ShieldCheck className="w-6 h-6 text-black" />
              </div>
              <h1 className="text-xl font-serif font-bold tracking-tight">Nest Wallet</h1>
            </div>

            <nav className="flex-1 space-y-2">
              <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} persona={userPersona} />
              <SidebarItem icon={Wallet} label="Assets" active={activeTab === 'Assets'} onClick={() => setActiveTab('Assets')} persona={userPersona} />
              <SidebarItem icon={Activity} label="Activities" active={activeTab === 'Activities'} onClick={() => setActiveTab('Activities')} persona={userPersona} />
              <SidebarItem icon={History} label="History" active={activeTab === 'History'} onClick={() => setActiveTab('History')} persona={userPersona} />
            </nav>

            <div className="mt-auto pt-6 border-t border-white/5 space-y-2">
              <SidebarItem icon={SettingsIcon} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} persona={userPersona} />
              <div 
                onClick={() => setAppState('onboarding')}
                className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-white/30 hover:text-white transition-colors group"
              >
                <LayoutDashboard className="w-5 h-5 group-hover:text-red-400" />
                <span className="text-sm font-medium">Switch Mode</span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-24 px-4 md:px-8 flex items-center justify-between border-b border-white/5 sticky top-0 bg-black/20 backdrop-blur-md z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden w-12 h-12 glass rounded-2xl flex items-center justify-center hover:bg-white/10"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-2xl font-serif font-bold">
                {userPersona === 'normal' ? 'Guardian Dashboard' : 'Sentinel Terminal'}
              </h2>
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5">
                {userPersona === 'normal' ? 'PROTECTING YOUR SAVINGS' : 'EVM_PROTOCOL_COMMANDER'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center gap-2 glass px-4 py-2.5 rounded-2xl border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                <Search className="w-4 h-4 text-white/30" />
                <span className="text-sm text-white/30">Search assets...</span>
             </div>
             <button className="w-12 h-12 glass rounded-2xl flex items-center justify-center border-white/5 hover:bg-white/5 relative">
                <Bell className="w-5 h-5 text-white/60" />
                <div className={cn("absolute top-3 right-3 w-2 h-2 rounded-full border-2 border-black", userPersona === 'normal' ? "bg-lime-500" : "bg-blue-500")} />
             </button>
             <div className="flex items-center gap-3 glass p-1.5 pr-4 rounded-2xl border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                <div className="w-9 h-9 bg-neutral-800 rounded-xl flex items-center justify-center font-bold text-xs ring-1 ring-white/10">0x</div>
                <div className="hidden sm:block">
                   <p className="text-[10px] font-black text-white uppercase tracking-widest">Main Wallet</p>
                   <p className="text-[10px] text-white/30 font-mono">0x7a2...fE3</p>
                </div>
             </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="scroll-smooth">
          {userPersona === 'normal' ? (
            <BeginnerDashboard />
          ) : (
            <ExpertDashboard />
          )}
        </div>
      </main>

      {/* Floating Action Button for Mobile */}
      <button className={cn(
        "fixed bottom-8 right-8 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl lg:hidden z-50 animate-bounce",
        userPersona === 'normal' ? "bg-lime-500 shadow-lime-500/20" : "bg-blue-500 shadow-blue-500/20"
      )}>
        <Plus className="w-6 h-6 text-black" />
      </button>
    </div>
  );
}

export default App;
