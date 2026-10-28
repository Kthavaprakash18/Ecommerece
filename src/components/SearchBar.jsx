export default function SearchBar({ value, onChange, placeholder = 'Search products…' }) {
  return (
    <div className="search-wrap">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search products"
      />
      {value && (
        <button onClick={() => onChange('')} style={{ color: 'var(--gray-400)', fontSize: '1rem', lineHeight: 1 }}>✕</button>
      )}
    </div>
  );
}
