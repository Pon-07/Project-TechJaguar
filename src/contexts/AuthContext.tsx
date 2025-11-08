import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { auth, supabase } from '../lib/supabase';
import { User } from '../types/user';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithPhone: (phone: string, action: 'send-otp' | 'verify-otp' | 'set-password', otp?: string, password?: string) => Promise<{ error: any; data?: any }>;
  signInWithAadhaar: (aadhaar: string, action: 'verify-aadhaar' | 'send-otp' | 'verify-otp', phone?: string, otp?: string) => Promise<{ error: any; data?: any }>;
  signInWithGoogle: (role?: 'farmer' | 'consumer' | 'warehouse' | 'admin') => Promise<{ error: any; data?: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ error: any }>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Convert Supabase user to our User type
  const transformUser = useCallback((supabaseUser: any): User | null => {
    if (!supabaseUser) return null;

    // If it's already a User object (from localStorage), return as is
    if (supabaseUser.name && supabaseUser.email && !supabaseUser.user_metadata) {
      return supabaseUser as User;
    }

    // Transform Supabase user format
    return {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.name || supabaseUser.name || supabaseUser.email?.split('@')[0] || 'User',
      email: supabaseUser.email,
      phone: supabaseUser.user_metadata?.phone || supabaseUser.phone,
      role: supabaseUser.user_metadata?.role || supabaseUser.role || 'farmer',
      profileImage: supabaseUser.user_metadata?.profileImage || supabaseUser.profileImage,
      state: supabaseUser.user_metadata?.state || supabaseUser.state,
      district: supabaseUser.user_metadata?.district || supabaseUser.district,
      village: supabaseUser.user_metadata?.village || supabaseUser.village,
      verified: supabaseUser.user_metadata?.verified || supabaseUser.verified || false,
      joinDate: supabaseUser.created_at || supabaseUser.joinDate,
      ...(supabaseUser.user_metadata || supabaseUser)
    };
  }, []);

  // Load user and session
  useEffect(() => {
    const loadSession = async () => {
      try {
        // First check localStorage for immediate user (fallback mode)
        const localUser = localStorage.getItem('greenledger-user');
        if (localUser) {
          try {
            const parsedUser = JSON.parse(localUser);
            const transformed = transformUser(parsedUser) || parsedUser;
            setUser(transformed);
            setSession({ user: parsedUser } as any);
            setLoading(false);
            // Continue to check Supabase in background
          } catch (e) {
            console.error('Error parsing local user:', e);
          }
        }

        // Try to get session from Supabase
        const { session, error: sessionError } = await auth.getSession();
        const { user: authUser, error: userError } = await auth.getUser();
        
        if (!sessionError && !userError) {
          // Supabase session available, use it
          setSession(session);
          setUser(authUser ? transformUser(authUser) : (session?.user ? transformUser(session.user) : null));
        } else if (sessionError || userError) {
          // Supabase failed, use localStorage if available
          if (localUser && !user) {
            try {
              const parsedUser = JSON.parse(localUser);
              setUser(transformUser(parsedUser) || parsedUser);
              setSession({ user: parsedUser } as any);
            } catch (e) {
              console.error('Error parsing local user:', e);
            }
          }
        }
      } catch (error) {
        console.error('Error loading session:', error);
        // Fallback to localStorage
        const localUser = localStorage.getItem('greenledger-user');
        if (localUser && !user) {
          try {
            const parsedUser = JSON.parse(localUser);
            setUser(transformUser(parsedUser) || parsedUser);
          } catch (e) {
            console.error('Error parsing local user:', e);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadSession();

    // Listen for auth changes (only if Supabase is available)
    try {
      const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
        setSession(session);
        setUser(session?.user ? transformUser(session.user) : null);
        setLoading(false);
      });

      return () => {
        subscription?.unsubscribe();
      };
    } catch (error) {
      console.warn('Auth state change listener not available:', error);
    }
  }, [transformUser]);

  const signUp = useCallback(async (email: string, password: string, userData: Partial<User>) => {
    try {
      const { error } = await auth.signUp(email, password, userData);
      return { error };
    } catch (error: any) {
      return { error };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await auth.signIn(email, password);
      
      // Even if there's an error message but we have user data, use it (fallback mode)
      if (data && data.user) {
        const transformedUser = transformUser(data.user);
        if (transformedUser) {
          console.log('✅ Login successful (fallback mode), setting user:', transformedUser);
          setUser(transformedUser);
          const session = data.session || { user: data.user };
          setSession(session as any);
          setLoading(false);
          // Return success even if there was an error message (offline mode)
          return { data, error: null };
        }
      }
      
      if (!error && data) {
        // Update user state immediately after successful login
        if (data.user) {
          const transformedUser = transformUser(data.user);
          if (transformedUser) {
            console.log('✅ Login successful, setting user:', transformedUser);
            setUser(transformedUser);
            // Use session from data if available, otherwise create one
            const session = data.session || { user: data.user };
            setSession(session as any);
            // Ensure loading is false so app can render
            setLoading(false);
            
            // Force a state update by triggering a re-render
            // The App component will detect the user and show dashboard
          } else {
            console.warn('⚠️ User transformation failed');
          }
        } else {
          console.warn('⚠️ No user in login response');
        }
      } else if (error) {
        console.error('❌ Login error:', error);
      }
      
      return { data, error };
    } catch (error: any) {
      console.error('SignIn exception:', error);
      // Try to get user from localStorage as last resort
      try {
        const localUser = localStorage.getItem('greenledger-user');
        if (localUser) {
          const parsedUser = JSON.parse(localUser);
          const transformedUser = transformUser(parsedUser);
          if (transformedUser) {
            console.log('✅ Using cached user from localStorage');
            setUser(transformedUser);
            setSession({ user: parsedUser } as any);
            setLoading(false);
            return { data: { user: transformedUser, session: { user: transformedUser } }, error: null };
          }
        }
      } catch (e) {
        console.error('Failed to load from localStorage:', e);
      }
      return { data: null, error };
    }
  }, [transformUser]);

  const signInWithPhone = useCallback(async (phone: string, action: 'send-otp' | 'verify-otp' | 'set-password', otp?: string, password?: string) => {
    try {
      const { data, error } = await auth.signInWithPhone(phone, action, otp, password);
      
      // Even if there's an error message but we have user data, use it (fallback mode)
      if (data && data.user && action === 'verify-otp') {
        const transformedUser = transformUser(data.user);
        if (transformedUser) {
          console.log('✅ Phone login successful (fallback mode), setting user:', transformedUser);
          setUser(transformedUser);
          const session = data.session || { user: data.user };
          setSession(session as any);
          setLoading(false);
          return { data, error: null };
        }
      }
      
      if (!error && data && action === 'verify-otp') {
        // Update user state after successful OTP verification
        if (data.user) {
          const transformedUser = transformUser(data.user);
          if (transformedUser) {
            console.log('✅ Phone login successful, setting user:', transformedUser);
            setUser(transformedUser);
            const session = data.session || { user: data.user };
            setSession(session as any);
            setLoading(false);
          }
        }
      }
      
      return { data, error };
    } catch (error: any) {
      console.error('Phone login exception:', error);
      // Try to get user from localStorage as last resort
      try {
        const localUser = localStorage.getItem('greenledger-user');
        if (localUser && action === 'verify-otp') {
          const parsedUser = JSON.parse(localUser);
          const transformedUser = transformUser(parsedUser);
          if (transformedUser && (parsedUser.phone === phone || parsedUser.phoneNumber === phone)) {
            console.log('✅ Using cached user from localStorage for phone login');
            setUser(transformedUser);
            setSession({ user: parsedUser } as any);
            setLoading(false);
            return { data: { user: transformedUser, session: { user: transformedUser } }, error: null };
          }
        }
      } catch (e) {
        console.error('Failed to load from localStorage:', e);
      }
      return { data: null, error };
    }
  }, [transformUser]);

  const signInWithAadhaar = useCallback(async (aadhaar: string, action: 'verify-aadhaar' | 'send-otp' | 'verify-otp', phone?: string, otp?: string) => {
    try {
      const { data, error } = await auth.signInWithAadhaar(aadhaar, action, phone, otp);
      
      // Even if there's an error message but we have user data, use it (fallback mode)
      if (data && data.user && action === 'verify-otp') {
        const transformedUser = transformUser(data.user);
        if (transformedUser) {
          console.log('✅ Aadhaar login successful (fallback mode), setting user:', transformedUser);
          setUser(transformedUser);
          const session = data.session || { user: data.user };
          setSession(session as any);
          setLoading(false);
          return { data, error: null };
        }
      }
      
      if (!error && data && action === 'verify-otp') {
        // Update user state after successful OTP verification
        if (data.user) {
          const transformedUser = transformUser(data.user);
          if (transformedUser) {
            console.log('✅ Aadhaar login successful, setting user:', transformedUser);
            setUser(transformedUser);
            const session = data.session || { user: data.user };
            setSession(session as any);
            setLoading(false);
          }
        }
      }
      
      return { data, error };
    } catch (error: any) {
      console.error('Aadhaar login exception:', error);
      // Try to get user from localStorage as last resort
      try {
        const localUser = localStorage.getItem('greenledger-user');
        if (localUser && action === 'verify-otp') {
          const parsedUser = JSON.parse(localUser);
          const transformedUser = transformUser(parsedUser);
          if (transformedUser && (parsedUser.aadhaarNumber === aadhaar || parsedUser.aadharNumber === aadhaar)) {
            console.log('✅ Using cached user from localStorage for Aadhaar login');
            setUser(transformedUser);
            setSession({ user: parsedUser } as any);
            setLoading(false);
            return { data: { user: transformedUser, session: { user: transformedUser } }, error: null };
          }
        }
      } catch (e) {
        console.error('Failed to load from localStorage:', e);
      }
      return { data: null, error };
    }
  }, [transformUser]);

  const signInWithGoogle = useCallback(async (role?: 'farmer' | 'consumer' | 'warehouse' | 'admin') => {
    try {
      const { data, error } = await auth.signInWithGoogle(role);
      
      if (error) {
        console.error('Google OAuth error:', error);
        return { data: null, error };
      }

      // OAuth redirect will happen, so we don't set user here
      // The user will be set when they return from OAuth callback
      return { data, error: null };
    } catch (error: any) {
      console.error('Google OAuth exception:', error);
      return { data: null, error };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await auth.signOut();
      setUser(null);
      setSession(null);
      // Clear localStorage
      localStorage.removeItem('greenledger-user');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!user?.id) {
      return { error: new Error('User not found') };
    }

    try {
      // Check if we're using localStorage fallback (user exists in localStorage but not in Supabase)
      const localUser = localStorage.getItem('greenledger-user');
      const isLocalStorageMode = localUser && !session;
      
      // Update auth metadata for quick access
      const authUpdate: any = {};
      if (updates.name) authUpdate.name = updates.name;
      if (updates.email) authUpdate.email = updates.email;
      if (updates.phone || updates.phoneNumber) authUpdate.phone = updates.phone || updates.phoneNumber;
      if (updates.profileImage) authUpdate.profileImage = updates.profileImage;

      // Update auth user metadata if there are auth fields to update (only if Supabase is available)
      if (Object.keys(authUpdate).length > 0 && !isLocalStorageMode) {
        try {
          const { error: authError } = await auth.updateUser({
            data: authUpdate
          });
          if (authError) {
            console.error('Auth update error:', authError);
          }
        } catch (authErr) {
          console.warn('Auth update failed, continuing with database update:', authErr);
        }
      }

      // Update localStorage if in fallback mode
      if (isLocalStorageMode) {
        try {
          const users = JSON.parse(localStorage.getItem('greenledger-users') || '[]');
          const userIndex = users.findIndex((u: any) => u.id === user.id);
          
          if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            localStorage.setItem('greenledger-users', JSON.stringify(users));
          }
          
          // Update current user in localStorage
          const updatedUser = { ...user, ...updates };
          localStorage.setItem('greenledger-user', JSON.stringify(updatedUser));
          setUser(updatedUser);
          
          return { error: null, data: updatedUser };
        } catch (localError) {
          console.error('LocalStorage update error:', localError);
          return { error: localError instanceof Error ? localError : new Error('Failed to update profile in localStorage') };
        }
      }

      // Update users table in database (try Supabase)
      try {
        const { userAPI } = await import('../lib/api/users');
        const { data, error } = await userAPI.updateUser(user.id, updates);
        
        if (error) {
          console.error('Database update error:', error);
          // If database update fails, try localStorage fallback
          console.warn('Database update failed, trying localStorage fallback');
          const users = JSON.parse(localStorage.getItem('greenledger-users') || '[]');
          const userIndex = users.findIndex((u: any) => u.id === user.id);
          
          if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            localStorage.setItem('greenledger-users', JSON.stringify(users));
          }
          
          const updatedUser = { ...user, ...updates };
          localStorage.setItem('greenledger-user', JSON.stringify(updatedUser));
          setUser(updatedUser);
          
          return { error: null, data: updatedUser };
        }

        // Update local user state with the updated data
        if (data && user) {
          setUser({ ...user, ...data });
          // Also update localStorage for consistency
          localStorage.setItem('greenledger-user', JSON.stringify({ ...user, ...data }));
        } else if (user) {
          // Fallback: update with the provided updates if data is not returned
          const updatedUser = { ...user, ...updates };
          setUser(updatedUser);
          localStorage.setItem('greenledger-user', JSON.stringify(updatedUser));
        }

        return { error: null, data: data || user };
      } catch (dbError) {
        console.error('Database update exception:', dbError);
        // Fallback to localStorage
        try {
          const users = JSON.parse(localStorage.getItem('greenledger-users') || '[]');
          const userIndex = users.findIndex((u: any) => u.id === user.id);
          
          if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            localStorage.setItem('greenledger-users', JSON.stringify(users));
          }
          
          const updatedUser = { ...user, ...updates };
          localStorage.setItem('greenledger-user', JSON.stringify(updatedUser));
          setUser(updatedUser);
          
          return { error: null, data: updatedUser };
        } catch (localError) {
          return { error: dbError instanceof Error ? dbError : new Error('Failed to update profile') };
        }
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      return { error: error instanceof Error ? error : new Error('Failed to update profile') };
    }
  }, [user, session]);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signInWithPhone,
        signInWithAadhaar,
        signInWithGoogle,
        signOut,
        updateProfile,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

