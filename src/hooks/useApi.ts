import { useState, useEffect } from 'react';
import { Developer, Project, Task, KPI } from '../types';

// Mock API functions with realistic delays
export const api = {
  getDashboardKPIs: async (): Promise<KPI> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      totalTasks: 247,
      onTimeRate: 87.5,
      overdueTasks: 12,
      overloadedDevs: 3,
      avgTaskCompletion: 4.2,
      projectsAtRisk: 2
    };
  },

  getDevelopers: async (): Promise<Developer[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [
      {
        id: '1',
        name: 'Sarah Chen',
        email: 'sarah.chen@company.com',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150',
        role: 'Senior',
        team: 'Frontend',
        status: 'available',
        workloadHours: 32,
        maxCapacity: 40,
        completionRate: 94,
        avgTaskTime: 3.2,
        activeProjects: ['proj1', 'proj2'],
        skills: [
          { id: 's1', name: 'React', category: 'Frontend', level: 5, verified: true },
          { id: 's2', name: 'TypeScript', category: 'Frontend', level: 4, verified: true },
          { id: 's3', name: 'Node.js', category: 'Backend', level: 3, verified: false }
        ],
        recentActivity: [
          {
            id: 'a1',
            type: 'task_completed',
            description: 'Completed user authentication module',
            timestamp: '2025-01-08T10:30:00Z'
          }
        ]
      },
      {
        id: '2',
        name: 'Marcus Rodriguez',
        email: 'marcus.r@company.com',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=150',
        role: 'Lead',
        team: 'Backend',
        status: 'overloaded',
        workloadHours: 45,
        maxCapacity: 40,
        completionRate: 89,
        avgTaskTime: 4.8,
        activeProjects: ['proj1', 'proj3', 'proj4'],
        skills: [
          { id: 's4', name: 'Python', category: 'Backend', level: 5, verified: true },
          { id: 's5', name: 'PostgreSQL', category: 'Backend', level: 4, verified: true },
          { id: 's6', name: 'Docker', category: 'DevOps', level: 4, verified: true }
        ],
        recentActivity: []
      },
      {
        id: '3',
        name: 'Emma Thompson',
        email: 'emma.t@company.com',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150',
        role: 'Mid',
        team: 'Frontend',
        status: 'busy',
        workloadHours: 38,
        maxCapacity: 40,
        completionRate: 92,
        avgTaskTime: 3.8,
        activeProjects: ['proj2'],
        skills: [
          { id: 's7', name: 'Vue.js', category: 'Frontend', level: 4, verified: true },
          { id: 's8', name: 'JavaScript', category: 'Frontend', level: 4, verified: true }
        ],
        recentActivity: []
      }
    ];
  },

  getProjects: async (): Promise<Project[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 'proj1',
        name: 'E-commerce Platform v2',
        client: 'TechCorp Inc',
        pm: 'Sarah Johnson',
        startDate: '2024-11-01',
        endDate: '2025-03-15',
        status: 'active',
        progress: 67,
        riskLevel: 'medium',
        teamSize: 8,
        taskCount: 45,
        budget: 120000,
        description: 'Complete redesign and modernization of the existing e-commerce platform',
        milestones: [
          {
            id: 'm1',
            title: 'UI/UX Design Complete',
            date: '2024-12-15',
            completed: true,
            description: 'All design mockups approved'
          },
          {
            id: 'm2',
            title: 'Backend API Development',
            date: '2025-01-30',
            completed: false,
            description: 'Core API endpoints and database schema'
          }
        ]
      },
      {
        id: 'proj2',
        name: 'Mobile Banking App',
        client: 'SecureBank',
        pm: 'David Park',
        startDate: '2024-12-01',
        endDate: '2025-04-30',
        status: 'active',
        progress: 34,
        riskLevel: 'high',
        teamSize: 6,
        taskCount: 38,
        description: 'New mobile banking application with enhanced security features',
        milestones: []
      },
      {
        id: 'proj3',
        name: 'Data Analytics Dashboard',
        client: 'DataFlow Solutions',
        pm: 'Lisa Chen',
        startDate: '2024-10-15',
        endDate: '2025-02-28',
        status: 'active',
        progress: 89,
        riskLevel: 'low',
        teamSize: 4,
        taskCount: 22,
        description: 'Real-time analytics dashboard for business intelligence',
        milestones: []
      }
    ];
  },

  getTasks: async (): Promise<Task[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [
      {
        id: 't1',
        title: 'Implement user authentication flow',
        description: 'Create secure login/logout functionality with JWT tokens',
        projectId: 'proj1',
        assigneeId: '1',
        status: 'in_progress',
        priority: 'high',
        estimateHours: 16,
        actualHours: 12,
        deadline: '2025-01-15T17:00:00Z',
        createdAt: '2025-01-05T09:00:00Z',
        updatedAt: '2025-01-08T14:30:00Z',
        requiredSkills: ['React', 'Node.js', 'JWT'],
        progress: 75
      },
      {
        id: 't2',
        title: 'Design product catalog UI',
        description: 'Create responsive product listing and detail pages',
        projectId: 'proj1',
        assigneeId: '3',
        status: 'review',
        priority: 'medium',
        estimateHours: 24,
        actualHours: 28,
        deadline: '2025-01-20T17:00:00Z',
        createdAt: '2025-01-03T10:00:00Z',
        updatedAt: '2025-01-08T16:45:00Z',
        requiredSkills: ['Vue.js', 'CSS', 'Responsive Design'],
        progress: 95
      },
      {
        id: 't3',
        title: 'Database schema optimization',
        description: 'Optimize queries and add proper indexing for better performance',
        projectId: 'proj1',
        assigneeId: '2',
        status: 'todo',
        priority: 'critical',
        estimateHours: 8,
        deadline: '2025-01-12T17:00:00Z',
        createdAt: '2025-01-07T11:00:00Z',
        updatedAt: '2025-01-07T11:00:00Z',
        requiredSkills: ['PostgreSQL', 'Performance Optimization'],
        progress: 0
      },
      {
        id: 't4',
        title: 'Mobile app security audit',
        description: 'Comprehensive security review of banking app features',
        projectId: 'proj2',
        assigneeId: '2',
        status: 'in_progress',
        priority: 'critical',
        estimateHours: 32,
        actualHours: 18,
        deadline: '2025-01-25T17:00:00Z',
        createdAt: '2025-01-02T08:00:00Z',
        updatedAt: '2025-01-08T12:00:00Z',
        requiredSkills: ['Security', 'Mobile', 'Penetration Testing'],
        progress: 45
      }
    ];
  }
};

export function useApi<T>(apiCall: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}