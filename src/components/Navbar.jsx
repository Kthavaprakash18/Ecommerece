import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { itemCount } = useCart();
  const { items: wishItems } = useWishlist();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          Shop<span>Ease</span>
        </Link>

        {/* Desktop links */}
        <div className="nav-links" style={{ display: 'flex' }}>
          <NavLink to="/"         className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Home</NavLink>
          <NavLink to="/products" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Products</NavLink>
        </div>

        {/* Actions */}
        <div className="nav-actions">
          {user && <span className="nav-user">Hi, {user.user_metadata?.full_name || user.email}</span>}

          <Link to="/wishlist" className="nav-icon-btn" title="Wishlist">
            ♡
            {wishItems.length > 0 && <span className="badge">{wishItems.length}</span>}
          </Link>

          <Link to="/cart" className="nav-icon-btn" title="Cart">
            🛒
            {itemCount > 0 && <span className="badge">{itemCount}</span>}
          </Link>

          {user ? (
            <button className="btn btn-sm btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }} onClick={handleSignOut}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn btn-sm btn-primary">Login</Link>
          )}

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <NavLink to="/"         className="nav-link" onClick={() => setMenuOpen(false)}>Home</NavLink>
        <NavLink to="/products" className="nav-link" onClick={() => setMenuOpen(false)}>Products</NavLink>
        <NavLink to="/cart"     className="nav-link" onClick={() => setMenuOpen(false)}>Cart {itemCount > 0 && `(${itemCount})`}</NavLink>
        <NavLink to="/wishlist" className="nav-link" onClick={() => setMenuOpen(false)}>Wishlist</NavLink>
        {user ? (
          <button className="nav-link" onClick={handleSignOut} style={{ textAlign: 'left' }}>Logout</button>
        ) : (
          <NavLink to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login / Register</NavLink>
        )}
      </div>
    </nav>
  );
}
