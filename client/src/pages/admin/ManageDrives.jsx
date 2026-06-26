import { useState, useEffect } from 'react';
import { getDrives, createDrive, updateDrive, deleteDrive, getCompanies } from '../../services/api';
import { useToast } from '../../components/Toast';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const EMPTY = { title: '', company: '', description: '', driveDate: '', lastDateToApply: '', status: 'upcoming', venue: '', instructions: '', eligibility: { branches: [], minCGPA: '', maxBacklogs: '', graduationYears: [] } };
const BRANCHES = ['CS', 'IT', 'ECE', 'EE', 'ME', 'CE'];

export default function ManageDrives() {
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const addToast = useToast();

  const fetchData = () => Promise.all([getDrives(), getCompanies()]).then(([d, c]) => { setDrives(d.data.drives); setCompanies(c.data.companies); setLoading(false); });
  useEffect(() => { fetchData(); }, []);

  const toggleBranch = (b) => {
    const branches = form.eligibility.branches.includes(b) ? form.eligibility.branches.filter(x => x !== b) : [...form.eligibility.branches, b];
    setForm({ ...form, eligibility: { ...form.eligibility, branches } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, eligibility: { ...form.eligibility, minCGPA: Number(form.eligibility.minCGPA), maxBacklogs: Number(form.eligibility.maxBacklogs), graduationYears: form.eligibility.graduationYears } };
    try {
      if (editing) { await updateDrive(editing, data); addToast('Drive updated', 'success'); }
      else { await createDrive(data); addToast('Drive created', 'success'); }
      setShowModal(false); setEditing(null); setForm(EMPTY); fetchData();
    } catch (err) { addToast(err.response?.data?.message || 'Failed', 'error'); }
  };

  const handleEdit = (d) => { setForm({ title: d.title, company: d.company?._id || '', description: d.description || '', driveDate: d.driveDate?.substring(0, 10) || '', lastDateToApply: d.lastDateToApply?.substring(0, 10) || '', status: d.status, venue: d.venue || '', instructions: d.instructions || '', eligibility: { branches: d.eligibility?.branches || [], minCGPA: d.eligibility?.minCGPA || '', maxBacklogs: d.eligibility?.maxBacklogs ?? '', graduationYears: d.eligibility?.graduationYears || [] } }); setEditing(d._id); setShowModal(true); };

  const handleDelete = async (id) => { if (!window.confirm('Delete this drive?')) return; try { await deleteDrive(id); addToast('Deleted', 'info'); fetchData(); } catch { addToast('Failed', 'error'); } };

  const toggleYear = (y) => {
    const yrs = form.eligibility.graduationYears.includes(y) ? form.eligibility.graduationYears.filter(x => x !== y) : [...form.eligibility.graduationYears, y];
    setForm({ ...form, eligibility: { ...form.eligibility, graduationYears: yrs } });
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div className="animate-fadeInUp">
      <div className="page-header"><div><h1>Manage Drives</h1><p>{drives.length} placement drives</p></div><button className="btn btn-primary" onClick={() => { setForm(EMPTY); setEditing(null); setShowModal(true); }}><FaPlus /> Create Drive</button></div>
      <div className="glass-card"><div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr><th>Title</th><th>Company</th><th>Date</th><th>Deadline</th><th>Venue</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{drives.map(d => (
            <tr key={d._id}><td style={{ fontWeight: 600 }}>{d.title}</td><td style={{ color: 'var(--accent-cyan)' }}>{d.company?.name}</td>
              <td>{new Date(d.driveDate).toLocaleDateString()}</td><td>{new Date(d.lastDateToApply).toLocaleDateString()}</td><td>{d.venue || '-'}</td>
              <td><span className={`badge badge-${d.status}`}>{d.status}</span></td>
              <td><div className="table-actions"><button className="btn btn-outline btn-sm" onClick={() => handleEdit(d)}><FaEdit /></button><button className="btn btn-danger btn-sm" onClick={() => handleDelete(d._id)}><FaTrash /></button></div></td>
            </tr>
          ))}</tbody>
        </table>
      </div></div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header"><h2>{editing ? 'Edit' : 'Create'} Drive</h2><button className="modal-close" onClick={() => setShowModal(false)}><FaTimes /></button></div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-row"><div className="form-group"><label>Title *</label><input className="form-control" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div><div className="form-group"><label>Company *</label><select className="form-control" value={form.company} onChange={e => setForm({...form, company: e.target.value})} required><option value="">Select...</option>{companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div></div>
              <div className="form-group"><label>Description</label><textarea className="form-control" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows="2" /></div>
              <div className="form-row"><div className="form-group"><label>Drive Date *</label><input type="date" className="form-control" value={form.driveDate} onChange={e => setForm({...form, driveDate: e.target.value})} required /></div><div className="form-group"><label>Last Date to Apply *</label><input type="date" className="form-control" value={form.lastDateToApply} onChange={e => setForm({...form, lastDateToApply: e.target.value})} required /></div></div>
              <div className="form-row"><div className="form-group"><label>Venue</label><input className="form-control" value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} /></div><div className="form-group"><label>Status</label><select className="form-control" value={form.status} onChange={e => setForm({...form, status: e.target.value})}><option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option></select></div></div>
              <div className="form-group"><label>Eligible Branches</label><div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>{BRANCHES.map(b => <button type="button" key={b} className={`btn btn-sm ${form.eligibility.branches.includes(b) ? 'btn-primary' : 'btn-outline'}`} onClick={() => toggleBranch(b)}>{b}</button>)}</div></div>
              <div className="form-row"><div className="form-group"><label>Min CGPA</label><input type="number" step="0.1" min="0" max="10" className="form-control" value={form.eligibility.minCGPA} onChange={e => setForm({...form, eligibility: {...form.eligibility, minCGPA: e.target.value}})} /></div><div className="form-group"><label>Max Backlogs</label><input type="number" min="0" className="form-control" value={form.eligibility.maxBacklogs} onChange={e => setForm({...form, eligibility: {...form.eligibility, maxBacklogs: e.target.value}})} /></div></div>
              <div className="form-group"><label>Graduation Years</label><div style={{ display: 'flex', gap: '8px' }}>{[2025, 2026, 2027, 2028].map(y => <button type="button" key={y} className={`btn btn-sm ${form.eligibility.graduationYears.includes(y) ? 'btn-primary' : 'btn-outline'}`} onClick={() => toggleYear(y)}>{y}</button>)}</div></div>
              <div className="form-group"><label>Instructions</label><textarea className="form-control" value={form.instructions} onChange={e => setForm({...form, instructions: e.target.value})} rows="2" /></div>
              <div className="modal-footer" style={{ padding: '16px 0 0', border: 'none' }}><button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'} Drive</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
