import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';

import Dashboard from './pages/Dashboard';
import DailyTracker from './pages/DailyTracker';
import SubjectProgress from './pages/SubjectProgress';
import ErrorLog from './pages/ErrorLog';
import MockAnalysis from './pages/MockAnalysis';
import Settings from './pages/Settings';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="tracker" element={<DailyTracker />} />
            <Route path="subjects" element={<SubjectProgress />} />
            <Route path="errors" element={<ErrorLog />} />
            <Route path="mocks" element={<MockAnalysis />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
