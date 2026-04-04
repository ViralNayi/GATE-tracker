import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { Target, Plus, TrendingUp, AlertCircle, X, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MockAnalysis() {
  const { mockTests, addMockTest, subjects } = useApp();
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: `Mock Test ${mockTests.length + 1}`,
    score: '',
    weakSubjectId: subjects[0]?.id || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.score || !formData.name) return;
    
    addMockTest({
      name: formData.name,
      score: Number(formData.score),
      weakSubjectId: formData.weakSubjectId
    });
    
    setShowForm(false);
    setFormData({ name: `Mock Test ${mockTests.length + 2}`, score: '', weakSubjectId: subjects[0]?.id || '' });
  };

  const lineChartData = mockTests.map((t, i) => ({
    name: `Test ${i+1}`,
    fullName: t.name,
    score: t.score,
    date: new Date(t.date).toLocaleDateString('en-US', { day:'numeric', month:'short' })
  }));

  // Analyze Weaknesses
  const weakSubjectsCounts = {};
  mockTests.forEach(test => {
    const subName = subjects.find(s => s.id === test.weakSubjectId)?.name;
    if (subName) {
      weakSubjectsCounts[subName] = (weakSubjectsCounts[subName] || 0) + 1;
    }
  });
  
  const weakSubjectsList = Object.entries(weakSubjectsCounts).sort((a,b) => b[1] - a[1]);

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/5">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-brand-500/10 rounded-xl"><Target className="text-brand-400 w-6 h-6" /></div>
             <h2 className="text-3xl font-black text-white tracking-tight">Mock Intelligence</h2>
          </div>
          <p className="text-gray-400 text-sm ml-12">Performance analytics and trend identification.</p>
        </div>
        
        <button 
          onClick={() => setShowForm(!showForm)} 
          className={`btn-primary flex items-center gap-2 px-6 h-12 transition-all ${showForm ? 'bg-white/5 border-white/10 text-gray-400 shadow-none' : 'glow-blue'}`}
        >
          {showForm ? <><X className="w-5 h-5"/> Clos Analysis</> : <><Plus className="w-5 h-5"/> Log New Score</>}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel p-8 rounded-3xl border-t-2 border-brand-500/50 mb-8 mt-4 relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-8 opacity-5 -mr-4 -mt-4 bg-brand-500 rounded-full blur-3xl" />
             <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end relative z-10">
                <div className="lg:col-span-1 space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Series Name</label>
                  <input type="text" required value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="input-field h-12 font-bold" />
                </div>
                <div className="lg:col-span-1 space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Percentile / Score</label>
                  <div className="relative">
                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500/50" />
                    <input type="number" step="0.1" max="100" min="0" required value={formData.score} onChange={e=>setFormData({...formData, score:e.target.value})} className="input-field h-12 pl-12 font-black text-lg" />
                  </div>
                </div>
                <div className="lg:col-span-1 space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Weakest subject</label>
                  <select value={formData.weakSubjectId} onChange={e=>setFormData({...formData, weakSubjectId:e.target.value})} className="input-field h-12 appearance-none font-bold uppercase tracking-tight">
                    {subjects.map(s => <option key={s.id} value={s.id} className="bg-dark-surface text-white">{s.name}</option>)}
                  </select>
                </div>
                <div className="lg:col-span-1">
                  <button type="submit" className="btn-primary w-full h-12 uppercase tracking-widest font-black text-[10px] glow-blue">Validate Score</button>
                </div>
             </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Trend Chart */}
        <div className="xl:col-span-2 glass-panel p-8 rounded-3xl group">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-500/10 rounded-xl text-brand-400"><TrendingUp className="w-5 h-5" /></div>
                <h3 className="text-xl font-black text-white">Performance Trajectory</h3>
             </div>
             {lineChartData.length > 0 && (
                <div className="badge bg-green-500/10 text-green-400 border border-green-500/10">Active Monitoring</div>
             )}
          </div>

          <div className="h-96">
            {lineChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={lineChartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#ffffff08" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="#4b5563" tickLine={false} axisLine={false} fontSize={11} dy={10} />
                  <YAxis stroke="#4b5563" tickLine={false} axisLine={false} domain={[0, 100]} fontSize={11} />
                  <Tooltip 
                    cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '5 5' }}
                    contentStyle={{ backgroundColor: '#0d1526', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorScore)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                <Target className="w-12 h-12 mb-4 opacity-10" />
                <p className="font-bold uppercase tracking-widest text-[10px]">Awaiting baseline score integration.</p>
              </div>
            )}
          </div>
        </div>

        {/* Intelligence / Weaknesses */}
        <div className="glass-panel p-8 rounded-3xl flex flex-col">
          <div className="flex items-center gap-3 mb-8">
             <div className="p-2 bg-red-500/10 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /></div>
             <h3 className="text-xl font-black text-white">Focus Analysis</h3>
          </div>

          {weakSubjectsList.length > 0 ? (
            <div className="flex-1 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                 <div className="w-1 h-1 rounded-full bg-red-500" /> Statistical Weaknesses
              </p>
              
              {weakSubjectsList.map(([subject, count], idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={subject} 
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-red-500/20 transition-all cursor-default"
                >
                  <div className="flex items-center gap-3">
                     <div className="w-1 h-1 rounded-full bg-red-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                     <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{subject}</span>
                  </div>
                  <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border border-red-500/10">
                    {count} Failures
                  </span>
                </motion.div>
              ))}

              <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-brand-600/10 to-indigo-600/10 border border-brand-500/20 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 -mr-2 -mt-2 group-hover:rotate-12 transition-transform">
                    <CheckCircle2 className="w-12 h-12 text-brand-400" />
                 </div>
                 <div className="relative z-10">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-400 mb-4 flex items-center gap-2">
                       <Zap className="w-3 h-3" /> Core Optimization
                    </p>
                    <p className="text-xs font-bold text-gray-300 leading-relaxed">
                      Recommended: Pivot next <span className="text-white font-black">48 hours</span> to deep-dive into <span className="text-brand-300 font-black">{weakSubjectsList[0][0]}</span>. Regression analysis suggests highest score impact.
                    </p>
                 </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 opacity-30">
              <div className="p-4 rounded-full bg-white/5"><Target className="w-10 h-10" /></div>
              <p className="text-xs font-bold uppercase tracking-[0.2em]">Insufficient intelligence to calculate weaknesses.</p>
            </div>
          )}
          
          <button className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors group">
             Detailed Report <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
