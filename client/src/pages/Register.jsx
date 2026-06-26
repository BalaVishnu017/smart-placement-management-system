import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap } from 'react-icons/fa';
import { getSystemConfig } from '../services/api';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeBatchYear, setActiveBatchYear] = useState(2026);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    rollNo: '', branch: 'CS', department: '', graduationYear: 2026,
    cgpa: '', tenthPercent: '', twelfthPercent: '', backlogs: 0, phone: '', skills: ''
  });

  useEffect(() => {
    getSystemConfig()
      .then(res => {
        if (res.data.activeGraduationYear) {
          setActiveBatchYear(res.data.activeGraduationYear);
          setForm(f => ({ ...f, graduationYear: res.data.activeGraduationYear }));
        }
      })
      .catch(err => console.error('Error fetching system config:', err));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const data = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean), cgpa: Number(form.cgpa), tenthPercent: Number(form.tenthPercent), twelfthPercent: Number(form.twelfthPercent), backlogs: Number(form.backlogs), graduationYear: Number(form.graduationYear) };
      delete data.confirmPassword;
      await register(data);
      navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card wide">
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <FaGraduationCap style={{ fontSize: '2.2rem', color: '#6366f1' }} />
        </div>
        <h1>Student Registration</h1>
        <p className="subtitle">Create your placement portal account</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" className="form-control" placeholder="John Doe" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input name="email" type="email" className="form-control" placeholder="john@student.com" value={form.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input name="password" type="password" className="form-control" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <input name="confirmPassword" type="password" className="form-control" placeholder="Re-enter password" value={form.confirmPassword} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Roll Number</label>
              <input name="rollNo" className="form-control" placeholder="CS2101" value={form.rollNo} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Branch *</label>
              <select name="branch" className="form-control" value={form.branch} onChange={handleChange}>
                <option value="CS">CSE</option><option value="IT">IT</option><option value="ECE">ECE</option>
                <option value="EE">EE</option><option value="ME">ME</option><option value="CE">CE</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Department</label>
              <input name="department" className="form-control" placeholder="Computer Science" value={form.department} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Graduation Year</label>
              <input 
                className="form-control" 
                value={`${activeBatchYear} (Active 4th Year Batch)`} 
                disabled 
                style={{ cursor: 'not-allowed', backgroundColor: 'rgba(255, 255, 255, 0.05)' }} 
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>CGPA (out of 10) *</label>
              <input name="cgpa" type="number" step="0.01" min="0" max="10" className="form-control" placeholder="8.5" value={form.cgpa} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Active Backlogs</label>
              <input name="backlogs" type="number" min="0" className="form-control" value={form.backlogs} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>10th Percentage</label>
              <input name="tenthPercent" type="number" step="0.01" min="0" max="100" className="form-control" placeholder="92" value={form.tenthPercent} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>12th Percentage</label>
              <input name="twelfthPercent" type="number" step="0.01" min="0" max="100" className="form-control" placeholder="88" value={form.twelfthPercent} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input name="phone" className="form-control" placeholder="9876543210" value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Skills (comma-separated)</label>
              <input name="skills" className="form-control" placeholder="JavaScript, React, Python" value={form.skills} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
