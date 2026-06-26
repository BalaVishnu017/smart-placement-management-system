import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/api';
import { useToast } from '../components/Toast';
import { FaGraduationCap } from 'react-icons/fa';

export default function ForgotPassword() {
  const addToast = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    email: '',
    rollNo: '',
    phone: '',
    masterKey: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.newPassword !== form.confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }
    
    if (form.newPassword.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: form.email,
        newPassword: form.newPassword
      };

      if (isAdmin) {
        payload.masterKey = form.masterKey;
      } else {
        payload.rollNo = form.rollNo;
        payload.phone = form.phone;
      }

      await forgotPassword(payload);
      addToast('Password reset successfully! Please log in.', 'success');
      navigate('/login');
    } catch (err) {
      addToast(err.response?.data?.message || 'Verification failed. Please check details.', 'error');
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
        <h1>Reset Password</h1>
        <p className="subtitle">Verify your identity to reset password</p>

        <div className="auth-tabs" style={{ background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '8px', marginBottom: '20px' }}>
          <button 
            type="button"
            className={`auth-tab ${!isAdmin ? 'active' : ''}`} 
            onClick={() => { setIsAdmin(false); setForm({ ...form, masterKey: '' }); }}
            style={{ width: '50%', padding: '6px', borderRadius: '6px', fontSize: '0.85rem' }}
          >
            Student
          </button>
          <button 
            type="button"
            className={`auth-tab ${isAdmin ? 'active' : ''}`} 
            onClick={() => { setIsAdmin(true); setForm({ ...form, rollNo: '', phone: '' }); }}
            style={{ width: '50%', padding: '6px', borderRadius: '6px', fontSize: '0.85rem' }}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Registered Email *</label>
            <input 
              name="email" 
              type="email" 
              className="form-control" 
              placeholder="e.g. rahul@student.com" 
              value={form.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          {!isAdmin ? (
            <>
              <div className="form-group">
                <label>Roll Number *</label>
                <input 
                  name="rollNo" 
                  className="form-control" 
                  placeholder="e.g. CS2101" 
                  value={form.rollNo} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Registered Phone Number *</label>
                <input 
                  name="phone" 
                  className="form-control" 
                  placeholder="e.g. 9876543210" 
                  value={form.phone} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </>
          ) : (
            <div className="form-group">
              <label>Master Recovery Key (JWT Secret) *</label>
              <input 
                name="masterKey" 
                type="password"
                className="form-control" 
                placeholder="Enter JWT_SECRET key" 
                value={form.masterKey} 
                onChange={handleChange} 
                required 
              />
            </div>
          )}

          <div className="form-group">
            <label>New Password *</label>
            <input 
              name="newPassword" 
              type="password" 
              className="form-control" 
              placeholder="Min 6 characters" 
              value={form.newPassword} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password *</label>
            <input 
              name="confirmPassword" 
              type="password" 
              className="form-control" 
              placeholder="Re-enter new password" 
              value={form.confirmPassword} 
              onChange={handleChange} 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%', marginTop: '8px' }} 
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '16px' }}>
          Remember your password? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
}
