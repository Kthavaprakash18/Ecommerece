import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice, calcDiscount, truncate, starArray } from '../utils/helpers';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const discount  = calcDiscount(product.original_price, product.price);
  const stars     = starArray(product.rating || 0);
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="product-card animate-fade-up">
      {/* Wishlist button */}
      <button className="wishlist-btn" onClick={() => toggleWishlist(product)} title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
        {wishlisted ? '❤️' : '🤍'}
      </button>

      {/* Out-of-stock overlay */}
      {product.stock === 0 && <div className="out-of-stock-overlay">Out of Stock</div>}

      {/* Image */}
      <Link to={`/products/${product.id}`}>
        <img
          src={product.image_url || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
        />
      </Link>

      <div className="product-card-body">
        <div className="product-card-category">{product.categories?.name || 'General'}</div>

        <Link to={`/products/${product.id}`}>
          <div className="product-card-name">{truncate(product.name, 50)}</div>
        </Link>

        {/* Stars */}
        <div className="product-card-rating">
          <div className="stars">
            {stars.map((s, i) => (
              <span key={i}>{s === 'full' ? '★' : s === 'half' ? '⯨' : '☆'}</span>
            ))}
          </div>
          <span>({product.review_count?.toLocaleString() || 0})</span>
        </div>

        {/* Price */}
        <div className="product-card-price">
          <span className="price">{formatPrice(product.price)}</span>
          {product.original_price > product.price && (
            <>
              <span className="price-orig">{formatPrice(product.original_price)}</span>
              <span className="discount">{discount}% off</span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="product-card-actions">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
          >
            🛒 Add
          </button>
          <Link to={`/products/${product.id}`} className="btn btn-outline btn-sm">
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
