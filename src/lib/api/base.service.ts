import { API_BASE_URL } from '../../config';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export class BaseService<T> {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = `${API_BASE_URL}/${endpoint}`;
  }

  protected async request<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          error: data.message || 'An error occurred',
          status: response.status,
        };
      }

      return { data, status: response.status };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error occurred',
        status: 500,
      };
    }
  }

  async getAll(queryParams: Record<string, any> = {}): Promise<ApiResponse<T[]>> {
    const query = new URLSearchParams(queryParams).toString();
    return this.request<T[]>(`${this.endpoint}?${query}`, { method: 'GET' });
  }

  async getById(id: string | number): Promise<ApiResponse<T>> {
    return this.request<T>(`${this.endpoint}/${id}`, { method: 'GET' });
  }

  async create<D = Partial<T>>(data: D): Promise<ApiResponse<T>> {
    return this.request<T>(this.endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update<D = Partial<T>>(id: string | number, data: D): Promise<ApiResponse<T>> {
    return this.request<T>(`${this.endpoint}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(id: string | number): Promise<ApiResponse<void>> {
    return this.request<void>(`${this.endpoint}/${id}`, {
      method: 'DELETE',
    });
  }
}
