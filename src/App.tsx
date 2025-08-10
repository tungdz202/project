import React, { useState } from 'react';
import { useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { DeveloperList } from './components/DeveloperList';
import { ProjectList } from './components/ProjectList';
import { TaskManagement } from './components/TaskManagement';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  // Listen for navigation events
  useEffect(() => {
    const handleNavigateToTasks = () => {
      setCurrentView('tasks');
    };

    window.addEventListener('navigateToTasks', handleNavigateToTasks);
    return () => {
      window.removeEventListener('navigateToTasks', handleNavigateToTasks);
    };
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'developers':
        return <DeveloperList />;
      case 'projects':
        return <ProjectList />;
      case 'tasks':
        return <TaskManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
      <Layout currentView={currentView} onViewChange={setCurrentView}>
        {renderCurrentView()}
      </Layout>
  );
}

export default App;