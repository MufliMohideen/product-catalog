import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ConfirmationModal from '../ConfirmationModal';

describe('ConfirmationModal Component', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Test Title',
    message: 'Test message',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders modal with all elements when isOpen is true', () => {
      render(<ConfirmationModal {...defaultProps} />);

      // Check title
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Test Title' })).toBeInTheDocument();

      // Check message
      expect(screen.getByText('Test message')).toBeInTheDocument();

      // Check buttons with default text
      expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();

      // Check warning icon SVG
      const svgElement = document.querySelector('svg');
      expect(svgElement).toBeInTheDocument();
      expect(svgElement).toHaveClass('h-6', 'w-6', 'text-red-600');
    });

    it('does not render anything when isOpen is false', () => {
      const { container } = render(
        <ConfirmationModal {...defaultProps} isOpen={false} />
      );

      expect(container.firstChild).toBeNull();
      expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
      expect(screen.queryByText('Test message')).not.toBeInTheDocument();
    });

    it('renders with custom confirm button text', () => {
      render(
        <ConfirmationModal {...defaultProps} confirmText="Delete Product" />
      );

      expect(screen.getByRole('button', { name: 'Delete Product' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Yes' })).not.toBeInTheDocument();
    });

    it('renders with custom cancel button text', () => {
      render(
        <ConfirmationModal {...defaultProps} cancelText="Keep Product" />
      );

      expect(screen.getByRole('button', { name: 'Keep Product' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'No' })).not.toBeInTheDocument();
    });

    it('renders with both custom button texts', () => {
      render(
        <ConfirmationModal
          {...defaultProps}
          confirmText="Confirm Action"
          cancelText="Cancel Action"
        />
      );

      expect(screen.getByRole('button', { name: 'Confirm Action' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel Action' })).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls onConfirm when confirm button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnConfirm = jest.fn();

      render(<ConfirmationModal {...defaultProps} onConfirm={mockOnConfirm} />);

      const confirmButton = screen.getByRole('button', { name: 'Yes' });
      await user.click(confirmButton);

      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnCancel = jest.fn();

      render(<ConfirmationModal {...defaultProps} onCancel={mockOnCancel} />);

      const cancelButton = screen.getByRole('button', { name: 'No' });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('renders backdrop and modal content correctly', () => {
      render(<ConfirmationModal {...defaultProps} />);

      // Check if backdrop element exists
      const backdrop = document.querySelector('.fixed.inset-0');
      expect(backdrop).toBeInTheDocument();

      // Check if modal content exists
      const modalContent = document.querySelector('.bg-white.rounded-lg');
      expect(modalContent).toBeInTheDocument();
    });

    it('renders modal structure correctly', async () => {
      render(<ConfirmationModal {...defaultProps} />);

      // Check for main modal structure elements
      const fixedContainer = document.querySelector('.fixed.inset-0');
      const modalContainer = document.querySelector('.bg-white.rounded-lg');
      const buttonsContainer = document.querySelector('.flex.space-x-3.justify-end');

      expect(fixedContainer).toBeInTheDocument();
      expect(modalContainer).toBeInTheDocument();
      expect(buttonsContainer).toBeInTheDocument();
    });

    it('handles multiple rapid clicks on confirm button', async () => {
      const user = userEvent.setup();
      const mockOnConfirm = jest.fn();

      render(<ConfirmationModal {...defaultProps} onConfirm={mockOnConfirm} />);

      const confirmButton = screen.getByRole('button', { name: 'Yes' });
      
      // Rapid clicks
      await user.click(confirmButton);
      await user.click(confirmButton);
      await user.click(confirmButton);

      expect(mockOnConfirm).toHaveBeenCalledTimes(3);
    });
  });

  describe('Loading State', () => {
    it('disables buttons and shows loading spinner when isLoading is true', () => {
      render(<ConfirmationModal {...defaultProps} isLoading={true} />);

      const confirmButton = screen.getByRole('button', { name: /deleting/i });
      const cancelButton = screen.getByRole('button', { name: 'No' });

      expect(confirmButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();

      // Check for loading text
      expect(screen.getByText('Deleting...')).toBeInTheDocument();

      // Check for loading spinner SVG
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });

    it('shows normal state when isLoading is false', () => {
      render(<ConfirmationModal {...defaultProps} isLoading={false} />);

      const confirmButton = screen.getByRole('button', { name: 'Yes' });
      const cancelButton = screen.getByRole('button', { name: 'No' });

      expect(confirmButton).not.toBeDisabled();
      expect(cancelButton).not.toBeDisabled();
      expect(screen.queryByText('Deleting...')).not.toBeInTheDocument();
    });

    it('shows custom confirm text instead of loading text when not loading', () => {
      render(
        <ConfirmationModal
          {...defaultProps}
          confirmText="Remove Item"
          isLoading={false}
        />
      );

      expect(screen.getByRole('button', { name: 'Remove Item' })).toBeInTheDocument();
      expect(screen.queryByText('Deleting...')).not.toBeInTheDocument();
    });

    it('does not call handlers when buttons are disabled due to loading', async () => {
      const user = userEvent.setup();
      const mockOnConfirm = jest.fn();
      const mockOnCancel = jest.fn();

      render(
        <ConfirmationModal
          {...defaultProps}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          isLoading={true}
        />
      );

      const confirmButton = screen.getByRole('button', { name: /deleting/i });
      const cancelButton = screen.getByRole('button', { name: 'No' });

      await user.click(confirmButton);
      await user.click(cancelButton);

      // Since buttons are disabled, handlers should not be called
      expect(mockOnConfirm).not.toHaveBeenCalled();
      expect(mockOnCancel).not.toHaveBeenCalled();
    });
  });

  describe('Default Props', () => {
    it('uses default confirmText when not provided', () => {
      render(<ConfirmationModal {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
    });

    it('uses default cancelText when not provided', () => {
      render(<ConfirmationModal {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
    });

    it('uses default isLoading value when not provided', () => {
      render(<ConfirmationModal {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: 'Yes' });
      const cancelButton = screen.getByRole('button', { name: 'No' });

      expect(confirmButton).not.toBeDisabled();
      expect(cancelButton).not.toBeDisabled();
    });
  });

  describe('CSS Classes and Styling', () => {
    it('applies correct CSS classes to modal elements', () => {
      render(<ConfirmationModal {...defaultProps} />);

      // Check backdrop classes
      const backdrop = document.querySelector('.fixed.inset-0');
      expect(backdrop).toHaveClass('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'z-50');

      // Check modal content classes
      const modalContent = document.querySelector('.bg-white.rounded-lg');
      expect(modalContent).toHaveClass('bg-white', 'rounded-lg', 'shadow-xl', 'max-w-md', 'w-full', 'mx-4');

      // Check button classes
      const confirmButton = screen.getByRole('button', { name: 'Yes' });
      const cancelButton = screen.getByRole('button', { name: 'No' });

      expect(confirmButton).toHaveClass('bg-red-600', 'text-white');
      expect(cancelButton).toHaveClass('bg-white', 'text-gray-700', 'border-gray-300');
    });

    it('applies disabled styles when loading', () => {
      render(<ConfirmationModal {...defaultProps} isLoading={true} />);

      const confirmButton = screen.getByRole('button', { name: /deleting/i });
      const cancelButton = screen.getByRole('button', { name: 'No' });

      expect(confirmButton).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
      expect(cancelButton).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });
  });

  describe('Accessibility', () => {
    it('has accessible heading for title', () => {
      render(<ConfirmationModal {...defaultProps} />);
      
      const heading = screen.getByRole('heading', { name: 'Test Title' });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H3');
    });

    it('has accessible button text', () => {
      render(
        <ConfirmationModal
          {...defaultProps}
          confirmText="Delete Item"
          cancelText="Keep Item"
        />
      );

      expect(screen.getByRole('button', { name: 'Delete Item' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Keep Item' })).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty strings for title and message', () => {
      render(
        <ConfirmationModal
          {...defaultProps}
          title=""
          message=""
        />
      );

      // Should still render the modal structure
      const backdrop = document.querySelector('.fixed.inset-0');
      expect(backdrop).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
    });

    it('handles very long title and message text', () => {
      const longTitle = 'A'.repeat(200);
      const longMessage = 'B'.repeat(500);

      render(
        <ConfirmationModal
          {...defaultProps}
          title={longTitle}
          message={longMessage}
        />
      );

      expect(screen.getByText(longTitle)).toBeInTheDocument();
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('handles special characters in title and message', () => {
      const specialTitle = 'Title with <script>alert("test")</script> & symbols!@#$%';
      const specialMessage = 'Message with "quotes" and \'apostrophes\' & entities';

      render(
        <ConfirmationModal
          {...defaultProps}
          title={specialTitle}
          message={specialMessage}
        />
      );

      expect(screen.getByText(specialTitle)).toBeInTheDocument();
      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });

    it('handles undefined optional props gracefully', () => {
      const propsWithUndefined = {
        ...defaultProps,
        confirmText: undefined,
        cancelText: undefined,
        isLoading: undefined,
      };

      render(<ConfirmationModal {...propsWithUndefined} />);

      // Should use default values
      expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
    });
  });

  describe('Component Lifecycle', () => {
    it('updates correctly when props change', () => {
      const { rerender } = render(<ConfirmationModal {...defaultProps} />);

      expect(screen.getByText('Test Title')).toBeInTheDocument();

      // Change props
      rerender(
        <ConfirmationModal
          {...defaultProps}
          title="Updated Title"
          message="Updated Message"
          confirmText="Updated Confirm"
          cancelText="Updated Cancel"
          isLoading={true}
        />
      );

      expect(screen.getByText('Updated Title')).toBeInTheDocument();
      expect(screen.getByText('Updated Message')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Updated Cancel' })).toBeInTheDocument();
      expect(screen.getByText('Deleting...')).toBeInTheDocument();
    });

    it('opens and closes correctly', () => {
      const { rerender } = render(<ConfirmationModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByText('Test Title')).not.toBeInTheDocument();

      rerender(<ConfirmationModal {...defaultProps} isOpen={true} />);

      expect(screen.getByText('Test Title')).toBeInTheDocument();

      rerender(<ConfirmationModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    });
  });
});