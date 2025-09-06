import React, { useState } from 'react';
import { ArrowLeft, Plus, X, Wand2 } from 'lucide-react';
import { Quiz, Question, Document } from '../../types';
import { documentService } from '../../services/documentService';
import { useAuth } from '../../hooks/useAuth';

interface QuizFormProps {
  quiz?: Quiz;
  sourceDocument?: Document;
  onSave: (quiz: Partial<Quiz>) => void;
  onCancel: () => void;
}

export const QuizForm: React.FC<QuizFormProps> = ({
  quiz,
  sourceDocument,
  onSave,
  onCancel,
}) => {
  const { user } = useAuth();
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [loadingDocuments, setLoadingDocuments] = React.useState(true);
  const [formData, setFormData] = useState({
    title: quiz?.title || '',
    description: quiz?.description || '',
    documentId: quiz?.documentId || sourceDocument?.id || '',
  });
  const [questions, setQuestions] = useState<Question[]>(quiz?.questions || []);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await documentService.getDocuments();
        setDocuments(docs);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoadingDocuments(false);
      }
    };

    fetchDocuments();
  }, []);

  const availableDocuments = documents.filter(doc => {
    if (doc.privacy === 'private') return doc.authorId === user?.id;
    if (doc.privacy === 'group') return doc.author.group === user?.group;
    return true;
  });

  const selectedDocument = availableDocuments.find(doc => doc.id === formData.documentId);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      content: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const generateWithAI = async () => {
    if (!selectedDocument) return;

    setLoading(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiQuestions: Question[] = [
        {
          id: '1',
          content: `Điểm chính của tài liệu "${selectedDocument.title}" là gì?`,
          options: [
            'Thông tin cơ bản về chủ đề',
            'Hướng dẫn chi tiết thực hiện',
            'Tham khảo từ các nguồn khác',
            'Kết luận và đánh giá'
          ],
          correctAnswer: 0,
          explanation: 'Dựa trên phân tích nội dung tài liệu bằng AI',
        },
        {
          id: '2',
          content: `Theo tài liệu, điều quan trọng nhất cần lưu ý là gì?`,
          options: [
            'Tuân thủ quy trình',
            'Hiểu rõ nguyên lý',
            'Thực hành thường xuyên',
            'Tất cả các đáp án trên'
          ],
          correctAnswer: 3,
          explanation: 'Tài liệu nhấn mạnh tầm quan trọng của việc kết hợp tất cả các yếu tố',
        }
      ];

      setQuestions(aiQuestions);
      setFormData(prev => ({
        ...prev,
        title: prev.title || `Quiz: ${selectedDocument.title}`,
        description: prev.description || `Kiểm tra kiến thức dựa trên tài liệu "${selectedDocument.title}"`,
      }));
    } catch (error) {
      alert('Không thể tạo quiz tự động. Vui lòng tạo thủ công.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.documentId || questions.length === 0) {
      alert('Vui lòng điền đầy đủ thông tin và tạo ít nhất 1 câu hỏi');
      return;
    }

    const invalidQuestions = questions.some(q => 
      !q.content.trim() || 
      q.options.some(opt => !opt.trim())
    );

    if (invalidQuestions) {
      alert('Vui lòng điền đầy đủ nội dung cho tất cả câu hỏi và đáp án');
      return;
    }

    const quizData: Partial<Quiz> = {
      ...formData,
      questions,
      document: selectedDocument!,
      authorId: user?.id,
      author: user!,
      createdAt: new Date().toISOString(),
    };

    if (!quiz) {
      quizData.id = Date.now().toString();
    }

    onSave(quizData);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {quiz ? 'Chỉnh sửa Quiz' : 'Tạo Quiz mới'}
          </h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tiêu đề Quiz <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tiêu đề quiz"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tài liệu nguồn <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.documentId}
                onChange={(e) => setFormData(prev => ({ ...prev, documentId: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={!!sourceDocument}
              >
                {loadingDocuments ? (
                  <option value="">Đang tải tài liệu...</option>
                ) : (
                  <>
                    <option value="">Chọn tài liệu</option>
                    {availableDocuments.map(doc => (
                      <option key={doc.id} value={doc.id}>
                        {doc.title}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mô tả Quiz
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Mô tả ngắn gọn về quiz này"
              rows={3}
            />
          </div>

          {/* AI Generation */}
          {selectedDocument && questions.length === 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Tạo câu hỏi tự động với AI</h3>
                  <p className="text-sm text-gray-600">
                    Hệ thống sẽ phân tích nội dung tài liệu và tạo câu hỏi phù hợp
                  </p>
                </div>
                <button
                  type="button"
                  onClick={generateWithAI}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                  <span>{loading ? 'Đang tạo...' : 'Tạo với AI'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Questions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Câu hỏi ({questions.length})
            </h2>
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm câu hỏi</span>
            </button>
          </div>

          <div className="space-y-6">
            {questions.map((question, questionIndex) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                {/* Question Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">
                    Câu hỏi {questionIndex + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Question Content */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung câu hỏi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={question.content}
                    onChange={(e) => updateQuestion(questionIndex, 'content', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Nhập câu hỏi..."
                    rows={2}
                    required
                  />
                </div>

                {/* Options */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đáp án <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name={`correct-${questionIndex}`}
                          checked={question.correctAnswer === optionIndex}
                          onChange={() => updateQuestion(questionIndex, 'correctAnswer', optionIndex)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Đáp án ${optionIndex + 1}`}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giải thích (tùy chọn)
                  </label>
                  <textarea
                    value={question.explanation}
                    onChange={(e) => updateQuestion(questionIndex, 'explanation', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Giải thích tại sao đáp án này đúng..."
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>

          {questions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Chưa có câu hỏi nào. Hãy thêm câu hỏi đầu tiên!</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all"
          >
            {quiz ? 'Cập nhật Quiz' : 'Tạo Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
};