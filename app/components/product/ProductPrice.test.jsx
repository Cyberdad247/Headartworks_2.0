import {render, screen} from '@testing-library/react';
import {ProductPrice} from './ProductPrice';

// Mock the Money component from Shopify Hydrogen
jest.mock('@shopify/hydrogen', () => ({
  Money: ({data}) => <div data-testid="money">{data.amount}</div>,
}));

describe('ProductPrice', () => {
  it('renders the price when only price is provided', () => {
    const price = {amount: '10.00', currencyCode: 'USD'};
    
    render(<ProductPrice price={price} />);
    
    expect(screen.getByTestId('money')).toHaveTextContent('10.00');
  });
  
  it('renders sale price when compareAtPrice is provided', () => {
    const price = {amount: '8.00', currencyCode: 'USD'};
    const compareAtPrice = {amount: '10.00', currencyCode: 'USD'};
    
    render(<ProductPrice price={price} compareAtPrice={compareAtPrice} />);
    
    const moneyElements = screen.getAllByTestId('money');
    expect(moneyElements).toHaveLength(2);
    expect(moneyElements[0]).toHaveTextContent('8.00');
    expect(moneyElements[1]).toHaveTextContent('10.00');
  });
  
  it('renders empty space when no price is provided', () => {
    render(<ProductPrice />);
    
    expect(screen.getByText(/\u00A0/)).toBeInTheDocument(); // &nbsp;
  });
});