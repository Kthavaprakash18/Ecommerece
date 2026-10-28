import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/api';
import { formatPrice } from '../utils/helpers';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const total = subtotal * 1.18;

  const [form, setForm] = useState({ name: user?.user_metadata?.full_name || '', email: user?.email || '', address: '', city: '', state: '', pincode: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const required = ['name', 'email', 'address', 'city', 'pincode'];
    for (const f of required) {
      if (!form[f]) { setError(`Please fill in: ${f}`); return; }
    }
    setLoading(true);
    try {
      await placeOrder({
        user_id: user?.id || null,
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        subtotal,
        total,
        delivery_info: form,
      });
      setSuccess(true);
      clearCart();
      setTimeout(() => navigate('/'), 4000);
    } catch (err) {
      setError(err.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !success) {
    navigate('/cart'); return null;
  }

  if (success) {
    return (
      <div className="page container">
        <div className="empty-state">
          <div className="empty-state-icon">🎉</div>
          <h3>Order Placed Successfully!</h3>
          <p>Thank you for your order. You'll receive a confirmation shortly.<br/>Redirecting to home in 4 seconds…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page container">
      <h1 className="page-title">Checkout</h1>
      <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
        🧪 <strong>Test Checkout</strong> — No real payment is processed. Orders are saved to the database.
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="checkout-layout">
        {/* Delivery Form */}
        <form className="checkout-form card" style={{ padding: '1.5rem' }} onSubmit={handleSubmit} noValidate>
          <h3 style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '1.25rem' }}>Delivery Information</h3>
          <div className="form-row">
            <div className="form-group"><label>Full Name *</label><input name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" /></div>
            <div className="form-group"><label>Email *</label><input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" /></div>
          </div>
          <div className="form-group"><label>Address *</label><input name="address" value={form.address} onChange={handleChange} placeholder="123 Main Street, Apt 4B" /></div>
          <div className="form-row">
            <div className="form-group"><label>City *</label><input name="city" value={form.city} onChange={handleChange} placeholder="Chennai" /></div>
            <div className="form-group"><label>State</label><input name="state" value={form.state} onChange={handleChange} placeholder="Tamil Nadu" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Pincode *</label><input name="pincode" value={form.pincode} onChange={handleChange} placeholder="600001" /></div>
            <div className="form-group"><label>Phone</label><input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" /></div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Placing order…' : '✅ Place Test Order'}
          </button>
        </form>

        {/* Order Summary */}
        <div className="order-summary-card">
          <h3 style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '1rem' }}>Order Summary</h3>
          {items.map((item) => (
            <div key={item.id} className="order-item-row">
              <img src={item.image_url} alt={item.name} className="order-item-img"
                   onError={(e) => { e.target.src = 'https://via.placeholder.com/48?text=?'; }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>Qty: {item.quantity}</div>
              </div>
              <div className="price" style={{ fontSize: '0.95rem' }}>{formatPrice(item.price * item.quantity)}</div>
            </div>
          ))}
          <div className="summary-row" style={{ marginTop: '1rem' }}><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="summary-row"><span>GST (18%)</span><span>{formatPrice(subtotal * 0.18)}</span></div>
          <div className="summary-row"><span>Shipping</span><span style={{ color: 'var(--success)' }}>Free</span></div>
          <div className="summary-row total"><span>Total</span><span>{formatPrice(total)}</span></div>
        </div>
      </div>
    </div>
  );
}
