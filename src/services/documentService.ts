import { apiService } from '../hooks/useAuth';
import { Document, DocumentFilters } from '../types';

export class DocumentService {
  async getDocuments(filters?: DocumentFilters): Promise<Document[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.search) queryParams.append('search', filters.search);
      if (filters?.privacy) queryParams.append('privacy', filters.privacy);
      if (filters?.tags?.length) queryParams.append('tags', filters.tags.join(','));
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);
      if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy);
      
      const endpoint = `/documents${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await apiService.get(endpoint);
      
      // Handle paginated response from Spring Boot
      if (response.content) {
        return response.content.map(this.transformDocumentFromAPI);
      }
      
      return Array.isArray(response) ? response.map(this.transformDocumentFromAPI) : [];
    } catch (error) {
      console.error('Error fetching documents:', error);
      // Fallback to mock data for demo
      const { mockDocuments } = await import('../data/mockData');
      return mockDocuments;
    }
  }

  async getDocument(id: string): Promise<Document> {
    try {
      const response = await apiService.get(`/documents/${id}`);
      return this.transformDocumentFromAPI(response);
    } catch (error) {
      console.error('Error fetching document:', error);
      // Fallback to mock data
      const { mockDocuments } = await import('../data/mockData');
      const document = mockDocuments.find(doc => doc.id === id);
      if (!document) throw new Error('Document not found');
      return document;
    }
  }

  async createDocument(documentData: Partial<Document>): Promise<Document> {
    try {
      const payload = this.transformDocumentToAPI(documentData);
      const response = await apiService.post('/documents', payload);
      return this.transformDocumentFromAPI(response);
    } catch (error) {
      console.error('Error creating document:', error);
      // Mock successful creation for demo
      return {
        ...documentData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Document;
    }
  }

  async updateDocument(id: string, documentData: Partial<Document>): Promise<Document> {
    try {
      const payload = this.transformDocumentToAPI(documentData);
      const response = await apiService.put(`/documents/${id}`, payload);
      return this.transformDocumentFromAPI(response);
    } catch (error) {
      console.error('Error updating document:', error);
      // Mock successful update for demo
      return {
        ...documentData,
        id,
        updatedAt: new Date().toISOString(),
      } as Document;
    }
  }

  async deleteDocument(id: string): Promise<void> {
    try {
      await apiService.delete(`/documents/${id}`);
    } catch (error) {
      console.error('Error deleting document:', error);
      // Mock successful deletion for demo
    }
  }

  async uploadFile(file: File): Promise<{ url: string; type: string; size: number }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${apiService.baseURL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: formData
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      return await response.json();
    } catch (error) {
      console.error('Error uploading file:', error);
      // Mock successful upload for demo
      return {
        url: URL.createObjectURL(file),
        type: file.type.includes('pdf') ? 'pdf' : 
              file.type.includes('word') || file.type.includes('document') ? 'doc' : 'image',
        size: file.size
      };
    }
  }

  async generateAISummary(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${apiService.baseURL}/ai/generate-summary`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: formData
      });
      
      if (!response.ok) throw new Error('AI summary generation failed');
      
      const result = await response.json();
      return result.summary;
    } catch (error) {
      console.error('Error generating AI summary:', error);
      // Fallback to mock AI summary
      return this.generateMockSummary(file);
    }
  }

  async rateDocument(documentId: string, rating: number): Promise<void> {
    try {
      await apiService.post(`/documents/${documentId}/rate`, { rating });
    } catch (error) {
      console.error('Error rating document:', error);
      // Mock successful rating for demo
    }
  }

  async commentDocument(documentId: string, content: string): Promise<void> {
    try {
      await apiService.post(`/documents/${documentId}/comments`, { content });
    } catch (error) {
      console.error('Error commenting on document:', error);
      // Mock successful comment for demo
    }
  }

  // Transform API response to frontend format
  private transformDocumentFromAPI(apiDoc: any): Document {
    return {
      id: apiDoc.id?.toString(),
      title: apiDoc.title,
      content: apiDoc.content,
      summary: apiDoc.summary,
      tags: apiDoc.tags || [],
      authorId: apiDoc.authorId?.toString(),
      author: apiDoc.author ? {
        id: apiDoc.author.id?.toString(),
        username: apiDoc.author.username,
        email: apiDoc.author.email,
        fullName: apiDoc.author.fullName,
        avatar: apiDoc.author.avatar,
        group: apiDoc.author.group || apiDoc.author.groupName,
        role: apiDoc.author.role,
        createdAt: apiDoc.author.createdAt
      } : null,
      privacy: apiDoc.privacy?.toLowerCase(),
      fileUrl: apiDoc.fileUrl,
      fileType: apiDoc.fileType,
      fileSize: apiDoc.fileSize,
      ratings: apiDoc.ratings || [],
      comments: apiDoc.comments || [],
      views: apiDoc.views || 0,
      averageRating: apiDoc.averageRating || 0,
      createdAt: apiDoc.createdAt,
      updatedAt: apiDoc.updatedAt
    };
  }

  // Transform frontend data to API format
  private transformDocumentToAPI(doc: Partial<Document>): any {
    return {
      title: doc.title,
      content: doc.content,
      summary: doc.summary,
      tags: doc.tags,
      privacy: doc.privacy?.toUpperCase(),
      fileUrl: doc.fileUrl,
      fileType: doc.fileType,
      fileSize: doc.fileSize
    };
  }

  // Mock AI summary generation
  private async generateMockSummary(file: File): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const fileName = file.name.toLowerCase();
    if (fileName.includes('react') || fileName.includes('javascript')) {
      return 'Tài liệu này cung cấp hướng dẫn chi tiết về React và JavaScript, bao gồm các khái niệm cơ bản, best practices và ví dụ thực tế. Phù hợp cho developers muốn nâng cao kỹ năng frontend development.';
    } else if (fileName.includes('database') || fileName.includes('sql')) {
      return 'Tài liệu hướng dẫn về thiết kế và quản lý cơ sở dữ liệu, bao gồm các nguyên tắc normalization, indexing strategies và performance optimization. Thích hợp cho database administrators và backend developers.';
    } else if (fileName.includes('hr') || fileName.includes('recruitment')) {
      return 'Tài liệu mô tả quy trình nhân sự và tuyển dụng, bao gồm các bước screening, phỏng vấn và onboarding. Cung cấp framework hoàn chỉnh cho việc quản lý nhân sự hiệu quả.';
    } else {
      return `Tài liệu "${file.name}" chứa thông tin quan trọng và hữu ích. Nội dung được tổ chức một cách logic và dễ hiểu, phù hợp cho mục đích học tập và tham khảo trong công việc.`;
    }
  }
}

export const documentService = new DocumentService();