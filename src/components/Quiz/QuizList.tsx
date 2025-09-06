import React, { useState } from 'react';
import { BookOpen, Play, Plus, Clock, Trophy, User } from 'lucide-react';
import { Quiz } from '../../types';
import { quizService } from '../../services/quizService';
import { useAuth } from '../../hooks/useAuth';

interface QuizListProps {
  onQuizSelect: (quiz: Quiz) => void;
  onCreateQuiz: () => void;
}

export const QuizList: React.FC<QuizListProps> = ({ onQuizSelect, onCreateQuiz }) => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = React.useState<Quiz[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = useState<'all' | 'my' | 'available'>('all');

  React.useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const quizData = await quizService.getQuizzes();
        setQuizzes(quizData);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter(quiz => {
    switch (filter) {
      case 'my':
        return quiz.authorId === user?.id;
      case 'available':
        return quiz.authorId !== user?.id;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quiz & Kiểm tra</h2>
            <p className="text-gray-600 mt-1">Đang tải...</p>
          </div>
        </div>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quiz & Kiểm tra</h2>
          <p className="text-gray-600 mt-1">
            Tìm thấy {filteredQuizzes.length} quiz
          </p>
        </div>
        <button
          onClick={onCreateQuiz}
          className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Quiz</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 inline-flex">
        {[
          { id: 'all', label: 'Tất cả' },
          { id: 'available', label: 'Có thể làm' },
          { id: 'my', label: 'Của tôi' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map(quiz => (
          <div
            key={quiz.id}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {quiz.questions.length} câu hỏi
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {quiz.description}
            </p>

            {/* Source Document */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-500 mb-1">Dựa trên tài liệu:</p>
              <p className="text-sm font-medium text-gray-900 line-clamp-1">
                {quiz.document.title}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>~{quiz.questions.length * 2} phút</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4" />
                  <span>0 lần làm</span>
                </div>
              </div>
            </div>

            {/* Author */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <img
                  src={quiz.author.avatar}
                  alt={quiz.author.fullName}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-gray-600">{quiz.author.fullName}</span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(quiz.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>

            {/* Action */}
            <button
              onClick={() => onQuizSelect(quiz)}
              className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>{quiz.authorId === user?.id ? 'Xem chi tiết' : 'Bắt đầu làm'}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'my' ? 'Bạn chưa tạo quiz nào' : 'Chưa có quiz nào'}
          </h3>
          <p className="text-gray-600 mb-4">
            {filter === 'my' 
              ? 'Hãy tạo quiz đầu tiên từ tài liệu của bạn'
              : 'Hãy tạo quiz mới hoặc đợi có quiz từ đồng nghiệp'
            }
          </p>
          <button
            onClick={onCreateQuiz}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tạo Quiz mới
          </button>
        </div>
      )}
    </div>
  );
};