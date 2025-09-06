import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuizTaking } from '../components/Quiz/QuizTaking';
import { quizService } from '../services/quizService';
import { QuizAttempt } from '../types';

export const QuizTakingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;
      
      try {
        const quizData = await quizService.getQuiz(id);
        setQuiz(quizData);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setError('Không thể tải quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {error || 'Không tìm thấy quiz'}
        </h2>
        <button
          onClick={() => navigate('/quiz')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const handleBack = () => {
    navigate('/quiz');
  };

  const handleComplete = async (attempt: QuizAttempt) => {
    console.log('Quiz completed:', attempt);
    try {
      await quizService.submitQuizAttempt(attempt);
      // Could navigate to results page or back to quiz list
    } catch (error) {
      console.error('Error submitting quiz attempt:', error);
    }
  };

  return (
    <QuizTaking
      quiz={quiz}
      onBack={handleBack}
      onComplete={handleComplete}
    />
  );
};