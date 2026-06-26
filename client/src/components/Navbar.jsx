import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaBars, FaTimes, FaLock } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { getNotifications, updatePassword } from '../services/api';

export default function Navbar({ title, onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Password Change Modal State
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getNotifications().then(res => setUnreadCount(res.data.unreadCount)).catch(() => {});
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const handleOpenModal = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await updatePassword({ currentPassword, newPassword });
      setSuccess('Password updated successfully!');
      setTimeout(() => setShowModal(false), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Incorrect current password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button className="hamburger" onClick={onToggleSidebar}><FaBars /></button>
        <div className="navbar-title">{title}</div>
      </div>
      <div className="navbar-actions">
        <button className="notification-bell" onClick={() => navigate(user.role === 'admin' ? '/admin' : '/student/notifications')}>
          <FaBell />
          {unreadCount > 0 && <span className="notification-count">{unreadCount > 9 ? '9+' : unreadCount}</span>}
        </button>
        <div className="navbar-user">
          <div className="navbar-user-info">
            <div className="navbar-user-name">{user?.name}</div>
            <div className="navbar-user-role">{user?.role}</div>
          </div>
          <div className="navbar-avatar">{user?.name?.charAt(0)}</div>
        </div>
        <button 
          className="btn-logout" 
          onClick={handleOpenModal}
          style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', marginRight: '8px', color: 'rgba(255, 255, 255, 0.8)' }}
        >
          Change Password
        </button>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {showModal && (
        <div className="modal-backdrop" style={{ zIndex: 1100 }}>
          <div className="modal-content glass-card" style={{ maxWidth: '400px', animation: 'scaleUp 0.2s ease-out' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaLock style={{ color: '#818cf8', fontSize: '1.1rem' }} /> Change Password
              </h3>
              <button className="btn-close" onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes /></button>
            </div>
            
            {error && <div className="auth-error" style={{ marginBottom: '12px', padding: '8px', borderRadius: '6px', fontSize: '0.85rem' }}>{error}</div>}
            {success && <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', marginBottom: '12px', padding: '8px', borderRadius: '6px', fontSize: '0.85rem', textAlign: 'center' }}>{success}</div>}
            
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.85rem' }}>Current Password *</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={currentPassword} 
                  onChange={e => setCurrentPassword(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.85rem' }}>New Password *</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.85rem' }}>Confirm New Password *</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  required 
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
