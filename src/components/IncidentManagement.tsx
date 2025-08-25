import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, AlertTriangle, Clock, CheckCircle, XCircle, Bot, Lightbulb } from 'lucide-react';
import { AIAdvice } from '../types/types';
import { incidentAPI, developerAPI, documentAPI } from '../services/api';

interface IncidentManagementProps {
  onNavigateToDocument?: (documentId: string) => void;
}

const IncidentManagement: React.FC<IncidentManagementProps> = ({ onNavigateToDocument }) => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [developers, setDevelopers] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [aiAdvice, setAiAdvice] = useState<AIAdvice | null>(null);
  const [showAiAdvice, setShowAiAdvice] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    errorType: '',
    assignedDev: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [incidentsData, developersData, documentsData] = await Promise.all([
        incidentAPI.getAll(),
        developerAPI.getAll(),
        documentAPI.getAll()
      ]);

      setIncidents(incidentsData);
      setDevelopers(developersData);
      setDocuments(documentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };

  const statusIcons = {
    new: AlertTriangle,
    'in-progress': Clock,
    resolved: CheckCircle,
    closed: XCircle
  };

  const generateAiAdvice = (incident: any): AIAdvice => {
    const relatedDocs = documents
      .filter(doc => doc.errorType === incident.errorType)
      .slice(0, 2)
      .map(doc => doc.documentId);

    const suggestions = {
      Authentication: 'Kiểm tra token expiration và refresh token mechanism. Verify database user credentials và session management.',
      Database: 'Monitor connection pool status. Thực hiện query optimization và check for missing indexes. Consider caching frequently accessed data.',
      Frontend: 'Test responsive design trên multiple devices. Kiểm tra CSS media queries và JavaScript errors in console.',
      Backend: 'Profile API endpoints để identify bottlenecks. Implement proper error handling và logging.',
      Email: 'Check SMTP configuration và email templates. Verify email queue processing và delivery status.'
    };

    return {
      suggestion: suggestions[incident.errorType as keyof typeof suggestions] || 'Phân tích log files và reproduce issue trong development environment.',
      confidence: Math.floor(Math.random() * 30) + 70, // 70-99%
      relatedDocs
    };
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.incidentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || incident.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreate = async () => {
    try {
      const newIncident = {
        ...formData,
        status: 'new'
      };

      await incidentAPI.create(newIncident);
      await fetchData(); // Refresh data
      setFormData({ title: '', description: '', priority: 'medium', errorType: '', assignedDev: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating incident:', error);
    }
  };

  const handleEdit = async () => {
    if (!selectedIncident) return;

    try {
      await incidentAPI.update(selectedIncident.id, formData);
      await fetchData(); // Refresh data
      setShowEditForm(false);
      setSelectedIncident(null);
    } catch (error) {
      console.error('Error updating incident:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa sự cố này?')) {
      try {
        await incidentAPI.delete(id);
        await fetchData(); // Refresh data
      } catch (error) {
        console.error('Error deleting incident:', error);
      }
    }
  };

  const handleGetAiAdvice = async (incident: any) => {
    try {
      setSelectedIncident(incident);
      const advice = await incidentAPI.getAIAdvice(incident.id);
      setAiAdvice(advice);
      setShowAiAdvice(true);
    } catch (error) {
      console.error('Error getting AI advice:', error);
      // Fallback to mock data
      setSelectedIncident(incident);
      setAiAdvice(generateAiAdvice(incident));
      setShowAiAdvice(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleCreateOld = () => {
    const newIncident: any = {
      incidentId: `INC${String(incidents.length + 1).padStart(3, '0')}`,
      ...formData,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    };

    setIncidents([...incidents, newIncident]);
    setFormData({ title: '', description: '', priority: 'medium', errorType: '', assignedDev: '' });
    setShowCreateForm(false);
  };

  const handleEditOld = () => {
    if (!selectedIncident) return;

    const updatedIncidents = incidents.map(inc =>
      inc.incidentId === selectedIncident.incidentId
        ? { ...selectedIncident, ...formData, updatedAt: new Date().toISOString() }
        : inc
    );

    setIncidents(updatedIncidents);
    setShowEditForm(false);
    setSelectedIncident(null);
  };

  const FormModal = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">
          {isEdit ? 'Chỉnh Sửa Sự Cố' : 'Tạo Sự Cố Mới'}
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tiêu Đề</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Nhập tiêu đề sự cố..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Mô Tả Chi Tiết</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Mô tả chi tiết về sự cố..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Dev Phụ Trách</label>
            <select
              value={formData.assignedDev}
              onChange={(e) => setFormData({ ...formData, assignedDev: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Chọn dev</option>
              {developers.map(dev => (
                <option key={dev.id} value={dev.id}>{dev.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={() => {
              setShowCreateForm(false);
              setShowEditForm(false);
              setFormData({ title: '', description: '', priority: 'medium', errorType: '', assignedDev: '' });
            }}
            className="px-6 py-3 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={isEdit ? handleEdit : handleCreate}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            {isEdit ? 'Cập Nhật' : 'Tạo Sự Cố'}
          </button>
        </div>
      </div>
    </div>
  );

  const DetailModal = () => {
    if (!selectedIncident) return null;

    const StatusIcon = statusIcons[selectedIncident.status];
    const assignedDev = selectedIncident.assignedDevInfo;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedIncident.title}</h3>
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedIncident.status]}`}>
                  <StatusIcon className="w-4 h-4" />
                  <span className="capitalize">{selectedIncident.status}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[selectedIncident.priority]}`}>
                  {selectedIncident.priority}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowDetailModal(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-3">Mô Tả Chi Tiết</h4>
                <p className="text-slate-600 leading-relaxed">{selectedIncident.description}</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-3">Thông Tin Kỹ Thuật</h4>
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700">Loại Lỗi:</span>
                    <span className="text-slate-900">{selectedIncident.errorType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700">Mã Sự Cố:</span>
                    <span className="font-mono text-slate-900">{selectedIncident.incidentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700">Ngày Tạo:</span>
                    <span className="text-slate-900">{new Date(selectedIncident.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700">Cập Nhật Cuối:</span>
                    <span className="text-slate-900">{new Date(selectedIncident.updatedAt).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-3">Dev Phụ Trách</h4>
                {assignedDev && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="font-medium text-blue-900">{assignedDev.name}</p>
                    <p className="text-sm text-blue-600">{assignedDev.email}</p>
                    <div className="mt-2 text-xs text-blue-600">
                      {assignedDev.activeIncidents} đang xử lý • {assignedDev.totalResolved} đã xử lý
                    </div>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => handleGetAiAdvice(selectedIncident)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  <Bot className="w-5 h-5" />
                  <span>Nhận Gợi Ý AI</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AiAdviceModal = () => {
    if (!aiAdvice || !selectedIncident) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl">
              <Lightbulb className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Gợi Ý AI</h3>
              <p className="text-slate-600">Cho sự cố: {selectedIncident.title}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-slate-900">Đề Xuất Giải Pháp</h4>
                <span className="text-sm bg-white px-3 py-1 rounded-full text-slate-600">
                  Độ tin cậy: {aiAdvice.confidence}%
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">{aiAdvice.suggestion}</p>
            </div>

            {aiAdvice.relatedDocs.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-4">Tài Liệu Liên Quan</h4>
                <div className="space-y-3">
                  {aiAdvice.relatedDocs.map(docId => {
                    const doc = documents.find(d => d.documentId === docId);
                    return doc ? (
                      <div
                        key={doc.documentId}
                        className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                        onClick={() => {
                          console.log('Clicked on document:', doc.documentId); // Debug log
                          if (onNavigateToDocument) {
                            console.log('Calling onNavigateToDocument'); // Debug log
                            onNavigateToDocument(doc.documentId);
                          } else {
                            console.log('onNavigateToDocument is not available'); // Debug log
                          }
                          setShowAiAdvice(false);
                        }}
                      >
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <div className="w-5 h-5 text-blue-600">📄</div>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{doc.title}</p>
                          <p className="text-sm text-slate-600">Loại: {doc.errorType}</p>
                          <p className="text-xs text-blue-600 mt-1">Click để xem chi tiết →</p>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end mt-8">
            <button
              onClick={() => setShowAiAdvice(false)}
              className="px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Quản Lý Sự Cố</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Tạo Sự Cố Mới</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sự cố..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="new">Mới</option>
                <option value="in-progress">Đang xử lý</option>
                <option value="resolved">Đã xử lý</option>
                <option value="closed">Đã đóng</option>
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Mã Sự Cố</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Tiêu Đề</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Trạng Thái</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Mức Độ</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Dev</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Ngày Tạo</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredIncidents.map((incident) => {
                const StatusIcon = statusIcons[incident.status];
                const assignedDev = incident.assignedDevInfo;
                
                return (
                  <tr key={incident.incidentId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-slate-900">{incident.incidentId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 truncate max-w-xs">{incident.title}</p>
                      <p className="text-sm text-slate-600">{incident.errorType}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium w-fit ${statusColors[incident.status]}`}>
                        <StatusIcon className="w-4 h-4" />
                        <span className="capitalize">{incident.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[incident.priority]}`}>
                        {incident.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-900">{assignedDev?.name || 'Chưa gán'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {new Date(incident.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedIncident(incident);
                            setShowDetailModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedIncident(incident);
                            setFormData({
                              title: incident.title,
                              description: incident.description,
                              priority: incident.priority,
                              errorType: incident.errorType,
                              assignedDev: incident.assignedDev || ''
                            });
                            setShowEditForm(true);
                          }}
                          className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(incident.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleGetAiAdvice(incident)}
                          className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                          title="AI Gợi ý"
                        >
                          <Bot className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredIncidents.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">Không tìm thấy sự cố nào phù hợp với tiêu chí tìm kiếm.</p>
          </div>
        )}
      </div>

      {showCreateForm && <FormModal />}
      {showEditForm && <FormModal isEdit />}
      {showDetailModal && <DetailModal />}
      {showAiAdvice && <AiAdviceModal />}
    </div>
  );
};

export default IncidentManagement;