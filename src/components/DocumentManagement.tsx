import React, { useState } from 'react';
import { useEffect } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, FileText, Lock, Users, Calendar } from 'lucide-react';
import { documentAPI } from '../services/api';

const DocumentManagement: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorTypeFilter, setErrorTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    errorType: '',
    content: '',
    priority: 'medium',
    createdBy: 'Current User',
    viewPermissions: ['all'] as string[]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const documentsData = await documentAPI.getAll();
      setDocuments(documentsData);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };

  const permissionLabels = {
    all: 'Tất cả',
    senior: 'Senior+',
    lead: 'Team Lead+'
  };

  const filteredDocuments = documents.filter(document => {
    const matchesSearch = document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.errorType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesErrorType = errorTypeFilter === 'all' || document.errorType === errorTypeFilter;
    const matchesPriority = priorityFilter === 'all' || document.priority === priorityFilter;
    
    return matchesSearch && matchesErrorType && matchesPriority;
  });

  const handleCreate = async () => {
    try {
      await documentAPI.create(formData);
      await fetchData(); // Refresh data
      setFormData({ 
        title: '', 
        errorType: '', 
        content: '', 
        priority: 'medium',
        createdBy: 'Current User',
        viewPermissions: ['all'] 
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  const handleEdit = async () => {
    if (!selectedDocument) return;
    
    try {
      await documentAPI.update(selectedDocument.id, formData);
      await fetchData(); // Refresh data
      setShowEditForm(false);
      setSelectedDocument(null);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
      try {
        await documentAPI.delete(id);
        await fetchData(); // Refresh data
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const FormModal = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">
          {isEdit ? 'Chỉnh Sửa Tài Liệu' : 'Tạo Tài Liệu Mới'}
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tiêu Đề</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Nhập tiêu đề tài liệu..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Loại Lỗi</label>
              <select
                value={formData.errorType}
                onChange={(e) => setFormData({ ...formData, errorType: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Chọn loại lỗi</option>
                <option value="Authentication">Authentication</option>
                <option value="Database">Database</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Email">Email</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mức Độ Ưu Tiên</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="low">Thấp</option>
                <option value="medium">Trung Bình</option>
                <option value="high">Cao</option>
                <option value="critical">Nghiêm Trọng</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Quyền Xem</label>
            <div className="space-y-3">
              {Object.entries(permissionLabels).map(([key, label]) => (
                <label key={key} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.viewPermissions.includes(key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ 
                          ...formData, 
                          viewPermissions: [...formData.viewPermissions, key] 
                        });
                      } else {
                        setFormData({ 
                          ...formData, 
                          viewPermissions: formData.viewPermissions.filter(p => p !== key) 
                        });
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nội Dung Hướng Dẫn</label>
            <textarea
              rows={12}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none font-mono text-sm"
              placeholder="Nhập nội dung hướng dẫn chi tiết (hỗ trợ Markdown)..."
            />
            <p className="text-xs text-slate-500 mt-2">Hỗ trợ Markdown formatting</p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={() => {
              setShowCreateForm(false);
              setShowEditForm(false);
              setFormData({ title: '', errorType: '', content: '', priority: 'medium', createdBy: 'Current User', viewPermissions: ['all'] });
            }}
            className="px-6 py-3 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={isEdit ? handleEdit : handleCreate}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            {isEdit ? 'Cập Nhật' : 'Tạo Tài Liệu'}
          </button>
        </div>
      </div>
    </div>
  );

  const DetailModal = () => {
    if (!selectedDocument) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{selectedDocument.title}</h3>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[selectedDocument.priority]}`}>
                  {selectedDocument.priority}
                </span>
                <div className="flex items-center space-x-1 text-sm text-slate-600">
                  <Lock className="w-4 h-4" />
                  <span>{selectedDocument.viewPermissions.map(p => permissionLabels[p as keyof typeof permissionLabels]).join(', ')}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(selectedDocument.updatedAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowDetailModal(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors ml-4"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="bg-slate-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Nội Dung Hướng Dẫn</h4>
                <div className="prose prose-slate max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed">
                    {selectedDocument.content}
                  </pre>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Thông Tin</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">Mã:</span>
                    <span className="ml-2 font-mono text-blue-900">{selectedDocument.documentId}</span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Loại Lỗi:</span>
                    <span className="ml-2 text-blue-900">{selectedDocument.errorType}</span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Tác Giả:</span>
                    <span className="ml-2 text-blue-900">{selectedDocument.createdBy}</span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Ngày Tạo:</span>
                    <span className="ml-2 text-blue-900">
                      {new Date(selectedDocument.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-4">
                <h4 className="font-semibold text-amber-900 mb-3">Hướng Dẫn Sử Dụng</h4>
                <ul className="text-sm text-amber-800 space-y-2">
                  <li>• Đọc kỹ từng bước xử lý</li>
                  <li>• Kiểm tra các điều kiện tiên quyết</li>
                  <li>• Test trên môi trường dev trước</li>
                  <li>• Ghi lại kết quả xử lý</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Quản Lý Tài Liệu Hướng Dẫn</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Tạo Tài Liệu Mới</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={errorTypeFilter}
                onChange={(e) => setErrorTypeFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả loại lỗi</option>
                <option value="Authentication">Authentication</option>
                <option value="Database">Database</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Email">Email</option>
              </select>
            </div>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả mức độ</option>
              <option value="low">Thấp</option>
              <option value="medium">Trung bình</option>
              <option value="high">Cao</option>
              <option value="critical">Nghiêm trọng</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <div key={document.documentId} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{document.title}</h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                      {document.errorType}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[document.priority]}`}>
                      {document.priority}
                    </span>
                  </div>
                </div>
                <FileText className="w-6 h-6 text-blue-500 flex-shrink-0" />
              </div>
              
              <div className="text-sm text-slate-600 mb-4 line-clamp-3">
                {document.content.substring(0, 100)}...
              </div>
              
              <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{document.viewPermissions.map(p => permissionLabels[p as keyof typeof permissionLabels]).join(', ')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(document.updatedAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Bởi: {document.createdBy}
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => {
                      setSelectedDocument(document);
                      setShowDetailModal(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDocument(document);
                      setFormData({
                        title: document.title,
                        errorType: document.errorType,
                        content: document.content,
                        priority: document.priority,
                        createdBy: document.createdBy,
                        viewPermissions: document.viewPermissions
                      });
                      setShowEditForm(true);
                    }}
                    className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(document.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">Không tìm thấy tài liệu nào phù hợp với tiêu chí tìm kiếm.</p>
          </div>
        )}
      </div>

      {showCreateForm && <FormModal />}
      {showEditForm && <FormModal isEdit />}
      {showDetailModal && <DetailModal />}
    </div>
  );
};

export default DocumentManagement;