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
  PauseCircle
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

function TaskTableView({ tasks }: { tasks: Task[] }) {
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
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
            <Plus className="w-4 h-4" />
            <span>New Task</span>
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
    </div>
  );
}