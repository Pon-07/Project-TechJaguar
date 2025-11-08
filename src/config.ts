// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Authentication Configuration
export const AUTH_CONFIG = {
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  tokenExpiryKey: 'token_expiry',
};

// App Configuration
export const APP_CONFIG = {
  name: 'GreenLedger',
  version: '1.0.0',
  defaultPageSize: 10,
  maxUploadSize: 5 * 1024 * 1024, // 5MB
};

// Feature Flags
export const FEATURE_FLAGS = {
  enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  enableExperimentalFeatures: false,
};

// Export all configs
export default {
  API_BASE_URL,
  AUTH_CONFIG,
  APP_CONFIG,
  FEATURE_FLAGS,
};
