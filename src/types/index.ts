export interface Developer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'AVAILABLE' | 'BUSY' | 'OVERLOADED' | 'offline';
  skills: Skill[];
  workloadHours: number;
  maxCapacity: number;
  completionRate: number;
  avgTaskTime: number;
  activeProjects: string[];
  recentActivity: Activity[];
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'DevOps' | 'Design' | 'Mobile' | 'Data';
  level: 1 | 2 | 3 | 4 | 5;
  verified: boolean;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  pm: string;
  startDate: string;
  endDate: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'PLANNING';
  progress: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  teamSize: number;
  taskCount: number;
  budget?: number;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  assigneeId: string;
  assigneeName: string,
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' ;
  estimateHours: number;
  actualHours?: number;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  requiredSkills: string[];
  // progress: number;
  subtasks?: Subtask[];
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  description: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Activity {
  id: string;
  type: 'task_completed' | 'project_assigned' | 'skill_updated' | 'comment_added';
  description: string;
  timestamp: string;
  relatedId?: string;
}

export interface KPI {
  totalTasks: number;
  onTimeRate: number;
  overdueTasks: number;
  overloadedDevs: number;
  projectsAtRisk: number;
}

export interface FilterState {
  projects?: string[];
  teams?: string[];
  developers?: string[];
  status?: string[];
  priority?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface FilterSearch {
  project?: string;
  status?: string;
}

export interface NotificationSettings {
  email: boolean;
  slack: boolean;
  teams: boolean;
  reminderDays: number;
}

export type ViewMode = 'table' | 'kanban' | 'calendar';
export type DateRange = 'today' | 'week' | 'month' | 'quarter' | 'custom';