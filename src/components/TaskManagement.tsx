import React, { useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Grid,
  List,
  Plus,
  Clock,
  User,
  Flag,
  CheckSquare,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  X,
  Save,
  Bot,
  UserCheck, Edit
} from 'lucide-react';
import { useApi, api } from '../hooks/useApi';
import { Task, ViewMode } from '../types';

function PriorityBadge({ priority }: { priority: string }) {
  const colors = {
    'critical': 'bg-red-100 text-red-700 border-red-200',
    'high': 'bg-orange-100 text-orange-700 border-orange-200',
    'medium': 'bg-blue-100 text-blue-700 border-blue-200',
    'low': 'bg-gray-100 text-gray-700 border-gray-200'
  };

  const icons = {
    'critical': <AlertTriangle className="w-3 h-3" />,
    'high': <Flag className="w-3 h-3" />,
    'medium': <Flag className="w-3 h-3" />,
    'low': <Flag className="w-3 h-3" />
  };

  return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${colors[priority as keyof typeof colors]}`}>
      {icons[priority as keyof typeof icons]}
        <span className="ml-1 capitalize">{priority}</span>
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    'todo': 'bg-gray-100 text-gray-700',
    'in_progress': 'bg-blue-100 text-blue-700',
    'review': 'bg-purple-100 text-purple-700',
    'done': 'bg-green-100 text-green-700'
  };

  const icons = {
    'todo': <PauseCircle className="w-3 h-3" />,
    'in_progress': <PlayCircle className="w-3 h-3" />,
    'review': <Clock className="w-3 h-3" />,
    'done': <CheckCircle className="w-3 h-3" />
  };

  const labels = {
    'todo': 'To Do',
    'in_progress': 'In Progress',
    'review': 'Review',
    'done': 'Done'
  };

  return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
      {icons[status as keyof typeof icons]}
        <span className="ml-1">{labels[status as keyof typeof labels]}</span>
    </span>
  );
}

function TaskEditModal({ task, onClose, onSave }: {
  task: Task | null;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
}) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    projectId: task?.projectId || '',
    assigneeId: task?.assigneeId || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    estimateHours: task?.estimateHours || 0,
    deadline: task?.deadline ? task.deadline.split('T')[0] : '',
    requiredSkills: task?.requiredSkills || []
  });

  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleAISuggestions = async () => {
    setAiLoading(true);
    try {
      // Simulate API call for AI assignment suggestions
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuggestions([
        {
          id: '1',
          name: 'Sarah Chen',
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150',
          role: 'Senior Frontend Developer',
          matchScore: 95,
          reason: 'Expert in React & TypeScript, 94% completion rate, currently at 80% capacity',
          availability: 'Available now'
        },
        {
          id: '3',
          name: 'Emma Thompson',
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150',
          role: 'Mid-Level Frontend Developer',
          matchScore: 87,
          reason: 'Strong Vue.js skills, 92% completion rate, available in 2 days',
          availability: 'Available in 2 days'
        },
        {
          id: '2',
          name: 'Marcus Rodriguez',
          avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=150',
          role: 'Lead Backend Developer',
          matchScore: 75,
          reason: 'Can handle full-stack work, but currently overloaded at 112% capacity',
          availability: 'Overloaded'
        }
      ]);
      setShowAISuggestions(true);
    } catch (error) {
      console.error('AI suggestions failed:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAssign = (developerId: string, developerName: string) => {
    setFormData({ ...formData, assigneeId: developerId });
    console.log(`Assigned task to ${developerName}`);
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Task Details */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title
                  </label>
                  <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project
                    </label>
                    <select
                        value={formData.projectId}
                        onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Project</option>
                      <option value="proj1">E-commerce Platform v2</option>
                      <option value="proj2">Mobile Banking App</option>
                      <option value="proj3">Data Analytics Dashboard</option>
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
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimate (hours)
                    </label>
                    <input
                        type="number"
                        value={formData.estimateHours}
                        onChange={(e) => setFormData({ ...formData, estimateHours: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deadline
                  </label>
                  <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Right Column - Assignment Suggestions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Assignment</h3>
                  <button
                      onClick={handleAISuggestions}
                      disabled={aiLoading}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2 disabled:opacity-50"
                  >
                    {aiLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Finding...</span>
                        </>
                    ) : (
                        <>
                          <Bot className="w-4 h-4" />
                          <span>AI Suggestions</span>
                        </>
                    )}
                  </button>
                </div>

                {showAISuggestions && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Recommended Developers</h4>
                      {suggestions.map((dev) => (
                          <div key={dev.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <img
                                    src={dev.avatar}
                                    alt={dev.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h5 className="font-medium text-gray-900">{dev.name}</h5>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        dev.matchScore >= 90 ? 'bg-green-100 text-green-700' :
                                            dev.matchScore >= 80 ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                    }`}>
                                {dev.matchScore}% match
                              </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{dev.role}</p>
                                  <p className="text-xs text-gray-500 mb-2">{dev.reason}</p>
                                  <p className="text-xs font-medium text-gray-700">{dev.availability}</p>
                                </div>
                              </div>
                              <button
                                  onClick={() => handleAssign(dev.id, dev.name)}
                                  disabled={dev.availability === 'Overloaded'}
                                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                              >
                                <UserCheck className="w-3 h-3" />
                                <span>Assign</span>
                              </button>
                            </div>
                          </div>
                      ))}
                    </div>
                )}

                {!showAISuggestions && (
                    <div className="text-center py-8 text-gray-500">
                      <Bot className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Click "AI Suggestions" to get developer recommendations</p>
                    </div>
                )}
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
              <span>{task ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </div>
      </div>
  );
}

function TaskTableView({ tasks }: { tasks: Task[] }) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const getDaysUntilDeadline = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input type="checkbox" className="rounded border-gray-300" />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Task
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Project
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Assignee
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Deadline
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progress
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map((task) => {
            const daysUntilDeadline = getDaysUntilDeadline(task.deadline);
            const isOverdue = daysUntilDeadline < 0;
            const isUrgent = daysUntilDeadline <= 2 && daysUntilDeadline >= 0;

            return (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{task.title}</div>
                      <div className="text-sm text-gray-500">{task.description.substring(0, 60)}...</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    E-commerce Platform v2
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">SC</span>
                      </div>
                      <span className="ml-2 text-sm text-gray-900">Sarah Chen</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : isUrgent ? 'text-orange-600 font-medium' : 'text-gray-900'}`}>
                      {new Date(task.deadline).toLocaleDateString()}
                    </div>
                    <div className={`text-xs ${isOverdue ? 'text-red-500' : isUrgent ? 'text-orange-500' : 'text-gray-500'}`}>
                      {isOverdue ? `${Math.abs(daysUntilDeadline)} days overdue` :
                          daysUntilDeadline === 0 ? 'Due today' :
                              daysUntilDeadline === 1 ? 'Due tomorrow' :
                                  `${daysUntilDeadline} days left`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-900">{task.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                          onClick={() => setEditingTask(task)}
                          className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
            );
          })}
          </tbody>
        </table>

        {editingTask && (
            <TaskEditModal
                task={editingTask}
                onClose={() => setEditingTask(null)}
                onSave={(updatedTask) => {
                  console.log('Saving task:', updatedTask);
                  // Here you would call your API to update the task
                }}
            />
        )}
      </div>
  );
}

function KanbanColumn({ title, status, tasks, count }: { title: string; status: string; tasks: Task[]; count: number }) {
  const columnTasks = tasks.filter(task => task.status === status);

  return (
      <div className="bg-gray-50 rounded-lg p-4 min-h-96">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
          {columnTasks.length}
        </span>
        </div>

        <div className="space-y-3">
          {columnTasks.map((task) => (
              <div key={task.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{task.title}</h4>
                  <PriorityBadge priority={task.priority} />
                </div>

                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">SC</span>
                    </div>
                    <span className="text-xs text-gray-600">Sarah Chen</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.ceil((new Date(task.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}d left
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {task.requiredSkills.slice(0, 2).map((skill, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    {skill}
                  </span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-600">{task.progress}%</div>
                </div>

                {task.progress > 0 && (
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                      <div
                          className="bg-blue-600 h-1 rounded-full"
                          style={{ width: `${task.progress}%` }}
                      />
                    </div>
                )}
              </div>
          ))}

          <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
            <Plus className="w-4 h-4 mx-auto mb-1" />
            Add Task
          </button>
        </div>
      </div>
  );
}

function KanbanView({ tasks }: { tasks: Task[] }) {
  const columns = [
    { title: 'To Do', status: 'todo' },
    { title: 'In Progress', status: 'in_progress' },
    { title: 'Review', status: 'review' },
    { title: 'Done', status: 'done' }
  ];

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
            <KanbanColumn
                key={column.status}
                title={column.title}
                status={column.status}
                tasks={tasks}
                count={tasks.filter(t => t.status === column.status).length}
            />
        ))}
      </div>
  );
}

function CalendarView({ tasks }: { tasks: Task[] }) {
  return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
          <p className="text-gray-600">Calendar view will show tasks plotted by their deadlines</p>
          <div className="mt-6 space-y-2">
            {tasks.slice(0, 3).map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">{task.title}</span>
                  <span className="text-xs text-gray-500">
                {new Date(task.deadline).toLocaleDateString()}
              </span>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
}

function TaskFilters() {
  return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Projects</option>
              <option value="proj1">E-commerce Platform v2</option>
              <option value="proj2">Mobile Banking App</option>
              <option value="proj3">Data Analytics Dashboard</option>
            </select>

            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Assignees</option>
              <option value="1">Sarah Chen</option>
              <option value="2">Marcus Rodriguez</option>
              <option value="3">Emma Thompson</option>
            </select>

            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>

            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
              Save Filter
            </button>
          </div>
        </div>
      </div>
  );
}

export function TaskManagement() {
  const { data: tasks, loading } = useApi(api.getTasks);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [prefilledAssignee, setPrefilledAssignee] = useState<{id: string, name: string} | null>(null);

  // Listen for navigation events from developer assignment
  React.useEffect(() => {
    const handleNavigateToTasks = (event: CustomEvent) => {
      setPrefilledAssignee({
        id: event.detail.assigneeId,
        name: event.detail.assigneeName
      });
      setShowCreateModal(true);
    };

    window.addEventListener('navigateToTasks', handleNavigateToTasks as EventListener);
    return () => {
      window.removeEventListener('navigateToTasks', handleNavigateToTasks as EventListener);
    };
  }, []);

  if (loading) {
    return (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="animate-pulse">
              <div className="w-32 h-8 bg-gray-200 rounded mb-2" />
              <div className="w-48 h-4 bg-gray-200 rounded" />
            </div>
            <div className="flex space-x-3">
              <div className="w-24 h-10 bg-gray-200 rounded animate-pulse" />
              <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <TaskFilters />
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-gray-200 rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="w-1/3 h-4 bg-gray-200 rounded" />
                      <div className="w-1/2 h-3 bg-gray-200 rounded" />
                    </div>
                    <div className="w-16 h-4 bg-gray-200 rounded" />
                    <div className="w-20 h-6 bg-gray-200 rounded-full" />
                    <div className="w-4 h-4 bg-gray-200 rounded" />
                  </div>
              ))}
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
            <p className="text-gray-600">Track and manage all project tasks</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex border border-gray-300 rounded-md">
              <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 text-sm font-medium flex items-center space-x-1 ${
                      viewMode === 'table'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <List className="w-4 h-4" />
                <span>Table</span>
              </button>
              <button
                  onClick={() => setViewMode('kanban')}
                  className={`px-3 py-2 text-sm font-medium flex items-center space-x-1 ${
                      viewMode === 'kanban'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Grid className="w-4 h-4" />
                <span>Kanban</span>
              </button>
              <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-2 text-sm font-medium flex items-center space-x-1 ${
                      viewMode === 'calendar'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Calendar</span>
              </button>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2">
              <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Task</span>
              </button>
            </button>
          </div>
        </div>

        <TaskFilters />

        {tasks && tasks.length > 0 ? (
            <>
              {viewMode === 'table' && <TaskTableView tasks={tasks} />}
              {viewMode === 'kanban' && <KanbanView tasks={tasks} />}
              {viewMode === 'calendar' && <CalendarView tasks={tasks} />}
            </>
        ) : (
            <div className="text-center py-12">
              <CheckSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600 mb-4">Create your first task to start managing your project workload.</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
                Create Task
              </button>
            </div>
        )}

        {showCreateModal && (
            <TaskEditModal
                task={prefilledAssignee ? {
                  assigneeId: prefilledAssignee.id,
                  title: '',
                  description: '',
                  projectId: '',
                  status: 'todo',
                  priority: 'medium',
                  estimateHours: 0,
                  deadline: '',
                  createdAt: '',
                  updatedAt: '',
                  requiredSkills: [],
                  progress: 0,
                  id: ''
                } as Task : null}
                onClose={() => {
                  setShowCreateModal(false);
                  setPrefilledAssignee(null);
                }}
                onSave={(newTask) => {
                  console.log('Creating task:', newTask);
                  // Here you would call your API to create the task
                }}
            />
        )}
      </div>
  );
}