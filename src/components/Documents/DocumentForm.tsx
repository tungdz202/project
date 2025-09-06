import React, { useState } from 'react';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { Document } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { documentService } from '../../services/documentService';

interface DocumentFormProps {
  initialDocument?: Document;
  onSave: (document: Partial<Document>) => void;
  onCancel: () => void;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({
  initialDocument,
  onSave,
  onCancel,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: initialDocument?.title || '',
    summary: initialDocument?.summary || '',
    content: initialDocument?.content || '',
    tags: initialDocument?.tags || [],
    privacy: initialDocument?.privacy || 'group',
  });
  const [newTag, setNewTag] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTagAdd = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleTagRemove = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg', 
      'image/png', 
      'image/gif',
      'image/jpg'
    ];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert('Chỉ chấp nhận file PDF, DOC, DOCX hoặc hình ảnh');
      return;
    }

    // Validate file size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 10MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Vui lòng điền đầy đủ tiêu đề và nội dung');
      return;
    }

    setLoading(true);

    try {
      let fileData = null;
      if (file) {
        // Upload file first
        fileData = await documentService.uploadFile(file);
      }

      // Simulate AI tag generation if no tags
      let tags = formData.tags;
      if (tags.length === 0) {
        const commonTags = ['Tài liệu', 'Kiến thức', 'Hướng dẫn'];
        tags = [commonTags[Math.floor(Math.random() * commonTags.length)]];
      }

      const documentData: Partial<Document> = {
        ...formData,
        tags,
        fileUrl: fileData?.url || initialDocument?.fileUrl,
        fileType: fileData?.type as any || initialDocument?.fileType,
        fileSize: fileData?.size || initialDocument?.fileSize,
        updatedAt: new Date().toISOString(),
      };

      if (!initialDocument) {
        documentData.id = Date.now().toString();
        documentData.authorId = user?.id;
        documentData.author = user;
        documentData.ratings = [];
        documentData.comments = [];
        documentData.views = 0;
        documentData.averageRating = 0;
        documentData.createdAt = new Date().toISOString();
        
        // Create new document via API
        await documentService.createDocument(documentData);
      } else {
        // Update existing document via API
        await documentService.updateDocument(initialDocument.id, documentData);
      }

      onSave(documentData);
    } catch (error) {
      alert('Đã xảy ra lỗi khi lưu tài liệu: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAISummary = async () => {
    if (!file) {
      alert('Vui lòng upload file trước khi tạo tóm tắt');
      return;
    }

    setLoading(true);
    try {
      // Call AI summary API
      const summary = await documentService.generateAISummary(file);
      setFormData(prev => ({ ...prev, summary }));
    } catch (error) {
      alert('Không thể tạo tóm tắt tự động: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const getFileType = (mimeType: string): 'pdf' | 'doc' | 'image' => {
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'doc';
    if (mimeType.includes('image')) return 'image';
    return 'doc';
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
            {initialDocument ? 'Chỉnh sửa tài liệu' : 'Tạo tài liệu mới'}
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tiêu đề tài liệu"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mức độ chia sẻ
              </label>
              <select
                value={formData.privacy}
                onChange={(e) => setFormData(prev => ({ ...prev, privacy: e.target.value as any }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="private">Riêng tư - Chỉ tôi xem được</option>
                <option value="group">Nhóm - Thành viên cùng nhóm</option>
                <option value="public">Công khai - Tất cả nhân viên</option>
              </select>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Tóm tắt
              </label>
              {file && (
                <button
                  type="button"
                  onClick={handleGenerateAISummary}
                  disabled={loading}
                  className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                  ) : (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  <span>{loading ? 'Đang tạo...' : 'AI Tóm tắt'}</span>
                </button>
              )}
            </div>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Tóm tắt nội dung tài liệu (tối đa 500 từ) - Có thể sử dụng AI để tự động tạo"
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.summary.length}/500 ký tự
              {file && !formData.summary && (
                <span className="ml-2 text-blue-600">• Có thể sử dụng AI để tạo tóm tắt từ file</span>
              )}
            </p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nội dung <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Nhập nội dung chi tiết của tài liệu"
              rows={10}
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Thẻ (Tags)
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center space-x-2"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập thẻ mới..."
              />
              <button
                type="button"
                onClick={handleTagAdd}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Để trống để hệ thống tự động gán thẻ bằng AI
            </p>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tệp đính kèm
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-2">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto ${
                    file.type.includes('pdf') ? 'bg-red-100' :
                    file.type.includes('word') || file.type.includes('document') ? 'bg-blue-100' :
                    'bg-green-100'
                  }`}>
                    <svg className={`w-8 h-8 ${
                      file.type.includes('pdf') ? 'text-red-600' :
                      file.type.includes('word') || file.type.includes('document') ? 'text-blue-600' :
                      'text-green-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {file.type.includes('pdf') ? 'PDF Document' :
                     file.type.includes('word') || file.type.includes('document') ? 'Word Document' :
                     file.type.includes('image') ? 'Image File' : 'Document'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Xóa file
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">
                    Kéo thả file hoặc{' '}
                    <button
                      type="button"
                      onClick={() => document.getElementById('fileInput')?.click()}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      chọn file
                    </button>
                  </p>
                  <p className="text-xs text-gray-500">
                    Hỗ trợ PDF, DOC, DOCX, JPG, PNG, GIF (tối đa 10MB)
                  </p>
                </div>
              )}
            </div>
            <input
              id="fileInput"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
            {file && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>File đã upload:</strong> {file.name}
                  <br />
                  <span className="text-blue-600">Bạn có thể sử dụng AI để tự động tạo tóm tắt từ file này.</span>
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{initialDocument ? 'Cập nhật' : 'Tạo mới'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};