import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { DashboardPage, ExamsPage, ExamPage, ResultsPage } from '@/pages';
import './App.css';

function App() {
  const { darkMode, setDarkMode } = useAppStore();

  useEffect(() => {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      setDarkMode(true);
    }
  }, [setDarkMode]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/exams" element={<ExamsPage />} />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="/results/:attemptId" element={<ResultsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
