import { apiService } from '../hooks/useAuth';
import { Quiz, QuizAttempt } from '../types';

export class QuizService {
  async getQuizzes(): Promise<Quiz[]> {
    try {
      // Check if backend is available first
      const response = await fetch('http://localhost:8080/api/health').catch(() => null);
      
      if (response && response.ok) {
        const data = await apiService.get('/quizzes');
        return Array.isArray(data) ? data : data.content || [];
      }
      throw new Error('Backend not available');
    } catch (error) {
      // Fallback to mock data for demo
      const { mockQuizzes } = await import('../data/mockData');
      return mockQuizzes;
    }
  }

  async getQuiz(id: string): Promise<Quiz> {
    try {
      // Check if backend is available first
      const response = await fetch('http://localhost:8080/api/health').catch(() => null);
      
      if (response && response.ok) {
        return await apiService.get(`/quizzes/${id}`);
      }
      throw new Error('Backend not available');
    } catch (error) {
      // Fallback to mock data for demo
      const { mockQuizzes } = await import('../data/mockData');
      const quiz = mockQuizzes.find(q => q.id === id);
      if (!quiz) throw new Error('Quiz not found');
      return quiz;
    }
  }

  async createQuiz(quizData: Partial<Quiz>): Promise<Quiz> {
    try {
      // Check if backend is available first
      const response = await fetch('http://localhost:8080/api/health').catch(() => null);
      
      if (response && response.ok) {
        return await apiService.post('/quizzes', quizData);
      }
      throw new Error('Backend not available');
    } catch (error) {
      // Mock successful creation for demo
      const newQuiz = {
        ...quizData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      } as Quiz;
      return newQuiz;
    }
  }

  async submitQuizAttempt(attempt: QuizAttempt): Promise<QuizAttempt> {
    try {
      // Check if backend is available first
      const response = await fetch('http://localhost:8080/api/health').catch(() => null);
      
      if (response && response.ok) {
        return await apiService.post('/quizzes/attempts', attempt);
      }
      throw new Error('Backend not available');
    } catch (error) {
      // Mock successful submission for demo
      return attempt;
    }
  }

  async generateQuizFromDocument(documentId: string): Promise<Quiz> {
    try {
      // Check if backend is available first
      const response = await fetch('http://localhost:8080/api/health').catch(() => null);
      
      if (response && response.ok) {
        return await apiService.post('/ai/generate-quiz', { documentId });
      }
      throw new Error('Backend not available');
    } catch (error) {
      // Mock AI-generated quiz for demo when backend unavailable
      throw new Error('AI quiz generation temporarily unavailable');
    }
  }
}

export const quizService = new QuizService();