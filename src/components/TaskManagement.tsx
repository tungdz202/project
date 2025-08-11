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
import axios from "axios";

function PriorityBadge({ priority }: { priority: string }) {
  const colors = {
    'HIGH': 'bg-orange-100 text-orange-700 border-orange-200',
    'MEDIUM': 'bg-blue-100 text-blue-700 border-blue-200',
    'LOW': 'bg-gray-100 text-gray-700 border-gray-200'
  };

  const icons = {
    'HIGH': <Flag className="w-3 h-3" />,
    'MEDIUM': <Flag className="w-3 h-3" />,
    'LOW': <Flag className="w-3 h-3" />
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
    'TODO': 'bg-gray-100 text-gray-700',
    'IN_PROGRESS': 'bg-blue-100 text-blue-700',
    'REVIEW': 'bg-purple-100 text-purple-700',
    'COMPLETED': 'bg-green-100 text-green-700'
  };

  const icons = {
    'TODO': <PauseCircle className="w-3 h-3" />,
    'IN_PROGRESS': <PlayCircle className="w-3 h-3" />,
    'REVIEW': <Clock className="w-3 h-3" />,
    'COMPLETED': <CheckCircle className="w-3 h-3" />
  };

  const labels = {
    'TODO': 'To Do',
    'IN_PROGRESS': 'In Progress',
    'REVIEW': 'Review',
    'COMPLETED': 'Done'
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
    id: task?.id || '',
    title: task?.title || '',
    description: task?.description || '',
    projectId: task?.projectId || '',
    assigneeId: task?.assigneeId || '',
    assigneeName: task?.assigneeName || '',
    status: task?.status || 'TODO',
    priority: task?.priority || 'LOW',
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
      const response = await axios.post('https://selected-duck-ethical.ngrok-free.app/task-suggestion',
          null,
          {
            params: { id: task?.id || ''},
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
          }
      );
      setSuggestions(response.data);
      setShowAISuggestions(true);
    } catch (error) {
      console.error('AI suggestions failed:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAssign = (developerId: string, developerName: string) => {
    setFormData({ ...formData, assigneeId: developerId , assigneeName: developerName});
    api.updateTask(formData).then(() => {
    });
    // Gọi callback onSave để component cha biết
    onSave(formData);
    onClose();
  };

  const handleSave = async () => {
    const updated = { ...formData }; // copy dữ liệu hiện tại
    try {
      // Gọi API update
      await api.updateTask(updated);
      // Cập nhật state local (nếu cần hiển thị tiếp)
      setFormData(updated);
      // Gọi callback onSave để component cha biết
      onSave(updated);
      // Đóng modal khi API thành công
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
    }
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
                      <option value="21">Hệ thống Quản lý Doanh Nghiệp</option>
                      <option value="22">Mobile Banking App</option>
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
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
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
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
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

                  <div >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assign
                      </label>
                      <select
                          value={formData.assigneeId}
                          onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Assignee</option>
                        <option value="42">Trần Ngọc Anh</option>
                        <option value="43">Nguyễn Hoàng Long</option>
                        <option value="44">Phạm Thu Hà</option>
                        <option value="45">Đỗ Minh Khoa</option>
                        <option value="46">Nguyễn Thị Lan</option>
                        <option value="47">Nguyễn Lê Anh Tú</option>
                      </select>
                    </div>
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
                      {Array.isArray(suggestions) && suggestions.length > 0 && suggestions.map((dev) => (
                          <div
                              key={dev.id}
                              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <img
                                    src="https://img.freepik.com/premium-vector/user-icon-icon_1076610-59410.jpg?w=150"
                                    alt={dev.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h5 className="font-medium text-gray-900">{dev.name}</h5>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            dev.matchScore >= 90
                                                ? 'bg-green-100 text-green-700'
                                                : dev.matchScore >= 80
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                        }`}
                                    >
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
                                <UserCheck className="w-3 h-3"/>
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
  const [taskList, setTaskList] = useState<Task[]>(tasks);

  const getDaysUntilDeadline = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const loadTasks = async () => {
    const res = await api.getTasks("","","",""); // gọi API thật
    setTaskList(res);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
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
              Actions
            </th>
          </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {taskList.map((task) => {
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
                      <tr key={task.id} onClick={() => handleEdit(task)}>
                        <td>{task.title}</td>
                      </tr>
                      <div className="text-sm text-gray-500">{task.description.substring(0, 60)}...</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {task.projectName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <img
                            src="https://img.freepik.com/premium-vector/user-icon-icon_1076610-59410.jpg?w=150"
                        />
                      </div>
                      <span className="ml-2 text-sm text-gray-900">{task.assigneeName}</span>
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
                onSave={async () => {
                  await loadTasks(); // reload ở đây
                  setEditingTask(null);
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
    { title: 'To Do', status: 'TODO' },
    { title: 'In Progress', status: 'IN_PROGRESS' },
    { title: 'Done', status: 'COMPLETED' }
  ];

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

interface TaskFiltersProps {
  onFilterChange: (filters: {
    inputText: string;
    project: string;
    assignee: string;
    status: string;
  }) => void;
}

function TaskFilters({ onFilterChange }: TaskFiltersProps) {
  const [inputText, setInputText] = useState('');
  const [project, setProject] = useState('');
  const [assignee, setAssignee] = useState('');
  const [status, setStatus] = useState('');
  const handleSearch = () => {
    onFilterChange({ inputText, project, assignee, status });
  };
  return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <select value={project} onChange={(e) => setProject(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="">All Projects</option>
              <option value="21">Hệ thống Quản lý Doanh nghiệp</option>
              {/*<option value="22">Mobile Banking App</option>*/}
            </select>

            <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="">Assignee</option>
              <option value="42">Trần Ngọc Anh</option>
              <option value="43">Nguyễn Hoàng Long</option>
              <option value="44">Phạm Thu Hà</option>
              <option value="45">Đỗ Minh Khoa</option>
              <option value="46">Nguyễn Thị Lan</option>
              <option value="47">Nguyễn Lê Anh Tú</option>
            </select>

            <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="">All Status</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Complete</option>
            </select>

            <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Search Filter
            </button>
          </div>
        </div>
      </div>
  );
}

export function TaskManagement() {

  const [filters, setFilters] = useState({
    inputText: '',
    project: '',
    assignee: '',
    status: '',
  });
  // Gọi API với params
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async (currentFilters: typeof filters) => {
    try {
      setLoading(true);
      const response = await api.getTasks(
          currentFilters.inputText,
          currentFilters.project,
          currentFilters.assignee,
          currentFilters.status
      );
      setTasks(response);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [prefilledAssignee, setPrefilledAssignee] = useState<{ id: string; name: string } | null>(null);

  // Listen for navigation events from developer assignment
  React.useEffect(() => {
    fetchTasks(filters);

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
  }, [filters]);

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
          <TaskFilters onFilterChange={setFilters} />
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
                  className={`px-3 py-2 text-sm font-medium flex items-center space-x-1 ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
                <span>Table</span>
              </button>
              <button
                  onClick={() => setViewMode('kanban')}
                  className={`px-3 py-2 text-sm font-medium flex items-center space-x-1 ${viewMode === 'kanban' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <Grid className="w-4 h-4" />
                <span>Kanban</span>
              </button>
              <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-2 text-sm font-medium flex items-center space-x-1 ${viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <Calendar className="w-4 h-4" />
                <span>Calendar</span>
              </button>
            </div>
            <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        <TaskFilters onFilterChange={setFilters} />
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
              <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Create Task
              </button>
            </div>
        )}

        {showCreateModal && (
            <TaskEditModal
                task={
                  prefilledAssignee
                      ? {
                        assigneeId: prefilledAssignee.id,
                        assigneeName: '',
                        title: '',
                        description: '',
                        projectId: '',
                        projectName: '',
                        status: 'TODO',
                        priority: 'MEDIUM',
                        estimateHours: 0,
                        deadline: '',
                        createdAt: '',
                        updatedAt: '',
                        requiredSkills: [],
                        id: ''
                      } as Task
                      : null
                }
                onClose={() => {
                  setShowCreateModal(false);
                  setPrefilledAssignee(null);
                }}
                onSave={(newTask) => {
                  console.log('Creating task:', newTask);
                }}
            />
        )}
      </div>
  );
}