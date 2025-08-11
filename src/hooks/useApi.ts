import { useState, useEffect } from 'react';
import { Developer, Project, Task, KPI } from '../types';
import axios from 'axios';

// Mock API functions with realistic delays
export const api = {
  getDashboardKPIs: async (project?: string, status?: string): Promise<KPI> => {
    const response = await axios.get('https://selected-duck-ethical.ngrok-free.app/api/dashboard', {
      params: {
        project: project || '',
        status: status || '',
      },
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
    });
    return response.data;
  },

  getDevelopers: async (): Promise<Developer[]> => {
    const response = await axios.get('https://selected-duck-ethical.ngrok-free.app/api/employees', {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
    });
    return response.data;
  },

  getProjects: async (): Promise<Project[]> => {
    const response = await axios.get('https://selected-duck-ethical.ngrok-free.app/api/projects', {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
    });
    return response.data;
  },

  getTasks: async (inputText: string, project: string, assignee:string, status: string): Promise<Task[]> => {
    const response = await axios.get('https://selected-duck-ethical.ngrok-free.app/api/tasks', {
      params: {
        inputText: inputText,
        project: project,
        assignee: assignee,
        status: status
      },
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
    });
    return response.data;
  },

  getRecommendProject: async (id: number): Promise<Task[]> => {
    const response = await axios.post('https://selected-duck-ethical.ngrok-free.app/smart-segregate',
        null,
        {
          params: {
            id: id
          },
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
        });
    return response.data;
  },

  updateTask: async (body: any): Promise<void> => {
    const response = await axios.put('https://selected-duck-ethical.ngrok-free.app/api/tasks',
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
        });
    return response.data;
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