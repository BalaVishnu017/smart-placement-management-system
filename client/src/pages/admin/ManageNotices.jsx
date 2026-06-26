import { useState, useEffect } from 'react';
import { getNotices, createNotice, deleteNotice } from '../../services/api';
import { useToast } from '../../components/Toast';
import { FaPlus, FaTrash, FaTimes } from 'react-icons/fa';

const BRANCHES = ['CS', 'IT', 'ECE', 'EE', 'ME', 'CE'];

export default function ManageNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', priority: 'normal', targetAudience: 'all', targetBranches: [] });
  const addToast = useToast();

  const fetchNotices = () => getNotices().then(res => { setNotices(res.data.notices); setLoading(false); });
  useEffect(() => { fetchNotices(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createNotice(form);
      addToast('Notice published', 'success');
      setShowModal(false);
      setForm({ title: '', content: '', priority: 'normal', targetAudience: 'all', targetBranches: [] });
      fetchNotices();
    } catch (err) { addToast(err.response?.data?.message || 'Failed', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    try { await deleteNotice(id); addToast('Notice deleted', 'info'); fetchNotices(); } catch { addToast('Failed', 'error'); }
  };

  const toggleBranch = (b) => {
    const branches = form.targetBranches.includes(b) ? form.targetBranches.filter(x => x !== b) : [...form.targetBranches, b];
    setForm({ ...form, targetBranches: branches });
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <div><h1>Manage Notices</h1><p>Publish announcements and instructions</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><FaPlus /> New Notice</button>
      </div>

      {notices.length === 0 ? (
        <div className="empty-state"><h3>No notices published</h3></div>
      ) : notices.map(n => (
        <div key={n._id} className="notice-card">
          <div className="notice-card-header">
            <span className="notice-card-title">{n.title}</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className={`badge badge-${n.priority}`}>{n.priority}</span>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(n._id)}><FaTrash /></button>
            </div>
          </div>
          <p className="notice-card-content">{n.content}</p>
          <div className="notice-card-meta">
            <span>Audience: {n.targetAudience}</span>
            {n.targetBranches?.length > 0 && <span>Branches: {n.targetBranches.join(', ')}</span>}
            <span>By: {n.publishedBy?.name}</span>
            <span>{new Date(n.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>Publish Notice</h2><button className="modal-close" onClick={() => setShowModal(false)}><FaTimes /></button></div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group"><label>Title *</label><input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="form-group"><label>Content *</label><textarea className="form-control" rows="5" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Priority</label><select className="form-control" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}><option value="normal">Normal</option><option value="important">Important</option><option value="urgent">Urgent</option></select></div>
                <div className="form-group"><label>Target Audience</label><select className="form-control" value={form.targetAudience} onChange={e => setForm({ ...form, targetAudience: e.target.value })}><option value="all">All</option><option value="students">Students Only</option><option value="specific_branch">Specific Branches</option></select></div>
              </div>
              {form.targetAudience === 'specific_branch' && (
                <div className="form-group"><label>Select Branches</label><div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>{BRANCHES.map(b => <button type="button" key={b} className={`btn btn-sm ${form.targetBranches.includes(b) ? 'btn-primary' : 'btn-outline'}`} onClick={() => toggleBranch(b)}>{b}</button>)}</div></div>
              )}
              <div className="modal-footer" style={{ padding: '16px 0 0', border: 'none' }}><button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">Publish Notice</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
