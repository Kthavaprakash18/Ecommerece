import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const SORTS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'popular',    label: 'Most Popular' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch]     = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort]         = useState('newest');

  const debouncedSearch = useDebounce(search, 350);
  const LIMIT = 12;

  // Load categories once
  useEffect(() => {
    getCategories()
      .then((r) => setCategories(r.data || []))
      .catch(() => {});
  }, []);

  // Fetch products whenever filters change
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: LIMIT, sort };
      if (debouncedSearch) params.search = debouncedSearch;
      if (category !== 'all') params.category = category;
      const result = await getProducts(params);
      setProducts(result.data || []);
      setTotal(result.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, sort, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [debouncedSearch, category, sort]);

  const handleClearFilters = () => {
    setSearch(''); setCategory('all'); setSort('newest'); setPage(1);
    setSearchParams({});
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="page container">
      {/* Top bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        <SearchBar value={search} onChange={setSearch} />
        <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        {(search || category !== 'all') && (
          <button className="btn btn-outline btn-sm" onClick={handleClearFilters}>✕ Clear Filters</button>
        )}
      </div>

      {/* Category chips */}
      <CategoryFilter categories={categories} selected={category} onSelect={setCategory} />

      {/* Results count */}
      {!loading && (
        <p style={{ fontSize: '0.88rem', color: 'var(--gray-600)', marginBottom: '1rem' }}>
          {total > 0 ? `Showing ${products.length} of ${total} products` : ''}
        </p>
      )}

      {/* Content */}
      {error && <ErrorMessage message={error} onRetry={fetchProducts} />}
      {loading && <LoadingSpinner />}

      {!loading && !error && products.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No products found</h3>
          <p>Try a different search term or category.</p>
          <button className="btn btn-primary" onClick={handleClearFilters}>Clear Filters</button>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="products-grid">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
          <button className="btn btn-outline btn-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
            <button key={p} className={`btn btn-sm ${page === p ? 'btn-primary' : 'btn-outline'}`} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button className="btn btn-outline btn-sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
        </div>
      )}
    </div>
  );
}
