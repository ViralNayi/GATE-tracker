import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Plus, X, Brain, Target, Info, ShieldAlert } from 'lucide-react';

export default function ErrorLog() {
  const { subjects, errorLogs, addErrorLog, toggleErrorFixed } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    subjectId: subjects[0]?.id || '',
    topic: '',
    mistakeType: 'Conceptual',
    reason: '',
    fix: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.topic || !formData.reason || !formData.fix) return;
    
    addErrorLog(formData);
    setIsAdding(false);
    setFormData({ ...formData, topic: '', reason: '', fix: '' });
  };

  const MISTAKE_TYPES = ['Conceptual', 'Calculation', 'Silly Mistake', 'Time Management', 'Formula Forgotten'];

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/5">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-red-500/10 rounded-xl"><ShieldAlert className="text-red-400 w-6 h-6" /></div>
             <h2 className="text-3xl font-black text-white tracking-tight">Mistake Audit</h2>
          </div>
          <p className="text-gray-400 text-sm ml-12">Systematically track and fix recurring errors.</p>
        </div>
        
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`btn-primary flex items-center gap-2 px-6 h-12 ${isAdding ? 'bg-red-500 hover:bg-red-400' : 'glow-blue'}`}
        >
          {isAdding ? <><X className="w-5 h-5"/> Cancel</> : <><Plus className="w-5 h-5"/> Audit New Mistake</>}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="overflow-hidden"
          >
            <div className="glass-panel p-8 rounded-3xl border-t-2 border-red-500/50 mb-8 mt-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 -mr-4 -mt-4 bg-red-500 rounded-full blur-3xl pointer-events-none" />
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Affected Subject</label>
                    <select 
                      value={formData.subjectId} 
                      onChange={e => setFormData({...formData, subjectId: e.target.value})}
                      className="input-field h-12 font-bold uppercase tracking-tight"
                    >
                      {subjects.map(s => <option key={s.id} value={s.id} className="bg-dark-surface text-white">{s.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Analysis Type</label>
                    <select 
                      value={formData.mistakeType} 
                      onChange={e => setFormData({...formData, mistakeType: e.target.value})}
                      className="input-field h-12 font-bold uppercase tracking-tight"
                    >
                      {MISTAKE_TYPES.map(t => <option key={t} value={t} className="bg-dark-surface text-white">{t}</option>)}
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Question Reference</label>
                  <div className="relative">
                     <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                     <input required
                        type="text" 
                        value={formData.topic} 
                        onChange={e => setFormData({...formData, topic: e.target.value})}
                        placeholder="e.g. 2023 GATE CS - Question 14 (Graph Theory)"
                        className="input-field h-12 pl-12 font-medium" 
                      />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Root Cause Analysis</label>
                    <textarea required
                      value={formData.reason} 
                      onChange={e => setFormData({...formData, reason: e.target.value})}
                      className="input-field min-h-[120px] pt-4 resize-none leading-relaxed" 
                      placeholder="Why did the system fail? (conceptual gap, lapse in concentration, etc.)"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Remediation Strategy</label>
                    <textarea required
                      value={formData.fix} 
                      onChange={e => setFormData({...formData, fix: e.target.value})}
                      className="input-field min-h-[120px] pt-4 resize-none leading-relaxed border-brand-500/10 focus:border-brand-500/50" 
                      placeholder="How will the student prevent recurrence?"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="submit" className="btn-primary flex items-center gap-2 h-14 px-10 uppercase tracking-widest font-black text-xs glow-blue">Synchronize Audit</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {errorLogs.length === 0 ? (
          <div className="glass-panel p-20 flex flex-col items-center justify-center text-gray-500 text-center gap-4 bg-white/[0.02] border-dashed">
            <div className="p-5 bg-white/5 rounded-full"><Brain className="w-12 h-12 opacity-30" /></div>
            <p className="font-bold uppercase tracking-widest text-xs opacity-50">Operational. No critical errors detected in recent logs.</p>
          </div>
        ) : (
          [...errorLogs].reverse().map((log, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={log.id} 
              className={`glass-panel p-8 rounded-3xl border-l-[6px] transition-all duration-500 group overflow-hidden relative ${
                log.fixed ? 'border-l-green-500 opacity-60 hover:opacity-100 grayscale-[0.6] hover:grayscale-0' : 'border-l-red-500 shadow-[0_10px_40px_rgba(239,68,68,0.08)]'
              }`}
            >
              {/* Subtle grid bg for resolved items */}
              {log.fixed && (
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#22c55e 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
              )}
              
              <div className="flex flex-col lg:flex-row justify-between items-start gap-8 relative z-10">
                <div className="flex-1 w-full space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`badge ${
                      log.mistakeType === 'Conceptual' ? 'bg-purple-500/20 text-purple-300' :
                      log.mistakeType === 'Silly Mistake' ? 'bg-amber-500/10 text-amber-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {log.mistakeType}
                    </span>
                    <span className="text-gray-500 font-bold uppercase tracking-tighter text-[10px]">{subjects.find(s=>s.id===log.subjectId)?.name}</span>
                    <div className="ml-auto flex items-center gap-2 text-gray-600">
                       <Info className="w-3.5 h-3.5" />
                       <span className="text-[10px] font-bold">{new Date(log.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <h3 className={`text-xl font-black tracking-tight ${log.fixed ? 'text-gray-400 line-through' : 'text-white group-hover:text-brand-300 transition-colors'}`}>{log.topic}</h3>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-red-400" /> Root Cause
                      </p>
                      <p className={`text-sm leading-relaxed ${log.fixed ? 'text-gray-500' : 'text-gray-300'}`}>{log.reason}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-400" /> Remediation
                      </p>
                      <p className={`text-sm leading-relaxed ${log.fixed ? 'text-gray-500 italic' : 'text-gray-300 font-medium'}`}>{log.fix}</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => toggleErrorFixed(log.id)}
                  className={`w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-2xl border transition-all lg:mt-2 active:scale-90 ${
                    log.fixed 
                      ? 'bg-green-500/10 text-green-400 border-green-500/30 glow-green' 
                      : 'bg-white/5 text-gray-500 border-white/5 hover:text-green-400 hover:border-green-500/30 hover:bg-green-500/10'
                  }`}
                  title={log.fixed ? "Re-open Audit" : "Resolve Audit"}
                >
                  <CheckCircle className={`w-8 h-8 ${log.fixed ? 'fill-current' : 'opacity-40'}`} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
