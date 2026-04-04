import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Download, TrendingUp, Clock, BookOpen, CheckCircle, Calendar, ArrowUpRight } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { subDays, format } from 'date-fns';
import StreakTracker from '../components/StreakTracker';
import RevisionScheduler from '../components/RevisionScheduler';
import { motion } from 'framer-motion';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export default function Dashboard() {
  const { dailyLogs, calculateSubjectProgress, subjects } = useApp();
  const dashboardRef = useRef(null);
  
  const oneWeekAgo = subDays(new Date(), 7);
  const weeklyLogs = dailyLogs.filter(log => new Date(log.date) >= oneWeekAgo);

  const weeklyStats = {
    lectures: 0,
    hours: 0,
    subjectsCovered: new Set(),
  };

  const subjectLecturesMap = {};
  const timeDistMap = {};
  const dailyHoursData = [];

  // Initialize last 7 days for the chart
  for (let i = 6; i >= 0; i--) {
    const d = subDays(new Date(), i);
    dailyHoursData.push({
      date: format(d, 'MMM dd'),
      hours: 0,
      fullDate: format(d, 'yyyy-MM-dd')
    });
  }

  weeklyLogs.forEach(log => {
    weeklyStats.lectures += log.lecturesCompleted || 0;
    weeklyStats.hours += log.studyHours || 0;
    if (log.subjectId) weeklyStats.subjectsCovered.add(log.subjectId);
    
    if (log.subjectId) {
      subjectLecturesMap[log.subjectId] = (subjectLecturesMap[log.subjectId] || 0) + (log.lecturesCompleted || 0);
      timeDistMap[log.subjectId] = (timeDistMap[log.subjectId] || 0) + (log.studyHours || 0);
    }

    const logDate = log.date?.split('T')[0];
    const dayData = dailyHoursData.find(d => d.fullDate === logDate);
    if (dayData) dayData.hours += log.studyHours || 0;
  });

  const barChartData = Object.keys(subjectLecturesMap).map(subId => ({
    name: subjects.find(s => s.id === subId)?.name.substring(0, 10) + (subjects.find(s => s.id === subId)?.name.length > 10 ? '...' : ''),
    lectures: subjectLecturesMap[subId]
  }));

  const pieChartData = Object.keys(timeDistMap).map(subId => ({
    name: subjects.find(s => s.id === subId)?.name,
    value: timeDistMap[subId]
  }));

  const overallProgress = calculateSubjectProgress();
  let totalLectures = 0; let totalCompleted = 0;
  Object.values(overallProgress).forEach(stat => {
    totalLectures += stat.totalLectures;
    totalCompleted += stat.completedLectures;
  });
  const overallPercentage = totalLectures > 0 ? (totalCompleted / totalLectures) * 100 : 0;

  const exportPDF = async () => {
    const element = dashboardRef.current;
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#060b18' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`GATE-Tracker-Report.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Overview</h2>
          <p className="text-gray-400 text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-400" />
            Performance metrics for the last 7 days
          </p>
        </div>
        <button onClick={exportPDF} className="btn-secondary flex items-center gap-2 group">
          <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" /> 
          <span className="font-semibold text-sm">Download Report</span>
        </button>
      </div>

      <div ref={dashboardRef} className="space-y-8">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard 
            icon={BookOpen} 
            title="Weekly Lectures" 
            value={weeklyStats.lectures} 
            type="blue"
            trend="+12% vs last week"
          />
          <StatCard 
            icon={Clock} 
            title="Weekly Hours" 
            value={`${weeklyStats.hours}h`} 
            type="amber"
            trend="+5h vs last week"
          />
          <StatCard 
            icon={CheckCircle} 
            title="Subjects Covered" 
            value={weeklyStats.subjectsCovered.size} 
            type="purple"
            trend="Broad coverage"
          />
          <StatCard 
            icon={TrendingUp} 
            title="Total Progress" 
            value={`${Math.round(overallPercentage)}%`} 
            type="green"
            trend="Approaching Goal"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-8 group">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-extrabold text-white">Lectures Per Subject</h3>
              <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-brand-400 transition-colors" />
            </div>
            <div className="h-[280px]">
              {barChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <XAxis 
                      dataKey="name" 
                      stroke="#4b5563" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false} 
                      dy={10}
                    />
                    <YAxis 
                      stroke="#4b5563" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(59,130,246,0.05)' }} 
                      contentStyle={{ 
                        backgroundColor: '#0d1526', 
                        border: '1px solid rgba(255,255,255,0.08)', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)'
                      }} 
                    />
                    <Bar 
                      dataKey="lectures" 
                      fill="url(#blueGradient)" 
                      radius={[6, 6, 0, 0]} 
                      barSize={32}
                    />
                    <defs>
                      <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1e40af" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState msg="No lectures logged this week." />
              )}
            </div>
          </div>

          <div className="glass-card p-8 group">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-extrabold text-white">Daily Study Intensity</h3>
              <div className="p-2 bg-brand-500/10 rounded-lg"><TrendingUp className="w-4 h-4 text-brand-400" /></div>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyHoursData}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0d1526', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <StreakTracker />
          <RevisionScheduler />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, type, trend }) {
  const styles = {
    blue: "stat-blue",
    purple: "stat-purple",
    amber: "stat-amber",
    green: "stat-green"
  };

  const iconColors = {
    blue: "text-brand-400",
    purple: "text-accent-400",
    amber: "text-amber-400",
    green: "text-emerald-400"
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className={`${styles[type]} p-6 rounded-2xl flex flex-col items-start gap-4 transition-all duration-300 hover:shadow-xl`}
    >
      <div className={`p-3.5 rounded-xl bg-white/5 ${iconColors[type]} flex items-center justify-center`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">{title}</h4>
        <p className="text-3xl font-black text-white">{value}</p>
        <p className={`text-[10px] mt-2 font-semibold ${iconColors[type]} opacity-80 uppercase tracking-tighter`}>{trend}</p>
      </div>
    </motion.div>
  );
}

function EmptyState({ msg }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
      <div className="p-4 bg-white/5 rounded-full"><BookOpen className="w-10 h-10 opacity-20" /></div>
      <p className="text-sm font-medium opacity-50 italic">{msg}</p>
    </div>
  );
}
