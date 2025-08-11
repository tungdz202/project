import React, { useState } from 'react';
import axios from 'axios';
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
  MoreHorizontal,
  Plus,
  X,
  Save,
  Bot,
  UserCheck,
  UserX
} from 'lucide-react';
import { useApi, api } from '../hooks/useApi';
import {Project, SuggestProject} from '../types';

function ProjectDetailModal({ project, onClose, onEdit }: {
  project: Project;
  onClose: () => void;
  onEdit: (project: Project) => void;
}) {
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<SuggestProject[]>([]);

  const handleAIAnalysis = async () => {
    setAiLoading(true);
    try {
      // Simulate API call for AI project analysis
      // Gọi API với params
      const response = await axios.post('https://selected-duck-ethical.ngrok-free.app/smart-segregate',
          null,
          {
            params: { id: project.id }, // truyền id vào query param
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
          }
      );
      // const response = api.getRecommendProject(project.id);
      setRecommendations(response.data.actions);
      setShowAIRecommendations(true);
    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setAiLoading(false);
    }
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{project.name}</h2>
                <p className="text-blue-100">{project.client} • PM: {project.pm}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                    onClick={handleAIAnalysis}
                    disabled={aiLoading}
                    className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50"
                >
                  {aiLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span>Analyzing...</span>
                      </>
                  ) : (
                      <>
                        <Bot className="w-4 h-4" />
                        <span>AI Performance Review</span>
                      </>
                  )}
                </button>
                <button
                    onClick={() => onEdit(project)}
                    className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition-colors font-medium"
                >
                  Edit Project
                </button>
                <button
                    onClick={onClose}
                    className="p-2 text-blue-200 hover:text-white rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Project Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-700">{project.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
                      <p className="text-sm text-gray-700">
                        {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    {/*<div className="bg-gray-50 rounded-lg p-4">*/}
                    {/*  <h4 className="font-medium text-gray-900 mb-2">Budget</h4>*/}
                    {/*  <p className="text-sm text-gray-700">*/}
                    {/*    {project.budget ? `$${project.budget.toLocaleString()}` : 'Not specified'}*/}
                    {/*  </p>*/}
                    {/*</div>*/}
                  </div>

                  {/*<div className="bg-gray-50 rounded-lg p-4">*/}
                  {/*  <h4 className="font-medium text-gray-900 mb-3">Milestones</h4>*/}
                  {/*  <div className="space-y-2">*/}
                  {/*    {project.milestones.map((milestone) => (*/}
                  {/*        <div key={milestone.id} className="flex items-center justify-between">*/}
                  {/*          <div className="flex items-center space-x-2">*/}
                  {/*            <div className={`w-2 h-2 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-gray-300'}`} />*/}
                  {/*            <span className="text-sm text-gray-700">{milestone.title}</span>*/}
                  {/*          </div>*/}
                  {/*          <span className="text-xs text-gray-500">*/}
                  {/*        {new Date(milestone.date).toLocaleDateString()}*/}
                  {/*      </span>*/}
                  {/*        </div>*/}
                  {/*    ))}*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                </div>
              </div>

              {/* Right Column - Progress & Team */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress & Team</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                      <span className="text-lg font-bold text-blue-600">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                          className="bg-blue-600 h-3 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">{project.teamSize}</div>
                      <div className="text-sm text-gray-600">Team Members</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">{project.taskCount}</div>
                      <div className="text-sm text-gray-600">Total Tasks</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Risk Assessment</h4>
                    <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                        project.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' :
                            project.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                    }`}>
                      {project.riskLevel === 'HIGH' && <AlertTriangle className="w-4 h-4 mr-2" />}
                      {project.riskLevel.charAt(0).toUpperCase() + project.riskLevel.slice(1)} Risk
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            {showAIRecommendations && (
                <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Bot className="w-5 h-5 mr-2 text-blue-600" />
                    AI Performance Analysis
                  </h3>
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                {rec.action === 'Replace' ? (
                                    <UserX className="w-4 h-4 text-red-500" />
                                ) : (
                                    <UserCheck className="w-4 h-4 text-green-500" />
                                )}
                                <span className="font-medium text-gray-900">
                            {rec.action === 'Replace' ? 'Replace Developer' : 'Add Team Member'}
                          </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    rec.priority === 'Cao' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                            {rec.priority} priority
                          </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{rec.details}</p>
                              <p className="text-sm font-medium text-gray-900">{rec.recommendation}</p>
                            </div>
                            <button className="ml-4 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                              Apply
                            </button>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}

function ProjectEditModal({ project, onClose, onSave }: {
  project: Project | null;
  onClose: () => void;
  onSave: (project: Partial<Project>) => void;
}) {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    client: project?.client || '',
    pm: project?.pm || '',
    description: project?.description || '',
    startDate: project?.startDate || '',
    endDate: project?.endDate || '',
    status: project?.status || 'PLANNING'
  });

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {project ? 'Edit Project' : 'Create New Project'}
            </h2>
            <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client
                </label>
                <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Manager
                </label>
                <select
                    value={formData.pm}
                    onChange={(e) => setFormData({ ...formData, pm: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select PM</option>
                  <option value="Sarah Johnson">Sarah Johnson</option>
                  <option value="David Park">David Park</option>
                  <option value="Lisa Chen">Lisa Chen</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/*<div className="md:col-span-2">*/}
              {/*  <label className="block text-sm font-medium text-gray-700 mb-2">*/}
              {/*    Budget ($)*/}
              {/*  </label>*/}
              {/*  <input*/}
              {/*      type="number"*/}
              {/*      value={formData.budget}*/}
              {/*      onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}*/}
              {/*      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"*/}
              {/*  />*/}
              {/*</div>*/}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{project ? 'Save Changes' : 'Create Project'}</span>
            </button>
          </div>
        </div>
      </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

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
            {project.riskLevel !== 'LOW' && (
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
                    project.riskLevel === 'HIGH' ? 'bg-red-500' :
                        project.riskLevel === 'MEDIUM' ? 'bg-amber-500' : 'bg-green-500'
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
            <button
                onClick={() => setShowDetail(true)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
                onClick={() => setShowEdit(true)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showDetail && (
            <ProjectDetailModal
                project={project}
                onClose={() => setShowDetail(false)}
                onEdit={(proj) => {
                  setShowDetail(false);
                  setShowEdit(true);
                }}
            />
        )}

        {showEdit && (
            <ProjectEditModal
                project={project}
                onClose={() => setShowEdit(false)}
                onSave={(updatedProject) => {
                  console.log('Saving project:', updatedProject);
                  // Here you would call your API to update the project
                }}
            />
        )}
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
                    project.status === 'TODO' ? 'bg-green-100 text-green-700' :
                        project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                            project.status === 'PLANNING' ? 'bg-yellow-100 text-yellow-700' :
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
                    project.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' :
                        project.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                }`}>
                  {project.riskLevel === 'HIGH' && <AlertTriangle className="w-3 h-3 mr-1" />}
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

            {/*<select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">*/}
            {/*  <option value="">All Risk Levels</option>*/}
            {/*  <option value="low">Low Risk</option>*/}
            {/*  <option value="medium">Medium Risk</option>*/}
            {/*  <option value="high">High Risk</option>*/}
            {/*</select>*/}

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
  const [showCreateModal, setShowCreateModal] = useState(false);

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
            <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
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
              <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
                Create Project
              </button>
            </div>
        )}

        {showCreateModal && (
            <ProjectEditModal
                project={null}
                onClose={() => setShowCreateModal(false)}
                onSave={(newProject) => {
                  console.log('Creating project:', newProject);
                  // Here you would call your API to create the project
                }}
            />
        )}
      </div>
  );
}