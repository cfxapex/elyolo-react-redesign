import { useMemo, useState, useEffect } from 'react';
import { products as localProducts } from '../data/products';
import { supabase } from '../lib/supabaseClient';
import { isShopifyConfigured, shopifyFetch } from '../lib/shopifyClient';
import './Shop.css';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shopError, setShopError] = useState('');

  const usingShopify = useMemo(() => isShopifyConfigured(), []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setShopError('');
      try {
        if (usingShopify) {
          const data = await shopifyFetch(`
            query Products($first: Int!) {
              products(first: $first) {
                edges {
                  node {
                    id
                    title
                    description
                    handle
                    featuredImage {
                      url
                      altText
                    }
                    options {
                      name
                      values
                    }
                    variants(first: 100) {
                      edges {
                        node {
                          id
                          title
                          availableForSale
                          price {
                            amount
                            currencyCode
                          }
                          selectedOptions {
                            name
                            value
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          `, { first: 50 });

          const mapped = (data?.products?.edges ?? []).map(({ node }) => {
            const variants = (node.variants?.edges ?? []).map((e) => e.node);
            const baseVariant = variants[0];
            const amount = baseVariant?.price?.amount ? Number(baseVariant.price.amount) : 0;
            return {
              id: node.id,
              name: node.title,
              description: node.description,
              imageUrl: node.featuredImage?.url,
              imageAlt: node.featuredImage?.altText || node.title,
              options: node.options ?? [],
              variants,
              price: amount
            };
          });
          setProducts(mapped);
        } else {
          // Fallback: local + Supabase products
          let merged = [...localProducts];
          const { data, error } = await supabase.from('products').select('*');
          if (!error && data?.length) merged = [...merged, ...data];
          setProducts(merged);
        }
      } catch (err) {
        setShopError(err?.message || 'Failed to load products');
        setProducts(usingShopify ? [] : localProducts);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const ensureCart = async () => {
    if (!usingShopify) return null;
    if (cartId && checkoutUrl) return { cartId, checkoutUrl };

    const data = await shopifyFetch(`
      mutation CartCreate {
        cartCreate {
          cart {
            id
            checkoutUrl
          }
          userErrors { field message }
        }
      }
    `);

    const created = data?.cartCreate?.cart;
    if (!created?.id) throw new Error(data?.cartCreate?.userErrors?.[0]?.message || 'Failed to create cart');
    setCartId(created.id);
    setCheckoutUrl(created.checkoutUrl);
    return { cartId: created.id, checkoutUrl: created.checkoutUrl };
  };

  const addToCart = async (product, selections, customText) => {
    if (!usingShopify) {
      alert('Checkout integration pending (Shopify not configured yet).');
      setSelectedProduct(null);
      return;
    }

    try {
      const { cartId: ensuredCartId } = await ensureCart();

      const match = (product.variants ?? []).find((v) => {
        const opts = v.selectedOptions ?? [];
        return Object.entries(selections).every(([name, value]) => {
          const found = opts.find((o) => o.name === name);
          return found?.value === value;
        });
      }) || product.variants?.[0];

      if (!match?.id) throw new Error('No purchasable variant found for your selections.');

      const attributes = [];
      if (customText) attributes.push({ key: 'Custom Back Text', value: customText });

      const data = await shopifyFetch(`
        mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart { id checkoutUrl }
            userErrors { field message }
          }
        }
      `, {
        cartId: ensuredCartId,
        lines: [{
          merchandiseId: match.id,
          quantity: 1,
          attributes
        }]
      });

      const errors = data?.cartLinesAdd?.userErrors ?? [];
      if (errors.length) throw new Error(errors[0]?.message || 'Failed to add to cart');

      setCheckoutUrl(data?.cartLinesAdd?.cart?.checkoutUrl ?? checkoutUrl);
      alert(`Added ${product.name} to cart!`);
      setSelectedProduct(null);
    } catch (err) {
      alert(err?.message || 'Failed to add to cart');
    }
  };

  const ProductCard = ({ product }) => (
    <div className="product-card">
      <div className="product-image">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.imageAlt || product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div className="placeholder-img">{product.image}</div>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <p className="product-description">{product.description}</p>
        <button
          className="btn"
          style={{ width: '100%' }}
          onClick={() => setSelectedProduct(product)}
        >
          Select Options
        </button>
      </div>
    </div>
  );

  const ProductModal = ({ product, onClose, onAddToCart }) => {
    const [wantsCustom, setWantsCustom] = useState(false);
    const [selections, setSelections] = useState({});

    const optionDefs = usingShopify
      ? (product.options ?? []).filter((o) => (o?.values?.length ?? 0) > 0)
      : [
        { name: 'Size', values: product.sizes ?? [] },
        { name: 'Color', values: product.colors ?? [] }
      ];

    useEffect(() => {
      // initialize selections with first value
      const next = {};
      optionDefs.forEach((opt) => {
        if (opt?.name && opt?.values?.length) next[opt.name] = opt.values[0];
      });
      setSelections(next);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product?.id]);

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>×</button>

          <h2>{product.name}</h2>
          <p className="modal-price">${(product.price + (wantsCustom ? 5 : 0)).toFixed(2)}</p>

          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const customText = formData.get('customText');
            onAddToCart(product, selections, wantsCustom ? String(customText || '') : '');
          }}>
            {optionDefs.map((opt) => (
              <div className="form-group" key={opt.name}>
                <label>{opt.name}</label>
                <select
                  value={selections[opt.name] ?? ''}
                  onChange={(e) => setSelections((prev) => ({ ...prev, [opt.name]: e.target.value }))}
                  required
                >
                  {(opt.values ?? []).map((v) => (
                    <option key={v} value={v}>{String(v).toUpperCase()}</option>
                  ))}
                </select>
              </div>
            ))}

            <div className="form-group" style={{
              border: '2px dashed #000',
              padding: '1rem',
              margin: '2rem 0',
              background: wantsCustom ? '#000' : 'transparent',
              color: wantsCustom ? '#fff' : '#000'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                color: 'inherit'
              }}>
                <input
                  type="checkbox"
                  checked={wantsCustom}
                  onChange={(e) => setWantsCustom(e.target.checked)}
                  style={{ width: '20px', marginRight: '1rem', height: '20px' }}
                />
                ADD CUSTOM BACK TEXT (+$5.00)
              </label>

              {wantsCustom && (
                <div style={{ marginTop: '1rem' }}>
                  <label style={{ color: '#fff' }}>ENTER YOUR TEXT:</label>
                  <input
                    type="text"
                    name="customText"
                    placeholder="E.G. 'LIVING MY BEST LIFE'"
                    required={wantsCustom}
                    style={{ border: '2px solid #fff' }}
                  />
                  <small style={{ display: 'block', marginTop: '0.5rem', color: '#ccc' }}>
                    * Text will be printed in high-contrast white/black font on the back.
                  </small>
                </div>
              )}
            </div>

            <button type="submit" className="btn" style={{ width: '100%' }}>
              ADD TO CART - ${(product.price + (wantsCustom ? 5 : 0)).toFixed(2)}
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="shop-page">
      <div className="container">
        <h1 className="section-title">Shop Collection</h1>

        {shopError && (
          <div className="cart-summary" style={{ borderStyle: 'solid', borderColor: '#a00' }}>
            <p style={{ color: '#a00' }}>SHOP ERROR</p>
            <div style={{ color: '#333', fontFamily: 'Courier New, monospace', fontWeight: 'bold' }}>
              {shopError}
            </div>
          </div>
        )}

        {/* Checkout */}
        {usingShopify && checkoutUrl && (
          <div className="cart-summary">
            <p>/// SHOPIFY CHECKOUT ///</p>
            <div style={{ flex: 1, margin: '0 2rem', color: '#333', fontWeight: 'bold' }}>
              Items are stored in Shopify cart. Checkout will open Shopify’s secure checkout.
            </div>
            <div style={{ textAlign: 'right' }}>
              <button
                className="btn"
                style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', marginTop: '1rem' }}
                onClick={() => window.location.assign(checkoutUrl)}
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="products-grid">
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#666' }}>
              Loading products…
            </div>
          ) : (
            products.map((product, index) => (
              <ProductCard key={product.id || index} product={product} />
            ))
          )}
        </div>

        {/* Product Options Modal */}
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={addToCart}
          />
        )}
      </div>
    </div>
  );
}
