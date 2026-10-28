import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Home() {
  const [featured, setFeatured]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [searchQuery, setSearch]  = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getProducts({ limit: 8, sort: 'popular' }),
      getCategories(),
    ])
      .then(([products, cats]) => {
        setFeatured(products.data || []);
        setCategories(cats.data || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <h1>Shop Smarter,<br /><span>Live Better</span></h1>
        <p>Discover thousands of products — electronics, fashion, books, home goods, sports, and beauty.</p>

        {/* Hero search */}
        <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for products…"
            style={{ padding: '0.75rem 1.25rem', border: 'none', borderRadius: '10px', width: '360px', maxWidth: '100%', fontSize: '1rem', outline: 'none' }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
            Search
          </button>
        </form>

        <div className="hero-actions" style={{ marginTop: '1rem' }}>
          <Link to="/products" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>Shop Now →</Link>
        </div>

        <div className="hero-stats">
          <div className="hero-stat"><strong>1000+</strong><span>Products</span></div>
          <div className="hero-stat"><strong>6</strong><span>Categories</span></div>
          <div className="hero-stat"><strong>Free</strong><span>Shipping</span></div>
          <div className="hero-stat"><strong>24/7</strong><span>Support</span></div>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        {/* Categories */}
        {categories.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <div className="section-heading">
              <h2>Shop by Category</h2>
              <Link to="/products">View all →</Link>
            </div>
            <div className="categories-grid">
              {categories.map((cat) => (
                <div key={cat.id} className="category-card" onClick={() => navigate(`/products?category=${cat.slug}`)}>
                  <img src={cat.image_url} alt={cat.name} loading="lazy"
                       onError={(e) => { e.target.src = 'https://via.placeholder.com/160x100?text=' + cat.name; }} />
                  <p>{cat.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured products */}
        <section>
          <div className="section-heading">
            <h2>🔥 Popular Products</h2>
            <Link to="/products">See all →</Link>
          </div>
          {error && <ErrorMessage message={error} />}
          {loading && <LoadingSpinner />}
          {!loading && !error && (
            <div className="products-grid">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
