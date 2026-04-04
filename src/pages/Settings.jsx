import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings as SettingsIcon, Save, Trash2, Plus, AlertCircle } from 'lucide-react';
import { DEFAULT_SUBJECTS } from '../data/subjects';
import { motion } from 'framer-motion';

export default function Settings() {
  const { examDate, setExamDate, subjects, setSubjects } = useApp();
  
  const [localDate, setLocalDate] = useState(examDate);
  const [localSubjects, setLocalSubjects] = useState([...subjects]);
  const [notification, setNotification] = useState('');

  const handleSave = () => {
    setExamDate(localDate);
    setSubjects(localSubjects);
    setNotification('Settings saved successfully!');
    setTimeout(() => setNotification(''), 3000);
  };

  const calculateDaysLeft = () => {
    const timeDiff = new Date(localDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
  };

  const updateSubject = (index, field, value) => {
    const newSubjects = [...localSubjects];
    if (field === 'totalLectures') value = Number(value);
    newSubjects[index] = { ...newSubjects[index], [field]: value };
    setLocalSubjects(newSubjects);
  };

  const removeSubject = (index) => {
    const newSubjects = [...localSubjects];
    newSubjects.splice(index, 1);
    setLocalSubjects(newSubjects);
  };

  const addSubject = () => {
    setLocalSubjects([...localSubjects, { id: `sub-${Date.now()}`, name: 'New Subject', totalLectures: 30, timeline: 'TBD' }]);
  };

  const handleReset = () => {
    if(window.confirm('Are you sure you want to restore default subjects? Custom subjects will be lost.')) {
      setLocalSubjects([...DEFAULT_SUBJECTS]);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <SettingsIcon className="text-gray-400 w-8 h-8" />
          Settings
        </h2>
        <div className="flex items-center gap-4">
          {notification && <span className="text-green-400 text-sm font-medium">{notification}</span>}
          <button onClick={handleSave} className="btn-primary flex items-center gap-2 px-6">
            <Save className="w-5 h-5"/> Save Changes
          </button>
        </div>
      </div>

      <div className="glass-card p-6 border-l-4 border-l-brand-500">
        <h3 className="text-lg font-semibold text-white mb-4">Exam Configuration</h3>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 w-full relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">Target Exam Date (GATE)</label>
            <input 
              type="date" 
              value={localDate} 
              onChange={e => setLocalDate(e.target.value)}
              className="input-field" 
            />
          </div>
          <div className="md:w-1/3 bg-dark-bg/50 border border-white/5 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-brand-500/20 text-brand-400 rounded-xl">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Time Remaining</p>
              <p className="text-2xl font-bold text-white">{calculateDaysLeft()} <span className="text-sm font-normal text-gray-500">Days</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Subject & Syllabus Configuration</h3>
            <p className="text-sm text-gray-400 mt-1">Adjust total syllabus lectures to track progress accurately.</p>
          </div>
          <button onClick={addSubject} className="btn-secondary text-sm flex items-center gap-2">
            <Plus className="w-4 h-4"/> Add Subject
          </button>
        </div>

        <div className="space-y-4">
          {localSubjects.map((sub, index) => (
            <motion.div 
              key={sub.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col md:flex-row gap-4 items-center bg-dark-bg/30 p-4 rounded-xl border border-white/5 group hover:border-white/10 transition-colors"
            >
              <div className="flex-1 w-full">
                <input 
                  type="text" 
                  value={sub.name} 
                  onChange={e => updateSubject(index, 'name', e.target.value)}
                  className="w-full bg-transparent border-b border-transparent focus:border-brand-500 text-white font-medium px-2 py-1 focus:outline-none transition-colors" 
                  placeholder="Subject Name"
                />
              </div>
              <div className="w-full md:w-32">
                <div className="flex items-center gap-2">
                  <input 
                    type="number" min="1"
                    value={sub.totalLectures} 
                    onChange={e => updateSubject(index, 'totalLectures', e.target.value)}
                    className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-brand-500 text-center" 
                  />
                  <span className="text-xs text-gray-500">Lec</span>
                </div>
              </div>
              <div className="w-full md:w-48">
                <input 
                  type="text" 
                  value={sub.timeline} 
                  onChange={e => updateSubject(index, 'timeline', e.target.value)}
                  className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-1.5 text-gray-300 focus:outline-none focus:border-brand-500 text-sm" 
                  placeholder="e.g. April - May"
                />
              </div>
              <button 
                onClick={() => removeSubject(index)}
                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-100 md:opacity-0 group-hover:opacity-100"
                title="Remove subject"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
          <p className="text-sm text-gray-500">Messed up? You can restore the defaults.</p>
          <button onClick={handleReset} className="text-sm text-amber-500 hover:text-amber-400 underline decoration-amber-500/30 underline-offset-4">
            Restore Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
