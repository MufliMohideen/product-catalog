/**
 * Product interface matching the backend API ProductDto
 */
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  category?: string;
  imageUrl?: string;
  sku?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create Product interface for adding new products
 */
export interface CreateProduct {
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  category?: string;
  imageUrl?: string;
  sku?: string;
  isActive?: boolean;
}

/**
 * Update Product interface for editing existing products
 */
export interface UpdateProduct {
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  category?: string;
  imageUrl?: string;
  sku?: string;
  isActive: boolean;
}

/**
 * API response wrapper for error handling
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

/**
 * Form validation errors
 */
export interface ValidationErrors {
  [key: string]: string[];
}