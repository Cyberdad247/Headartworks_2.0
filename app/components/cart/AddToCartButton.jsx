import {CartForm} from '@shopify/hydrogen';

/**
 * @param {{
 *   children?: React.ReactNode;
 *   disabled?: boolean;
 *   lines: CartLineInput[];
 *   onClick?: () => void;
 * }}
 */
export function AddToCartButton({children, disabled, lines, onClick}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesAdd}
      inputs={{
        lines,
      }}
    >
      <button
        className="add-to-cart"
        disabled={disabled}
        onClick={onClick}
        type="submit"
      >
        {children || 'Add to cart'}
      </button>
    </CartForm>
  );
}

/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartLineInput} CartLineInput */