import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Trophy, Calendar } from 'lucide-react';

// Returns a local YYYY-MM-DD string (avoids UTC offset issues)
const toLocalDate = (isoString) => {
  const d = new Date(isoString);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getToday = () => toLocalDate(new Date().toISOString());

export default function StreakTracker() {
  const { dailyLogs } = useApp();

  const { currentStreak, longestStreak, heatmapData, totalStudyDays } = useMemo(() => {
    // Build a map: date -> total hours
    const hoursMap = {};
    dailyLogs.forEach(log => {
      if (!log.date) return;
      const d = toLocalDate(log.date);
      hoursMap[d] = (hoursMap[d] || 0) + (log.studyHours || 0);
    });

    // Unique sorted study dates
    const studyDates = [...new Set(
      dailyLogs.filter(l => l.date).map(l => toLocalDate(l.date))
    )].sort();

    const today = getToday();

    // Current streak: count consecutive days ending today or yesterday
    let currentStreak = 0;
    let checkDate = new Date();
    // If today has no log yet, still allow streak from yesterday
    if (!hoursMap[today]) checkDate.setDate(checkDate.getDate() - 1);
    while (true) {
      const ds = toLocalDate(checkDate.toISOString());
      if (hoursMap[ds]) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else break;
    }

    // Longest streak
    let longestStreak = 0, run = 1;
    for (let i = 1; i < studyDates.length; i++) {
      const prev = new Date(studyDates[i - 1]);
      const curr = new Date(studyDates[i]);
      const diffDays = Math.round((curr - prev) / (1000 * 3600 * 24));
      if (diffDays === 1) { run++; longestStreak = Math.max(longestStreak, run); }
      else run = 1;
    }
    if (studyDates.length === 1) longestStreak = 1;
    longestStreak = Math.max(longestStreak, currentStreak);

    // Heatmap: 15 weeks × 7 days ending today
    const weeks = 15;
    const totalDays = weeks * 7;
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - (totalDays - 1));

    const heatmapData = [];
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const ds = toLocalDate(d.toISOString());
      heatmapData.push({ date: ds, hours: hoursMap[ds] || 0 });
    }

    return { currentStreak, longestStreak, heatmapData, totalStudyDays: studyDates.length };
  }, [dailyLogs]);

  // Color intensity by hours studied
  const getColor = (hours) => {
    if (hours === 0) return 'bg-white/5';
    if (hours < 2) return 'bg-emerald-900/60 border-emerald-700/40';
    if (hours < 4) return 'bg-emerald-700/70 border-emerald-500/40';
    if (hours < 6) return 'bg-emerald-600/80 border-emerald-400/50';
    return 'bg-emerald-500 border-emerald-300/60 shadow-[0_0_6px_rgba(52,211,153,0.4)]';
  };

  const today = getToday();

  // Group heatmap cells into 15 columns (weeks), each with 7 rows (days)
  const weeks = [];
  for (let w = 0; w < 15; w++) {
    weeks.push(heatmapData.slice(w * 7, w * 7 + 7));
  }

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="glass-card p-6 border-t border-white/10">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          Study Streak
        </h3>
        <span className="text-xs text-gray-500">{totalStudyDays} days studied total</span>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-gradient-to-br from-orange-500/15 to-red-500/10 border border-orange-500/20 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-orange-500/20 rounded-lg">
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Current Streak</p>
            <p className="text-2xl font-bold text-white">
              {currentStreak}
              <span className="text-sm font-normal text-gray-400 ml-1">days</span>
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/15 to-amber-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-yellow-500/20 rounded-lg">
            <Trophy className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Longest Streak</p>
            <p className="text-2xl font-bold text-white">
              {longestStreak}
              <span className="text-sm font-normal text-gray-400 ml-1">days</span>
            </p>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div>
        <div className="flex items-center gap-1 mb-2">
          <Calendar className="w-3.5 h-3.5 text-gray-500 mr-1" />
          <span className="text-xs text-gray-500">Last 15 weeks</span>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-1 shrink-0">
            {dayLabels.map((d, i) => (
              <div key={i} className="w-3 h-3 flex items-center justify-center text-[9px] text-gray-600 leading-none">{d}</div>
            ))}
          </div>
          {/* Week columns */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1 shrink-0">
              {week.map((cell, di) => (
                <div
                  key={di}
                  title={`${cell.date}: ${cell.hours}h studied`}
                  className={`w-3 h-3 rounded-sm border transition-all duration-200 hover:scale-150 hover:z-10 relative cursor-default ${
                    cell.date === today
                      ? 'ring-1 ring-brand-400 ring-offset-1 ring-offset-dark-surface'
                      : ''
                  } ${getColor(cell.hours)}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-[10px] text-gray-600">Less</span>
          {[0, 1, 3, 5, 8].map(h => (
            <div key={h} className={`w-3 h-3 rounded-sm border ${getColor(h)}`} />
          ))}
          <span className="text-[10px] text-gray-600">More</span>
        </div>
      </div>

      {/* Motivational badge */}
      {currentStreak >= 3 && (
        <div className="mt-4 flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2">
          <span className="text-lg">🔥</span>
          <p className="text-xs text-orange-300 font-medium">
            {currentStreak >= 30 ? 'Legendary streak! GATE is yours.' :
             currentStreak >= 14 ? 'Two weeks strong! Keep the fire burning.' :
             currentStreak >= 7 ? 'One full week! You\'re unstoppable.' :
             'Great streak! Don\'t break the chain.'}
          </p>
        </div>
      )}
    </div>
  );
}
