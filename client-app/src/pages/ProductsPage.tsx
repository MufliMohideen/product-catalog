import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import ConfirmationModal from '../components/ConfirmationModal';
import { useProducts, useProductOperations } from '../hooks/useProducts';
import type { Product, CreateProduct, UpdateProduct } from '../types/product';

interface ProductsPageProps {
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
  searchTerm: string;
  clearEditingProduct: boolean;
  setClearEditingProduct: (clear: boolean) => void;
}

/**
 * ProductsPage - Main product management interface
 * 
 * Handles product listing, creation, editing, and deletion operations.
 * Integrates with search functionality and provides responsive layout.
 */
const ProductsPage: React.FC<ProductsPageProps> = ({ 
  showAddForm, 
  setShowAddForm, 
  searchTerm, 
  clearEditingProduct, 
  setClearEditingProduct 
}) => {
  const { products, loading, error, refetch } = useProducts();
  const { createProduct, updateProduct, deleteProduct, loading: operationLoading } = useProductOperations();
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    productId: number | null;
    productName: string;
  }>({
    isOpen: false,
    productId: null,
    productName: ''
  });

  /**
   * Clears editing state when Add Product is triggered from header
   */
  useEffect(() => {
    if (clearEditingProduct) {
      setEditingProduct(null);
      setClearEditingProduct(false);
    }
  }, [clearEditingProduct, setClearEditingProduct]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowAddForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  /**
   * Handles form submission for both create and update operations
   */
  const handleFormSubmit = async (productData: CreateProduct | UpdateProduct) => {
    try {
      let result;
      if (editingProduct) {
        result = await updateProduct(editingProduct.id, productData as UpdateProduct);
        if (result) {
          toast.success('Product updated successfully!');
        } else {
          toast.error('Failed to update product. Please try again.');
          return;
        }
      } else {
        result = await createProduct(productData as CreateProduct);
        if (result) {
          toast.success('Product created successfully!');
        } else {
          toast.error('Failed to create product. Please try again.');
          return;
        }
      }
      
      setShowAddForm(false);
      setEditingProduct(null);
      refetch();
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMessage = editingProduct ? 'Failed to update product' : 'Failed to create product';
      toast.error(`${errorMessage}. Please try again.`);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    const product = products.find(p => p.id === id);
    setDeleteConfirmation({
      isOpen: true,
      productId: id,
      productName: product?.name || 'this product'
    });
  };

  const confirmDelete = async () => {
    if (deleteConfirmation.productId) {
      const success = await deleteProduct(deleteConfirmation.productId);
      if (success) {
        toast.success('Product deleted successfully!');
        refetch();
      } else {
        toast.error('Failed to delete product. Please try again.');
      }
      setDeleteConfirmation({ isOpen: false, productId: null, productName: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, productId: null, productName: '' });
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingProduct(null);
  };

  if (showAddForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={operationLoading}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-5 bg-white">
      {/* Header */}
      <div className="mb-3">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">PRODUCTS</h1>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <div className="flex">
            <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">Error loading products</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              {searchTerm ? (
                <>
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">No products match your search "{searchTerm}".</p>
                </>
              ) : (
                <>
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">Get started by adding your first product.</p>
                  <button onClick={handleAddProduct} className="btn-primary">
                    Add Your First Product
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="mb-5">
                <p className="text-gray-500">
                  {searchTerm ? (
                    <>Showing {filteredProducts.length} of {products.length} product{filteredProducts.length !== 1 ? 's' : ''} for "{searchTerm}"</>
                  ) : (
                    <>Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</>
                  )}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                    showActions={true}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteConfirmation.productName}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="No, Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isLoading={operationLoading}
      />
    </div>
  );
};

export default ProductsPage;