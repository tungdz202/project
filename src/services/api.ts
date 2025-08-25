// const API_BASE_URL = 'https://hackathon-u4gi.onrender.com/api/developers';
const API_BASE_URL = 'https://selected-duck-ethical.ngrok-free.app/api';

// Generic API function
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Handle empty responses (like DELETE)
    if (response.status === 204) {
      return {} as T;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

// Incident API
export const incidentAPI = {
  getAll: () => apiCall<any[]>('/incidents'),
  getById: (id: number) => apiCall<any>(`/incidents/${id}`),
  create: (incident: any) => apiCall<any>('/incidents', {
    method: 'POST',
    body: JSON.stringify(incident),
  }),
  update: (id: number, incident: any) => apiCall<any>(`/incidents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(incident),
  }),
  delete: (id: number) => apiCall<void>(`/incidents/${id}`, {
    method: 'DELETE',
  }),
  search: (keyword: string) => apiCall<any[]>(`/incidents/search?keyword=${encodeURIComponent(keyword)}`),
  getByStatus: (status: string) => apiCall<any[]>(`/incidents/status/${status}`),
  getByPriority: (priority: string) => apiCall<any[]>(`/incidents/priority/${priority}`),
  getStatistics: () => apiCall<Record<string, number>>('/incidents/statistics'),
  getAIAdvice: (id: number) => apiCall<any>(`/incidents/${id}/ai-advice`),
};

// Developer API
export const developerAPI = {
  getAll: () => apiCall<any[]>('/developers'),
  getById: (id: number) => apiCall<any>(`/developers/${id}`),
  create: (developer: any) => apiCall<any>('/developers', {
    method: 'POST',
    body: JSON.stringify(developer),
  }),
  update: (id: number, developer: any) => apiCall<any>(`/developers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(developer),
  }),
  delete: (id: number) => apiCall<void>(`/developers/${id}`, {
    method: 'DELETE',
  }),
  getTop: () => apiCall<any[]>('/developers/top'),
};

// Document API
export const documentAPI = {
  getAll: () => apiCall<any[]>('/documents'),
  getById: (id: number) => apiCall<any>(`/documents/${id}`),
  create: (document: any) => apiCall<any>('/documents', {
    method: 'POST',
    body: JSON.stringify(document),
  }),
  update: (id: number, document: any) => apiCall<any>(`/documents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(document),
  }),
  delete: (id: number) => apiCall<void>(`/documents/${id}`, {
    method: 'DELETE',
  }),
  search: (keyword: string) => apiCall<any[]>(`/documents/search?keyword=${encodeURIComponent(keyword)}`),
  getByErrorType: (errorType: string) => apiCall<any[]>(`/documents/error-type/${errorType}`),
  getByPriority: (priority: string) => apiCall<any[]>(`/documents/priority/${priority}`),
};