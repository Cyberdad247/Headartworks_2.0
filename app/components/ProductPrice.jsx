import {Money} from '@shopify/hydrogen';

/**
 * @param {{
 *   price?: MoneyV2;
 *   compareAtPrice?: MoneyV2 | null;
 *   currency?: string;
 * }}
 */
export function ProductPrice({price, compareAtPrice, currency}) {
  return (
    <div className="product-price">
      {compareAtPrice ? (
        <div className="product-price-on-sale">
          {price ? <Money data={price} as="span" /> : null}
          <s>
            <Money data={compareAtPrice} as="span" />
          </s>
        </div>
      ) : price ? (
        <Money data={price} as="span" />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen/storefront-api-types').MoneyV2} MoneyV2 */
