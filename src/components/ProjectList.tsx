import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Pause, 
  Clock,
  TrendingUp,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react';
import { useApi, api } from '../hooks/useApi';
import { Project } from '../types';

function ProjectCard({ project }: { project: Project }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <TrendingUp className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'paused':
        return <Pause className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'active': 'bg-green-100 text-green-700 border-green-200',
      'completed': 'bg-blue-100 text-blue-700 border-blue-200',
      'paused': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'planning': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[status as keyof typeof colors] || colors.planning;
  };

  const getRiskColor = (risk: string) => {
    const colors = {
      'low': 'bg-green-100 text-green-700',
      'medium': 'bg-yellow-100 text-yellow-700',
      'high': 'bg-red-100 text-red-700'
    };
    return colors[risk as keyof typeof colors];
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
              {getStatusIcon(project.status)}
              <span className="ml-1 capitalize">{project.status}</span>
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">{project.client}</p>
          <p className="text-xs text-gray-500">PM: {project.pm}</p>
        </div>
        <div className="flex items-center space-x-2">
          {project.riskLevel !== 'low' && (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(project.riskLevel)}`}>
              <AlertTriangle className="w-3 h-3 mr-1" />
              {project.riskLevel} risk
            </span>
          )}
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              project.riskLevel === 'high' ? 'bg-red-500' : 
              project.riskLevel === 'medium' ? 'bg-amber-500' : 'bg-green-500'
            }`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center text-gray-600 mb-1">
            <Users className="w-4 h-4 mr-1" />
          </div>
          <div className="text-sm font-medium text-gray-900">{project.teamSize}</div>
          <div className="text-xs text-gray-500">Team Size</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center text-gray-600 mb-1">
            <CheckCircle className="w-4 h-4 mr-1" />
          </div>
          <div className="text-sm font-medium text-gray-900">{project.taskCount}</div>
          <div className="text-xs text-gray-500">Tasks</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center text-gray-600 mb-1">
            <Calendar className="w-4 h-4 mr-1" />
          </div>
          <div className="text-sm font-medium text-gray-900">
            {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
          <div className="text-xs text-gray-500">Due Date</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Started {new Date(project.startDate).toLocaleDateString()}
        </div>
        <div className="flex space-x-2">
          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectTable({ projects }: { projects: Project[] }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Project
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              PM
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progress
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Team
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Risk
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{project.name}</div>
                  <div className="text-sm text-gray-500">{project.description.substring(0, 50)}...</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {project.client}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {project.pm}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === 'active' ? 'bg-green-100 text-green-700' :
                  project.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                  project.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {project.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-900">{project.progress}%</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-sm text-gray-900">{project.teamSize}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(project.endDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  project.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                  project.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {project.riskLevel === 'high' && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {project.riskLevel}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-700">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProjectFilters() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects or clients..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
            <option value="planning">Planning</option>
          </select>

          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All PMs</option>
            <option value="sarah">Sarah Johnson</option>
            <option value="david">David Park</option>
            <option value="lisa">Lisa Chen</option>
          </select>

          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProjectList() {
  const { data: projects, loading } = useApi(api.getProjects);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  if (loading) {
    return (
      <div className="p-6">
        <ProjectFilters />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-32 h-5 bg-gray-200 rounded" />
                  <div className="w-16 h-6 bg-gray-200 rounded-full" />
                </div>
                <div className="w-24 h-4 bg-gray-200 rounded mb-2" />
                <div className="w-20 h-3 bg-gray-200 rounded mb-4" />
                <div className="w-full h-2 bg-gray-200 rounded mb-4" />
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="text-center">
                      <div className="w-8 h-4 bg-gray-200 rounded mx-auto mb-1" />
                      <div className="w-12 h-3 bg-gray-200 rounded mx-auto" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage and track your project portfolio</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-2 text-sm font-medium ${
                viewMode === 'cards' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 text-sm font-medium ${
                viewMode === 'table' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Table
            </button>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
            New Project
          </button>
        </div>
      </div>

      <ProjectFilters />

      {projects && projects.length > 0 ? (
        viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <ProjectTable projects={projects} />
        )
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-4">Create your first project to get started with task management.</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
            Create Project
          </button>
        </div>
      )}
    </div>
  );
}