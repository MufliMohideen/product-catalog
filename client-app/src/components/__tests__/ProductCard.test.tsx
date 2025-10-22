import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductCard from '../ProductCard';
import type { Product } from '../../types/product';

// Mock react-tooltip if used in ProductCard
jest.mock('react-tooltip', () => ({
  Tooltip: ({ id, children, ...props }: any) => (
    <div data-testid={`tooltip-${id}`} {...props}>
      {children}
    </div>
  )
}));

describe('ProductCard Component', () => {
  const product: Product = {
    id: 1,
    name: 'Test Product',
    description: 'Test product description',
    price: 99.99,
    stockQuantity: 10,
    category: 'Electronics',
    imageUrl: 'https://example.com/image.jpg',
    sku: 'TEST-001',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders product name', () => {
      render(<ProductCard product={product} />);
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('renders product description', () => {
      render(<ProductCard product={product} />);
      expect(screen.getByText('Test product description')).toBeInTheDocument();
    });

    it('renders product price with default currency', () => {
      render(<ProductCard product={product} />);
      expect(screen.getByText('LKR 99.99')).toBeInTheDocument();
    });

    it('renders product category', () => {
      render(<ProductCard product={product} />);
      expect(screen.getByText('Electronics')).toBeInTheDocument();
    });

    it('renders product SKU', () => {
      render(<ProductCard product={product} />);
      expect(screen.getByText('SKU: TEST-001')).toBeInTheDocument();
    });

    it('renders stock quantity', () => {
      render(<ProductCard product={product} />);
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('renders active status', () => {
      render(<ProductCard product={product} />);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders product image when imageUrl is provided', () => {
      render(<ProductCard product={product} />);
      const image = screen.getByAltText('Test Product');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('renders fallback when imageUrl is not provided', () => {
      const productWithoutImage = { ...product, imageUrl: undefined };
      render(<ProductCard product={productWithoutImage} />);
      expect(screen.getByText('No Image')).toBeInTheDocument();
    });

    it('renders created date', () => {
      render(<ProductCard product={product} />);
      expect(screen.getByText(/Created: Jan 1, 2023/)).toBeInTheDocument();
    });
  });

  describe('Product Status Display', () => {
    it('shows active status with correct styling', () => {
      render(<ProductCard product={product} />);
      const activeStatus = screen.getByText('Active');
      expect(activeStatus).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('shows inactive status with correct styling', () => {
      const inactiveProduct = { ...product, isActive: false };
      render(<ProductCard product={inactiveProduct} />);
      const inactiveStatus = screen.getByText('Inactive');
      expect(inactiveStatus).toHaveClass('bg-red-100', 'text-red-800');
    });
  });

  describe('Stock Display', () => {
    it('shows stock with green color when in stock', () => {
      render(<ProductCard product={product} />);
      const stockElement = screen.getByText('10');
      expect(stockElement).toHaveClass('text-green-600');
    });

    it('shows stock with red color when out of stock', () => {
      const outOfStockProduct = { ...product, stockQuantity: 0 };
      render(<ProductCard product={outOfStockProduct} />);
      const stockElement = screen.getByText('0');
      expect(stockElement).toHaveClass('text-red-600');
    });

    it('shows stock with red color when negative', () => {
      const negativeStockProduct = { ...product, stockQuantity: -5 };
      render(<ProductCard product={negativeStockProduct} />);
      const stockElement = screen.getByText('-5');
      expect(stockElement).toHaveClass('text-red-600');
    });
  });

  describe('Action Buttons', () => {
    it('shows edit button when onEdit is provided', () => {
      render(<ProductCard product={product} onEdit={mockOnEdit} />);
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });

    it('shows delete button when onDelete is provided', () => {
      render(<ProductCard product={product} onDelete={mockOnDelete} />);
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('hides buttons when showActions is false', () => {
      render(
        <ProductCard
          product={product}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          showActions={false}
        />
      );
      expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });

    it('calls onEdit with product when edit button is clicked', () => {
      render(<ProductCard product={product} onEdit={mockOnEdit} />);
      fireEvent.click(screen.getByRole('button', { name: /edit/i }));
      expect(mockOnEdit).toHaveBeenCalledWith(product);
    });

    it('calls onDelete with product id when delete button is clicked', () => {
      render(<ProductCard product={product} onDelete={mockOnDelete} />);
      fireEvent.click(screen.getByRole('button', { name: /delete/i }));
      expect(mockOnDelete).toHaveBeenCalledWith(product.id);
    });
  });

  describe('Optional Fields', () => {
    it('handles missing description', () => {
      const productWithoutDescription = { ...product, description: undefined };
      render(<ProductCard product={productWithoutDescription} />);
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.queryByText('Test product description')).not.toBeInTheDocument();
    });

    it('handles missing category', () => {
      const productWithoutCategory = { ...product, category: undefined };
      render(<ProductCard product={productWithoutCategory} />);
      expect(screen.queryByText('Electronics')).not.toBeInTheDocument();
    });

    it('handles missing SKU', () => {
      const productWithoutSku = { ...product, sku: undefined };
      render(<ProductCard product={productWithoutSku} />);
      expect(screen.queryByText(/SKU:/)).not.toBeInTheDocument();
    });
  });

  describe('Date Formatting', () => {
    it('formats created date correctly', () => {
      render(<ProductCard product={product} />);
      expect(screen.getByText(/Created: Jan 1, 2023/)).toBeInTheDocument();
    });

    it('shows both created and updated dates when different', () => {
      const updatedProduct = { ...product, updatedAt: '2023-02-01T00:00:00Z' };
      render(<ProductCard product={updatedProduct} />);
      expect(screen.getByText(/Created: Jan 1, 2023/)).toBeInTheDocument();
      expect(screen.getByText(/Updated: Feb 1, 2023/)).toBeInTheDocument();
    });
  });

  describe('Tooltips', () => {
    it('shows tooltip for long product names', () => {
      const longNameProduct = { ...product, name: 'This is a very long product name that should trigger tooltip' };
      render(<ProductCard product={longNameProduct} />);
      const nameElement = screen.getByText(longNameProduct.name);
      expect(nameElement).toHaveAttribute('data-tooltip-id');
    });
  });

  describe('Image Error Handling', () => {
    it('handles image load error', () => {
      render(<ProductCard product={product} />);
      const image = screen.getByAltText('Test Product') as HTMLImageElement;
      fireEvent.error(image);
      expect(image.style.display).toBe('none');
    });
  });
});
