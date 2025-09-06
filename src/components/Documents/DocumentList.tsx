import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Star, Eye, Edit, Trash2, Lock, Globe, Users } from 'lucide-react';
import { Document, DocumentFilters } from '../../types';
import { documentService } from '../../services/documentService';
import { useAuth } from '../../hooks/useAuth';

interface DocumentListProps {
  onDocumentSelect: (document: Document) => void;
  onDocumentEdit: (document: Document) => void;
  onDocumentDelete: (document: Document) => void;
  onCreateNew: () => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  onDocumentSelect,
  onDocumentEdit,
  onDocumentDelete,
  onCreateNew,
}) => {
  const { user } = useAuth();
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filters, setFilters] = useState<DocumentFilters>({
    search: '',
    tags: [],
    privacy: '',
    dateFrom: '',
    dateTo: '',
    group: '',
    sortBy: 'newest',
  });
  const [showFilters, setShowFilters] = useState(false);

  React.useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await documentService.getDocuments(filters);
        setDocuments(docs);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [filters]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    documents.forEach(doc => doc.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    let result = documents.filter(doc => {
      // Privacy filter
      if (doc.privacy === 'private' && doc.authorId !== user?.id) return false;
      if (doc.privacy === 'group' && doc.author.group !== user?.group) return false;

      // Search filter
      if (filters.search && !doc.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !doc.summary.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Privacy type filter
      if (filters.privacy && doc.privacy !== filters.privacy) return false;

      // Group filter
      if (filters.group && doc.author.group !== filters.group) return false;

      // Tags filter
      if (filters.tags.length > 0 && !filters.tags.some(tag => doc.tags.includes(tag))) {
        return false;
      }

      // Date filters
      if (filters.dateFrom && new Date(doc.createdAt) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(doc.createdAt) > new Date(filters.dateTo)) return false;

      return true;
    });

    // Sort
    switch (filters.sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'rating':
        result.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'views':
        result.sort((a, b) => b.views - a.views);
        break;
      default: // newest
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [filters, user, documents]);

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'public':
        return <Globe className="w-4 h-4 text-green-600" />;
      case 'group':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'private':
        return <Lock className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getPrivacyLabel = (privacy: string) => {
    switch (privacy) {
      case 'public':
        return 'Công khai';
      case 'group':
        return 'Nhóm';
      case 'private':
        return 'Riêng tư';
      default:
        return privacy;
    }
  };

  const handleDeleteDocument = async (document: Document) => {
    try {
      await documentService.deleteDocument(document.id);
      // Refresh documents list
      const docs = await documentService.getDocuments(filters);
      setDocuments(docs);
      // Also call the parent handler
      onDocumentDelete(document);
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Không thể xóa tài liệu. Vui lòng thử lại.');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý tài liệu</h2>
          <p className="text-gray-600 mt-1">
            Tìm thấy {filteredDocuments.length} tài liệu
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo mới</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Tìm kiếm tài liệu..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Bộ lọc</span>
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <select
              value={filters.privacy}
              onChange={(e) => setFilters(prev => ({ ...prev, privacy: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả quyền truy cập</option>
              <option value="public">Công khai</option>
              <option value="group">Nhóm</option>
              <option value="private">Riêng tư</option>
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="rating">Đánh giá cao</option>
              <option value="views">Lượt xem nhiều</option>
            </select>

            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Từ ngày"
            />

            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Đến ngày"
            />

            <button
              onClick={() => setFilters({
                search: '',
                tags: [],
                privacy: '',
                dateFrom: '',
                dateTo: '',
                group: '',
                sortBy: 'newest',
              })}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map(document => (
          <div
            key={document.id}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getPrivacyIcon(document.privacy)}
                <span className="text-sm text-gray-600">{getPrivacyLabel(document.privacy)}</span>
              </div>
              <div className="flex items-center space-x-2">
                {document.authorId === user?.id && (
                  <>
                    <button
                      onClick={() => onDocumentEdit(document)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(document)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            <div
              onClick={() => onDocumentSelect(document)}
              className="cursor-pointer"
            >
              {/* File Type Indicator */}
              {document.fileUrl && (
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    document.fileType === 'pdf' ? 'bg-red-100 text-red-700' :
                    document.fileType === 'doc' ? 'bg-blue-100 text-blue-700' :
                    document.fileType === 'image' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {document.fileType === 'pdf' ? '📄 PDF' :
                     document.fileType === 'doc' ? '📝 DOC' :
                     document.fileType === 'image' ? '🖼️ IMG' : '📎 FILE'}
                  </div>
                  <span className="text-xs text-gray-500">
                    {((document.fileSize || 0) / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>
              )}

              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                {document.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {document.summary}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {document.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
                {document.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{document.tags.length - 3}</span>
                )}
              </div>

              {/* Author and Stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src={document.author.avatar}
                    alt={document.author.fullName}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-gray-600">{document.author.fullName}</span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {document.averageRating > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{document.averageRating}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{document.views}</span>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  {new Date(document.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy tài liệu</h3>
          <p className="text-gray-600 mb-4">
            Hãy thử điều chỉnh bộ lọc hoặc tạo tài liệu mới
          </p>
          <button
            onClick={onCreateNew}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tạo tài liệu mới
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};