import React from 'react';
import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { incidentAPI, developerAPI } from '../services/api';

const Dashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<Record<string, number>>({});
  const [incidents, setIncidents] = useState<any[]>([]);
  const [developers, setDevelopers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, incidentsData, developersData] = await Promise.all([
          incidentAPI.getStatistics(),
          incidentAPI.getAll(),
          developerAPI.getAll()
        ]);
        
        setStatistics(statsData);
        setIncidents(incidentsData);
        setDevelopers(developersData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalIncidents = statistics.total || 0;
  const inProgressIncidents = statistics.inProgress || 0;
  const resolvedIncidents = statistics.resolved || 0;
  const overdueIncidents = statistics.overdue || 0;

  const priorityStats = {
    critical: statistics.critical || 0,
    high: statistics.high || 0,
    medium: statistics.medium || 0,
    low: statistics.low || 0
  };

  const StatusCard = ({ title, value, icon: Icon, color, bgColor }: {
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
    bgColor: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const PriorityChart = () => {
    const total = Object.values(priorityStats).reduce((sum, val) => sum + val, 0);
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Sự Cố Theo Mức Độ Nghiêm Trọng</h3>
        <div className="space-y-4">
          {Object.entries(priorityStats).map(([priority, count]) => {
            const percentage = total > 0 ? (count / total) * 100 : 0;
            const colors = {
              critical: 'bg-red-500',
              high: 'bg-orange-500',
              medium: 'bg-yellow-500',
              low: 'bg-green-500'
            };
            const labels = {
              critical: 'Nghiêm Trọng',
              high: 'Cao',
              medium: 'Trung Bình',
              low: 'Thấp'
            };
            
            return (
              <div key={priority} className="flex items-center space-x-3">
                <div className="w-16 text-sm font-medium text-slate-600">
                  {labels[priority as keyof typeof labels]}
                </div>
                <div className="flex-1 bg-slate-100 rounded-full h-6 relative overflow-hidden">
                  <div
                    className={`h-full ${colors[priority as keyof typeof colors]} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-700">
                    {count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const TopDevelopers = () => {
    const sortedDevs = [...developers].sort((a, b) => b.totalResolved - a.totalResolved).slice(0, 5);
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Dev Xử Lý Nhiều Nhất</h3>
        <div className="space-y-3">
          {sortedDevs.map((dev, index) => (
            <div key={dev.id} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{dev.name}</p>
                <p className="text-sm text-slate-600">{dev.activeIncidents} đang xử lý • {dev.totalResolved} đã xử lý</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const OverdueAlert = () => {
    const overdueList = incidents.filter(i => new Date(i.dueDate) < new Date() && i.status !== 'resolved');
    
    if (overdueList.length === 0) return null;

    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">Cảnh Báo: Sự Cố Quá Hạn</h3>
        </div>
        <div className="space-y-2">
          {overdueList.slice(0, 3).map(incident => (
            <div key={incident.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
              <span className="text-sm font-mono text-slate-600">{incident.incidentId}</span>
              <span className="flex-1 text-sm text-slate-900">{incident.title}</span>
              <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                Quá hạn {Math.ceil((new Date().getTime() - new Date(incident.dueDate).getTime()) / (1000 * 60 * 60 * 24))} ngày
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Dashboard Tổng Quan</h2>
        <div className="text-sm text-slate-600">
          Cập nhật lúc: {new Date().toLocaleString('vi-VN')}
        </div>
      </div>

      <OverdueAlert />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard
          title="Tổng Sự Cố"
          value={totalIncidents}
          icon={AlertTriangle}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <StatusCard
          title="Đang Xử Lý"
          value={inProgressIncidents}
          icon={Clock}
          color="text-orange-600"
          bgColor="bg-orange-100"
        />
        <StatusCard
          title="Đã Xử Lý"
          value={resolvedIncidents}
          icon={CheckCircle}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <StatusCard
          title="Quá Hạn"
          value={overdueIncidents}
          icon={AlertCircle}
          color="text-red-600"
          bgColor="bg-red-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriorityChart />
        <TopDevelopers />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Phân Bổ Theo Dev</h3>
        <div className="space-y-3">
          {developers.map(dev => {
            const maxIncidents = Math.max(...developers.map(d => d.activeIncidents || 0));
            const percentage = maxIncidents > 0 ? (dev.activeIncidents / maxIncidents) * 100 : 0;
            
            return (
              <div key={dev.id} className="flex items-center space-x-4">
                <div className="w-32 text-sm font-medium text-slate-700 truncate">
                  {dev.name}
                </div>
                <div className="flex-1 bg-slate-100 rounded-full h-6 relative overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-700">
                    {dev.activeIncidents || 0} sự cố
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;