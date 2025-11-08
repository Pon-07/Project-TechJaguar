export type UserRole = 'farmer' | 'consumer' | 'warehouse' | 'admin' | 'superadmin';

export interface Address {
  street?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

// Shared user interface for the GreenLedger application
export interface User {
  id?: string;
  name: string;
  phone?: string;
  aadharNumber?: string;
  aadhaarNumber?: string;
  farmerId?: string;
  uzhavarPin?: string;
  state?: string;
  district?: string;
  village?: string;
  location?: string;
  farmSize?: number;
  landSize?: string;
  crops?: string[];
  totalIncome?: number;
  monthlyGrowth?: number;
  greenPoints?: number;
  coordinates?: { lat: number; lng: number };
  verified?: boolean;
  joinDate?: string;
  taluk?: string;
  phoneNumber?: string;
  profileImage?: string;
  role?: UserRole;
  pin?: string;
  loginTime?: string;
  email?: string;
  password?: string; // Never expose this in API responses
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; // For additional properties
  
  // Extended properties
  isActive?: boolean;
  lastLogin?: string;
  address?: Address;
  preferences?: {
    language?: string;
    theme?: 'light' | 'dark' | 'system';
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
  };
  metadata?: Record<string, any>;
}

// Interface for login flow
export interface LoginFlowProps {
  onLoginSuccess: (userData: User) => void;
  onCancel: () => void;
}

// Interface for user query parameters
export interface UserQueryParams {
  role?: UserRole;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// Interface for user update payload
export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
  address?: Partial<Address>;
  preferences?: {
    language?: string;
    theme?: 'light' | 'dark' | 'system';
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
  };
  metadata?: Record<string, any>;
}

// Interface for user creation payload
export interface CreateUserPayload extends Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin'> {}

// Interface for user search response
export interface UserSearchResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interface for Navigation component
export interface NavigationProps {
  activeModule: 'farmer' | 'warehouse' | 'consumer' | 'uzhavan' | 'profile' | 'admin';
  setActiveModule: (module: 'farmer' | 'warehouse' | 'consumer' | 'uzhavan' | 'profile' | 'admin') => void;
  user: User | null;
  onLogout?: () => void;
}

// Interface for Farmer Module
export interface FarmerModuleProps {
  user: User | null;
  setUser: (user: User | null) => void;
}