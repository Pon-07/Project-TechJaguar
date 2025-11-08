export type ActivityType =
  | 'user:login'
  | 'user:logout'
  | 'user:profile_update'
  | 'user:password_change'
  | 'user:created'
  | 'user:deactivated'
  | 'product:created'
  | 'product:updated'
  | 'product:deleted'
  | 'order:created'
  | 'order:updated'
  | 'order:status_changed'
  | 'order:cancelled'
  | 'inventory:updated'
  | 'inventory:low_stock'
  | 'payment:received'
  | 'payment:refunded'
  | 'shipment:created'
  | 'shipment:delivered'
  | 'api:request'
  | 'system:maintenance'
  | 'system:backup'
  | 'system:error'
  | string; // Allow for custom activity types

export interface Activity {
  id: string;
  type: ActivityType;
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
  timestamp: string;
  resourceType?: string;
  resourceId?: string;
  status?: 'success' | 'failed' | 'pending';
  error?: string;
  duration?: number; // in milliseconds
}

export interface ActivityQueryParams {
  userId?: string;
  type?: ActivityType | ActivityType[];
  resourceType?: string;
  resourceId?: string;
  status?: 'success' | 'failed' | 'pending';
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: 'timestamp' | 'type' | 'userId';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  groupBy?: 'type' | 'status' | 'resourceType' | 'userId' | 'day' | 'hour';
}

export interface ActivitySummary {
  date: string;
  count: number;
  types: Record<string, number>;
  statuses: {
    success: number;
    failed: number;
    pending: number;
  };
}

export interface ActivityStats {
  total: number;
  last24Hours: number;
  byType: Array<{ type: string; count: number }>;
  byStatus: {
    success: number;
    failed: number;
    pending: number;
  };
  byResourceType: Array<{ type: string; count: number }>;
  byHour: Array<{ hour: number; count: number }>;
  byDay: Array<{ day: string; count: number }>;
  topUsers: Array<{ userId: string; count: number; name?: string }>;
}

export interface ActivityExportOptions {
  format: 'csv' | 'json' | 'xlsx';
  fields?: string[];
  filter?: Partial<ActivityQueryParams>;
  includeUserInfo?: boolean;
  includeMetadata?: boolean;
}
