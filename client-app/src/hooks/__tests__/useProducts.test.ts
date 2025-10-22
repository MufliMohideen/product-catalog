import { renderHook, waitFor, act } from '@testing-library/react';
import { useProducts, useProduct, useProductOperations, useProductSearch } from '../useProducts';
import type { Product, CreateProduct, UpdateProduct } from '../../types/product';

// Mock the ProductService module
jest.mock('../../services/productService', () => ({
  __esModule: true,
  default: {
    getAllProducts: jest.fn(),
    getProductById: jest.fn(),
    getProductsByCategory: jest.fn(),
    searchProducts: jest.fn(),
    getActiveProducts: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  },
}));

// Import the mocked service after mocking
import ProductService from '../../services/productService';

// Create a typed reference to the mocked service
const mockedProductService = ProductService as unknown as {
  getAllProducts: jest.MockedFunction<() => Promise<Product[]>>;
  getProductById: jest.MockedFunction<(id: number) => Promise<Product>>;
  getProductsByCategory: jest.MockedFunction<(category: string) => Promise<Product[]>>;
  searchProducts: jest.MockedFunction<(searchTerm: string) => Promise<Product[]>>;
  getActiveProducts: jest.MockedFunction<() => Promise<Product[]>>;
  createProduct: jest.MockedFunction<(product: CreateProduct) => Promise<Product>>;
  updateProduct: jest.MockedFunction<(id: number, product: UpdateProduct) => Promise<Product>>;
  deleteProduct: jest.MockedFunction<(id: number) => Promise<void>>;
};


describe('useProducts Hook', () => {
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Test Product 1',
      description: 'Test Description 1',
      price: 99.99,
      stockQuantity: 10,
      category: 'Electronics',
      imageUrl: 'https://example.com/image1.jpg',
      sku: 'TEST-001',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: 'Test Product 2',
      description: 'Test Description 2',
      price: 149.99,
      stockQuantity: 5,
      category: 'Clothing',
      imageUrl: 'https://example.com/image2.jpg',
      sku: 'TEST-002',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useProducts', () => {
    it('should fetch products successfully on mount', async () => {
      mockedProductService.getAllProducts.mockResolvedValue(mockProducts);

      const { result } = renderHook(() => useProducts());

      // Initially loading should be true
      expect(result.current.loading).toBe(true);
      expect(result.current.products).toEqual([]);
      expect(result.current.error).toBe(null);

      // Wait for the effect to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.products).toEqual(mockProducts);
      expect(result.current.error).toBe(null);
      expect(mockedProductService.getAllProducts).toHaveBeenCalledTimes(1);
    });

    it('should handle fetch error', async () => {
      const errorMessage = 'Failed to fetch products';
      mockedProductService.getAllProducts.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.products).toEqual([]);
      expect(result.current.error).toBe(errorMessage);
      expect(mockedProductService.getAllProducts).toHaveBeenCalledTimes(1);
    });

    it('should refetch products when refetch is called', async () => {
      mockedProductService.getAllProducts.mockResolvedValue(mockProducts);

      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Clear previous calls
      mockedProductService.getAllProducts.mockClear();

      // Call refetch
      await act(async () => {
        await result.current.refetch();
      });

      expect(mockedProductService.getAllProducts).toHaveBeenCalledTimes(1);
    });

    it('should handle non-Error exceptions', async () => {
      mockedProductService.getAllProducts.mockRejectedValue('String error');

      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Failed to fetch products');
    });

    it('should reset error state on successful refetch', async () => {
      // First call fails
      mockedProductService.getAllProducts.mockRejectedValueOnce(new Error('Network error'));
      
      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
      });

      // Second call succeeds
      mockedProductService.getAllProducts.mockResolvedValue(mockProducts);

      await act(async () => {
        await result.current.refetch();
      });

      await waitFor(() => {
        expect(result.current.error).toBe(null);
        expect(result.current.products).toEqual(mockProducts);
      });
    });
  });

  describe('useProduct', () => {
    const mockProduct = mockProducts[0];

    it('should fetch product successfully', async () => {
      mockedProductService.getProductById.mockResolvedValue(mockProduct);

      const { result } = renderHook(() => useProduct(1));

      expect(result.current.loading).toBe(true);
      expect(result.current.product).toBe(null);
      expect(result.current.error).toBe(null);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.product).toEqual(mockProduct);
      expect(result.current.error).toBe(null);
      expect(mockedProductService.getProductById).toHaveBeenCalledWith(1);
    });

    it('should handle fetch error', async () => {
      const errorMessage = 'Product not found';
      mockedProductService.getProductById.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useProduct(999));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.product).toBe(null);
      expect(result.current.error).toBe(errorMessage);
    });

    it('should refetch when id changes', async () => {
      mockedProductService.getProductById.mockResolvedValue(mockProduct);

      const { result, rerender } = renderHook(
        ({ id }) => useProduct(id),
        { initialProps: { id: 1 } }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockedProductService.getProductById).toHaveBeenCalledWith(1);

      // Change the ID
      mockedProductService.getProductById.mockClear();
      rerender({ id: 2 });

      await waitFor(() => {
        expect(mockedProductService.getProductById).toHaveBeenCalledWith(2);
      });
    });

    it('should handle non-Error exceptions', async () => {
      mockedProductService.getProductById.mockRejectedValue('String error');

      const { result } = renderHook(() => useProduct(1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Failed to fetch product');
    });
  });

  describe('useProductOperations', () => {
    const mockCreateProduct: CreateProduct = {
      name: 'New Product',
      description: 'New Description',
      price: 199.99,
      stockQuantity: 15,
      category: 'Electronics',
      sku: 'NEW-001',
      isActive: true
    };

    const mockUpdateProduct: UpdateProduct = {
      name: 'Updated Product',
      description: 'Updated Description',
      price: 299.99,
      stockQuantity: 20,
      category: 'Electronics',
      sku: 'UPD-001',
      isActive: true
    };

    const createdProduct: Product = {
      ...mockCreateProduct,
      id: 3,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };

    describe('createProduct', () => {
      it('should create product successfully', async () => {
        mockedProductService.createProduct.mockResolvedValue(createdProduct);

        const { result } = renderHook(() => useProductOperations());

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);

        let createdResult: Product | null = null;
        await act(async () => {
          createdResult = await result.current.createProduct(mockCreateProduct);
        });

        expect(createdResult).toEqual(createdProduct);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
        expect(mockedProductService.createProduct).toHaveBeenCalledWith(mockCreateProduct);
      });

      it('should handle create error', async () => {
        const errorMessage = 'Validation failed';
        mockedProductService.createProduct.mockRejectedValue(new Error(errorMessage));

        const { result } = renderHook(() => useProductOperations());

        let createdResult: Product | null = null;
        await act(async () => {
          createdResult = await result.current.createProduct(mockCreateProduct);
        });

        expect(createdResult).toBe(null);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(errorMessage);
      });

      it('should handle loading state during creation', async () => {
        // Create a promise that we can control
        let resolvePromise: (value: Product) => void;
        const pendingPromise = new Promise<Product>((resolve) => {
          resolvePromise = resolve;
        });

        mockedProductService.createProduct.mockReturnValue(pendingPromise);

        const { result } = renderHook(() => useProductOperations());

        // Start the creation
        let createPromise: Promise<Product | null>;
        act(() => {
          createPromise = result.current.createProduct(mockCreateProduct);
        });

        // Should be loading
        expect(result.current.loading).toBe(true);

        // Resolve the promise
        act(() => {
          resolvePromise!(createdProduct);
        });

        await act(async () => {
          await createPromise!;
        });

        expect(result.current.loading).toBe(false);
      });
    });

    describe('updateProduct', () => {
      it('should update product successfully', async () => {
        const updatedProduct = { ...createdProduct, ...mockUpdateProduct };
        mockedProductService.updateProduct.mockResolvedValue(updatedProduct);

        const { result } = renderHook(() => useProductOperations());

        let updateResult: Product | null = null;
        await act(async () => {
          updateResult = await result.current.updateProduct(1, mockUpdateProduct);
        });

        expect(updateResult).toEqual(updatedProduct);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
        expect(mockedProductService.updateProduct).toHaveBeenCalledWith(1, mockUpdateProduct);
      });

      it('should handle update error', async () => {
        const errorMessage = 'Product not found';
        mockedProductService.updateProduct.mockRejectedValue(new Error(errorMessage));

        const { result } = renderHook(() => useProductOperations());

        let updateResult: Product | null = null;
        await act(async () => {
          updateResult = await result.current.updateProduct(999, mockUpdateProduct);
        });

        expect(updateResult).toBe(null);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(errorMessage);
      });
    });

    describe('deleteProduct', () => {
      it('should delete product successfully', async () => {
        mockedProductService.deleteProduct.mockResolvedValue(undefined);

        const { result } = renderHook(() => useProductOperations());

        let deleteResult: boolean = false;
        await act(async () => {
          deleteResult = await result.current.deleteProduct(1);
        });

        expect(deleteResult).toBe(true);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
        expect(mockedProductService.deleteProduct).toHaveBeenCalledWith(1);
      });

      it('should handle delete error', async () => {
        const errorMessage = 'Cannot delete product';
        mockedProductService.deleteProduct.mockRejectedValue(new Error(errorMessage));

        const { result } = renderHook(() => useProductOperations());

        let deleteResult: boolean = true;
        await act(async () => {
          deleteResult = await result.current.deleteProduct(1);
        });

        expect(deleteResult).toBe(false);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(errorMessage);
      });
    });

    it('should handle non-Error exceptions in all operations', async () => {
      const { result } = renderHook(() => useProductOperations());

      // Test create with string error
      mockedProductService.createProduct.mockRejectedValue('String error');
      await act(async () => {
        await result.current.createProduct(mockCreateProduct);
      });
      expect(result.current.error).toBe('Failed to create product');

      // Test update with string error
      mockedProductService.updateProduct.mockRejectedValue('String error');
      await act(async () => {
        await result.current.updateProduct(1, mockUpdateProduct);
      });
      expect(result.current.error).toBe('Failed to update product');

      // Test delete with string error
      mockedProductService.deleteProduct.mockRejectedValue('String error');
      await act(async () => {
        await result.current.deleteProduct(1);
      });
      expect(result.current.error).toBe('Failed to delete product');
    });
  });

  describe('useProductSearch', () => {
    it('should search products successfully', async () => {
      const searchResults = [mockProducts[0]];
      mockedProductService.searchProducts.mockResolvedValue(searchResults);

      const { result } = renderHook(() => useProductSearch());

      expect(result.current.searchResults).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);

      await act(async () => {
        await result.current.searchProducts('test');
      });

      expect(result.current.searchResults).toEqual(searchResults);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(mockedProductService.searchProducts).toHaveBeenCalledWith('test');
    });

    it('should handle search error', async () => {
      const errorMessage = 'Search failed';
      mockedProductService.searchProducts.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useProductSearch());

      await act(async () => {
        await result.current.searchProducts('test');
      });

      expect(result.current.searchResults).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
    });

    it('should not search with empty or whitespace-only terms', async () => {
      const { result } = renderHook(() => useProductSearch());

      await act(async () => {
        await result.current.searchProducts('');
      });

      expect(result.current.searchResults).toEqual([]);
      expect(mockedProductService.searchProducts).not.toHaveBeenCalled();

      await act(async () => {
        await result.current.searchProducts('   ');
      });

      expect(result.current.searchResults).toEqual([]);
      expect(mockedProductService.searchProducts).not.toHaveBeenCalled();
    });

    it('should handle loading state during search', async () => {
      let resolvePromise: (value: Product[]) => void;
      const pendingPromise = new Promise<Product[]>((resolve) => {
        resolvePromise = resolve;
      });

      mockedProductService.searchProducts.mockReturnValue(pendingPromise);

      const { result } = renderHook(() => useProductSearch());

      // Start the search
      let searchPromise: Promise<void>;
      act(() => {
        searchPromise = result.current.searchProducts('test');
      });

      // Should be loading
      expect(result.current.loading).toBe(true);

      // Resolve the promise
      act(() => {
        resolvePromise!([mockProducts[0]]);
      });

      await act(async () => {
        await searchPromise!;
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.searchResults).toEqual([mockProducts[0]]);
    });

    it('should clear search results and error state', async () => {
      const { result } = renderHook(() => useProductSearch());

      // First perform a search to set some results
      mockedProductService.searchProducts.mockResolvedValue([mockProducts[0]]);
      
      await act(async () => {
        await result.current.searchProducts('test');
      });

      expect(result.current.searchResults).toEqual([mockProducts[0]]);

      // Then clear the search
      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.searchResults).toEqual([]);
      expect(result.current.error).toBe(null);
    });

    it('should clear search results when called with empty results from previous error', async () => {
      const { result } = renderHook(() => useProductSearch());

      // First cause an error
      mockedProductService.searchProducts.mockRejectedValue(new Error('Search failed'));
      
      await act(async () => {
        await result.current.searchProducts('test');
      });

      expect(result.current.error).toBe('Search failed');
      expect(result.current.searchResults).toEqual([]);

      // Then clear - should reset error
      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.searchResults).toEqual([]);
      expect(result.current.error).toBe(null);
    });

    it('should handle non-Error exceptions', async () => {
      mockedProductService.searchProducts.mockRejectedValue('String error');

      const { result } = renderHook(() => useProductSearch());

      await act(async () => {
        await result.current.searchProducts('test');
      });

      expect(result.current.error).toBe('Failed to search products');
      expect(result.current.searchResults).toEqual([]);
    });

    it('should reset error state on successful search', async () => {
      const { result } = renderHook(() => useProductSearch());

      // First search fails
      mockedProductService.searchProducts.mockRejectedValueOnce(new Error('Search failed'));
      
      await act(async () => {
        await result.current.searchProducts('test');
      });

      expect(result.current.error).toBe('Search failed');

      // Second search succeeds
      mockedProductService.searchProducts.mockResolvedValue([mockProducts[0]]);

      await act(async () => {
        await result.current.searchProducts('test');
      });

      expect(result.current.error).toBe(null);
      expect(result.current.searchResults).toEqual([mockProducts[0]]);
    });

    it('should handle multiple rapid search calls correctly', async () => {
      const { result } = renderHook(() => useProductSearch());

      // Setup different responses for different calls
      mockedProductService.searchProducts
        .mockResolvedValueOnce([mockProducts[0]])
        .mockResolvedValueOnce([mockProducts[1]])
        .mockResolvedValueOnce([]);

      // Make multiple rapid calls
      await act(async () => {
        await result.current.searchProducts('first');
      });
      expect(result.current.searchResults).toEqual([mockProducts[0]]);

      await act(async () => {
        await result.current.searchProducts('second');
      });
      expect(result.current.searchResults).toEqual([mockProducts[1]]);

      await act(async () => {
        await result.current.searchProducts('third');
      });
      expect(result.current.searchResults).toEqual([]);
    });

    it('should handle search with only whitespace characters', async () => {
      const { result } = renderHook(() => useProductSearch());

      await act(async () => {
        await result.current.searchProducts('   \t\n   ');
      });

      expect(result.current.searchResults).toEqual([]);
      expect(mockedProductService.searchProducts).not.toHaveBeenCalled();
    });
  });

  // Additional edge cases and integration-like tests
  describe('Integration scenarios', () => {
    it('should handle simultaneous operations in useProductOperations', async () => {
      const { result } = renderHook(() => useProductOperations());

      const newProduct: CreateProduct = {
        name: 'Test Product',
        price: 99.99,
        stockQuantity: 10,
        isActive: true
      };

      const createdProduct: Product = {
        id: 1,
        name: newProduct.name,
        price: newProduct.price,
        stockQuantity: newProduct.stockQuantity,
        isActive: newProduct.isActive!,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };

      const updateProduct: UpdateProduct = {
        name: newProduct.name,
        price: newProduct.price,
        stockQuantity: newProduct.stockQuantity,
        isActive: newProduct.isActive!
      };

      // Mock all operations to succeed
      mockedProductService.createProduct.mockResolvedValue(createdProduct);
      mockedProductService.updateProduct.mockResolvedValue(createdProduct);
      mockedProductService.deleteProduct.mockResolvedValue(undefined);

      // Perform operations sequentially
      let createResult: Product | null = null;
      await act(async () => {
        createResult = await result.current.createProduct(newProduct);
      });
      expect(createResult).toEqual(createdProduct);

      let updateResult: Product | null = null;
      await act(async () => {
        updateResult = await result.current.updateProduct(1, updateProduct);
      });
      expect(updateResult).toEqual(createdProduct);

      let deleteResult: boolean = false;
      await act(async () => {
        deleteResult = await result.current.deleteProduct(1);
      });
      expect(deleteResult).toBe(true);

      // Final state should be clean
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should maintain independent state between different hook instances', async () => {
      const hook1 = renderHook(() => useProductOperations());
      const hook2 = renderHook(() => useProductOperations());

      // Cause error in first hook
      mockedProductService.createProduct.mockRejectedValue(new Error('First error'));
      
      await act(async () => {
        await hook1.result.current.createProduct({ 
          name: 'Test', 
          price: 10, 
          stockQuantity: 1, 
          isActive: true 
        });
      });

      expect(hook1.result.current.error).toBe('First error');
      expect(hook2.result.current.error).toBe(null);
    });

    it('should handle product with minimal required fields', async () => {
      const minimalProduct: CreateProduct = {
        name: 'Minimal Product',
        price: 1,
        stockQuantity: 0,
        isActive: false
      };

      const createdMinimalProduct: Product = {
        id: 99,
        name: minimalProduct.name,
        price: minimalProduct.price,
        stockQuantity: minimalProduct.stockQuantity,
        isActive: minimalProduct.isActive!,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };

      mockedProductService.createProduct.mockResolvedValue(createdMinimalProduct);

      const { result } = renderHook(() => useProductOperations());

      let createResult: Product | null = null;
      await act(async () => {
        createResult = await result.current.createProduct(minimalProduct);
      });

      expect(createResult).toEqual(createdMinimalProduct);
      expect(mockedProductService.createProduct).toHaveBeenCalledWith(minimalProduct);
    });

    it('should handle useProduct with different ID types', async () => {
      const { result, rerender } = renderHook(
        ({ id }) => useProduct(id),
        { initialProps: { id: 1 } }
      );

      mockedProductService.getProductById.mockResolvedValue(mockProducts[0]);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockedProductService.getProductById).toHaveBeenCalledWith(1);

      // Test with different ID
      mockedProductService.getProductById.mockClear();
      mockedProductService.getProductById.mockResolvedValue(mockProducts[1]);
      
      rerender({ id: 999 });

      await waitFor(() => {
        expect(mockedProductService.getProductById).toHaveBeenCalledWith(999);
      });
    });

    it('should handle error state transitions correctly in useProducts', async () => {
      // First call fails - set up mock before rendering hook
      mockedProductService.getAllProducts.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useProducts());

      // Wait for initial fetch to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.products).toEqual([]);

      // Refetch succeeds
      mockedProductService.getAllProducts.mockResolvedValue(mockProducts);

      await act(async () => {
        await result.current.refetch();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe(null);
      expect(result.current.products).toEqual(mockProducts);

      // Another refetch fails
      mockedProductService.getAllProducts.mockRejectedValue(new Error('Server error'));

      await act(async () => {
        await result.current.refetch();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Server error');
      // Products should remain from previous successful fetch
      expect(result.current.products).toEqual(mockProducts);
    });
  });
});