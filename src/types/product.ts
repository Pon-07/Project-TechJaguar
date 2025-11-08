export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
  images?: ProductImage[];
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  children?: ProductCategory[];
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  costPerItem?: number;
  sku: string;
  barcode?: string;
  quantity: number;
  trackQuantity: boolean;
  continueSellingWhenOutOfStock: boolean;
  weight?: number;
  weightUnit: 'g' | 'kg' | 'lb' | 'oz';
  status: 'draft' | 'active' | 'archived' | 'out_of_stock';
  isFeatured: boolean;
  isGiftCard: boolean;
  requiresShipping: boolean;
  isTaxable: boolean;
  taxCode?: string;
  seoTitle?: string;
  seoDescription?: string;
  vendor?: string;
  productType?: string;
  tags: string[];
  categories: string[];
  collections: string[];
  variants: ProductVariant[];
  images: ProductImage[];
  reviews: ProductReview[];
  averageRating?: number;
  reviewCount: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload
  extends Omit<
    Product,
    | 'id'
    | 'slug'
    | 'variants'
    | 'images'
    | 'reviews'
    | 'averageRating'
    | 'reviewCount'
    | 'createdAt'
    | 'updatedAt'
  > {
  variants?: Omit<ProductVariant, 'id' | 'images' | 'createdAt' | 'updatedAt'>[];
  images?: Omit<ProductImage, 'id' | 'createdAt' | 'updatedAt'>[];
}

export interface UpdateProductPayload
  extends Partial<Omit<CreateProductPayload, 'variants' | 'images'>> {
  variants?: (Partial<ProductVariant> & { id?: string })[];
  images?: (Partial<ProductImage> & { id?: string })[];
}

export interface ProductQueryParams {
  query?: string;
  status?: 'draft' | 'active' | 'archived' | 'out_of_stock';
  category?: string;
  collection?: string;
  vendor?: string;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt' | 'updatedAt' | 'bestSelling';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  include?: string[];
}

export interface ProductSearchResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  facets?: {
    categories: Array<{ id: string; name: string; count: number }>;
    priceRanges: Array<{ from: number; to: number; count: number }>;
    vendors: Array<{ name: string; count: number }>;
  };
}
