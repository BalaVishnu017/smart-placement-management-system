import { useState, useEffect } from 'react';
import { getCompanies, createCompany, updateCompany, deleteCompany } from '../../services/api';
import { useToast } from '../../components/Toast';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaGlobe } from 'react-icons/fa';

const EMPTY = { name: '', industry: '', website: '', description: '', headquarters: '', employeeCount: '', techStack: '', avgPackage: '' };

export default function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const addToast = useToast();

  const fetchCompanies = () => getCompanies().then(res => { setCompanies(res.data.companies); setLoading(false); });
  useEffect(() => { fetchCompanies(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, techStack: form.techStack.split(',').map(s => s.trim()).filter(Boolean), employeeCount: Number(form.employeeCount), avgPackage: Number(form.avgPackage) };
    try {
      if (editing) { await updateCompany(editing, data); addToast('Company updated', 'success'); }
      else { await createCompany(data); addToast('Company added', 'success'); }
      setShowModal(false); setEditing(null); setForm(EMPTY); fetchCompanies();
    } catch (err) { addToast(err.response?.data?.message || 'Failed', 'error'); }
  };

  const handleEdit = (c) => { setForm({ name: c.name, industry: c.industry, website: c.website || '', description: c.description || '', headquarters: c.headquarters || '', employeeCount: c.employeeCount || '', techStack: c.techStack?.join(', ') || '', avgPackage: c.avgPackage || '' }); setEditing(c._id); setShowModal(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this company?')) return;
    try { await deleteCompany(id); addToast('Company deleted', 'info'); fetchCompanies(); } catch { addToast('Delete failed', 'error'); }
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div className="animate-fadeInUp">
      <div className="page-header"><div><h1>Manage Companies</h1><p>{companies.length} companies registered</p></div><button className="btn btn-primary" onClick={() => { setForm(EMPTY); setEditing(null); setShowModal(true); }}><FaPlus /> Add Company</button></div>
      <div className="glass-card">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Industry</th><th>HQ</th><th>Employees</th><th>Avg Package</th><th>Website</th><th>Actions</th></tr></thead>
            <tbody>{companies.map(c => (
              <tr key={c._id}>
                <td style={{ fontWeight: 600 }}>{c.name}</td><td>{c.industry}</td><td>{c.headquarters || '-'}</td>
                <td>{c.employeeCount?.toLocaleString() || '-'}</td><td>{c.avgPackage ? `${c.avgPackage} LPA` : '-'}</td>
                <td>{c.website ? <a href={c.website} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-cyan)' }}><FaGlobe /></a> : '-'}</td>
                <td><div className="table-actions"><button className="btn btn-outline btn-sm" onClick={() => handleEdit(c)}><FaEdit /></button><button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id)}><FaTrash /></button></div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>{editing ? 'Edit' : 'Add'} Company</h2><button className="modal-close" onClick={() => setShowModal(false)}><FaTimes /></button></div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-row"><div className="form-group"><label>Company Name *</label><input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div><div className="form-group"><label>Industry *</label><input className="form-control" value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} required /></div></div>
              <div className="form-row"><div className="form-group"><label>Website</label><input className="form-control" value={form.website} onChange={e => setForm({...form, website: e.target.value})} placeholder="https://..." /></div><div className="form-group"><label>Headquarters</label><input className="form-control" value={form.headquarters} onChange={e => setForm({...form, headquarters: e.target.value})} /></div></div>
              <div className="form-row"><div className="form-group"><label>Employee Count</label><input type="number" className="form-control" value={form.employeeCount} onChange={e => setForm({...form, employeeCount: e.target.value})} /></div><div className="form-group"><label>Avg Package (LPA)</label><input type="number" step="0.1" className="form-control" value={form.avgPackage} onChange={e => setForm({...form, avgPackage: e.target.value})} /></div></div>
              <div className="form-group"><label>Description</label><textarea className="form-control" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows="3" /></div>
              <div className="form-group"><label>Tech Stack (comma-separated)</label><input className="form-control" value={form.techStack} onChange={e => setForm({...form, techStack: e.target.value})} placeholder="React, Node.js, Python" /></div>
              <div className="modal-footer" style={{ padding: '16px 0 0', border: 'none' }}><button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add'} Company</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
