import { BaseService, ApiResponse } from './base.service';
import { Product, CreateProductPayload, UpdateProductPayload, ProductQueryParams } from '../../types/product';

export class ProductService extends BaseService<Product> {
  constructor() {
    super('products');
  }

  async getProducts(params: ProductQueryParams = {}): Promise<ApiResponse<Product[]>> {
    return this.getAll(params);
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    return this.getById(id);
  }

  async createProduct(productData: CreateProductPayload): Promise<ApiResponse<Product>> {
    return this.create(productData);
  }

  async updateProduct(id: string, productData: UpdateProductPayload): Promise<ApiResponse<Product>> {
    return this.update(id, productData);
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return this.delete(id);
  }

  async searchProducts(query: string, filters: Partial<ProductQueryParams> = {}): Promise<ApiResponse<{ data: Product[]; total: number }>> {
    const queryParams = new URLSearchParams({
      q: query,
      ...Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    });

    return this.request(`${this.endpoint}/search?${queryParams.toString()}`, {
      method: 'GET',
    }) as Promise<ApiResponse<{ data: Product[]; total: number }>>;
  }

  async getProductCategories(): Promise<ApiResponse<string[]>> {
    return this.request(`${this.endpoint}/categories`, {
      method: 'GET',
    }) as Promise<ApiResponse<string[]>>;
  }

  async uploadProductImage(productId: string, file: File): Promise<ApiResponse<{ imageUrl: string }>> {
    const formData = new FormData();
    formData.append('image', file);

    return this.request(`${this.endpoint}/${productId}/image`, {
      method: 'POST',
      body: formData,
      headers: {
        // Let the browser set the Content-Type with the boundary
      },
    }) as Promise<ApiResponse<{ imageUrl: string }>>;
  }
}

export const productService = new ProductService();
