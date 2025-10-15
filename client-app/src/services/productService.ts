import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { Product, CreateProduct, UpdateProduct } from '../types/product';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5073/api',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (import.meta.env.VITE_ENABLE_REQUEST_LOGGING === 'true') {
      console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    }
    return config;
  },
  (error) => {
    if (import.meta.env.VITE_ENABLE_DEBUG_LOGS === 'true') {
      console.error('Request error:', error);
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.VITE_ENABLE_DEBUG_LOGS === 'true') {
      console.error('API Error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * ProductService - API communication layer
 * 
 * Provides methods for CRUD operations on products with proper error handling
 * and request/response interceptors for logging and debugging.
 */
export class ProductService {
  private static readonly ENDPOINTS = {
    PRODUCTS: '/products',
    PRODUCT_BY_ID: (id: number) => `/products/${id}`,
    PRODUCTS_BY_CATEGORY: (category: string) => `/products/category/${category}`,
    SEARCH_PRODUCTS: '/products/search',
    ACTIVE_PRODUCTS: '/products/active',
  };

  /**
   * Get all products
   */
  static async getAllProducts(): Promise<Product[]> {
    try {
      const response: AxiosResponse<Product[]> = await api.get(this.ENDPOINTS.PRODUCTS);
      return response.data;
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  /**
   * Get product by ID
   */
  static async getProductById(id: number): Promise<Product> {
    try {
      const response: AxiosResponse<Product> = await api.get(this.ENDPOINTS.PRODUCT_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw new Error('Failed to fetch product');
    }
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response: AxiosResponse<Product[]> = await api.get(
        this.ENDPOINTS.PRODUCTS_BY_CATEGORY(category)
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching products by category ${category}:`, error);
      throw new Error('Failed to fetch products by category');
    }
  }

  /**
   * Search products by term
   */
  static async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      const response: AxiosResponse<Product[]> = await api.get(this.ENDPOINTS.SEARCH_PRODUCTS, {
        params: { searchTerm },
      });
      return response.data;
    } catch (error) {
      console.error(`Error searching products with term "${searchTerm}":`, error);
      throw new Error('Failed to search products');
    }
  }

  /**
   * Get only active products
   */
  static async getActiveProducts(): Promise<Product[]> {
    try {
      const response: AxiosResponse<Product[]> = await api.get(this.ENDPOINTS.ACTIVE_PRODUCTS);
      return response.data;
    } catch (error) {
      console.error('Error fetching active products:', error);
      throw new Error('Failed to fetch active products');
    }
  }

  /**
   * Create a new product
   */
  static async createProduct(product: CreateProduct): Promise<Product> {
    try {
      const response: AxiosResponse<Product> = await api.post(this.ENDPOINTS.PRODUCTS, product);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  }

  /**
   * Update an existing product
   */
  static async updateProduct(id: number, product: UpdateProduct): Promise<Product> {
    try {
      const response: AxiosResponse<Product> = await api.put(
        this.ENDPOINTS.PRODUCT_BY_ID(id),
        product
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw new Error('Failed to update product');
    }
  }

  /**
   * Delete a product
   */
  static async deleteProduct(id: number): Promise<void> {
    try {
      await api.delete(this.ENDPOINTS.PRODUCT_BY_ID(id));
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw new Error('Failed to delete product');
    }
  }
}

export default ProductService;