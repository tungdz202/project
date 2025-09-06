import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DocumentDetail } from '../components/Documents/DocumentDetail';
import { documentService } from '../services/documentService';
import { Document } from '../types';

export const DocumentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = React.useState<Document | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchDocument = async () => {
      if (!id) return;
      
      try {
        const doc = await documentService.getDocument(id);
        setDocument(doc);
      } catch (error) {
        console.error('Error fetching document:', error);
        setError('Không thể tải tài liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {error || 'Không tìm thấy tài liệu'}
        </h2>
        <button
          onClick={() => navigate('/documents')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }


  const handleBack = () => {
    navigate('/documents');
  };

  const handleEdit = (document: any) => {
    navigate(`/documents/${document.id}/edit`);
  };

  const handleDelete = (document: any) => {
    if (confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
      documentService.deleteDocument(document.id)
        .then(() => {
          alert('Tài liệu đã được xóa thành công!');
          navigate('/documents');
        })
        .catch((error) => {
          console.error('Error deleting document:', error);
          alert('Không thể xóa tài liệu. Vui lòng thử lại.');
        });
    }
  };

  const handleCreateQuiz = (document: any) => {
    navigate(`/quiz/new?documentId=${document.id}`);
  };

  return (
    <DocumentDetail
      document={document}
      onBack={handleBack}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCreateQuiz={handleCreateQuiz}
    />
  );
};