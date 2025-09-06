import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './components/Auth/LoginPage';
import { ProtectedRoute } from './components/Layout/ProtectedRoute';
import { AppLayout } from './components/Layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { DocumentDetailPage } from './pages/DocumentDetailPage';
import { DocumentFormPage } from './pages/DocumentFormPage';
import { QuizPage } from './pages/QuizPage';
import { QuizTakingPage } from './pages/QuizTakingPage';
import { QuizFormPage } from './pages/QuizFormPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  const { loading, checkSession } = useAuth();

  React.useEffect(() => {
    console.log('Setting up session check interval...');
    const interval = setInterval(() => {
      checkSession();
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [checkSession]);

  if (loading) {
    console.log('App is loading...');
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  console.log('App rendering with router...');
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          {/* Dashboard */}
          <Route index element={<DashboardPage />} />
          
          {/* Documents */}
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="documents/new" element={<DocumentFormPage />} />
          <Route path="documents/:id" element={<DocumentDetailPage />} />
          <Route path="documents/:id/edit" element={<DocumentFormPage />} />
          
          {/* Quiz */}
          <Route path="quiz" element={<QuizPage />} />
          <Route path="quiz/new" element={<QuizFormPage />} />
          <Route path="quiz/:id/take" element={<QuizTakingPage />} />
          <Route path="quiz/:id/edit" element={<QuizFormPage />} />
          
          {/* Other Pages */}
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;