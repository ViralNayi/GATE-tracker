import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, CheckCircle2, BookMarked, Clock3 } from 'lucide-react';

// Spaced repetition intervals in days
const INTERVALS = [1, 3, 7, 14, 30];

const toLocalDate = (isoString) => {
  const d = new Date(isoString);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return toLocalDate(d.toISOString());
};

const getToday = () => toLocalDate(new Date().toISOString());

export default function RevisionScheduler() {
  const { dailyLogs, subjects, revisionsDone, markRevisionDone, unmarkRevisionDone } = useApp();

  const { todayItems, upcomingItems } = useMemo(() => {
    const today = getToday();
    const todayItems = [];
    const upcomingItems = [];

    // Only logs that have topics studied
    const logsWithTopics = dailyLogs.filter(l => l.topicsStudied && l.topicsStudied.trim() && l.date);

    logsWithTopics.forEach(log => {
      const logDate = toLocalDate(log.date);
      const subject = subjects.find(s => s.id === log.subjectId);
      const subjectName = subject?.name || 'Unknown';
      const topics = log.topicsStudied.trim();

      INTERVALS.forEach(interval => {
        const dueDate = addDays(logDate, interval);
        const key = `${log.id}-${interval}`;
        const isDone = revisionsDone.includes(key);
        const daysDiff = Math.round((new Date(dueDate) - new Date(today)) / (1000 * 3600 * 24));

        const item = {
          key,
          logId: log.id,
          topics,
          subjectName,
          subjectId: log.subjectId,
          dueDate,
          interval,
          isDone,
          daysDiff,
        };

        if (daysDiff <= 0 && !isDone) {
          todayItems.push({ ...item, isOverdue: daysDiff < 0 });
        } else if (daysDiff > 0 && daysDiff <= 7 && !isDone) {
          upcomingItems.push(item);
        }
      });
    });

    // Sort: overdue first, then by due date
    todayItems.sort((a, b) => a.daysDiff - b.daysDiff);
    upcomingItems.sort((a, b) => a.daysDiff - b.daysDiff);

    return { todayItems, upcomingItems };
  }, [dailyLogs, subjects, revisionsDone]);

  const intervalLabel = (n) => `Day +${n}`;
  const subjectColor = (id) => {
    const colors = {
      maths: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      c: 'text-green-400 bg-green-500/10 border-green-500/20',
      ds: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      algo: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      os: 'text-red-400 bg-red-500/10 border-red-500/20',
      dbms: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      cn: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
      toc: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      cd: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      apti: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    };
    return colors[id] || 'text-gray-400 bg-white/5 border-white/10';
  };

  const isEmpty = todayItems.length === 0 && upcomingItems.length === 0;

  return (
    <div className="glass-card p-6 border-t border-white/10">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-violet-400" />
          Revision Scheduler
          <span className="text-xs font-normal text-gray-500">(Spaced Repetition)</span>
        </h3>
        {todayItems.length > 0 && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 animate-pulse">
            {todayItems.length} due today
          </span>
        )}
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <BookMarked className="w-10 h-10 text-gray-600 mb-3" />
          <p className="text-gray-500 text-sm">No revisions due soon.</p>
          <p className="text-gray-600 text-xs mt-1">Log topics in the Daily Tracker to enable spaced repetition.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">

          {/* Today / Overdue */}
          {todayItems.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
                Due Today & Overdue
              </p>
              <AnimatePresence>
                {todayItems.map((item) => (
                  <motion.div
                    key={item.key}
                    layout
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`mb-2 flex items-start gap-3 p-3 rounded-xl border transition-all ${
                      item.isOverdue
                        ? 'bg-red-500/5 border-red-500/20'
                        : 'bg-violet-500/5 border-violet-500/20'
                    }`}
                  >
                    <button
                      onClick={() => item.isDone ? unmarkRevisionDone(item.key) : markRevisionDone(item.key)}
                      className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        item.isDone
                          ? 'bg-green-500 border-green-500'
                          : item.isOverdue
                          ? 'border-red-400 hover:border-red-300 hover:bg-red-500/20'
                          : 'border-violet-400 hover:border-violet-300 hover:bg-violet-500/20'
                      }`}
                    >
                      {item.isDone && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-md font-medium border ${subjectColor(item.subjectId)}`}>
                          {item.subjectName}
                        </span>
                        <span className="text-xs text-gray-500">{intervalLabel(item.interval)}</span>
                        {item.isOverdue && (
                          <span className="text-xs text-red-400 font-medium">
                            {Math.abs(item.daysDiff)}d overdue
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-300 mt-1 line-clamp-1">{item.topics}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Upcoming (next 7 days) */}
          {upcomingItems.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                <Clock3 className="w-3 h-3" />
                Upcoming (next 7 days)
              </p>
              {upcomingItems.slice(0, 5).map((item) => (
                <div
                  key={item.key}
                  className="mb-2 flex items-start gap-3 p-3 rounded-xl border bg-white/2 border-white/5 opacity-70"
                >
                  <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 border-white/10" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-md font-medium border ${subjectColor(item.subjectId)}`}>
                        {item.subjectName}
                      </span>
                      <span className="text-xs text-gray-500">{intervalLabel(item.interval)}</span>
                      <span className="text-xs text-gray-500 ml-auto">in {item.daysDiff}d</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-1">{item.topics}</p>
                  </div>
                </div>
              ))}
              {upcomingItems.length > 5 && (
                <p className="text-xs text-gray-600 text-center mt-1">+{upcomingItems.length - 5} more upcoming</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
