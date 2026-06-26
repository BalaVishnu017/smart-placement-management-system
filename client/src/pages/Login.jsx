import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap } from 'react-icons/fa';

export default function Login() {
  const [searchParams] = useSearchParams();
  const [isAdmin, setIsAdmin] = useState(searchParams.get('role') === 'admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Reset inputs when switching roles
  useEffect(() => {
    setEmail('');
    setPassword('');
    setError('');
  }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      navigate(data.user.role === 'admin' ? '/admin' : '/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <FaGraduationCap style={{ fontSize: '2.2rem', color: '#6366f1' }} />
        </div>
        <h1>{isAdmin ? 'Admin Portal' : 'Welcome Back'}</h1>
        <p className="subtitle">{isAdmin ? 'Sign in to placement officer console' : 'Sign in to your account'}</p>
        
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control" placeholder={isAdmin ? 'admin@spms.com' : 'Enter your email'} value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group" style={{ marginBottom: '8px' }}>
            <label>Password</label>
            <input type="password" className="form-control" placeholder={isAdmin ? 'admin123' : 'Enter your password'} value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div style={{ textAlign: 'right', marginBottom: '16px' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.82rem', color: '#818cf8', textDecoration: 'none' }}>Forgot Password?</Link>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in...' : `Sign in as ${isAdmin ? 'Admin' : 'Student'}`}
          </button>
        </form>
        
        <div className="auth-footer" style={{ marginTop: '16px' }}>
          {!isAdmin ? (
            <>
              Don't have an account? <Link to="/register">Register here</Link>
              <div style={{ marginTop: '8px' }}>
                Placement Officer? <button type="button" onClick={() => setIsAdmin(true)} className="btn-link" style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'underline' }}>Login here</button>
              </div>
            </>
          ) : (
            <div>
              Are you a Student? <button type="button" onClick={() => setIsAdmin(false)} className="btn-link" style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'underline' }}>Login here</button>
            </div>
          )}
        </div>
        
        <div className="auth-footer" style={{ marginTop: '10px' }}>
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
