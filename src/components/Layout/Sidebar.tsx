import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, FileText, Upload, BookOpen, BarChart3, Settings } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { id: 'dashboard', label: 'Trang chủ', icon: Home, path: '/' },
    { id: 'documents', label: 'Tài liệu', icon: FileText, path: '/documents' },
    { id: 'upload', label: 'Tải lên', icon: Upload, path: '/documents/new' },
    { id: 'quiz', label: 'Quiz', icon: BookOpen, path: '/quiz' },
    { id: 'analytics', label: 'Thống kê', icon: BarChart3, path: '/analytics' },
    { id: 'settings', label: 'Cài đặt', icon: Settings, path: '/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 h-full">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all ${
                    active
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-blue-700' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};