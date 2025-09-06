import React from 'react';
import { TrendingUp, Star, Clock, FileText, Users, Eye } from 'lucide-react';
import { Document } from '../../types';
import { documentService } from '../../services/documentService';
import { useAuth } from '../../hooks/useAuth';

interface DashboardProps {
  onDocumentSelect: (document: Document) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onDocumentSelect }) => {
  const { user } = useAuth();
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await documentService.getDocuments();
        setDocuments(docs);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const getVisibleDocuments = (documents: Document[]) => {
    return documents.filter(doc => {
      if (doc.privacy === 'public') return true;
      if (doc.privacy === 'private') return doc.authorId === user?.id;
      if (doc.privacy === 'group') return doc.author.group === user?.group;
      return false;
    });
  };

  const visibleDocuments = getVisibleDocuments(documents);
  const recentDocuments = visibleDocuments
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  const popularDocuments = visibleDocuments
    .filter(doc => doc.averageRating > 0)
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 5);
  
  const myDocuments = visibleDocuments
    .filter(doc => doc.authorId === user?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stats = [
    {
      title: 'Tổng tài liệu',
      value: visibleDocuments.length,
      icon: FileText,
      color: 'bg-blue-500',
      trend: '+12%',
    },
    {
      title: 'Lượt xem tuần này',
      value: visibleDocuments.reduce((sum, doc) => sum + doc.views, 0),
      icon: Eye,
      color: 'bg-emerald-500',
      trend: '+23%',
    },
    {
      title: 'Tài liệu của tôi',
      value: myDocuments.length,
      icon: Users,
      color: 'bg-orange-500',
      trend: '+5%',
    },
    {
      title: 'Đánh giá trung bình',
      value: (visibleDocuments.reduce((sum, doc) => sum + doc.averageRating, 0) / visibleDocuments.length || 0).toFixed(1),
      icon: Star,
      color: 'bg-purple-500',
      trend: '+0.3',
    },
  ];

  const DocumentCard: React.FC<{ document: Document; showAuthor?: boolean }> = ({ document, showAuthor = true }) => (
    <div
      key={document.id}
      onClick={() => onDocumentSelect(document)}
      className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {document.title}
        </h4>
        <div className={`px-2 py-1 text-xs rounded-full ${
          document.privacy === 'public' ? 'bg-green-100 text-green-700' :
          document.privacy === 'group' ? 'bg-blue-100 text-blue-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {document.privacy === 'public' ? 'Công khai' :
           document.privacy === 'group' ? 'Nhóm' : 'Riêng tư'}
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{document.summary}</p>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {document.tags.slice(0, 3).map(tag => (
          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        {showAuthor && (
          <div className="flex items-center space-x-2">
            <img src={document.author.avatar} alt={document.author.fullName} className="w-5 h-5 rounded-full" />
            <span>{document.author.fullName}</span>
          </div>
        )}
        <div className="flex items-center space-x-4">
          {document.averageRating > 0 && (
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span>{document.averageRating}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{document.views}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Chào mừng trở lại, {user?.fullName}!</h2>
          <p className="text-blue-100">Đang tải dữ liệu...</p>
        </div>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Chào mừng trở lại, {user?.fullName}!</h2>
        <p className="text-blue-100">Khám phá và chia sẻ kiến thức cùng đội ngũ của bạn</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 font-medium">{stat.trend}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Documents */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Tài liệu mới nhất
            </h3>
          </div>
          <div className="space-y-4">
            {recentDocuments.map(document => (
              <DocumentCard key={document.id} document={document} />
            ))}
            {recentDocuments.length === 0 && (
              <p className="text-gray-500 text-center py-4">Chưa có tài liệu nào</p>
            )}
          </div>
        </div>

        {/* Popular Documents */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
              Tài liệu nổi bật
            </h3>
          </div>
          <div className="space-y-4">
            {popularDocuments.map(document => (
              <DocumentCard key={document.id} document={document} />
            ))}
            {popularDocuments.length === 0 && (
              <p className="text-gray-500 text-center py-4">Chưa có tài liệu nào được đánh giá</p>
            )}
          </div>
        </div>

        {/* My Documents */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-orange-600" />
              Tài liệu của tôi
            </h3>
          </div>
          <div className="space-y-4">
            {myDocuments.map(document => (
              <DocumentCard key={document.id} document={document} showAuthor={false} />
            ))}
            {myDocuments.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Bạn chưa có tài liệu nào
                <br />
                <span className="text-sm">Hãy tạo tài liệu đầu tiên!</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};