import { BaseService, ApiResponse } from './base.service';
import { 
  User, 
  UserRole, 
  UserQueryParams, 
  UpdateUserPayload, 
  CreateUserPayload,
  UserSearchResponse
} from '../../types/user';


export class UserService extends BaseService<User> {
  constructor() {
    super('users');
  }

  async getUsers(params: UserQueryParams = {}): Promise<ApiResponse<User[]>> {
    return this.getAll(params);
  }

  async getUserById(id: string) {
    return this.getById(id);
  }

  async createUser(userData: CreateUserPayload): Promise<ApiResponse<User>> {
    return this.create(userData);
  }

  async updateUser(id: string, userData: UpdateUserPayload): Promise<ApiResponse<User>> {
    return this.update(id, userData);
  }

  async deleteUser(id: string) {
    return this.delete(id);
  }

  async updateUserRole(id: string, role: UserRole) {
    return this.request<User>(`${this.endpoint}/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  async updateUserStatus(id: string, isActive: boolean) {
    return this.request<User>(`${this.endpoint}/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  }

  async searchUsers(query: string): Promise<ApiResponse<UserSearchResponse>> {
    return this.request(`${this.endpoint}/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
    }) as Promise<ApiResponse<UserSearchResponse>>;
  }

  async getActivityLogs(userId: string, params: { limit?: number } = {}): Promise<ApiResponse<any[]>> {
    const query = new URLSearchParams();
    if (params.limit) query.append('limit', params.limit.toString());
    
    return this.request<any[]>(`${this.endpoint}/${userId}/activity?${query.toString()}`, {
      method: 'GET',
    });
  }
}

export const userService = new UserService();
