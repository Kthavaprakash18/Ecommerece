export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className="filter-bar">
      <button
        className={`filter-chip ${selected === 'all' ? 'active' : ''}`}
        onClick={() => onSelect('all')}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`filter-chip ${selected === cat.slug ? 'active' : ''}`}
          onClick={() => onSelect(cat.slug)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
