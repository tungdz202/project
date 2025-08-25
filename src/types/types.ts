export interface Incident {
  id: string;
  title: string;
  description: string;
  status: 'new' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  errorType: string;
  assignedDev: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  attachments?: string[];
}

export interface Developer {
  id: string;
  name: string;
  email: string;
  activeIncidents: number;
  totalResolved: number;
}

export interface Document {
  id: string;
  title: string;
  errorType: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
  viewPermissions: string[];
}

export interface AIAdvice {
  suggestion: string;
  confidence: number;
  relatedDocs: string[];
}