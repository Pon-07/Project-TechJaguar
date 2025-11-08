import { supabase } from '../supabase';

export interface Product {
  id?: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  farmerId?: string;
  warehouseId?: string;
  image?: string;
  qrCode?: string;
  status: 'available' | 'sold' | 'expired';
  expiryDate?: string;
  harvestDate?: string;
  organic?: boolean;
  created_at?: string;
  updated_at?: string;
}

// CRUD operations for products
export const productAPI = {
  // Create product
  createProduct: async (productData: Partial<Product>) => {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();
    return { data, error };
  },

  // Get product by ID
  getProductById: async (productId: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    return { data, error };
  },

  // Get all products
  getAllProducts: async (filters?: {
    category?: string;
    status?: string;
    farmerId?: string;
    warehouseId?: string;
  }) => {
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.farmerId) {
      query = query.eq('farmer_id', filters.farmerId);
    }
    if (filters?.warehouseId) {
      query = query.eq('warehouse_id', filters.warehouseId);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Update product
  updateProduct: async (productId: string, updates: Partial<Product>) => {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()
      .single();
    return { data, error };
  },

  // Delete product
  deleteProduct: async (productId: string) => {
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
    return { data, error };
  }
};

