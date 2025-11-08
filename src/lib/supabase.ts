import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;

let supabase: any;
let supabaseError: string | null = null;

try {
  supabase = createClient(supabaseUrl, publicAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
} catch (error: any) {
  console.error('Failed to initialize Supabase:', error);
  supabaseError = error.message || 'Failed to connect to Supabase';
  // Create a mock client that will fail gracefully
  supabase = null;
}

export { supabase, supabaseError };

// Check if Supabase is available
const isSupabaseAvailable = () => {
  return supabase !== null && !supabaseError;
};

// Check if error is a network/fetch error
const isNetworkError = (error: any) => {
  if (!error) return false;
  const errorMessage = error.message?.toLowerCase() || '';
  const errorString = String(error).toLowerCase();
  return (
    errorMessage.includes('failed to fetch') ||
    errorMessage.includes('network error') ||
    errorMessage.includes('networkerror') ||
    errorMessage.includes('fetch error') ||
    errorString.includes('failed to fetch') ||
    errorString.includes('network error') ||
    error?.code === 'ECONNREFUSED' ||
    error?.code === 'ENOTFOUND' ||
    error?.code === 'ETIMEDOUT'
  );
};

// Fallback to localStorage if Supabase is not available
const fallbackSignUp = (email: string, password: string, userData: any) => {
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const user = {
    id: userId,
    email,
    name: userData.name || email.split('@')[0],
    role: userData.role || 'farmer',
    phone: userData.phone || '',
    state: userData.state || '',
    district: userData.district || '',
    village: userData.village || '',
    uzhavarPin: userData.uzhavarPin || `UZP-${userId.slice(-6)}`,
    location: userData.location || `${userData.state || ''}, ${userData.district || ''}`.trim() || 'Unknown',
    verified: userData.verified || false,
    joinDate: userData.joinDate || new Date().toISOString(),
    ...userData,
    createdAt: new Date().toISOString()
  };
  
  // Store in localStorage
  const users = JSON.parse(localStorage.getItem('greenledger-users') || '[]');
  users.push({ ...user, password: btoa(password) }); // Simple encoding (not secure, but better than plain text)
  localStorage.setItem('greenledger-users', JSON.stringify(users));
  
  // Store current user
  localStorage.setItem('greenledger-user', JSON.stringify(user));
  localStorage.setItem('greenledger-session', JSON.stringify({
    userId,
    email,
    createdAt: new Date().toISOString(),
    user
  }));
  
  return { data: { user, session: { user } }, error: null };
};

// Auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string, userData: {
    name: string;
    role?: 'farmer' | 'consumer' | 'warehouse' | 'admin';
    phone?: string;
    [key: string]: any;
  }) => {
    // Use fallback if Supabase is not available
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not available, using localStorage fallback');
      try {
        return fallbackSignUp(email, password, userData);
      } catch (error: any) {
        return { data: null, error: { message: error.message || 'Failed to create account' } };
      }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) {
        // If Supabase fails, try fallback
        console.warn('Supabase signup failed, trying fallback:', error);
        return fallbackSignUp(email, password, userData);
      }
      
      return { data, error };
    } catch (error: any) {
      console.error('Signup error:', error);
      // Try fallback on error
      try {
        return fallbackSignUp(email, password, userData);
      } catch (fallbackError: any) {
        return { 
          data: null, 
          error: { 
            message: error.message || 'Failed to create account. Please check your internet connection.' 
          } 
        };
      }
    }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    // Use fallback if Supabase is not available
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not available, using localStorage fallback');
      try {
        const users = JSON.parse(localStorage.getItem('greenledger-users') || '[]');
        const user = users.find((u: any) => u.email === email && atob(u.password) === password);
        
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          // Ensure user has required fields
          const completeUser = {
            ...userWithoutPassword,
            name: userWithoutPassword.name || userWithoutPassword.email?.split('@')[0] || 'User',
            role: userWithoutPassword.role || 'farmer',
            location: userWithoutPassword.location || `${userWithoutPassword.state || ''}, ${userWithoutPassword.district || ''}`.trim() || 'Unknown',
            uzhavarPin: userWithoutPassword.uzhavarPin || `UZP-${userWithoutPassword.id?.slice(-6) || '000000'}`
          };
          localStorage.setItem('greenledger-user', JSON.stringify(completeUser));
          localStorage.setItem('greenledger-session', JSON.stringify({
            userId: completeUser.id,
            email: completeUser.email,
            user: completeUser
          }));
          return { data: { user: completeUser, session: { user: completeUser } }, error: null };
        } else {
          return { data: null, error: { message: 'Invalid email or password' } };
        }
      } catch (error: any) {
        return { data: null, error: { message: error.message || 'Login failed' } };
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error || isNetworkError(error)) {
        // Try fallback if Supabase fails or network error
        console.warn('Supabase login failed, trying fallback:', error);
        return fallbackSignIn(email, password);
      }
      
      return { data, error };
    } catch (error: any) {
      console.warn('Login exception, trying fallback:', error);
      // Always try fallback on any error
      const fallbackResult = fallbackSignIn(email, password);
      if (fallbackResult.error) {
        return { 
          data: null, 
          error: { 
            message: 'Using offline mode. ' + (fallbackResult.error.message || 'Login failed. Please check your credentials.') 
          } 
        };
      }
      return fallbackResult;
    }
  },

  // Sign out
  signOut: async () => {
    if (!isSupabaseAvailable()) {
      localStorage.removeItem('greenledger-user');
      localStorage.removeItem('greenledger-session');
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signOut();
      // Also clear localStorage
      localStorage.removeItem('greenledger-user');
      localStorage.removeItem('greenledger-session');
      return { error };
    } catch (error: any) {
      // Clear localStorage even on error
      localStorage.removeItem('greenledger-user');
      localStorage.removeItem('greenledger-session');
      return { error };
    }
  },

  // Get current session
  getSession: async () => {
    if (!isSupabaseAvailable()) {
      const sessionData = localStorage.getItem('greenledger-session');
      if (sessionData) {
        return { session: JSON.parse(sessionData), error: null };
      }
      return { session: null, error: null };
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      return { session, error };
    } catch (error: any) {
      // Fallback to localStorage
      const sessionData = localStorage.getItem('greenledger-session');
      if (sessionData) {
        return { session: JSON.parse(sessionData), error: null };
      }
      return { session: null, error };
    }
  },

  // Get current user
  getUser: async () => {
    if (!isSupabaseAvailable()) {
      const userData = localStorage.getItem('greenledger-user');
      if (userData) {
        return { user: JSON.parse(userData), error: null };
      }
      return { user: null, error: null };
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        // Fallback to localStorage
        const userData = localStorage.getItem('greenledger-user');
        if (userData) {
          return { user: JSON.parse(userData), error: null };
        }
      }
      return { user, error };
    } catch (error: any) {
      // Fallback to localStorage
      const userData = localStorage.getItem('greenledger-user');
      if (userData) {
        return { user: JSON.parse(userData), error: null };
      }
      return { user: null, error };
    }
  },

  // Update user
  updateUser: async (updates: {
    email?: string;
    password?: string;
    data?: Record<string, any>;
  }) => {
    const { data, error } = await supabase.auth.updateUser(updates);
    return { data, error };
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    return { data, error };
  },

  // On auth state change
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    if (!isSupabaseAvailable()) {
      // Return a mock subscription that does nothing
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    }
    try {
      return supabase.auth.onAuthStateChange(callback);
    } catch (error) {
      console.warn('Auth state change not available:', error);
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    }
  },

  // Sign in with phone number
  signInWithPhone: async (phone: string, action: 'send-otp' | 'verify-otp' | 'set-password', otp?: string, password?: string) => {
    // Use fallback if Supabase is not available
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not available, using localStorage fallback for phone login');
      return fallbackPhoneAuth(phone, action, otp, password);
    }

    try {
      if (action === 'send-otp') {
        // Send OTP via Supabase
        const { data, error } = await supabase.auth.signInWithOtp({
          phone: `+91${phone}`,
          options: {
            channel: 'sms'
          }
        });
        if (error || isNetworkError(error)) {
          console.warn('Supabase OTP send failed, using fallback');
          return fallbackPhoneAuth(phone, action, otp, password);
        }
        return { data, error };
      } else if (action === 'verify-otp' && otp) {
        // Verify OTP
        const { data, error } = await supabase.auth.verifyOtp({
          phone: `+91${phone}`,
          token: otp,
          type: 'sms'
        });
        if (error || isNetworkError(error)) {
          console.warn('Supabase OTP verify failed, using fallback');
          return fallbackPhoneAuth(phone, action, otp, password);
        }
        return { data, error };
      } else if (action === 'set-password' && password) {
        // Set password for new user
        const { data, error } = await supabase.auth.updateUser({
          password: password
        });
        if (error || isNetworkError(error)) {
          console.warn('Supabase password set failed, using fallback');
          return fallbackPhoneAuth(phone, action, otp, password);
        }
        return { data, error };
      }
      return { data: null, error: { message: 'Invalid action' } };
    } catch (error: any) {
      console.warn('Supabase phone auth exception, using fallback:', error);
      return fallbackPhoneAuth(phone, action, otp, password);
    }
  },

  // Sign in with Aadhaar
  // Sign in with Google/Gmail OAuth
  signInWithGoogle: async (role?: 'farmer' | 'consumer' | 'warehouse' | 'admin') => {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not available for Google OAuth');
      return { 
        data: null, 
        error: { 
          message: 'Google OAuth requires Supabase connection. Please check your internet connection.' 
        } 
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: role 
            ? `${window.location.origin}/auth/callback?role=${role}`
            : `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          // Pass role as metadata if provided
          ...(role && {
            data: {
              role: role
            }
          })
        }
      });

      if (error) {
        console.error('Google OAuth error:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Google OAuth exception:', error);
      return { 
        data: null, 
        error: { 
          message: error.message || 'Failed to initiate Google sign-in. Please try again.' 
        } 
      };
    }
  },

  signInWithAadhaar: async (aadhaar: string, action: 'verify-aadhaar' | 'send-otp' | 'verify-otp', phone?: string, otp?: string) => {
    // Use fallback if Supabase is not available
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not available, using localStorage fallback for Aadhaar login');
      return fallbackAadhaarAuth(aadhaar, action, phone, otp);
    }

    try {
      if (action === 'verify-aadhaar') {
        // Verify Aadhaar (in real app, this would call Aadhaar verification API)
        // For now, we'll use fallback
        return fallbackAadhaarAuth(aadhaar, action, phone, otp);
      } else if (action === 'send-otp' && phone) {
        // Send OTP to phone after Aadhaar verification
        const { data, error } = await supabase.auth.signInWithOtp({
          phone: `+91${phone}`,
          options: {
            channel: 'sms',
            data: {
              aadhaar: aadhaar
            }
          }
        });
        if (error || isNetworkError(error)) {
          console.warn('Supabase Aadhaar OTP send failed, using fallback');
          return fallbackAadhaarAuth(aadhaar, action, phone, otp);
        }
        return { data, error };
      } else if (action === 'verify-otp' && phone && otp) {
        // Verify OTP
        const { data, error } = await supabase.auth.verifyOtp({
          phone: `+91${phone}`,
          token: otp,
          type: 'sms'
        });
        if (error || isNetworkError(error)) {
          console.warn('Supabase Aadhaar OTP verify failed, using fallback');
          return fallbackAadhaarAuth(aadhaar, action, phone, otp);
        }
        return { data, error };
      }
      return { data: null, error: { message: 'Invalid action or missing parameters' } };
    } catch (error: any) {
      console.warn('Supabase Aadhaar auth exception, using fallback:', error);
      return fallbackAadhaarAuth(aadhaar, action, phone, otp);
    }
  }
};

// Fallback sign in using localStorage
const fallbackSignIn = (email: string, password: string) => {
  try {
    const users = JSON.parse(localStorage.getItem('greenledger-users') || '[]');
    const user = users.find((u: any) => u.email === email && atob(u.password) === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      // Ensure user has required fields
      const completeUser = {
        ...userWithoutPassword,
        name: userWithoutPassword.name || userWithoutPassword.email?.split('@')[0] || 'User',
        role: userWithoutPassword.role || 'farmer',
        location: userWithoutPassword.location || `${userWithoutPassword.state || ''}, ${userWithoutPassword.district || ''}`.trim() || 'Unknown',
        uzhavarPin: userWithoutPassword.uzhavarPin || `UZP-${userWithoutPassword.id?.slice(-6) || '000000'}`
      };
      localStorage.setItem('greenledger-user', JSON.stringify(completeUser));
      localStorage.setItem('greenledger-session', JSON.stringify({
        userId: completeUser.id,
        email: completeUser.email,
        user: completeUser
      }));
      return { data: { user: completeUser, session: { user: completeUser } }, error: null };
    } else {
      return { data: null, error: { message: 'Invalid email or password' } };
    }
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'Login failed' } };
  }
};

// Fallback phone authentication using localStorage
const fallbackPhoneAuth = (phone: string, action: 'send-otp' | 'verify-otp' | 'set-password', otp?: string, password?: string) => {
  try {
    const users = JSON.parse(localStorage.getItem('greenledger-users') || '[]');
    
    if (action === 'send-otp') {
      // Generate and store OTP (demo: use 123456)
      const demoOtp = '123456';
      localStorage.setItem(`greenledger-otp-${phone}`, JSON.stringify({
        otp: demoOtp,
        phone,
        expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
      }));
      return { data: { success: true }, error: null };
    } else if (action === 'verify-otp' && otp) {
    // Verify OTP
    const otpData = localStorage.getItem(`greenledger-otp-${phone}`);
    if (!otpData) {
      return { data: null, error: { message: 'OTP expired or not found' } };
    }
    
    const parsed = JSON.parse(otpData);
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(`greenledger-otp-${phone}`);
      return { data: null, error: { message: 'OTP expired' } };
    }
    
    if (parsed.otp !== otp && otp !== '123456') { // Allow demo OTP
      return { data: null, error: { message: 'Invalid OTP' } };
    }
    
    // Find or create user
    let user = users.find((u: any) => u.phone === phone || u.phoneNumber === phone);
    
    if (!user) {
      // Create new user automatically
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      user = {
        id: userId,
        phone,
        phoneNumber: phone,
        name: `User ${phone.slice(-4)}`,
        role: 'farmer',
        verified: true, // Auto-verify for demo
        joinDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        location: 'Unknown',
        uzhavarPin: `UZP-${userId.slice(-6)}`
      };
      users.push(user);
      localStorage.setItem('greenledger-users', JSON.stringify(users));
      console.log('✅ Created new user automatically for phone:', phone);
    }
    
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem('greenledger-user', JSON.stringify(userWithoutPassword));
    localStorage.setItem('greenledger-session', JSON.stringify({
      userId: userWithoutPassword.id,
      phone: userWithoutPassword.phone,
      user: userWithoutPassword
    }));
    localStorage.removeItem(`greenledger-otp-${phone}`);
    
    return { 
      data: { 
        user: userWithoutPassword, 
        session: { user: userWithoutPassword },
        requiresPassword: !user.password
      }, 
      error: null 
    };
  } else if (action === 'set-password' && password) {
    // Set password for user
    const userData = localStorage.getItem('greenledger-user');
    if (!userData) {
      return { data: null, error: { message: 'User not found' } };
    }
    
    const user = JSON.parse(userData);
    const userIndex = users.findIndex((u: any) => u.id === user.id || (u.phone === user.phone || u.phoneNumber === user.phone));
    
    if (userIndex !== -1) {
      users[userIndex].password = btoa(password);
      localStorage.setItem('greenledger-users', JSON.stringify(users));
    }
    
    return { data: { success: true }, error: null };
  }
  
  return { data: null, error: { message: 'Invalid action' } };
  } catch (error: any) {
    console.error('Fallback phone auth error:', error);
    // Even on error, try to create a basic user to allow login
    if (action === 'verify-otp' && otp && otp === '123456') {
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const user = {
        id: userId,
        phone,
        phoneNumber: phone,
        name: `User ${phone.slice(-4)}`,
        role: 'farmer',
        verified: true,
        joinDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        location: 'Unknown',
        uzhavarPin: `UZP-${userId.slice(-6)}`
      };
      localStorage.setItem('greenledger-user', JSON.stringify(user));
      localStorage.setItem('greenledger-session', JSON.stringify({
        userId: user.id,
        phone: user.phone,
        user: user
      }));
      return { 
        data: { 
          user: user, 
          session: { user: user }
        }, 
        error: null 
      };
    }
    return { data: null, error: { message: error.message || 'Authentication failed' } };
  }
};

// Fallback Aadhaar authentication using localStorage
const fallbackAadhaarAuth = (aadhaar: string, action: 'verify-aadhaar' | 'send-otp' | 'verify-otp', phone?: string, otp?: string) => {
  try {
    const users = JSON.parse(localStorage.getItem('greenledger-users') || '[]');
    
    if (action === 'verify-aadhaar') {
    // Verify Aadhaar (in real app, this would call Aadhaar verification API)
    // For demo, accept any 12-digit number
    if (aadhaar.length !== 12 || !/^\d+$/.test(aadhaar)) {
      return { data: null, error: { message: 'Invalid Aadhaar number' } };
    }
    return { data: { success: true, verified: true }, error: null };
  } else if (action === 'send-otp' && phone) {
    // Generate and store OTP
    const demoOtp = '123456';
    localStorage.setItem(`greenledger-otp-${phone}`, JSON.stringify({
      otp: demoOtp,
      phone,
      aadhaar,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    }));
    return { data: { success: true }, error: null };
  } else if (action === 'verify-otp' && phone && otp) {
    // Verify OTP
    const otpData = localStorage.getItem(`greenledger-otp-${phone}`);
    if (!otpData) {
      return { data: null, error: { message: 'OTP expired or not found' } };
    }
    
    const parsed = JSON.parse(otpData);
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(`greenledger-otp-${phone}`);
      return { data: null, error: { message: 'OTP expired' } };
    }
    
    if (parsed.otp !== otp && otp !== '123456') { // Allow demo OTP
      return { data: null, error: { message: 'Invalid OTP' } };
    }
    
    // Find or create user by Aadhaar
    let user = users.find((u: any) => u.aadhaarNumber === aadhaar || u.aadharNumber === aadhaar);
    
    if (!user) {
      // Create new user
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      user = {
        id: userId,
        aadhaarNumber: aadhaar,
        aadharNumber: aadhaar,
        phone: phone,
        phoneNumber: phone,
        name: `User ${aadhaar.slice(-4)}`,
        role: 'farmer',
        verified: true,
        joinDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        location: 'Unknown',
        uzhavarPin: `UZP-${userId.slice(-6)}`
      };
      users.push(user);
      localStorage.setItem('greenledger-users', JSON.stringify(users));
      console.log('✅ Created new user automatically for Aadhaar:', aadhaar);
    } else {
      // Update phone if different
      if (user.phone !== phone && user.phoneNumber !== phone) {
        user.phone = phone;
        user.phoneNumber = phone;
        const userIndex = users.findIndex((u: any) => u.id === user.id);
        if (userIndex !== -1) {
          users[userIndex] = user;
          localStorage.setItem('greenledger-users', JSON.stringify(users));
        }
      }
    }
    
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem('greenledger-user', JSON.stringify(userWithoutPassword));
    localStorage.setItem('greenledger-session', JSON.stringify({
      userId: userWithoutPassword.id,
      aadhaar: aadhaar,
      phone: userWithoutPassword.phone,
      user: userWithoutPassword
    }));
    localStorage.removeItem(`greenledger-otp-${phone}`);
    
    return { 
      data: { 
        user: userWithoutPassword, 
        session: { user: userWithoutPassword }
      }, 
      error: null 
    };
  }
  
  return { data: null, error: { message: 'Invalid action or missing parameters' } };
  } catch (error: any) {
    console.error('Fallback Aadhaar auth error:', error);
    // Even on error, try to create a basic user to allow login
    if (action === 'verify-otp' && phone && otp && otp === '123456' && aadhaar) {
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const user = {
        id: userId,
        aadhaarNumber: aadhaar,
        aadharNumber: aadhaar,
        phone,
        phoneNumber: phone,
        name: `User ${aadhaar.slice(-4)}`,
        role: 'farmer',
        verified: true,
        joinDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        location: 'Unknown',
        uzhavarPin: `UZP-${userId.slice(-6)}`
      };
      localStorage.setItem('greenledger-user', JSON.stringify(user));
      localStorage.setItem('greenledger-session', JSON.stringify({
        userId: user.id,
        aadhaar: aadhaar,
        phone: user.phone,
        user: user
      }));
      return { 
        data: { 
          user: user, 
          session: { user: user }
        }, 
        error: null 
      };
    }
    return { data: null, error: { message: error.message || 'Authentication failed' } };
  }
};

