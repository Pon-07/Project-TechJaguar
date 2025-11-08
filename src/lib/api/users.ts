import { supabase } from '../supabase';
import { User } from '../../types/user';

// CRUD operations for users
export const userAPI = {
  // Create user (admin only)
  createUser: async (userData: Partial<User>) => {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    return { data, error };
  },

  // Get user by ID
  getUserById: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Update user
  updateUser: async (userId: string, updates: Partial<User>) => {
    try {
      // First, check if user exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      if (fetchError && fetchError.code === 'PGRST116') {
        // User doesn't exist, create them
        const { data, error: createError } = await supabase
          .from('users')
          .insert([{ id: userId, ...updates }])
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating user:', createError);
          return { data: null, error: createError };
        }
        return { data, error: null };
      }

      if (fetchError) {
        console.error('Error checking user existence:', fetchError);
        return { data: null, error: fetchError };
      }

      // User exists, update them
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating user:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Unexpected error in updateUser:', error);
      return { data: null, error: error instanceof Error ? error : new Error('Failed to update user') };
    }
  },

  // Delete user (admin only)
  deleteUser: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    return { data, error };
  },

  // Get user activity history
  getUserActivity: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    return { data, error };
  },

  // Upload profile picture
  uploadProfilePicture: async (userId: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `profiles/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      return { error: uploadError };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(filePath);

    // Update user profile image
    const { data, error } = await supabase
      .from('users')
      .update({ profileImage: publicUrl })
      .eq('id', userId)
      .select()
      .single();

    return { data, error, publicUrl };
  }
};

