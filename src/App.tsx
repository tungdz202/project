import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import IncidentManagement from './components/IncidentManagement';
import DocumentManagement from './components/DocumentManagement';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'incidents':
        return <IncidentManagement
          onNavigateToDocument={(docId) => {
            console.log('Navigating to document:', docId); // Debug log
            setSelectedDocumentId(docId);
            setActiveTab('documents');
          }}
        />;
      case 'documents':
        return <DocumentManagement selectedDocumentId={selectedDocumentId} onDocumentSelected={() => setSelectedDocumentId(null)} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="ml-64 min-h-screen">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;