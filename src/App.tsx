import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { DeveloperList } from './components/DeveloperList';
import { ProjectList } from './components/ProjectList';
import { TaskManagement } from './components/TaskManagement';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

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