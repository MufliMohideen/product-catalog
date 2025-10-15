import React, { useState, useEffect } from 'react';
import type { Product, CreateProduct, UpdateProduct } from '../types/product';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (productData: CreateProduct | UpdateProduct) => void;
  onCancel: () => void;
  loading?: boolean;
}

/**
 * ProductForm - Create and edit product interface
 * 
 * Handles form validation, state management, and submission for product operations.
 * Provides real-time validation feedback and character limits.
 */
const ProductForm: React.FC<ProductFormProps> = ({ 
  product, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    category: '',
    imageUrl: '',
    sku: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const LIMITS = {
    name: 50,
    description: 500,
    price: 10,
    stockQuantity: 10,
    category: 50,
    sku: 50,
    imageUrl: 500,
  };

  const isFormValid = (): boolean => {
    return (
      formData.name.trim().length > 0 &&
      formData.name.length <= LIMITS.name &&
      formData.description.length <= LIMITS.description &&
      formData.price.length <= LIMITS.price &&
      formData.stockQuantity.length <= LIMITS.stockQuantity &&
      formData.category.length <= LIMITS.category &&
      formData.sku.length <= LIMITS.sku &&
      formData.imageUrl.length <= LIMITS.imageUrl &&
      !isNaN(parseFloat(formData.price)) &&
      parseFloat(formData.price) >= 0 &&
      !isNaN(parseInt(formData.stockQuantity)) &&
      parseInt(formData.stockQuantity) >= 0 &&
      (formData.imageUrl === '' || isValidUrl(formData.imageUrl))
    );
  };

  /**
   * Populates form data when editing or resets for new product creation
   */
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        stockQuantity: product.stockQuantity.toString(),
        category: product.category || '',
        imageUrl: product.imageUrl || '',
        sku: product.sku || '',
        isActive: product.isActive,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        category: '',
        imageUrl: '',
        sku: '',
        isActive: true,
      });
    }
    setErrors({});
  }, [product]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.length > LIMITS.name) {
      newErrors.name = `Product name cannot exceed ${LIMITS.name} characters`;
    }

    // Description validation
    if (formData.description.length > LIMITS.description) {
      newErrors.description = `Description cannot exceed ${LIMITS.description} characters`;
    }

    // Price validation
    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price < 0) {
      newErrors.price = 'Valid price is required';
    } else if (formData.price.length > LIMITS.price) {
      newErrors.price = `Price cannot exceed ${LIMITS.price} digits`;
    }

    // Stock quantity validation
    const stockQuantity = parseInt(formData.stockQuantity);
    if (!formData.stockQuantity || isNaN(stockQuantity) || stockQuantity < 0) {
      newErrors.stockQuantity = 'Valid stock quantity is required';
    } else if (formData.stockQuantity.length > LIMITS.stockQuantity) {
      newErrors.stockQuantity = `Stock quantity cannot exceed ${LIMITS.stockQuantity} digits`;
    }

    // Category validation
    if (formData.category.length > LIMITS.category) {
      newErrors.category = `Category cannot exceed ${LIMITS.category} characters`;
    }

    // SKU validation
    if (formData.sku.length > LIMITS.sku) {
      newErrors.sku = `SKU cannot exceed ${LIMITS.sku} characters`;
    }

    // Image URL validation
    if (formData.imageUrl.length > LIMITS.imageUrl) {
      newErrors.imageUrl = `Image URL cannot exceed ${LIMITS.imageUrl} characters`;
    } else if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please provide a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity),
      category: formData.category.trim() || undefined,
      imageUrl: formData.imageUrl.trim() || undefined,
      sku: formData.sku.trim() || undefined,
      isActive: formData.isActive,
    };

    onSubmit(productData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // Real-time validation
    const newErrors = { ...errors };
    
    if (name === 'name') {
      if (value.length > LIMITS.name) {
        newErrors.name = `Product name cannot exceed ${LIMITS.name} characters`;
      } else if (!value.trim()) {
        newErrors.name = 'Product name is required';
      } else {
        delete newErrors.name;
      }
    }
    
    if (name === 'description') {
      if (value.length > LIMITS.description) {
        newErrors.description = `Description cannot exceed ${LIMITS.description} characters`;
      } else {
        delete newErrors.description;
      }
    }
    
    if (name === 'price') {
      if (value.length > LIMITS.price) {
        newErrors.price = `Price cannot exceed ${LIMITS.price} digits`;
      } else if (value && (isNaN(parseFloat(value)) || parseFloat(value) < 0)) {
        newErrors.price = 'Valid price is required';
      } else {
        delete newErrors.price;
      }
    }
    
    if (name === 'stockQuantity') {
      if (value.length > LIMITS.stockQuantity) {
        newErrors.stockQuantity = `Stock quantity cannot exceed ${LIMITS.stockQuantity} digits`;
      } else if (value && (isNaN(parseInt(value)) || parseInt(value) < 0)) {
        newErrors.stockQuantity = 'Valid stock quantity is required';
      } else {
        delete newErrors.stockQuantity;
      }
    }
    
    if (name === 'category') {
      if (value.length > LIMITS.category) {
        newErrors.category = `Category cannot exceed ${LIMITS.category} characters`;
      } else {
        delete newErrors.category;
      }
    }
    
    if (name === 'sku') {
      if (value.length > LIMITS.sku) {
        newErrors.sku = `SKU cannot exceed ${LIMITS.sku} characters`;
      } else {
        delete newErrors.sku;
      }
    }
    
    if (name === 'imageUrl') {
      if (value.length > LIMITS.imageUrl) {
        newErrors.imageUrl = `Image URL cannot exceed ${LIMITS.imageUrl} characters`;
      } else if (value && !isValidUrl(value)) {
        newErrors.imageUrl = 'Please provide a valid URL';
      } else {
        delete newErrors.imageUrl;
      }
    }
    
    setErrors(newErrors);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
        <p className="text-gray-400 mt-1">
          {product ? 'Update product information' : 'Fill in the details to create a new product'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
            <span className={`float-right text-xs ${formData.name.length > LIMITS.name ? 'text-red-500' : 'text-gray-400'}`}>
              {formData.name.length}/{LIMITS.name}
            </span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            maxLength={LIMITS.name + 10} // Allow typing but show error
            className={`input-field ${errors.name ? 'border-red-500' : formData.name.length > LIMITS.name ? 'border-red-300' : ''}`}
            placeholder="Enter product name"
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
            <span className={`float-right text-xs ${formData.description.length > LIMITS.description ? 'text-red-500' : 'text-gray-400'}`}>
              {formData.description.length}/{LIMITS.description}
            </span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            maxLength={LIMITS.description + 10} // Allow typing but show error
            rows={3}
            className={`input-field ${errors.description ? 'border-red-500' : formData.description.length > LIMITS.description ? 'border-red-300' : ''}`}
            placeholder="Enter product description"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Price and Stock Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price *
              <span className={`float-right text-xs ${formData.price.length > LIMITS.price ? 'text-red-500' : 'text-gray-400'}`}>
                {formData.price.length}/{LIMITS.price} digits
              </span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className={`input-field ${errors.price ? 'border-red-500' : formData.price.length > LIMITS.price ? 'border-red-300' : ''}`}
              placeholder="0.00"
              required
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity *
              <span className={`float-right text-xs ${formData.stockQuantity.length > LIMITS.stockQuantity ? 'text-red-500' : 'text-gray-400'}`}>
                {formData.stockQuantity.length}/{LIMITS.stockQuantity} digits
              </span>
            </label>
            <input
              type="number"
              id="stockQuantity"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              min="0"
              className={`input-field ${errors.stockQuantity ? 'border-red-500' : formData.stockQuantity.length > LIMITS.stockQuantity ? 'border-red-300' : ''}`}
              placeholder="0"
              required
            />
            {errors.stockQuantity && <p className="text-red-500 text-sm mt-1">{errors.stockQuantity}</p>}
          </div>
        </div>

        {/* Category and SKU Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
              <span className={`float-right text-xs ${formData.category.length > LIMITS.category ? 'text-red-500' : 'text-gray-400'}`}>
                {formData.category.length}/{LIMITS.category}
              </span>
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              maxLength={LIMITS.category + 10}
              className={`input-field ${errors.category ? 'border-red-500' : formData.category.length > LIMITS.category ? 'border-red-300' : ''}`}
              placeholder="Enter category"
            />
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
              SKU
              <span className={`float-right text-xs ${formData.sku.length > LIMITS.sku ? 'text-red-500' : 'text-gray-400'}`}>
                {formData.sku.length}/{LIMITS.sku}
              </span>
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              maxLength={LIMITS.sku + 10}
              className={`input-field ${errors.sku ? 'border-red-500' : formData.sku.length > LIMITS.sku ? 'border-red-300' : ''}`}
              placeholder="Enter SKU"
            />
            {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
            <span className={`float-right text-xs ${formData.imageUrl.length > LIMITS.imageUrl ? 'text-red-500' : 'text-gray-400'}`}>
              {formData.imageUrl.length}/{LIMITS.imageUrl}
            </span>
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            maxLength={LIMITS.imageUrl + 10}
            className={`input-field ${errors.imageUrl ? 'border-red-500' : formData.imageUrl.length > LIMITS.imageUrl ? 'border-red-300' : ''}`}
            placeholder="Enter image URL"
          />
          {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Product is active
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`btn-primary ${!isFormValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading || !isFormValid()}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {product ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              product ? 'Update Product' : 'Create Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;