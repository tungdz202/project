import React, { useState } from 'react';
import { ArrowLeft, Star, Eye, MessageCircle, Share, Download, Edit, Trash2, Globe, Users, Lock } from 'lucide-react';
import { Document, Comment, Rating } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { documentService } from '../../services/documentService';

interface DocumentDetailProps {
  document: Document;
  onBack: () => void;
  onEdit: (document: Document) => void;
  onDelete: (document: Document) => void;
  onCreateQuiz: (document: Document) => void;
}

export const DocumentDetail: React.FC<DocumentDetailProps> = ({
  document,
  onBack,
  onEdit,
  onDelete,
  onCreateQuiz,
}) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [comments, setComments] = useState<Comment[]>(document.comments);
  const [ratings, setRatings] = useState<Rating[]>(document.ratings);
  const [loading, setLoading] = useState(false);

  const isOwner = document.authorId === user?.id;
  const existingRating = ratings.find(r => r.userId === user?.id);

  const handleRating = async (rating: number) => {
    if (!user) return;

    setLoading(true);
    try {
      await documentService.rateDocument(document.id, rating);

      const newRating: Rating = {
        id: Date.now().toString(),
        userId: user.id,
        user,
        documentId: document.id,
        rating,
        createdAt: new Date().toISOString(),
      };

      if (existingRating) {
        setRatings(ratings.map(r => r.id === existingRating.id ? newRating : r));
      } else {
        setRatings([...ratings, newRating]);
      }
      setUserRating(rating);
    } catch (error) {
      console.error('Error rating document:', error);
      alert('Không thể đánh giá tài liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim() || !user) return;

    setLoading(true);
    try {
      await documentService.commentDocument(document.id, newComment);

      const comment: Comment = {
        id: Date.now().toString(),
        userId: user.id,
        user,
        documentId: document.id,
        content: newComment,
        createdAt: new Date().toISOString(),
      };

      setComments([...comments, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Không thể thêm bình luận. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
    : 0;

  const getPrivacyInfo = () => {
    switch (document.privacy) {
      case 'public':
        return { icon: Globe, text: 'Công khai', color: 'text-green-600 bg-green-50' };
      case 'group':
        return { icon: Users, text: 'Nhóm', color: 'text-blue-600 bg-blue-50' };
      case 'private':
        return { icon: Lock, text: 'Riêng tư', color: 'text-gray-600 bg-gray-50' };
      default:
        return { icon: Globe, text: 'Công khai', color: 'text-green-600 bg-green-50' };
    }
  };

  const privacyInfo = getPrivacyInfo();
  const PrivacyIcon = privacyInfo.icon;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>
        
        <div className="flex items-center space-x-2">
          {isOwner && (
            <>
              <button
                onClick={() => onEdit(document)}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Chỉnh sửa</span>
              </button>
              <button
                onClick={() => onDelete(document)}
                className="px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 flex items-center space-x-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa</span>
              </button>
            </>
          )}
          <button
            onClick={() => onCreateQuiz(document)}
            className="px-3 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all"
          >
            Tạo Quiz
          </button>
        </div>
      </div>

      {/* Document Content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Header Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{document.title}</h1>
              <p className="text-gray-600 text-lg">{document.summary}</p>
            </div>
            <div className={`px-3 py-1 rounded-full flex items-center space-x-2 ${privacyInfo.color}`}>
              <PrivacyIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{privacyInfo.text}</span>
            </div>
          </div>

          {/* Author and Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={document.author.avatar}
                alt={document.author.fullName}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900">{document.author.fullName}</p>
                <p className="text-sm text-gray-600">{document.author.group} • {new Date(document.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{averageRating.toFixed(1)} ({ratings.length})</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{document.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{comments.length}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {document.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* File Preview */}
        {document.fileUrl && (
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Xem trước tài liệu</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {document.fileType === 'image' ? (
                <img
                  src={document.fileUrl}
                  alt={document.title}
                  className="max-w-full h-auto rounded-lg mx-auto"
                />
              ) : document.fileType === 'pdf' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="text-gray-900 font-medium mb-2">{document.title}.pdf</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Kích thước: {((document.fileSize || 0) / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <div className="space-y-2">
                    <button 
                      onClick={() => window.open(document.fileUrl, '_blank')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mr-2"
                    >
                      Xem PDF
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Tải xuống
                    </button>
                  </div>
                </div>
              ) : document.fileType === 'doc' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-gray-900 font-medium mb-2">{document.title}.{document.fileUrl?.includes('.docx') ? 'docx' : 'doc'}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Kích thước: {((document.fileSize || 0) / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 mb-4">
                      Tài liệu Word - Tải xuống để xem nội dung đầy đủ
                    </p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Tải xuống
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-gray-900 font-medium mb-2">{document.title}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Kích thước: {((document.fileSize || 0) / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Tải xuống
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Nội dung</h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {document.content}
            </p>
          </div>
        </div>

        {/* Rating Section */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Đánh giá</h3>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-sm text-gray-600">Đánh giá của bạn:</span>
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRating(rating)}
                className="transition-colors"
              >
                <Star
                  className={`w-6 h-6 ${
                    rating <= (existingRating?.rating || userRating)
                      ? 'text-yellow-500 fill-current'
                      : 'text-gray-300'
                  } hover:text-yellow-400`}
                />
              </button>
            ))}
          </div>
          
          {ratings.length > 0 && (
            <div className="space-y-3">
              {ratings.map((rating) => (
                <div key={rating.id} className="flex items-center space-x-3">
                  <img
                    src={rating.user.avatar}
                    alt={rating.user.fullName}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{rating.user.fullName}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= rating.rating
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(rating.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Bình luận ({comments.length})</h3>
          
          {/* Add Comment */}
          <div className="mb-6">
            <div className="flex space-x-3">
              <img
                src={user?.avatar}
                alt={user?.fullName}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Thêm bình luận..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={handleComment}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    {loading && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    <span>Gửi bình luận</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <img
                  src={comment.user.avatar}
                  alt={comment.user.fullName}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">{comment.user.fullName}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {comments.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};