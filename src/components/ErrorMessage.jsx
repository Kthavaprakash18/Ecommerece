export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="alert alert-error animate-fade-up" role="alert">
      <span>⚠️</span>
      <span style={{ flex: 1 }}>{message || 'Something went wrong.'}</span>
      {onRetry && (
        <button className="btn btn-sm btn-outline" onClick={onRetry} style={{ borderColor: 'var(--error)', color: 'var(--error)' }}>
          Retry
        </button>
      )}
    </div>
  );
}
