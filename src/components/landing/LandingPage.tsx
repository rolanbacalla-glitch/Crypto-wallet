import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Zap, Globe, Cpu, ChevronRight, ArrowRight, BarChart3, Lock, Wallet } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-container">
      {/* Background Mesh Gradient */}
      <div className="bg-mesh"></div>
      
      {/* Header */}
      <nav className="header glass">
        <div className="container flex-between py-4">
          <div className="flex items-center gap-2">
            <div className="logo-container">
              <img src="/src/assets/logo.png" alt="Antigravity" className="logo-icon" />
            </div>
            <span className="logo-text text-2xl font-bold tracking-tight">Antigravity</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/login?register=true" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="hero-section container py-24 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content max-w-2xl"
          >
            <div className="badge mb-6">Latest: Antigravity v2.0 is Live</div>
            <h1 className="hero-title text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
              Future of <span className="gradient-text">Crypto Wallet</span> is Here
            </h1>
            <p className="hero-desc text-xl text-neutral-400 mb-10 leading-relaxed max-w-lg mx-auto md:mx-0">
              Zero-fee swaps, enterprise-grade safety, and the most intuitive dashboard in the multichain world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/login" className="btn btn-primary px-10 py-4 flex items-center gap-2 group">
                Create Free Wallet <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="btn btn-secondary px-10 py-4">View Features</button>
            </div>
            
            <div className="hero-stats flex gap-10 mt-16 justify-center md:justify-start">
              <div className="stat">
                <div className="stat-value text-3xl font-bold">4.8M+</div>
                <div className="stat-label text-neutral-400">Users</div>
              </div>
              <div className="stat">
                <div className="stat-value text-3xl font-bold">$2B+</div>
                <div className="stat-label text-neutral-400">Volume</div>
              </div>
              <div className="stat">
                <div className="stat-value text-3xl font-bold">0%</div>
                <div className="stat-label text-neutral-400">Breach Rate</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, type: "spring" }}
            className="perspective-container"
          >
            <div className="crypto-card-stack relative h-[500px] w-[350px]">
              {/* These would be stylized crypto wallet preview components */}
              <div className="crypto-card-preview p-6 glass rounded-3xl border border-white/10 shadow-2xl absolute -rotate-12 translate-x-[-40px] translate-y-10 z-0 opacity-40">
                 <div className="flex-between mb-8">
                   <div className="w-10 h-10 bg-neutral-800 rounded-full"></div>
                   <div className="w-20 h-4 bg-neutral-800 rounded-full"></div>
                 </div>
                 <div className="w-full h-32 bg-neutral-800 rounded-2xl mb-4"></div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="h-10 bg-neutral-800 rounded-lg"></div>
                   <div className="h-10 bg-neutral-800 rounded-lg"></div>
                 </div>
              </div>
              
              <div className="crypto-card-preview p-10 glass rounded-3xl border border-white/20 shadow-2xl relative z-20 scale-110">
                <div className="flex-between mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#00f2fe] rounded-2xl flex items-center justify-center p-2">
                       <Wallet className="text-black" />
                    </div>
                    <div>
                      <div className="text-sm text-neutral-400 font-medium">Main Portfolio</div>
                      <div className="text-2xl font-bold font-mono">$42,904.52</div>
                    </div>
                  </div>
                  <Cpu className="text-[#00f2fe]" />
                </div>
                
                <div className="mb-10">
                  <div className="flex-between mb-3 text-sm">
                    <span className="text-neutral-400">Network Stability</span>
                    <span className="text-[#00f2fe]">99.8%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: "90%" }}
                      transition={{ duration: 2, delay: 0.5 }}
                    ></motion.div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-6 mb-8 text-center">
                  <div>
                    <BarChart3 className="mx-auto mb-2 opacity-60" />
                    <div className="text-xs text-neutral-500 uppercase tracking-widest">Trade</div>
                  </div>
                  <div>
                    <Zap className="mx-auto mb-2 opacity-60 text-yellow-400" />
                    <div className="text-xs text-neutral-500 uppercase tracking-widest">Swap</div>
                  </div>
                  <div>
                    <Globe className="mx-auto mb-2 opacity-60 text-blue-400" />
                    <div className="text-xs text-neutral-500 uppercase tracking-widest">Web3</div>
                  </div>
                </div>
                
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                       <Shield size={18} className="text-green-400" />
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold text-green-400">Safety Level: Secure</div>
                      <div className="text-xs text-neutral-500">Antigravity AI is protecting you</div>
                    </div>
                 </div>
              </div>
              
              <div className="crypto-card-preview p-6 glass rounded-3xl border border-white/10 shadow-2xl absolute rotate-12 translate-x-[40px] translate-y-20 z-0 opacity-40">
                 <div className="flex-between mb-8">
                   <div className="w-10 h-10 bg-neutral-800 rounded-full"></div>
                   <div className="w-20 h-4 bg-neutral-800 rounded-full"></div>
                 </div>
                 <div className="w-full h-32 bg-neutral-800 rounded-2xl mb-4"></div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="h-10 bg-neutral-800 rounded-lg"></div>
                   <div className="h-10 bg-neutral-800 rounded-lg"></div>
                 </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="features-section container py-32 border-t border-white/5">
          <div className="text-center mb-20 max-w-3xl mx-auto">
             <h2 className="text-4xl md:text-5xl font-bold mb-6">Designed for Everyone</h2>
             <p className="text-neutral-400 text-lg">Whether you are a beginner or a professional trader, Antigravity has the tools to make you more profitable and more secure.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
             {[
               { icon: <Lock className="text-cyan-400" />, title: "Bank-Grade Safety", desc: "Your keys, your crypto. We use FIPS 140-2 level hardware security." },
               { icon: <Zap className="text-yellow-400" />, title: "Instant Swaps", desc: "Swap any token across 15+ chains with one click and zero markup." },
               { icon: <Globe className="text-blue-400" />, title: "Integrated Web3", desc: "The ultimate browser for the decentralized web is built-in." }
             ].map((f, i) => (
               <motion.div 
                 key={i}
                 whileHover={{ y: -10 }}
                 className="feature-card glass p-10 rounded-[2.5rem]"
               >
                 <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                   {f.icon}
                 </div>
                 <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                 <p className="text-neutral-400 leading-relaxed font-medium">{f.desc}</p>
                 <Link to="/login" className="mt-8 flex items-center gap-2 text-cyan-400 font-bold hover:gap-3 transition-all">
                   Explore <ChevronRight size={18} />
                 </Link>
               </motion.div>
             ))}
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 bg-black">
        <div className="container flex-between opacity-50">
          <span>&copy; 2026 Antigravity Inc.</span>
          <div className="flex gap-8">
            <a href="#">X / Twitter</a>
            <a href="#">Discord</a>
            <a href="#">Medium</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
