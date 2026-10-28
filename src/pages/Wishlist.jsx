import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="page container">
        <h1 className="page-title">My Wishlist</h1>
        <div className="empty-state">
          <div className="empty-state-icon">🤍</div>
          <h3>Your wishlist is empty</h3>
          <p>Save items you love by clicking the heart icon on any product.</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page container">
      <h1 className="page-title">My Wishlist ({items.length})</h1>
      <div className="products-grid">
        {items.map((item) => (
          <div key={item.id} className="product-card animate-fade-up">
            <Link to={`/products/${item.id}`}>
              <img src={item.image_url} alt={item.name} className="product-card-img" loading="lazy"
                   onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }} />
            </Link>
            <div className="product-card-body">
              <Link to={`/products/${item.id}`}><div className="product-card-name">{item.name}</div></Link>
              <div className="product-card-price"><span className="price">{formatPrice(item.price)}</span></div>
              <div className="product-card-actions">
                <button className="btn btn-primary btn-sm" onClick={() => { addToCart(item); removeFromWishlist(item.id); }}>
                  🛒 Move to Cart
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => removeFromWishlist(item.id)}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
