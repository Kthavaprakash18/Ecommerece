import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!form.fullName || !form.email || !form.password) { setAuthError('Please fill all fields.'); return; }
    if (form.password !== form.confirm) { setAuthError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setAuthError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await signUp(form.email, form.password, form.fullName);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch {
      /* error via authError */
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-up">
        <h2>Create account</h2>
        <p>Join ShopEase and start shopping</p>

        {authError && <div className="alert alert-error">{authError}</div>}
        {success && <div className="alert alert-success">🎉 Account created! Check your email to confirm, then login. Redirecting…</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Full Name</label>
            <input name="fullName" type="text" value={form.fullName} onChange={handleChange} placeholder="Jane Doe" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 6 chars" required />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input name="confirm" type="password" value={form.confirm} onChange={handleChange} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} disabled={loading || success}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
