/**
 * @param {{
 *   swatch?: string;
 *   name: string;
 * }}
 */
export function ProductOptionSwatch({swatch, name}) {
  return (
    <div
      className="product-option-swatch"
      style={{
        backgroundColor: swatch || 'transparent',
      }}
    >
      {!swatch && <span>{name}</span>}
    </div>
  );
}