import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dashboard } from '../components/Dashboard/Dashboard';
import { Document } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleDocumentSelect = (document: Document) => {
    navigate(`/documents/${document.id}`);
  };

  return <Dashboard onDocumentSelect={handleDocumentSelect} />;
};