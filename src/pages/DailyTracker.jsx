import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, BookOpen, PenTool, CheckSquare, Trash2, Pencil, X, Save, Plus, ChevronRight, Activity } from 'lucide-react';
import PomodoroTimer from '../components/PomodoroTimer';

// ── Edit Modal ─────────────────────────────────────────────────────────────────
function EditLogModal({ log, subjects, onSave, onClose }) {
  const [form, setForm] = useState({
    subjectId: log.subjectId,
    lecturesCompleted: log.lecturesCompleted ?? 0,
    pyqsSolved: log.pyqsSolved ?? 0,
    studyHours: log.studyHours ?? 0,
    revisionDone: log.revisionDone ?? false,
    topicsStudied: log.topicsStudied ?? '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(log.id, {
      subjectId: form.subjectId,
      lecturesCompleted: Number(form.lecturesCompleted),
      pyqsSolved: Number(form.pyqsSolved),
      studyHours: Number(form.studyHours),
      revisionDone: form.revisionDone,
      topicsStudied: form.topicsStudied,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-bg/85 backdrop-blur-xl p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 30 }}
        className="glass-panel w-full max-w-lg p-8 rounded-3xl border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.5)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-brand-500/20 rounded-xl text-brand-400"><Pencil className="w-5 h-5" /></div>
             <h3 className="text-xl font-black text-white">Edit Learning Log</h3>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Focus Subject</label>
            <select name="subjectId" value={form.subjectId} onChange={handleChange} className="input-field appearance-none h-12 uppercase font-black tracking-tight text-sm">
              {subjects.map(s => (
                <option key={s.id} value={s.id} className="bg-dark-surface text-white">{s.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1 ml-1">Lectures</label>
            <div className="relative">
               <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500/50" />
               <input type="number" min="0" name="lecturesCompleted" value={form.lecturesCompleted} onChange={handleChange} className="input-field pl-11 h-12" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1 ml-1">PYQs</label>
            <div className="relative">
               <PenTool className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500/50" />
               <input type="number" min="0" name="pyqsSolved" value={form.pyqsSolved} onChange={handleChange} className="input-field pl-11 h-12" />
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1 ml-1">Focus Duration (Hours)</label>
            <div className="relative">
               <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/50" />
               <input type="number" min="0" step="0.5" name="studyHours" value={form.studyHours} onChange={handleChange} className="input-field pl-11 h-12" />
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1 ml-1">Specific Topics</label>
            <textarea name="topicsStudied" value={form.topicsStudied} onChange={handleChange} rows={3} className="input-field pt-3" placeholder="What specifically did you learn/practice?" />
          </div>

          <div className="md:col-span-2 flex items-center gap-4 py-2 bg-white/5 rounded-2xl px-5 border border-white/5">
             <div className="relative flex items-center">
               <input type="checkbox" id="edit-rev" name="revisionDone" checked={form.revisionDone} onChange={handleChange} className="peer appearance-none w-6 h-6 rounded-lg border border-white/20 bg-dark-bg/80 checked:bg-brand-500 transition-all cursor-pointer" />
               <CheckCircle className="absolute inset-0 w-6 h-6 text-white opacity-0 peer-checked:opacity-100 pointer-events-none p-1" />
            </div>
            <label htmlFor="edit-rev" className="text-sm font-bold text-gray-300 cursor-pointer select-none">Marked for Revision session</label>
          </div>

          <div className="md:col-span-2 flex gap-4 mt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-4 uppercase tracking-[0.2em] text-xs font-black">Cancel</button>
            <button type="submit" className="btn-primary flex-1 py-4 uppercase tracking-[0.2em] text-xs font-black glow-blue">Save Changes</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function DailyTracker() {
  const { subjects, addDailyLog, dailyLogs, deleteDailyLog, updateDailyLog } = useApp();

  const [formData, setFormData] = useState({
    subjectId: subjects[0]?.id || '',
    lecturesCompleted: 0,
    pyqsSolved: 0,
    studyHours: 0,
    revisionDone: false,
    topicsStudied: '',
  });

  const [targetGoal] = useState({ lectures: 2, pyqs: 20, hours: 4 });
  const [notification, setNotification] = useState(null);
  const [editingLog, setEditingLog] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subjectId) return;
    addDailyLog({
      subjectId: formData.subjectId,
      lecturesCompleted: Number(formData.lecturesCompleted),
      pyqsSolved: Number(formData.pyqsSolved),
      studyHours: Number(formData.studyHours),
      revisionDone: formData.revisionDone,
      topicsStudied: formData.topicsStudied,
    });
    showToast('Activity logged. Mastery approaching.');
    setFormData(f => ({ ...f, lecturesCompleted: 0, pyqsSolved: 0, studyHours: 0, revisionDone: false, topicsStudied: '' }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEditSave = (id, updates) => {
    updateDailyLog(id, updates);
    showToast('Log entry refined.');
  };

  const handleDelete = (id) => {
    deleteDailyLog(id);
    setDeleteConfirmId(null);
    showToast('Activity purged.', 'error');
  };

  // Today's calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysLogs = dailyLogs.filter(log => log.date?.startsWith(todayStr));
  const todayStats = todaysLogs.reduce(
    (acc, log) => {
      acc.lectures += log.lecturesCompleted || 0;
      acc.pyqs += log.pyqsSolved || 0;
      acc.hours += log.studyHours || 0;
      if (log.revisionDone) acc.hasRevision = true;
      return acc;
    },
    { lectures: 0, pyqs: 0, hours: 0, hasRevision: false }
  );

  const productivityScore = Math.min(100, Math.max(0, Math.round(((todayStats.lectures/targetGoal.lectures)*0.4 + (todayStats.pyqs/targetGoal.pyqs)*0.3 + (todayStats.hours/targetGoal.hours)*0.3) * 100)));

  return (
    <div className="space-y-10 relative">

      {/* ── Toast ── */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -40, x: '50%' }} animate={{ opacity: 1, y: 0, x: '0%' }} exit={{ opacity: 0, scale: 0.9 }}
            style={{ left: '50%', transform: 'translateX(-50%)' }}
            className={`fixed top-8 z-[200] glass-panel px-8 py-4 rounded-2xl flex items-center gap-4 shadow-2xl border ${
              notification.type === 'error' ? 'border-red-500/30 text-red-300' : 'border-green-500/30 text-green-300'
            }`}
          >
            <Activity className="w-5 h-5 text-current" />
            <span className="font-bold tracking-tight">{notification.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{editingLog && (
        <EditLogModal log={editingLog} subjects={subjects} onSave={handleEditSave} onClose={() => setEditingLog(null)} />
      )}</AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Form */}
        <div className="xl:col-span-5 space-y-8">
           <div className="glass-panel p-10 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-5 -mr-5 -mt-5 group-hover:opacity-10 transition-opacity">
                 <CheckSquare className="w-32 h-32 text-brand-500" />
              </div>

              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-10">
                    <div className="p-2.5 bg-brand-500/10 rounded-xl text-brand-400"><Plus className="w-6 h-6" /></div>
                    <h2 className="text-2xl font-black text-white tracking-tighter">Register Study Output</h2>
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Target Subject</label>
                      <select name="subjectId" value={formData.subjectId} onChange={handleChange} className="input-field appearance-none h-14 font-black uppercase tracking-tight">
                        {subjects.map(s => (
                          <option key={s.id} value={s.id} className="bg-dark-surface text-white">{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-[10px] items-center gap-2 font-black uppercase tracking-widest text-gray-500 mb-1 ml-1">Lectures <BookOpen className="inline w-3 h-3 mb-0.5 opacity-50" /></label>
                        <input type="number" min="0" name="lecturesCompleted" value={formData.lecturesCompleted} onChange={handleChange} className="input-field h-14 text-lg font-black" />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 ml-1">PYQs <PenTool className="inline w-3 h-3 mb-0.5 opacity-50" /></label>
                        <input type="number" min="0" name="pyqsSolved" value={formData.pyqsSolved} onChange={handleChange} className="input-field h-14 text-lg font-black" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 ml-1">Study Duration (Hours) <Clock className="inline w-3 h-3 mb-0.5 opacity-50" /></label>
                      <input type="number" min="0" step="0.5" name="studyHours" value={formData.studyHours} onChange={handleChange} className="input-field h-14 text-lg font-black" />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 ml-1">Topics Accomplished</label>
                      <textarea name="topicsStudied" value={formData.topicsStudied} onChange={handleChange} rows={3} placeholder="Highlights of your learning..." className="input-field pt-4 resize-none leading-relaxed" />
                    </div>

                    <div className="flex items-center gap-4 py-3 bg-white/5 rounded-2xl px-6 border border-white/5 transition-colors hover:border-brand-500/20">
                      <div className="relative flex items-center">
                        <input type="checkbox" id="rev-check" name="revisionDone" checked={formData.revisionDone} onChange={handleChange} className="peer appearance-none w-6 h-6 rounded-lg border border-white/20 bg-dark-bg/80 checked:bg-brand-500 transition-all cursor-pointer" />
                        <CheckCircle className="absolute inset-0 w-6 h-6 text-white opacity-0 peer-checked:opacity-100 pointer-events-none p-1" />
                      </div>
                      <label htmlFor="rev-check" className="text-xs font-black uppercase tracking-widest text-gray-400 cursor-pointer select-none">Marked as Revision session</label>
                    </div>

                    <button type="submit" className="btn-primary w-full h-16 text-xs uppercase font-black tracking-[0.3em] glow-blue active:scale-[0.98] transition-transform">Save Log Entry</button>
                 </form>
              </div>
           </div>
        </div>

        {/* Right Column: Performance & Timer */}
        <div className="xl:col-span-7 space-y-8">
           <div className="glass-panel p-10 rounded-3xl h-full flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-12">
                 <div className="space-y-1">
                    <h2 className="text-2xl font-black text-white tracking-tighter">Daily Momentum</h2>
                    <p className="text-xs font-bold text-gray-500 tracking-widest uppercase">Target tracking for {new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black text-green-500/80 uppercase">Live Metrics</span>
                 </div>
              </div>

              <div className="flex-1 flex flex-col md:flex-row items-center justify-around gap-12 mb-12">
                 <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_15px_rgba(59,130,246,0.2)]" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="44" className="stroke-current text-white/5" strokeWidth="10" fill="none" />
                      <motion.circle cx="50" cy="50" r="44" className="stroke-current text-brand-500" strokeWidth="10" strokeDasharray="276" strokeLinecap="round" animate={{ strokeDashoffset: 276 - (276 * productivityScore) / 100 }} transition={{ duration: 1.5, ease: "easeOut" }} fill="none" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                       <span className="text-5xl font-black text-white">{productivityScore}%</span>
                       <span className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-500">Output</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    <MiniMetric label="Lectures" current={todayStats.lectures} target={targetGoal.lectures} color="brand" icon={BookOpen} />
                    <MiniMetric label="PYQs" current={todayStats.pyqs} target={targetGoal.pyqs} color="purple" icon={PenTool} />
                    <MiniMetric label="Hours" current={todayStats.hours} target={targetGoal.hours} color="amber" icon={Clock} />
                    <div className={`p-5 rounded-2xl border flex flex-col gap-3 transition-all ${todayStats.hasRevision ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/5'}`}>
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-gray-500">Revision</span>
                          {todayStats.hasRevision ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-gray-600" />}
                       </div>
                       <p className="text-xs font-black uppercase text-white truncate">{todayStats.hasRevision ? 'Mastered' : 'Pending'}</p>
                    </div>
                 </div>
              </div>

              <PomodoroTimer />
           </div>
        </div>
      </div>

      {/* ── All Activities ── */}
      <div className="glass-panel p-10 rounded-3xl relative overflow-hidden">
         <div className="flex items-center justify-between mb-10">
            <div className="space-y-1">
               <h2 className="text-2xl font-black text-white tracking-tighter">Learning History</h2>
               <p className="text-xs font-bold text-gray-500 tracking-widest uppercase">Archive of your academic progress</p>
            </div>
            <div className="badge bg-brand-500/10 text-brand-400 border border-brand-500/10">{dailyLogs.length} Entries</div>
         </div>

         {dailyLogs.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
               <Activity className="w-16 h-16 mx-auto mb-4 text-gray-600 opacity-20" />
               <p className="text-gray-500 font-bold tracking-tight uppercase text-xs">No learning data detected yet.</p>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
               {[...dailyLogs].reverse().map(log => {
                  const subject = subjects.find(s => s.id === log.subjectId);
                  const isPendingDelete = deleteConfirmId === log.id;

                  return (
                    <motion.div key={log.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`group p-6 rounded-2xl border transition-all duration-300 relative ${
                      isPendingDelete ? 'stat-amber scale-[0.98]' : 'glass-card-hover'
                    }`}>
                       <div className="flex justify-between items-start mb-6">
                          <div className="space-y-1 max-w-[70%]">
                             <p className="text-[9px] font-black uppercase tracking-widest text-brand-500/80">{subject?.name || 'Unknown'}</p>
                             <h4 className="text-sm font-black text-white line-clamp-1">{log.topicsStudied || 'Untitled Session'}</h4>
                          </div>
                          <div className="text-[10px] font-bold text-gray-600">{new Date(log.date).toLocaleDateString('en-US', { day:'numeric', month:'short' })}</div>
                       </div>

                       <div className="flex gap-4 mb-6">
                          <LogBadge icon={BookOpen} value={log.lecturesCompleted} color="brand" />
                          <LogBadge icon={PenTool} value={log.pyqsSolved} color="purple" />
                          <LogBadge icon={Clock} value={log.studyHours} unit="h" color="amber" />
                       </div>

                       <div className="flex items-center gap-2 pt-5 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {isPendingDelete ? (
                             <>
                                <span className="text-[10px] font-black uppercase text-amber-500 mr-auto">Confirm delete?</span>
                                <button onClick={() => handleDelete(log.id)} className="px-3 py-1 bg-amber-500 text-white text-[10px] font-black uppercase rounded-lg">Yes</button>
                                <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1 bg-white/5 text-[10px] font-black uppercase rounded-lg">No</button>
                             </>
                          ) : (
                             <>
                                <button onClick={() => setEditingLog(log)} className="p-2 bg-white/5 text-gray-400 hover:text-brand-400 hover:bg-brand-500/10 rounded-xl transition-all"><Pencil className="w-4 h-4" /></button>
                                <button onClick={() => setDeleteConfirmId(log.id)} className="p-2 bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                                <div className="ml-auto flex items-center gap-2 text-gray-600">
                                   {log.revisionDone && <CheckCircle className="w-4 h-4 text-green-500/50" />}
                                   <ChevronRight className="w-4 h-4" />
                                </div>
                             </>
                          )}
                       </div>
                    </motion.div>
                  );
               })}
            </div>
         )}
      </div>

    </div>
  );
}

function MiniMetric({ label, current, target, color, icon: Icon }) {
  const colors = { brand: 'text-brand-400 bg-brand-500/10 border-brand-500/10', purple: 'text-purple-400 bg-purple-500/10 border-purple-500/10', amber: 'text-amber-400 bg-amber-500/10 border-amber-500/10' };
  return (
    <div className={`p-5 rounded-2xl border ${colors[color]} flex flex-col gap-3 group transition-all`}>
       <div className="flex justify-between items-center">
          <span className="text-[10px] font-black uppercase text-gray-500 group-hover:text-gray-300 transition-colors">{label}</span>
          <Icon className="w-4 h-4 opacity-40 group-hover:opacity-80" />
       </div>
       <p className="text-xl font-black text-white">{current} <span className="text-xs font-bold text-gray-500">/ {target}</span></p>
    </div>
  );
}

function LogBadge({ icon: Icon, value, unit="", color }) {
   const colors = { brand: 'bg-brand-500/10 text-brand-400', purple: 'bg-purple-500/10 text-purple-400', amber: 'bg-amber-500/10 text-amber-400' };
   return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-[10px] ${colors[color]}`}>
         <Icon className="w-3.5 h-3.5" />
         <span>{value}{unit}</span>
      </div>
   );
}
