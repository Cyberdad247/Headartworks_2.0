import {render, screen, fireEvent} from '@testing-library/react';
import {AddToCartButton} from './AddToCartButton';

// Mock the CartForm component from Shopify Hydrogen
jest.mock('@shopify/hydrogen', () => ({
  CartForm: ({children, action, inputs}) => (
    <form data-testid="cart-form" data-action={action} data-inputs={JSON.stringify(inputs)}>
      {children}
    </form>
  ),
}));

describe('AddToCartButton', () => {
  const mockLines = [{merchandiseId: 'product-id-123', quantity: 1}];
  const mockOnClick = jest.fn();
  
  it('renders with default text when no children are provided', () => {
    render(<AddToCartButton lines={mockLines} />);
    
    expect(screen.getByRole('button')).toHaveTextContent('Add to cart');
  });
  
  it('renders with custom text when children are provided', () => {
    render(<AddToCartButton lines={mockLines}>Buy Now</AddToCartButton>);
    
    expect(screen.getByRole('button')).toHaveTextContent('Buy Now');
  });
  
  it('is disabled when disabled prop is true', () => {
    render(<AddToCartButton lines={mockLines} disabled={true} />);
    
    expect(screen.getByRole('button')).toBeDisabled();
  });
  
  it('calls onClick handler when clicked', () => {
    render(<AddToCartButton lines={mockLines} onClick={mockOnClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
  
  it('passes the correct lines to CartForm', () => {
    render(<AddToCartButton lines={mockLines} />);
    
    const form = screen.getByTestId('cart-form');
    expect(form).toHaveAttribute('data-inputs', JSON.stringify({lines: mockLines}));
  });
});