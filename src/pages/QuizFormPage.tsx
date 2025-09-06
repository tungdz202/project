import React from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { QuizForm } from '../components/Quiz/QuizForm';
import { quizService } from '../services/quizService';
import { documentService } from '../services/documentService';
import { Quiz } from '../types';

export const QuizFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [quiz, setQuiz] = React.useState<Quiz | undefined>(undefined);
  const [sourceDocument, setSourceDocument] = React.useState(undefined);
  const [loading, setLoading] = React.useState(true);

  const documentId = searchParams.get('documentId');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const quizData = await quizService.getQuiz(id);
          setQuiz(quizData);
        }
        
        if (documentId) {
          const docData = await documentService.getDocument(documentId);
          setSourceDocument(docData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, documentId]);

  const handleSave = async (quizData: Partial<Quiz>) => {
    try {
      if (id) {
        // Update existing quiz
        await quizService.updateQuiz(id, quizData);
        alert('Quiz đã được cập nhật thành công!');
      } else {
        // Create new quiz
        await quizService.createQuiz(quizData);
        alert('Quiz đã được tạo thành công!');
      }
      navigate('/quiz');
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Có lỗi xảy ra khi lưu quiz. Vui lòng thử lại.');
    }
  };

  const handleCancel = () => {
    navigate('/quiz');
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <QuizForm
      quiz={quiz}
      sourceDocument={sourceDocument}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
};