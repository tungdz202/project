import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DocumentList } from '../components/Documents/DocumentList';
import { Document } from '../types';

export const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleDocumentSelect = (document: Document) => {
    navigate(`/documents/${document.id}`);
  };

  const handleDocumentEdit = (document: Document) => {
    navigate(`/documents/${document.id}/edit`);
  };

  const handleDocumentDelete = (document: Document) => {
    if (confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
      alert('Tài liệu đã được xóa thành công!');
      // Refresh the page or update the list
      window.location.reload();
    }
  };

  const handleCreateNew = () => {
    navigate('/documents/new');
  };

  return (
    <DocumentList
      onDocumentSelect={handleDocumentSelect}
      onDocumentEdit={handleDocumentEdit}
      onDocumentDelete={handleDocumentDelete}
      onCreateNew={handleCreateNew}
    />
  );
};