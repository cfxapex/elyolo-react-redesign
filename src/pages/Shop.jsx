import { useState, useEffect } from 'react';
import { products as localProducts } from '../data/products';
import { supabase } from '../lib/supabaseClient';
import './Shop.css';

export default function Shop() {
  const [products, setProducts] = useState(localProducts);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (!error && data) {
        // Merge local and remote products, ensuring no duplicates if IDs clash (though IDs should ideally be distinct)
        // For now, we prefer remote if ID matches, or just concat.
        // Simple concat avoiding ID collision relative to local might be tricky unless we assume remote IDs are different (UUIDs vs numbers).
        // Let's just append remote ones.
        setProducts([...localProducts, ...data]);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product, size, color, customText) => {
    // Basic customization fee logic
    const basePrice = product.price;
    const finalPrice = customText ? basePrice + 5.00 : basePrice;

    const cartItem = {
      ...product,
      price: finalPrice, // Update price if customized
      selectedSize: size,
      selectedColor: color,
      customText: customText || 'None',
      cartId: Date.now()
    };

    setCart([...cart, cartItem]);
    alert(`Added ${product.name} to cart!`);
    setSelectedProduct(null);
  };

  const ProductCard = ({ product }) => (
    <div className="product-card">
      <div className="product-image">
        <div className="placeholder-img">{product.image}</div>
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

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>×</button>

          <h2>{product.name}</h2>
          <p className="modal-price">
            ${(product.price + (wantsCustom ? 5 : 0)).toFixed(2)}
          </p>

          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            onAddToCart(
              product,
              formData.get('size'),
              formData.get('color'),
              formData.get('customText')
            );
          }}>
            <div className="form-group">
              <label>Size</label>
              <select name="size" required>
                <option value="">SELECT SIZE</option>
                {product.sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Color</label>
              <select name="color" required>
                <option value="">SELECT COLOR</option>
                {product.colors.map(color => (
                  <option key={color} value={color}>{color.toUpperCase()}</option>
                ))}
              </select>
            </div>

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

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="cart-summary">
            <p>/// ORDER RECEIPT ///</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, margin: '0 2rem' }}>
              {cart.map(item => (
                <div key={item.cartId} style={{ borderBottom: '1px dashed #ccc', paddingBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold' }}>{item.name}</span>
                  <span style={{ margin: '0 1rem' }}>[{item.selectedSize} / {item.selectedColor}]</span>
                  {item.customText !== 'None' && (
                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#666' }}>
                      + CUSTOM: "{item.customText}"
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'right' }}>
              <p>TOTAL: ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</p>
              <button
                className="btn"
                style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', marginTop: '1rem' }}
                onClick={() => alert('Checkout integration pending...')}
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="products-grid">
          {products.map((product, index) => (
            <ProductCard key={product.id || index} product={product} />
          ))}
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
