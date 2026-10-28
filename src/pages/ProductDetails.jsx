import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice, calcDiscount, starArray } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [qty, setQty]         = useState(1);
  const [added, setAdded]     = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  useEffect(() => {
    setLoading(true); setError('');
    getProductById(id)
      .then((r) => setProduct(r.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="page container"><LoadingSpinner /></div>;
  if (error)   return <div className="page container"><ErrorMessage message={error} /></div>;
  if (!product) return null;

  const discount = calcDiscount(product.original_price, product.price);
  const stars    = starArray(product.rating || 0);
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="page container">
      <div style={{ marginBottom: '1rem', fontSize: '0.88rem', color: 'var(--gray-400)' }}>
        <Link to="/">Home</Link> / <Link to="/products">Products</Link> / <span style={{ color: 'var(--navy)' }}>{product.name}</span>
      </div>

      <div className="product-detail">
        {/* Image */}
        <img
          src={product.image_url || 'https://via.placeholder.com/600x480?text=No+Image'}
          alt={product.name}
          className="product-detail-img"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/600x480?text=No+Image'; }}
        />

        {/* Info */}
        <div>
          <div className="product-detail-category">{product.categories?.name || 'General'}</div>
          <h1 className="product-detail-name">{product.name}</h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div className="stars">{stars.map((s, i) => <span key={i}>{s === 'full' ? '★' : s === 'half' ? '⯨' : '☆'}</span>)}</div>
            <span style={{ fontSize: '0.88rem', color: 'var(--gray-600)' }}>{product.rating} ({product.review_count?.toLocaleString()} reviews)</span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
            <span className="product-detail-price">{formatPrice(product.price)}</span>
            {product.original_price > product.price && (
              <>
                <span className="price-orig" style={{ fontSize: '1rem' }}>{formatPrice(product.original_price)}</span>
                <span className="discount" style={{ fontSize: '0.9rem' }}>{discount}% off</span>
              </>
            )}
          </div>

          <p className="product-detail-desc">{product.description}</p>

          {/* Meta */}
          <div className="product-detail-meta">
            <div className="meta-item"><label>Availability</label><span style={{ color: product.stock > 0 ? 'var(--success)' : 'var(--error)' }}>{product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}</span></div>
            <div className="meta-item"><label>Category</label><span>{product.categories?.name || '—'}</span></div>
            <div className="meta-item"><label>Rating</label><span>⭐ {product.rating}/5.0</span></div>
            <div className="meta-item"><label>Reviews</label><span>{product.review_count?.toLocaleString()}</span></div>
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="tags-wrap">{product.tags.map((t) => <span key={t} className="tag">#{t}</span>)}</div>
          )}

          {/* Qty */}
          {product.stock > 0 && (
            <div className="qty-control">
              <span style={{ fontWeight: 600, color: 'var(--gray-600)' }}>Qty:</span>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
            </div>
          )}

          {/* Actions */}
          <div className="detail-actions">
            <button className="btn btn-primary" onClick={handleAddToCart} disabled={product.stock === 0 || added}>
              {added ? '✓ Added!' : '🛒 Add to Cart'}
            </button>
            <button className="btn btn-outline" onClick={() => toggleWishlist(product)}>
              {wishlisted ? '❤️ Wishlisted' : '🤍 Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
