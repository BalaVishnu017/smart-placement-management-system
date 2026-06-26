import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateStudent } from '../../services/api';
import { useToast } from '../../components/Toast';

export default function StudentProfile() {
  const { user, refreshUser } = useAuth();
  const addToast = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '', skills: user?.skills?.join(', ') || '',
    cgpa: user?.cgpa || '', tenthPercent: user?.tenthPercent || '', twelfthPercent: user?.twelfthPercent || '',
    backlogs: user?.backlogs || 0, branch: user?.branch || '', department: user?.department || '',
    graduationYear: user?.graduationYear || '', rollNo: user?.rollNo || '',
    isPlaced: user?.isPlaced || false, placedCompany: user?.placedCompany || '', placedPackage: user?.placedPackage || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateStudent(user._id, { 
        ...form, 
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean), 
        cgpa: Number(form.cgpa), 
        tenthPercent: Number(form.tenthPercent), 
        twelfthPercent: Number(form.twelfthPercent), 
        backlogs: Number(form.backlogs), 
        graduationYear: Number(form.graduationYear),
        isPlaced: form.isPlaced,
        placedCompany: form.isPlaced ? form.placedCompany : '',
        placedPackage: form.isPlaced ? Number(form.placedPackage) : null
      });
      await refreshUser();
      setEditing(false);
      addToast('Profile updated successfully', 'success');
    } catch (err) { addToast(err.response?.data?.message || 'Update failed', 'error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <div><h1>My Profile</h1><p>Manage your personal information</p></div>
        {!editing && <button className="btn btn-primary" onClick={() => setEditing(true)}>Edit Profile</button>}
      </div>
      <div className="profile-grid">
        <div className="glass-card profile-sidebar-card">
          <div className="profile-avatar">{user?.name?.charAt(0)}</div>
          <div className="profile-name">{user?.name}</div>
          <div className="profile-branch">{user?.branch} - {user?.department}</div>
          <span className={`badge ${user?.isPlaced ? 'badge-selected' : 'badge-upcoming'}`}>{user?.isPlaced ? '✓ Placed' : 'Not Placed'}</span>
          <div className="profile-stats">
            <div className="profile-stat"><div className="profile-stat-value">{user?.cgpa}</div><div className="profile-stat-label">CGPA</div></div>
            <div className="profile-stat"><div className="profile-stat-value">{user?.backlogs}</div><div className="profile-stat-label">Backlogs</div></div>
            <div className="profile-stat"><div className="profile-stat-value">{user?.tenthPercent}%</div><div className="profile-stat-label">10th</div></div>
            <div className="profile-stat"><div className="profile-stat-value">{user?.twelfthPercent}%</div><div className="profile-stat-label">12th</div></div>
          </div>
        </div>
        <div className="glass-card">
          {editing ? (
            <form onSubmit={handleSave}>
              <div className="form-row">
                <div className="form-group"><label>Name</label><input name="name" className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                <div className="form-group"><label>Roll No</label><input name="rollNo" className="form-control" value={form.rollNo} onChange={e => setForm({...form, rollNo: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Branch</label>
                  <select className="form-control" value={form.branch} onChange={e => setForm({...form, branch: e.target.value})}>
                    <option value="CS">CSE</option><option value="IT">IT</option><option value="ECE">ECE</option><option value="EE">EE</option><option value="ME">ME</option><option value="CE">CE</option>
                  </select>
                </div>
                <div className="form-group"><label>Department</label><input className="form-control" value={form.department} onChange={e => setForm({...form, department: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>CGPA</label><input type="number" step="0.01" min="0" max="10" className="form-control" value={form.cgpa} onChange={e => setForm({...form, cgpa: e.target.value})} /></div>
                <div className="form-group"><label>Backlogs</label><input type="number" min="0" className="form-control" value={form.backlogs} onChange={e => setForm({...form, backlogs: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>10th %</label><input type="number" className="form-control" value={form.tenthPercent} onChange={e => setForm({...form, tenthPercent: e.target.value})} /></div>
                <div className="form-group"><label>12th %</label><input type="number" className="form-control" value={form.twelfthPercent} onChange={e => setForm({...form, twelfthPercent: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Phone</label><input className="form-control" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                <div className="form-group"><label>Graduation Year</label><input type="number" className="form-control" value={form.graduationYear} onChange={e => setForm({...form, graduationYear: e.target.value})} /></div>
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Skills (comma-separated)</label>
                <input className="form-control" value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500' }}>
                  <input 
                    type="checkbox" 
                    checked={form.isPlaced} 
                    onChange={e => setForm({...form, isPlaced: e.target.checked})} 
                  />
                  I am Placed (in a company)
                </label>
              </div>
              {form.isPlaced && (
                <div className="form-row" style={{ animation: 'fadeIn 0.3s ease' }}>
                  <div className="form-group">
                    <label>Placed Company</label>
                    <input 
                      className="form-control" 
                      placeholder="e.g. Google" 
                      value={form.placedCompany} 
                      onChange={e => setForm({...form, placedCompany: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Placed Package (LPA)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      className="form-control" 
                      placeholder="e.g. 12.5" 
                      value={form.placedPackage} 
                      onChange={e => setForm({...form, placedPackage: e.target.value})} 
                      required 
                    />
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ margin: 0 }}>Profile Details</h3>
                {user?.isPlaced && (
                  <span className="badge badge-selected" style={{ padding: '6px 12px', borderRadius: '20px' }}>
                    🎉 Placed at {user.placedCompany} ({user.placedPackage} LPA)
                  </span>
                )}
              </div>
              <div className="detail-grid">
                <div className="detail-item"><div className="detail-item-label">Email</div><div className="detail-item-value">{user?.email}</div></div>
                <div className="detail-item"><div className="detail-item-label">Roll No</div><div className="detail-item-value">{user?.rollNo || '-'}</div></div>
                <div className="detail-item"><div className="detail-item-label">Phone</div><div className="detail-item-value">{user?.phone || '-'}</div></div>
                <div className="detail-item"><div className="detail-item-label">Graduation Year</div><div className="detail-item-value">{user?.graduationYear}</div></div>
                <div className="detail-item"><div className="detail-item-label">Branch</div><div className="detail-item-value">{user?.branch}</div></div>
                <div className="detail-item"><div className="detail-item-label">Department</div><div className="detail-item-value">{user?.department || '-'}</div></div>
              </div>
              {user?.skills?.length > 0 && (
                <div style={{ marginTop: '18px' }}>
                  <div className="detail-item-label" style={{ marginBottom: '8px' }}>Skills</div>
                  <div className="job-card-skills">{user.skills.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
