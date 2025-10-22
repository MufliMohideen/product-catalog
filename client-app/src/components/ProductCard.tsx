import React from 'react';
import { Tooltip } from 'react-tooltip';
import type { Product } from '../types/product';
import { getDefaultCurrency } from '../utils/env';


interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

/**
 * ProductCard - Individual product display component
 * 
 * Renders product information in a card layout with actions for edit/delete.
 * Includes tooltips for truncated content and responsive design.
 */
const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onEdit, 
  onDelete, 
  showActions = true 
}) => {
  const formatPrice = (price: number) => {
    const currency = getDefaultCurrency();
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const createTooltipId = (suffix: string) => `product-${product.id}-${suffix}`;

  const shouldShowTooltip = (text: string, maxLength: number) => {
    return text && text.length > maxLength;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="h-48 bg-gray-100 flex items-center justify-center flex-shrink-0">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`text-gray-400 text-center p-4 ${product.imageUrl ? 'hidden' : ''}`}>
          <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <p className="text-sm">No Image</p>
        </div>
      </div>

      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <h3 
            className="text-lg font-semibold text-gray-900 truncate cursor-help"
            data-tooltip-id={createTooltipId('name')}
            data-tooltip-content={shouldShowTooltip(product.name, 25) ? product.name : ''}
          >
            {product.name}
          </h3>
          {shouldShowTooltip(product.name, 25) && (
            <Tooltip
              id={createTooltipId('name')}
              place="top"
              className="max-w-sm !bg-gray-900 !text-white !rounded-lg !shadow-lg !z-50"
            />
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Content that can vary in height */}
        <div className="flex-grow">
          {product.description && (
            <>
              <p 
                className="text-gray-600 text-sm mb-3 line-clamp-2 cursor-help"
                data-tooltip-id={createTooltipId('description')}
                data-tooltip-content={shouldShowTooltip(product.description, 80) ? product.description : ''}
              >
                {product.description}
              </p>
              {shouldShowTooltip(product.description, 80) && (
                <Tooltip
                  id={createTooltipId('description')}
                  place="bottom"
                  className="max-w-md !bg-gray-900 !text-white !rounded-lg !shadow-lg !z-50"
                />
              )}
            </>
          )}

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-2xl font-bold text-blue-600">{formatPrice(product.price)}</span>
              <span className="text-sm text-gray-500">
                Stock: <span className={product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}>
                  {product.stockQuantity}
                </span>
              </span>
            </div>

            {product.category && (
              <div className="flex items-center justify-between">
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  {product.category}
                </span>
                {product.sku && (
                  <span className="text-xs text-gray-500">SKU: {product.sku}</span>
                )}
              </div>
            )}
          </div>

          <div className="text-xs text-gray-400 mb-4">
            Created: {formatDate(product.createdAt)}
            {product.updatedAt !== product.createdAt && (
              <span className="ml-2">• Updated: {formatDate(product.updatedAt)}</span>
            )}
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom with consistent spacing */}
        {showActions && (
          <div className="flex space-x-2 mt-auto">
            {onEdit && (
              <button
                onClick={() => onEdit(product)}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(product.id)}
                className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;