import {CartForm, Money} from '@shopify/hydrogen';
import {useRef} from 'react';

/**
 * @param {CartSummaryProps}
 */
export function CartSummary({cart, layout}) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  return (
    <div aria-labelledby="cart-summary" className={className}>
      <h4>Totals</h4>
      <dl className="cart-subtotal">
        <dt>Subtotal</dt>
        <dd>
          {cart.cost?.subtotalAmount?.amount ? (
            <Money data={cart.cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </dd>
      </dl>
      <CartDiscounts discountCodes={cart.discountCodes} />
      <CartGiftCard giftCardCodes={cart.appliedGiftCards} />
      <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
    </div>
  );
}
/**
 * @param {{checkoutUrl?: string}}
 */
function CartCheckoutActions({checkoutUrl}) {
  if (!checkoutUrl) return null;

  return (
    <div>
      <a href={checkoutUrl} target="_self">
        <p>Continue to Checkout &rarr;</p>
      </a>
      <br />
    </div>
  );
}

/**
 * @param {{
 *   discountCodes?: CartApiQueryFragment['discountCodes'];
 * }}
 */
function CartDiscounts({discountCodes}) {
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button>Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div>
          <input type="text" name="discountCode" placeholder="Discount code" />
          &nbsp;
          <button type="submit">Apply</button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

/**
 * @param {{
 *   discountCodes?: string[];
 *   children: React.ReactNode;
 * }}
 */
function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * @param {{
 *   giftCardCodes?: CartApiQueryFragment['appliedGiftCards'];
 * }}
 */
function CartGiftCard({giftCardCodes}) {
  const codes = giftCardCodes || [];
  const formRef = useRef(null);

  return (
    <div>
      {/* Have existing gift card, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Gift card(s)</dt>
          {codes.map((code) => (
            <div key={code.id}>
              <CartForm
                route="/cart"
                action={CartForm.ACTIONS.GiftCardsUpdate}
                inputs={{
                  giftCardCodes: [],
                }}
              >
                <div className="cart-discount">
                  <code>{code.lastCharacters}</code>
                  &nbsp;
                  <button>Remove</button>
                </div>
              </CartForm>
            </div>
          ))}
        </div>
      </dl>

      {/* Show an input to apply a gift card */}
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.GiftCardsUpdate}
        inputs={{
          giftCardCodes: codes.map((code) => code.id),
        }}
        ref={formRef}
      >
        <div>
          <input type="text" name="giftCardCode" placeholder="Gift card code" />
          &nbsp;
          <button type="submit">Apply</button>
        </div>
      </CartForm>
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/**
 * @typedef {{
 *   cart: CartApiQueryFragment;
 *   layout: 'page' | 'aside';
 * }} CartSummaryProps
 */