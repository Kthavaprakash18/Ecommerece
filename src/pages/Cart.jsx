import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal, total, itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="page container">
        <h1 className="page-title">Shopping Cart</h1>
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some products to get started!</p>
          <Link to="/products" className="btn btn-primary">Shop Now</Link>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="page container">
      <h1 className="page-title">Shopping Cart ({itemCount} items)</h1>
      <div className="cart-layout">
        {/* Cart items */}
        <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={item.image_url} alt={item.name} className="cart-item-img"
                           onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=?'; }} />
                      <div>
                        <Link to={`/products/${item.id}`} style={{ fontWeight: 600, color: 'var(--navy)' }}>
                          {item.name}
                        </Link>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>
                          {item.categories?.name || ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="price">{formatPrice(item.price)}</td>
                  <td>
                    <div className="cart-qty">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </td>
                  <td className="price">{formatPrice(item.price * item.quantity)}</td>
                  <td>
                    <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--error)', fontSize: '1.1rem' }} title="Remove">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-outline btn-sm" onClick={clearCart}>Clear Cart</button>
            <Link to="/products" className="btn btn-outline btn-sm">← Continue Shopping</Link>
          </div>
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h3 style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '1rem' }}>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="summary-row"><span>Shipping</span><span style={{ color: 'var(--success)' }}>Free</span></div>
          <div className="summary-row"><span>Tax (18% GST)</span><span>{formatPrice(subtotal * 0.18)}</span></div>
          <div className="summary-row total"><span>Total</span><span>{formatPrice(total * 1.18)}</span></div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1.25rem' }} onClick={handleCheckout}>
            Proceed to Checkout →
          </button>
          <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)', textAlign: 'center', marginTop: '0.75rem' }}>
            🔒 Secure checkout
          </div>
        </div>
      </div>
    </div>
  );
}
