import { BaseService, ApiResponse } from './base.service';
import { 
  Activity, 
  ActivityType, 
  ActivityQueryParams,
  ActivitySummary,
  ActivityStats
} from '../../types/activity';

export class ActivityService extends BaseService<Activity> {
  constructor() {
    super('activities');
  }

  async getActivities(params: ActivityQueryParams = {}): Promise<ApiResponse<Activity[]>> {
    return this.getAll(params);
  }

  async getActivityById(id: string): Promise<ApiResponse<Activity>> {
    return this.getById(id);
  }

  async logActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Promise<ApiResponse<Activity>> {
    return this.create(activity);
  }

  async getUserActivities(
    userId: string, 
    params: Omit<ActivityQueryParams, 'userId'> = {}
  ): Promise<ApiResponse<Activity[]>> {
    return this.getAll({ ...params, userId });
  }

  async getRecentActivities(limit: number = 10): Promise<ApiResponse<Activity[]>> {
    return this.getAll({ 
      limit,
      sortBy: 'timestamp',
      sortOrder: 'desc' 
    });
  }

  async getActivitySummary(
    params: Omit<ActivityQueryParams, 'groupBy'>
  ): Promise<ApiResponse<ActivitySummary[]>> {
    return this.request(`${this.endpoint}/summary?${new URLSearchParams(params as any).toString()}`, {
      method: 'GET',
    }) as Promise<ApiResponse<ActivitySummary[]>>;
  }

  async getActivityStats(
    params: Omit<ActivityQueryParams, 'groupBy'>
  ): Promise<ApiResponse<ActivityStats>> {
    return this.request(`${this.endpoint}/stats?${new URLSearchParams(params as any).toString()}`, {
      method: 'GET',
    }) as Promise<ApiResponse<ActivityStats>>;
  }

  async exportActivities(
    format: 'csv' | 'json' = 'json',
    params?: ActivityQueryParams
  ): Promise<ApiResponse<{ url: string }>> {
    return this.request(`${this.endpoint}/export?format=${format}&${new URLSearchParams(params as any).toString()}`, {
      method: 'GET',
    }) as Promise<ApiResponse<{ url: string }>>;
  }

  async clearActivities(params: ActivityQueryParams = {}): Promise<ApiResponse<{ count: number }>> {
    return this.request(`${this.endpoint}/clear?${new URLSearchParams(params as any).toString()}`, {
      method: 'DELETE',
    }) as Promise<ApiResponse<{ count: number }>>;
  }
}

export const activityService = new ActivityService();
