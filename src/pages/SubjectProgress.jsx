import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { BookOpen, Target, CheckCircle2, Circle } from 'lucide-react';

export default function SubjectProgress() {
  const { subjects, calculateSubjectProgress } = useApp();
  const progressMap = calculateSubjectProgress();

  let totalLectures = 0;
  let totalCompleted = 0;
  Object.values(progressMap).forEach(stat => {
    totalLectures += stat.totalLectures;
    totalCompleted += stat.completedLectures;
  });
  const overallPercentage = totalLectures > 0 ? (totalCompleted / totalLectures) * 100 : 0;

  return (
    <div className="space-y-10">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-brand-500/10 rounded-xl"><BookOpen className="text-brand-400 w-6 h-6" /></div>
             <h2 className="text-3xl font-black text-white tracking-tight">Syllabus Overview</h2>
          </div>
          <p className="text-gray-400 text-sm ml-12">Track your journey across all GATE CS core subjects.</p>
        </div>
        
        <div className="glass-panel px-8 py-5 rounded-2xl flex flex-col gap-3 min-w-[280px]">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-brand-300/70">
            <span>Overall Roadmap</span>
            <span>{Math.round(overallPercentage)}%</span>
          </div>
          <div className="w-full bg-dark-bg/60 rounded-full h-2.5 overflow-hidden border border-white/5 shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${overallPercentage}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="bg-gradient-to-r from-brand-600 via-brand-400 to-accent-500 h-full rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-[10px] text-gray-500 font-medium">Progress calculated across {subjects.length} subjects</span>
            <div className="flex items-center gap-1">
               <CheckCircle2 className="w-3 h-3 text-green-500" />
               <span className="text-[10px] text-white font-bold">{totalCompleted} / {totalLectures} Lecs</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Subject Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {subjects.map((subject, index) => {
          const stats = progressMap[subject.id] || { completedLectures: 0, totalLectures: subject.totalLectures, completionPercentage: 0 };
          const isDone = stats.completionPercentage >= 100;
          
          return (
            <motion.div 
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className={`glass-card-hover p-6 flex flex-col relative overflow-hidden group ${isDone ? 'border-green-500/20' : ''}`}
            >
              {/* Progress Corner Glow */}
              <div 
                className="absolute -top-10 -right-10 w-32 h-32 blur-[40px] opacity-10 transition-opacity group-hover:opacity-20"
                style={{ background: isDone ? '#10b981' : '#3b82f6' }}
              />

              <div className="flex justify-between items-start mb-6">
                <div>
                   <h3 className="font-black text-xl text-white leading-tight mb-1 group-hover:text-brand-300 transition-colors">{subject.name}</h3>
                   <span className="badge bg-white/5 text-gray-400 border border-white/5">{subject.timeline}</span>
                </div>
                {isDone ? (
                  <div className="p-2 bg-green-500/20 rounded-full border border-green-500/30">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                ) : (
                  <div className="p-2 bg-brand-500/10 rounded-full border border-brand-500/20">
                    <Target className="w-5 h-5 text-brand-400" />
                  </div>
                )}
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/5 flex-1 flex flex-col justify-end">
                <div className="flex justify-between items-end mb-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter">Completion</span>
                    <span className="text-lg font-black text-white">{Math.round(stats.completionPercentage)}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter">Lectures</span>
                    <p className="text-xs font-bold text-gray-300">{stats.completedLectures} <span className="text-gray-600">/ {stats.totalLectures}</span></p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-dark-bg/60 rounded-full h-3 overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.completionPercentage}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: index * 0.1 }}
                    className={`h-full rounded-full relative ${
                      isDone 
                        ? 'bg-gradient-to-r from-emerald-600 to-green-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]' 
                        : 'bg-gradient-to-r from-brand-600 via-brand-400 to-indigo-500 shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                    }`}
                  >
                    {/* Glowing Tip */}
                    {stats.completionPercentage > 0 && stats.completionPercentage < 100 && (
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-white blur-[2px] opacity-50" />
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
                 <ArrowRight className="w-5 h-5 text-brand-400" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Helper icons not in lucide or needs custom
function ArrowRight(props) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M5 12h14m-7-7 7 7-7 7"/>
    </svg>
  );
}
