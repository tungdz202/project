export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  group: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  summary: string;
  tags: string[];
  authorId: string;
  author: User;
  privacy: 'private' | 'group' | 'public';
  fileUrl?: string;
  fileType?: 'pdf' | 'doc' | 'image';
  fileSize?: number;
  ratings: Rating[];
  comments: Comment[];
  views: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  id: string;
  userId: string;
  user: User;
  documentId: string;
  rating: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  documentId: string;
  content: string;
  createdAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  documentId: string;
  document: Document;
  questions: Question[];
  authorId: string;
  author: User;
  createdAt: string;
}

export interface Question {
  id: string;
  content: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  user: User;
  quizId: string;
  quiz: Quiz;
  answers: number[];
  score: number;
  completedAt: string;
}

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
};

export type DocumentFilters = {
  search: string;
  tags: string[];
  privacy: string;
  dateFrom: string;
  dateTo: string;
  group: string;
  sortBy: 'newest' | 'oldest' | 'rating' | 'views';
};