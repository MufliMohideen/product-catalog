import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductForm from '../ProductForm';
import type { Product } from '../../types/product';

describe('ProductForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  const sampleProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'Sample description',
    price: 100,
    stockQuantity: 10,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
    sku: 'SKU123',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Form Rendering', () => {
    test('renders Add New Product form correctly', () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      expect(screen.getByText('Add New Product')).toBeInTheDocument();
      expect(screen.getByText('Fill in the details to create a new product')).toBeInTheDocument();
      expect(screen.getByLabelText(/Product Name/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Create Product/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Create Product/i })).toBeDisabled();
    });

    test('renders Edit Product form correctly when product is provided', () => {
      render(<ProductForm product={sampleProduct} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      expect(screen.getByText('Edit Product')).toBeInTheDocument();
      expect(screen.getByText('Update product information')).toBeInTheDocument();
      expect(screen.getByDisplayValue(sampleProduct.name)).toBeInTheDocument();
      expect(screen.getByDisplayValue(sampleProduct.description!)).toBeInTheDocument();
      expect(screen.getByDisplayValue(sampleProduct.price.toString())).toBeInTheDocument();
      expect(screen.getByDisplayValue(sampleProduct.stockQuantity.toString())).toBeInTheDocument();
      expect(screen.getByDisplayValue(sampleProduct.category!)).toBeInTheDocument();
      expect(screen.getByDisplayValue(sampleProduct.imageUrl!)).toBeInTheDocument();
      expect(screen.getByDisplayValue(sampleProduct.sku!)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Update Product/i })).toBeInTheDocument();
    });

    test('renders all form fields with correct labels', () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      expect(screen.getByLabelText(/Product Name \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Price \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Stock Quantity \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/SKU/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Image URL/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Product is active/i)).toBeInTheDocument();
    });

    test('shows character count limits for all fields', () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      // Check that character counts are displayed
      expect(screen.getAllByText('0/500')).toHaveLength(2); // Description and Image URL
      expect(screen.getAllByText('0/10 digits')).toHaveLength(2); // Price and Stock
      expect(screen.getAllByText('0/50')).toHaveLength(3); // Name, Category, SKU
    });
  });

  describe('Form Validation - Required Fields', () => {
    test('submit button is disabled when form is invalid', () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const submitButton = screen.getByRole('button', { name: /Create Product/i });
      expect(submitButton).toBeDisabled();
    });

    test('submit button is enabled when all required fields are filled', async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const nameInput = screen.getByLabelText(/Product Name/i);
      const priceInput = screen.getByLabelText(/Price/i);
      const stockInput = screen.getByLabelText(/Stock Quantity/i);

      fireEvent.change(nameInput, { target: { value: 'Test Product' } });
      fireEvent.change(priceInput, { target: { value: '10' } });
      fireEvent.change(stockInput, { target: { value: '5' } });

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /Create Product/i });
        expect(submitButton).not.toBeDisabled();
      });
    });

    test('submit button is disabled when name is empty', async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const nameInput = screen.getByLabelText(/Product Name/i);
      const priceInput = screen.getByLabelText(/Price/i);
      const stockInput = screen.getByLabelText(/Stock Quantity/i);

      fireEvent.change(nameInput, { target: { value: '' } });
      fireEvent.change(priceInput, { target: { value: '10' } });
      fireEvent.change(stockInput, { target: { value: '5' } });

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /Create Product/i });
        expect(submitButton).toBeDisabled();
      });
    });

    test('submit button is disabled when price is invalid', async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const nameInput = screen.getByLabelText(/Product Name/i);
      const priceInput = screen.getByLabelText(/Price/i);
      const stockInput = screen.getByLabelText(/Stock Quantity/i);

      fireEvent.change(nameInput, { target: { value: 'Test Product' } });
      fireEvent.change(priceInput, { target: { value: '-10' } });
      fireEvent.change(stockInput, { target: { value: '5' } });

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /Create Product/i });
        expect(submitButton).toBeDisabled();
      });
    });

    test('submit button is disabled when stock quantity is invalid', async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const nameInput = screen.getByLabelText(/Product Name/i);
      const priceInput = screen.getByLabelText(/Price/i);
      const stockInput = screen.getByLabelText(/Stock Quantity/i);

      fireEvent.change(nameInput, { target: { value: 'Test Product' } });
      fireEvent.change(priceInput, { target: { value: '10' } });
      fireEvent.change(stockInput, { target: { value: '-5' } });

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /Create Product/i });
        expect(submitButton).toBeDisabled();
      });
    });

    test('submit button is disabled when image URL is invalid', async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const nameInput = screen.getByLabelText(/Product Name/i);
      const priceInput = screen.getByLabelText(/Price/i);
      const stockInput = screen.getByLabelText(/Stock Quantity/i);
      const imageInput = screen.getByLabelText(/Image URL/i);

      fireEvent.change(nameInput, { target: { value: 'Test Product' } });
      fireEvent.change(priceInput, { target: { value: '10' } });
      fireEvent.change(stockInput, { target: { value: '5' } });
      fireEvent.change(imageInput, { target: { value: 'invalid-url' } });

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /Create Product/i });
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe('Form Validation - Character Limits', () => {
    test('shows validation error when name exceeds character limit', async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const nameInput = screen.getByLabelText(/Product Name/i);
      const longName = 'a'.repeat(51); // Exceeds 50 character limit
      fireEvent.change(nameInput, { target: { value: longName } });

      await waitFor(() => {
        expect(screen.getByText('Product name cannot exceed 50 characters')).toBeInTheDocument();
        expect(screen.getByText('51/50')).toBeInTheDocument();
      });
    });

    test('shows validation error when description exceeds character limit', async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const descriptionInput = screen.getByLabelText(/Description/i);
      const longDescription = 'a'.repeat(501); // Exceeds 500 character limit
      fireEvent.change(descriptionInput, { target: { value: longDescription } });

      await waitFor(() => {
        expect(screen.getByText('Description cannot exceed 500 characters')).toBeInTheDocument();
        expect(screen.getByText('501/500')).toBeInTheDocument();
      });
    });

    test('shows validation error when price exceeds digit limit', async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const priceInput = screen.getByLabelText(/Price/i);
      const longPrice = '12345678901'; // Exceeds 10 digit limit
      fireEvent.change(priceInput, { target: { value: longPrice } });

      await waitFor(() => {
        expect(screen.getByText('Price cannot exceed 10 digits')).toBeInTheDocument();
      });
    });

    test('shows validation error when stock quantity exceeds digit limit', async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const stockInput = screen.getByLabelText(/Stock Quantity/i);
      const longStock = '12345678901'; // Exceeds 10 digit limit
      fireEvent.change(stockInput, { target: { value: longStock } });

      await waitFor(() => {
        expect(screen.getByText('Stock quantity cannot exceed 10 digits')).toBeInTheDocument();
      });
    });

    test('shows validation error when category exceeds character limit', async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const categoryInput = screen.getByLabelText(/Category/i);
      const longCategory = 'a'.repeat(51); // Exceeds 50 character limit
      fireEvent.change(categoryInput, { target: { value: longCategory } });

      await waitFor(() => {
        expect(screen.getByText('Category cannot exceed 50 characters')).toBeInTheDocument();
      });
    });

    test('shows validation error when SKU exceeds character limit', async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const skuInput = screen.getByLabelText(/SKU/i);
      const longSku = 'a'.repeat(51); // Exceeds 50 character limit
      fireEvent.change(skuInput, { target: { value: longSku } });

      await waitFor(() => {
        expect(screen.getByText('SKU cannot exceed 50 characters')).toBeInTheDocument();
      });
    });

    test('shows validation error when image URL exceeds character limit', async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const imageUrlInput = screen.getByLabelText(/Image URL/i);
      const longUrl = 'https://example.com/' + 'a'.repeat(500); // Exceeds 500 character limit
      fireEvent.change(imageUrlInput, { target: { value: longUrl } });

      await waitFor(() => {
        expect(screen.getByText('Image URL cannot exceed 500 characters')).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation - URL Validation', () => {
    test('validates image URL format', async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const imageUrlInput = screen.getByLabelText(/Image URL/i);
      fireEvent.change(imageUrlInput, { target: { value: 'invalid-url' } });

      await waitFor(() => {
        expect(screen.getByText('Please provide a valid URL')).toBeInTheDocument();
      });
    });

    test('accepts valid URL formats', async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const imageUrlInput = screen.getByLabelText(/Image URL/i);
      fireEvent.change(imageUrlInput, { target: { value: 'https://example.com/image.jpg' } });

      await waitFor(() => {
        expect(screen.queryByText('Please provide a valid URL')).not.toBeInTheDocument();
      });
    });

    test('allows empty image URL', async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const imageUrlInput = screen.getByLabelText(/Image URL/i);
      fireEvent.change(imageUrlInput, { target: { value: '' } });

      await waitFor(() => {
        expect(screen.queryByText('Please provide a valid URL')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    test('submits valid form successfully for new product', async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      // Fill in required fields
      fireEvent.change(screen.getByLabelText(/Product Name/i), { target: { value: 'Laptop' } });
      fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Gaming laptop' } });
      fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '2500.99' } });
      fireEvent.change(screen.getByLabelText(/Stock Quantity/i), { target: { value: '5' } });
      fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'Electronics' } });
      fireEvent.change(screen.getByLabelText(/SKU/i), { target: { value: 'LAP-001' } });
      fireEvent.change(screen.getByLabelText(/Image URL/i), { target: { value: 'https://via.placeholder.com/300' } });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Create Product/i })).not.toBeDisabled();
      });

      fireEvent.click(screen.getByRole('button', { name: /Create Product/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'Laptop',
          description: 'Gaming laptop',
          price: 2500.99,
          stockQuantity: 5,
          category: 'Electronics',
          sku: 'LAP-001',
          imageUrl: 'https://via.placeholder.com/300',
          isActive: true,
        });
      });
    });

    test('submits form with only required fields', async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      // Fill in only required fields
      fireEvent.change(screen.getByLabelText(/Product Name/i), { target: { value: 'Basic Product' } });
      fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '10' } });
      fireEvent.change(screen.getByLabelText(/Stock Quantity/i), { target: { value: '1' } });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Create Product/i })).not.toBeDisabled();
      });

      fireEvent.click(screen.getByRole('button', { name: /Create Product/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'Basic Product',
          description: undefined,
          price: 10,
          stockQuantity: 1,
          category: undefined,
          sku: undefined,
          imageUrl: undefined,
          isActive: true,
        });
      });
    });

    test('submits updated product data when editing', async () => {
      render(<ProductForm product={sampleProduct} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      // Update the name
      const nameInput = screen.getByDisplayValue(sampleProduct.name);
      fireEvent.change(nameInput, { target: { value: 'Updated Product Name' } });

      fireEvent.click(screen.getByRole('button', { name: /Update Product/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'Updated Product Name',
          description: sampleProduct.description,
          price: sampleProduct.price,
          stockQuantity: sampleProduct.stockQuantity,
          category: sampleProduct.category,
          sku: sampleProduct.sku,
          imageUrl: sampleProduct.imageUrl,
          isActive: sampleProduct.isActive,
        });
      });
    });

    test('trims whitespace from form inputs on submission', async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      fireEvent.change(screen.getByLabelText(/Product Name/i), { target: { value: '  Laptop  ' } });
      fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: '  Gaming laptop  ' } });
      fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '2500' } });
      fireEvent.change(screen.getByLabelText(/Stock Quantity/i), { target: { value: '5' } });
      fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: '  Electronics  ' } });

      fireEvent.click(screen.getByRole('button', { name: /Create Product/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
          name: 'Laptop',
          description: 'Gaming laptop',
          category: 'Electronics',
        }));
      });
    });

    test('converts empty strings to undefined for optional fields', async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      fireEvent.change(screen.getByLabelText(/Product Name/i), { target: { value: 'Product' } });
      fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: '' } });
      fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '10' } });
      fireEvent.change(screen.getByLabelText(/Stock Quantity/i), { target: { value: '1' } });
      fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: '' } });

      fireEvent.click(screen.getByRole('button', { name: /Create Product/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
          description: undefined,
          category: undefined,
        }));
      });
    });
  });

  describe('Form State Management', () => {
    test('enables submit button when form is valid', async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const submitButton = screen.getByRole('button', { name: /Create Product/i });
      expect(submitButton).toBeDisabled();

      fireEvent.change(screen.getByLabelText(/Product Name/i), { target: { value: 'Valid Product' } });
      fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '10' } });
      fireEvent.change(screen.getByLabelText(/Stock Quantity/i), { target: { value: '1' } });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    test('disables submit button when form is invalid', async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const submitButton = screen.getByRole('button', { name: /Create Product/i });
      
      fireEvent.change(screen.getByLabelText(/Product Name/i), { target: { value: 'Valid Product' } });
      fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: 'invalid' } });
      fireEvent.change(screen.getByLabelText(/Stock Quantity/i), { target: { value: '1' } });

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    test('updates character count in real-time', async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const nameInput = screen.getByLabelText(/Product Name/i);
      fireEvent.change(nameInput, { target: { value: 'Test' } });

      await waitFor(() => {
        expect(screen.getByText('4/50')).toBeInTheDocument();
      });
    });

    test('handles checkbox state correctly', () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const checkbox = screen.getByLabelText(/Product is active/i);
      expect(checkbox).toBeChecked(); // Default should be true

      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    test('resets form when product prop changes from null to product', () => {
      const { rerender } = render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      // Fill form with some data
      fireEvent.change(screen.getByLabelText(/Product Name/i), { target: { value: 'Test Name' } });
      expect(screen.getByDisplayValue('Test Name')).toBeInTheDocument();

      // Change to edit mode with a product
      rerender(<ProductForm product={sampleProduct} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      expect(screen.getByDisplayValue(sampleProduct.name)).toBeInTheDocument();
      expect(screen.queryByDisplayValue('Test Name')).not.toBeInTheDocument();
    });

    test('resets form when product prop changes from product to null', () => {
      const { rerender } = render(<ProductForm product={sampleProduct} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      expect(screen.getByDisplayValue(sampleProduct.name)).toBeInTheDocument();

      // Change to create mode
      rerender(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      expect(screen.queryByDisplayValue(sampleProduct.name)).not.toBeInTheDocument();
      expect(screen.getByLabelText(/Product Name/i)).toHaveValue('');
    });
  });

  describe('Loading States', () => {
    test('shows loading state for create operation', () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} loading={true} />);
      
      expect(screen.getByText('Creating...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Creating.../i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeDisabled();
    });

    test('shows loading state for update operation', () => {
      render(<ProductForm product={sampleProduct} onSubmit={mockOnSubmit} onCancel={mockOnCancel} loading={true} />);
      
      expect(screen.getByText('Updating...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Updating.../i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeDisabled();
    });

    test('shows loading spinner when loading', () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} loading={true} />);
      
      const spinner = screen.getByRole('button', { name: /Creating.../i }).querySelector('svg');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });
  });

  describe('Button Interactions', () => {
    test('calls onCancel when Cancel button is clicked', () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    test('prevents form submission when form is invalid', async () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      // Try to submit empty form
      fireEvent.click(screen.getByRole('button', { name: /Create Product/i }));
      
      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    test('has proper form labels', () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      expect(screen.getByLabelText(/Product Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Stock Quantity/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/SKU/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Image URL/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Product is active/i)).toBeInTheDocument();
    });

    test('has proper button roles', () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      expect(screen.getByRole('button', { name: /Create Product/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    });

    test('shows required field indicators', () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      expect(screen.getByText(/Product Name \*/)).toBeInTheDocument();
      expect(screen.getByText(/Price \*/)).toBeInTheDocument();
      expect(screen.getByText(/Stock Quantity \*/)).toBeInTheDocument();
    });
  });
});
