import { useState, useEffect } from 'react';
import ProductService from '../services/productService';
import type { Product, CreateProduct, UpdateProduct } from '../types/product';

/**
 * Custom hook for fetching all products
 */
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProductService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
};

/**
 * Custom hook for fetching a single product by ID
 */
export const useProduct = (id: number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ProductService.getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};

/**
 * Custom hook for product CRUD operations
 */
export const useProductOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (productData: CreateProduct): Promise<Product | null> => {
    try {
      setLoading(true);
      setError(null);
      const newProduct = await ProductService.createProduct(productData);
      return newProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: number, productData: UpdateProduct): Promise<Product | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedProduct = await ProductService.updateProduct(id, productData);
      return updatedProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await ProductService.deleteProduct(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    loading,
    error,
  };
};

/**
 * Custom hook for searching products
 */
export const useProductSearch = () => {
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProducts = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const results = await ProductService.searchProducts(searchTerm);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search products');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setError(null);
  };

  return {
    searchResults,
    searchProducts,
    clearSearch,
    loading,
    error,
  };
};