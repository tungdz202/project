import { Incident, Developer, Document } from '../types/types';

export const mockDevelopers: Developer[] = [
  {
    id: 'dev1',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@company.com',
    activeIncidents: 5,
    totalResolved: 45
  },
  {
    id: 'dev2',
    name: 'Trần Thị Bình',
    email: 'binh.tran@company.com',
    activeIncidents: 3,
    totalResolved: 38
  },
  {
    id: 'dev3',
    name: 'Lê Minh Cường',
    email: 'cuong.le@company.com',
    activeIncidents: 7,
    totalResolved: 52
  },
  {
    id: 'dev4',
    name: 'Phạm Thu Dung',
    email: 'dung.pham@company.com',
    activeIncidents: 2,
    totalResolved: 29
  }
];

export const mockIncidents: Incident[] = [
  {
    id: 'INC001',
    title: 'Lỗi đăng nhập không thành công',
    description: 'Người dùng không thể đăng nhập vào hệ thống sau khi nhập đúng thông tin',
    status: 'in-progress',
    priority: 'high',
    errorType: 'Authentication',
    assignedDev: 'dev1',
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-15T10:15:00Z',
    dueDate: '2024-01-17T17:00:00Z'
  },
  {
    id: 'INC002',
    title: 'Database connection timeout',
    description: 'Kết nối đến database bị timeout trong giờ cao điểm',
    status: 'new',
    priority: 'critical',
    errorType: 'Database',
    assignedDev: 'dev3',
    createdAt: '2024-01-15T14:20:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    dueDate: '2024-01-16T09:00:00Z'
  },
  {
    id: 'INC003',
    title: 'UI hiển thị sai trên mobile',
    description: 'Giao diện bị vỡ layout khi hiển thị trên thiết bị mobile',
    status: 'resolved',
    priority: 'medium',
    errorType: 'Frontend',
    assignedDev: 'dev2',
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-15T16:30:00Z',
    dueDate: '2024-01-18T17:00:00Z'
  },
  {
    id: 'INC004',
    title: 'API response chậm',
    description: 'Thời gian phản hồi của API quá chậm, ảnh hưởng đến trải nghiệm người dùng',
    status: 'in-progress',
    priority: 'high',
    errorType: 'Backend',
    assignedDev: 'dev4',
    createdAt: '2024-01-13T11:45:00Z',
    updatedAt: '2024-01-15T09:20:00Z',
    dueDate: '2024-01-16T17:00:00Z'
  },
  {
    id: 'INC005',
    title: 'Email không gửi được',
    description: 'Hệ thống email notification không hoạt động',
    status: 'new',
    priority: 'medium',
    errorType: 'Email',
    assignedDev: 'dev1',
    createdAt: '2024-01-15T16:00:00Z',
    updatedAt: '2024-01-15T16:00:00Z',
    dueDate: '2024-01-17T17:00:00Z'
  }
];

export const mockDocuments: Document[] = [
  {
    id: 'DOC001',
    title: 'Hướng dẫn xử lý lỗi Authentication',
    errorType: 'Authentication',
    content: `## Nguyên nhân thường gặp:
    
1. Token hết hạn
2. Sai thông tin đăng nhập
3. Session timeout
4. Lỗi cấu hình JWT

## Các bước xử lý:

1. **Kiểm tra token**: Verify token expiration và signature
2. **Reset session**: Clear session và redirect về login
3. **Check database**: Kiểm tra user credentials trong DB
4. **Log analysis**: Xem log để identify root cause

## Code sample:
\`\`\`javascript
// Kiểm tra token validity
const isTokenValid = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return Date.now() < decoded.exp * 1000;
  } catch (error) {
    return false;
  }
};
\`\`\``,
    priority: 'high',
    createdBy: 'Nguyễn Văn An',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    viewPermissions: ['all']
  },
  {
    id: 'DOC002',
    title: 'Tối ưu Database Performance',
    errorType: 'Database',
    content: `## Nguyên nhân database chậm:

1. Missing indexes
2. N+1 query problem
3. Connection pool exhausted
4. Large dataset without pagination

## Giải pháp:

1. **Tạo indexes**: Thêm indexes cho các trường thường query
2. **Query optimization**: Sử dụng JOIN thay vì multiple queries
3. **Connection pooling**: Cấu hình connection pool phù hợp
4. **Caching**: Implement Redis caching cho data ít thay đổi

## Monitoring:
- Sử dụng EXPLAIN ANALYZE để check query performance
- Monitor connection count
- Set up alerts cho slow queries`,
    priority: 'critical',
    createdBy: 'Lê Minh Cường',
    createdAt: '2024-01-08T15:30:00Z',
    updatedAt: '2024-01-12T09:15:00Z',
    viewPermissions: ['senior', 'lead']
  },
  {
    id: 'DOC003',
    title: 'Frontend Responsive Design Issues',
    errorType: 'Frontend',
    content: `## Common responsive issues:

1. Fixed width elements
2. Improper CSS media queries
3. Image sizing problems
4. Text overflow

## Solutions:

1. **Use flexbox/grid**: Modern CSS layout techniques
2. **Mobile-first approach**: Design for mobile then scale up
3. **Test on real devices**: Don't rely only on browser dev tools
4. **CSS frameworks**: Consider using Tailwind or Bootstrap

## Best practices:
- Use relative units (rem, %, vw, vh)
- Implement proper breakpoints
- Optimize images for different screen sizes`,
    priority: 'medium',
    createdBy: 'Trần Thị Bình',
    createdAt: '2024-01-09T11:20:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
    viewPermissions: ['all']
  }
];