import React, { useState } from 'react';
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  Users,
  Target,
  Calendar,
  Filter,
  Save,
  Bot,
  Search
} from 'lucide-react';
import { useApi, api } from '../hooks/useApi';
import {FilterSearch, FilterState} from '../types';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'red';
  loading?: boolean;
}



function KPICard({ title, value, change, trend, icon, color, loading }: KPICardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="w-24 h-8 bg-gray-200 rounded mb-2"></div>
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600 bg-blue-50',
    green: 'bg-emerald-500 text-emerald-600 bg-emerald-50',
    orange: 'bg-amber-500 text-amber-600 bg-amber-50',
    red: 'bg-red-500 text-red-600 bg-red-50'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${colorClasses[color].split(' ')[2]} rounded-lg flex items-center justify-center`}>
          <div className={`${colorClasses[color].split(' ')[1]}`}>
            {icon}
          </div>
        </div>
        {change && (
          <div className={`flex items-center text-sm font-medium ${
            trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
            {change}
          </div>
        )}
      </div>
      <div className="mb-2">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600">{title}</div>
      </div>
    </div>
  );
}

function WorkloadChart() {
  const { data: developers, loading } = useApi(api.getDevelopers);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="w-32 h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="w-24 h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="w-full h-2 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Workload</h3>
      <div className="space-y-4">
        {developers?.map((dev) => {
          const utilizationPercent = (dev.workloadHours / dev.maxCapacity) * 100;
          const isOverloaded = utilizationPercent > 100;
          
          return (
            <div key={dev.id} className="group cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://img.freepik.com/premium-vector/user-icon-icon_1076610-59410.jpg?w=150"
                    alt={dev.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{dev.name}</div>
                    {/*<div className="text-sm text-gray-600">{dev.team} • {dev.role}</div>*/}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {dev.workloadHours}h / {dev.maxCapacity}h
                  </div>
                  <div className={`text-xs ${isOverloaded ? 'text-red-600' : 'text-gray-600'}`}>
                    {utilizationPercent.toFixed(0)}% utilized
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    isOverloaded 
                      ? 'bg-red-500' 
                      : utilizationPercent > 80 
                      ? 'bg-amber-500' 
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                />
              </div>
              {isOverloaded && (
                <div className="mt-1 text-xs text-red-600 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Overloaded by {(utilizationPercent - 100).toFixed(0)}%
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProjectProgress() {
  const { data: projects, loading } = useApi(api.getProjects);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="w-32 h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
                <div className="w-20 h-4 bg-gray-200 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Progress</h3>
      <div className="grid grid-cols-2 gap-4">
        {projects?.map((project) => (
          <div key={project.id} className="text-center cursor-pointer group">
            <div className="relative w-16 h-16 mx-auto mb-2">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`transition-all ${
                    project.riskLevel === 'HIGH' ? 'text-red-500' : 
                    project.riskLevel === 'MEDIUM' ? 'text-amber-500' : 'text-emerald-500'
                  }`}
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="transparent"
                  strokeDasharray={`${project.progress}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">{project.progress}%</span>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
              {project.name}
            </div>
            <div className="text-xs text-gray-600">{project.client}</div>
            {project.riskLevel !== 'LOW' && (
              <div className={`inline-flex items-center px-2 py-1 mt-1 text-xs rounded-full ${
                project.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
              }`}>
                <AlertTriangle className="w-3 h-3 mr-1" />
                Risk: {project.riskLevel}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


function QuickFilters({ filters, setFilters, onSearch }: {
  filters: FilterSearch;
  setFilters: React.Dispatch<React.SetStateAction<FilterSearch>>;
  onSearch: () => void;
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4 flex-wrap">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Quick Filters:</span>
          </div>
          
          <select
              value={filters.project || ""}
              onChange={(e) => setFilters(f => ({ ...f, project: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Projects</option>
            <option value="21">Hệ thống Quản lý Doanh nghiệp</option>
            <option value="14">Mobile Banking App</option>
            {/*<option value="11">Data Analytics Dashboard</option>*/}
          </select>
          <select
              value={filters.status || ""}
              onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Status</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <select className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Time</option>
            <option value="week">This Week</option>
            <option value="quarter">This Quarter</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        <button
            onClick={onSearch}
            className="flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
        >
          <Search className="w-4 h-4 mr-1" />
          Search
        </button>
      </div>
    </div>
  );
}

function AIInsights() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Workload Rebalancing Needed</h4>
              <p className="text-sm text-gray-600 mb-2">
                Marcus Rodriguez is 12% overloaded. Consider redistributing 2 backend tasks to available team members.
              </p>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View Suggestions →
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Risk Alert: Mobile Banking App</h4>
              <p className="text-sm text-gray-600 mb-2">
                Project timeline at risk due to security audit delays. Recommend additional resources or scope adjustment.
              </p>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                See Details →
              </button>
            </div>
          </div>
        </div>

        <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          Apply All Recommendations
        </button>
      </div>
    </div>
  );
}

function UpcomingDeadlines() {
  // const { data: tasks, loading } = useApi(api.getTasks);
  // Gọi API với params
  const { data: tasks, loading } = useApi(() =>
      api.getTasks("", "", "", "")
  );


  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="w-32 h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="w-32 h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="w-24 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const upcomingTasks = tasks?.filter(task => {
    const deadline = new Date(task.deadline);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  }).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
      <div className="space-y-3">
        {upcomingTasks?.slice(0, 5).map((task) => {
          const deadline = new Date(task.deadline);
          const now = new Date();
          const diffTime = deadline.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return (
            <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  task.priority === 'HIGH' ? 'bg-orange-500' :
                  task.priority === 'MEDIUM' ? 'bg-blue-500' : 'bg-gray-400'
                }`} />
                <div>
                  <div className="font-medium text-gray-900 text-sm">{task.title}</div>
                  <div className="text-xs text-gray-600">Project: E-commerce Platform v2</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  diffDays <= 1 ? 'text-red-600' : diffDays <= 3 ? 'text-amber-600' : 'text-gray-600'
                }`}>
                  {diffDays === 0 ? 'Today' : diffDays === 1 ? 'Tomorrow' : `${diffDays} days`}
                </div>
                <div className="text-xs text-gray-500">
                  {deadline.toLocaleDateString()}
                </div>
              </div>
            </div>
          );
        })}
        
        {(!upcomingTasks || upcomingTasks.length === 0) && (
          <div className="text-center py-6 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No upcoming deadlines in the next 7 days</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function Dashboard() {
  // const { data: kpis, loading: kpiLoading } = useApi(api.getDashboardKPIs);

  const [filters, setFilters] = useState<FilterSearch>({ project: "", status: "" });

  const { data: kpis, loading: kpiLoading, refetch: refetchKPIs } = useApi(() =>
      api.getDashboardKPIs(filters.project, filters.status)
  );

  const handleSearch = () => {
    refetchKPIs();
  };

  return (
    <div className="p-6 space-y-6">
      <QuickFilters
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
      />
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Tasks"
          value={kpis?.totalTasks || 0}
          change="+12%"
          trend="up"
          icon={<Target className="w-6 h-6" />}
          color="blue"
          loading={kpiLoading}
        />
        <KPICard
          title="On-time Delivery"
          value={kpis ? `${kpis.onTimeRate}%` : '0%'}
          change="+3.2%"
          trend="up"
          icon={<Clock className="w-6 h-6" />}
          color="green"
          loading={kpiLoading}
        />
        <KPICard
          title="Overdue Tasks"
          value={kpis?.overdueTasks || 0}
          change="-8%"
          trend="down"
          icon={<AlertTriangle className="w-6 h-6" />}
          color="red"
          loading={kpiLoading}
        />
        <KPICard
          title="Overloaded Devs"
          value={kpis?.overloadedDevs || 0}
          change="±0%"
          trend="neutral"
          icon={<Users className="w-6 h-6" />}
          color="orange"
          loading={kpiLoading}
        />
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <WorkloadChart />
        </div>
        <div className="lg:col-span-1">
          <ProjectProgress />
        </div>
        <div className="lg:col-span-1">
          <UpcomingDeadlines />
        </div>
      </div>

      {/* AI Insights */}
      <AIInsights />
    </div>
  );
}