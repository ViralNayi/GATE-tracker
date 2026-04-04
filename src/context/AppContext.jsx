import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DEFAULT_SUBJECTS } from '../data/subjects';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Config state
  const [subjects, setSubjects] = useLocalStorage('gate-subjects', DEFAULT_SUBJECTS);
  const [examDate, setExamDate] = useLocalStorage('gate-exam-date', '2027-02-01');
  
  // Progress states
  const [dailyLogs, setDailyLogs] = useLocalStorage('gate-daily-logs', []);
  const [errorLogs, setErrorLogs] = useLocalStorage('gate-error-logs', []);
  const [mockTests, setMockTests] = useLocalStorage('gate-mock-tests', []);
  const [dailyGoals, setDailyGoals] = useLocalStorage('gate-daily-goals', []);
  const [revisionsDone, setRevisionsDone] = useLocalStorage('gate-revisions-done', []);
  
  // Calculate stats based on dailyLogs
  const calculateSubjectProgress = () => {
    const progress = {};
    
    // Initialize
    subjects.forEach(sub => {
      progress[sub.id] = {
        completedLectures: 0,
        totalLectures: sub.totalLectures,
        completionPercentage: 0
      };
    });
    
    // Accumulate
    dailyLogs.forEach(log => {
      if (progress[log.subjectId]) {
        progress[log.subjectId].completedLectures += (log.lecturesCompleted || 0);
      }
    });
    
    // Calculate percentages
    Object.keys(progress).forEach(key => {
      const item = progress[key];
      item.completionPercentage = item.totalLectures > 0 
        ? Math.min(100, (item.completedLectures / item.totalLectures) * 100) 
        : 0;
    });
    
    return progress;
  };

  const addDailyLog = (log) => {
    setDailyLogs(current => [...current, { ...log, id: Date.now().toString(), date: new Date().toISOString() }]);
  };
  
  const deleteDailyLog = (id) => {
    setDailyLogs(current => current.filter(log => log.id !== id));
  };

  const updateDailyLog = (id, updates) => {
    setDailyLogs(current => current.map(log => log.id === id ? { ...log, ...updates } : log));
  };
  
  const addErrorLog = (log) => {
    setErrorLogs(current => [...current, { ...log, id: Date.now().toString(), date: new Date().toISOString(), fixed: false }]);
  };

  const toggleErrorFixed = (id) => {
    setErrorLogs(current => current.map(e => e.id === id ? { ...e, fixed: !e.fixed } : e));
  };

  const addMockTest = (mock) => {
    setMockTests(current => [...current, { ...mock, id: Date.now().toString(), date: new Date().toISOString() }]);
  };

  const markRevisionDone = (key) => {
    setRevisionsDone(current => current.includes(key) ? current : [...current, key]);
  };

  const unmarkRevisionDone = (key) => {
    setRevisionsDone(current => current.filter(k => k !== key));
  };

  return (
    <AppContext.Provider value={{
      subjects, setSubjects,
      examDate, setExamDate,
      dailyLogs, addDailyLog, deleteDailyLog, updateDailyLog,
      errorLogs, addErrorLog, toggleErrorFixed,
      mockTests, addMockTest,
      dailyGoals, setDailyGoals,
      revisionsDone, markRevisionDone, unmarkRevisionDone,
      calculateSubjectProgress
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
