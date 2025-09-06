import React from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { DocumentForm } from '../components/Documents/DocumentForm';
import { mockDocuments } from '../data/mockData';
import { Document } from '../types';

export const DocumentFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const document = id ? mockDocuments.find(doc => doc.id === id) : undefined;
  const isEdit = !!id;

  const handleSave = (documentData: Partial<Document>) => {
    alert(`Tài liệu đã được ${isEdit ? 'cập nhật' : 'tạo'} thành công!`);
    navigate('/documents');
  };

  const handleCancel = () => {
    navigate('/documents');
  };

  return (
    <DocumentForm
      document={document}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
};