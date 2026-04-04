import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, BookOpen, AlertTriangle, Target, Settings, Brain, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';


const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/tracker', label: 'Daily Tracker', icon: CheckSquare },
  { path: '/subjects', label: 'Subject Progress', icon: BookOpen },
  { path: '/errors', label: 'Error Log', icon: AlertTriangle },
  { path: '/mocks', label: 'Mock Analysis', icon: Target },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Layout() {
  const { examDate } = useApp();
  
  const calculateDaysLeft = () => {
    const timeDiff = new Date(examDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
  };

  const daysLeft = calculateDaysLeft();

  return (
    <div className="min-h-screen flex bg-dark-bg text-gray-100 font-sans selection:bg-brand-500/30">
      {/* ── Background Decorations ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-600/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-400/5 blur-[100px] rounded-full" />
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* ── Sidebar ── */}
      <aside className="w-72 glass-panel border-r border-white/5 flex flex-col hidden lg:flex sticky top-0 h-screen z-50">
        <div className="p-8 pb-6 flex items-center gap-4">
          <div className="relative">
            <div className="p-2.5 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl shadow-lg shadow-brand-500/20">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-dark-surface rounded-full shadow-sm" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">GATE Tracker</h1>
          </div>
        </div>

        <nav className="flex-1 py-4 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-brand-500/10 text-brand-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-brand-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 w-1 h-6 bg-brand-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        
        {/* Days Left Widget */}
        <div className="p-6">
          <div className="stat-blue p-5 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-12 h-12 text-brand-400" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-300/60 mb-1">Final Count</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-white">{daysLeft}</span>
                <span className="text-sm font-medium text-brand-200/70">Days to Exam</span>
              </div>
              <div className="mt-3 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  className="h-full bg-brand-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Mobile Header */}
        <header className="lg:hidden glass-panel border-b border-white/5 p-5 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-brand-500 rounded-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-lg text-white">GATE Tracker</h1>
          </div>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <Settings className="w-6 h-6 text-gray-400" />
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-5 md:p-10">
          <div className="max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={window.location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
