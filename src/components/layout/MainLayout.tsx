import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-primary selection:text-black">
      {/* Top Navigation Bar - Nest Frosted Glass Style */}
      <header className="sticky top-0 h-20 w-full z-50 glass-frosted flex items-center border-b border-white/5">
        <div className="w-full max-w-[1600px] mx-auto px-8 flex justify-between items-center">
          
          <div className="flex items-center gap-16">
            <div className="flex items-center">
              <span className="text-2xl font-extrabold tracking-tighter hover:text-primary transition-colors cursor-default">
                nest
              </span>
            </div>
            
            <nav className="flex gap-10">
              {['Dashboard', 'Market', 'Trade', 'Portfolio', 'Assets', 'Audit'].map((item) => (
                <NavLink 
                  key={item}
                  to={item === 'Dashboard' ? '/' : `/${item.toLowerCase()}`} 
                  className={({ isActive }) => `
                    relative py-2 text-sm font-bold transition-all duration-300
                    ${isActive ? 'text-primary' : 'text-text-dim hover:text-white'}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {item}
                      {isActive && (
                        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(212,255,59,0.5)]" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input 
                type="text" 
                placeholder="Find assets..." 
                className="bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-6 text-sm w-[280px] focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-text-muted"
              />
            </div>
            
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full p-1.5 pl-1.5 pr-4 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all group">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-black font-black text-xs shadow-[0_0_15px_rgba(212,255,59,0.3)]">
                JD
              </div>
              <span className="text-sm font-bold tracking-tight">johndoe.eth</span>
              <span className="material-symbols-outlined text-lg text-text-dim group-hover:text-white transition-colors">expand_more</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <div className="w-full max-w-[1600px] mx-auto px-8 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
