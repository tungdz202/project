import React, { useState } from 'react';
import {
  Search,
  Filter,
  Star,
  Clock,
  TrendingUp,
  MessageSquare,
  UserPlus,
  ChevronRight,
  MapPin,
  Calendar,
  Send,
  X, Users
} from 'lucide-react';
import { useApi, api } from '../hooks/useApi';
import { Developer, FilterState } from '../types';

function SkillBadge({ skill }: { skill: { name: string; level: number; verified: boolean; category: string } }) {
  const getSkillColor = (category: string) => {
    const colors = {
      'Frontend': 'bg-blue-100 text-blue-700',
      'Backend': 'bg-green-100 text-green-700',
      'DevOps': 'bg-purple-100 text-purple-700',
      'Design': 'bg-pink-100 text-pink-700',
      'Mobile': 'bg-indigo-100 text-indigo-700',
      'Data': 'bg-orange-100 text-orange-700'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSkillColor(skill.category)}`}>
      {skill.name}
        <div className="ml-1 flex">
        {[...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-2 h-2 ${i < skill.level ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ))}
      </div>
        {skill.verified && (
            <div className="ml-1 w-2 h-2 bg-green-500 rounded-full" title="Verified skill" />
        )}
    </span>
  );
}

function SendMessageModal({ developer, onClose, onSend }: {
  developer: Developer;
  onClose: () => void;
  onSend: (message: string) => void;
}) {
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || !subject.trim()) return;

    setSending(true);
    try {
      // Simulate API call to send email
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSend(message);
      onClose();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <img
                  src={developer.avatar}
                  alt={developer.name}
                  className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Send Message</h3>
                <p className="text-sm text-gray-600">To: {developer.name} ({developer.email})</p>
              </div>
            </div>
            <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter message subject..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
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
                onClick={handleSend}
                disabled={!message.trim() || !subject.trim() || sending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
              ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
              )}
            </button>
          </div>
        </div>
      </div>
  );
}

function DeveloperCard({ developer, onSelect }: { developer: Developer; onSelect: (dev: Developer) => void }) {
  const getStatusColor = (status: string) => {
    const colors = {
      'AVAILABLE': 'bg-green-100 text-green-700 border-green-200',
      'BUSY': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'OVERLOADED': 'bg-red-100 text-red-700 border-red-200',
      'OFFLINE': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[status as keyof typeof colors] || colors.OFFLINE;
  };

  const utilizationPercent = (developer.workloadHours / developer.maxCapacity) * 100;

  return (
      <div
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onSelect(developer)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <img
                  src="https://img.freepik.com/premium-vector/user-icon-icon_1076610-59410.jpg?w=150"
                  alt={developer.name}
                  className="w-12 h-12 rounded-full object-cover"
              />
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  developer.status === 'AVAILABLE' ? 'bg-green-500' :
                      developer.status === 'BUSY' ? 'bg-yellow-500' :
                          developer.status === 'OVERLOADED' ? 'bg-red-500' : 'bg-gray-400'
              }`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{developer.name}</h3>
              {/*<p className="text-sm text-gray-600">{developer.role} • {developer.team}</p>*/}
              <p className="text-xs text-gray-500">{developer.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(developer.status)}`}>
            {developer.status}
          </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Workload</span>
            <span className="font-medium">{developer.workloadHours}h / {developer.maxCapacity}h</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
                className={`h-2 rounded-full ${
                    utilizationPercent > 100 ? 'bg-red-500' :
                        utilizationPercent > 80 ? 'bg-amber-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {developer.completionRate}% completion
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {developer.avgTaskTime}h avg
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {developer.skills.slice(0, 3).map((skill) => (
              <SkillBadge key={skill.id} skill={skill} />
          ))}
          {developer.skills.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            +{developer.skills.length - 3} more
          </span>
          )}
        </div>

        <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {/*{developer.activeProjects.length} active project{developer.activeProjects.length !== 1 ? 's' : ''}*/}
        </span>
          <div className="flex space-x-2">
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
              <MessageSquare className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded">
              <UserPlus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
  );
}

function DeveloperFilters() {
  const [filters, setFilters] = useState<FilterState>({});
  const [searchTerm, setSearchTerm] = useState('');

  return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                  type="text"
                  placeholder="Search by name, email, or skills..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All project</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="devops">DevOps</option>
              <option value="mobile">Mobile</option>
            </select>

            {/*<select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">*/}
            {/*  <option value="">All Status</option>*/}
            {/*  <option value="available">Available</option>*/}
            {/*  <option value="busy">Busy</option>*/}
            {/*  <option value="overloaded">Overloaded</option>*/}
            {/*</select>*/}

            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
              Search
            </button>
          </div>
        </div>
      </div>
  );
}

function DeveloperDetail({ developer, onClose }: { developer: Developer; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'tasks' | 'notes'>('overview');
  const [showMessageModal, setShowMessageModal] = useState(false);

  const handleAssignTask = () => {
    // Navigate to task management with pre-filled assignee
    onClose();
    // This would typically use a router to navigate
    window.dispatchEvent(new CustomEvent('navigateToTasks', {
      detail: { assigneeId: developer.id, assigneeName: developer.name }
    }));
  };

  const handleSendMessage = (message: string) => {
    // Here you would call your API to send the email
    console.log('Sending message to', developer.email, ':', message);
    // Show success toast or notification
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                    src="https://img.freepik.com/premium-vector/user-icon-icon_1076610-59410.jpg?w=150"
                    alt={developer.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-white/20"
                />
                <div>
                  <h2 className="text-2xl font-bold">{developer.name}</h2>
                  {/*<p className="text-blue-100">{developer.role} • {developer.team}</p>*/}
                  <p className="text-blue-200 text-sm">{developer.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium">
                  <button
                      onClick={handleAssignTask}
                      className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium"
                  >
                    Assign Task
                  </button>
                </button>
                <button className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition-colors font-medium">
                  <button
                      onClick={() => setShowMessageModal(true)}
                      className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition-colors font-medium"
                  >
                    Send Message
                  </button>
                </button>
                <button
                    onClick={onClose}
                    className="p-2 text-blue-200 hover:text-white rounded-md"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="px-6">
              <div className="flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'projects', label: 'Projects' },
                  { id: 'tasks', label: 'Tasks' },
                  { id: 'notes', label: 'Notes & Reviews' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`py-4 px-2 border-b-2 font-medium text-sm ${
                            activeTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                      {tab.label}
                    </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Skills */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
                    <div className="space-y-4">
                      {Object.entries(
                          developer.skills.reduce((acc, skill) => {
                            if (!acc[skill.category]) acc[skill.category] = [];
                            acc[skill.category].push(skill);
                            return acc;
                          }, {} as Record<string, typeof developer.skills>)
                      ).map(([category, skills]) => (
                          <div key={category} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
                            <div className="space-y-2">
                              {skills.map(skill => (
                                  <div key={skill.id} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">{skill.name}</span>
                                    <div className="flex items-center space-x-2">
                                      <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3 h-3 ${i < skill.level ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                            />
                                        ))}
                                      </div>
                                      {skill.verified && (
                                          <div className="w-2 h-2 bg-green-500 rounded-full" title="Verified" />
                                      )}
                                    </div>
                                  </div>
                              ))}
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column - Performance */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Task Completion Rate</span>
                          <span className="text-lg font-bold text-green-600">{developer.completionRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${developer.completionRate}%` }}
                          />
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Average Task Time</span>
                          <span className="text-lg font-bold text-blue-600">{developer.avgTaskTime}h</span>
                        </div>
                        <p className="text-xs text-gray-600">15% faster than team average</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Current Utilization</span>
                          <span className="text-lg font-bold text-amber-600">
                        {Math.round((developer.workloadHours / developer.maxCapacity) * 100)}%
                      </span>
                        </div>
                        <p className="text-xs text-gray-600">{developer.workloadHours}h / {developer.maxCapacity}h capacity</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 mb-3">Recent Activity</h4>
                      <div className="space-y-3">
                        {(developer.recentActivity !=null && developer.recentActivity.length > 0) ? (
                            developer.recentActivity.map(activity => (
                                <div key={activity.id} className="flex items-start space-x-3">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                                  <div>
                                    <p className="text-sm text-gray-700">{activity.description}</p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(activity.timestamp).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No recent activity</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
            )}

            {activeTab === 'projects' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Projects</h3>
                  <div className="space-y-3">

                    {(developer.activeProjects !=null && developer.activeProjects.length > 0) ? (
                        developer.activeProjects.map(id => (
                              <div key={id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-medium text-gray-900">E-commerce Platform v2</h4>
                                    <p className="text-sm text-gray-600">Frontend Developer • 67% complete</p>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-sm font-medium text-green-600">On Track</span>
                                    <p className="text-xs text-gray-500">Due: Mar 15, 2025</p>
                                  </div>
                                </div>
                              </div>
                          ))
                    ) : (
                        <p className="text-sm text-gray-500">No recent project</p>
                    )}
                  </div>
                </div>
            )}

            {activeTab === 'tasks' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Tasks</h3>
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Task details will be loaded from the task management system</p>
                  </div>
                </div>
            )}

            {activeTab === 'notes' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes & Performance Reviews</h3>
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No notes or reviews yet</p>
                    <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                      Add Note
                    </button>
                  </div>
                </div>
            )}
          </div>
        </div>

        {showMessageModal && (
            <SendMessageModal
                developer={developer}
                onClose={() => setShowMessageModal(false)}
                onSend={handleSendMessage}
            />
        )}
      </div>
  );
}

export function DeveloperList() {
  const { data: developers, loading } = useApi(api.getDevelopers);
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);

  if (loading) {
    return (
        <div className="p-6">
          <DeveloperFilters />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="animate-pulse">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full" />
                      <div>
                        <div className="w-24 h-4 bg-gray-200 rounded mb-2" />
                        <div className="w-32 h-3 bg-gray-200 rounded" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-3 bg-gray-200 rounded" />
                      <div className="w-3/4 h-3 bg-gray-200 rounded" />
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
        <DeveloperFilters />

        {developers && developers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {developers.map((developer) => (
                  <DeveloperCard
                      key={developer.id}
                      developer={developer}
                      onSelect={setSelectedDeveloper}
                  />
              ))}
            </div>
        ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No developers found</h3>
              <p className="text-gray-600 mb-4">Get started by adding team members to your workspace.</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
                Add Team Member
              </button>
            </div>
        )}

        {selectedDeveloper && (
            <DeveloperDetail
                developer={selectedDeveloper}
                onClose={() => setSelectedDeveloper(null)}
            />
        )}
      </div>
  );
}