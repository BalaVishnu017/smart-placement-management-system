import { useState, useEffect } from 'react';
import { getJobs, createJob, updateJob, deleteJob, getCompanies, getDrives } from '../../services/api';
import { useToast } from '../../components/Toast';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const BRANCHES = ['CS', 'IT', 'ECE', 'EE', 'ME', 'CE'];
const EMPTY = { title: '', company: '', drive: '', description: '', type: 'full-time', packageLPA: '', location: '', openings: '', skills: '', deadline: '', status: 'open', eligibility: { branches: [], minCGPA: '', maxBacklogs: '', graduationYears: [] } };

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const addToast = useToast();

  const fetchData = () => Promise.all([getJobs(), getCompanies(), getDrives()]).then(([j, c, d]) => { setJobs(j.data.jobs); setCompanies(c.data.companies); setDrives(d.data.drives); setLoading(false); });
  useEffect(() => { fetchData(); }, []);

  const toggleBranch = (b) => { const branches = form.eligibility.branches.includes(b) ? form.eligibility.branches.filter(x => x !== b) : [...form.eligibility.branches, b]; setForm({ ...form, eligibility: { ...form.eligibility, branches } }); };
  const toggleYear = (y) => { const yrs = form.eligibility.graduationYears.includes(y) ? form.eligibility.graduationYears.filter(x => x !== y) : [...form.eligibility.graduationYears, y]; setForm({ ...form, eligibility: { ...form.eligibility, graduationYears: yrs } }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean), packageLPA: Number(form.packageLPA), openings: Number(form.openings), eligibility: { ...form.eligibility, minCGPA: Number(form.eligibility.minCGPA), maxBacklogs: Number(form.eligibility.maxBacklogs) } };
    try {
      if (editing) { await updateJob(editing, data); addToast('Job updated', 'success'); }
      else { await createJob(data); addToast('Job posted', 'success'); }
      setShowModal(false); setEditing(null); setForm(EMPTY); fetchData();
    } catch (err) { addToast(err.response?.data?.message || 'Failed', 'error'); }
  };

  const handleEdit = (j) => { setForm({ title: j.title, company: j.company?._id || '', drive: j.drive?._id || '', description: j.description || '', type: j.type, packageLPA: j.packageLPA || '', location: j.location || '', openings: j.openings || '', skills: j.skills?.join(', ') || '', deadline: j.deadline?.substring(0, 10) || '', status: j.status, eligibility: { branches: j.eligibility?.branches || [], minCGPA: j.eligibility?.minCGPA || '', maxBacklogs: j.eligibility?.maxBacklogs ?? '', graduationYears: j.eligibility?.graduationYears || [] } }); setEditing(j._id); setShowModal(true); };
  const handleDelete = async (id) => { if (!window.confirm('Delete?')) return; try { await deleteJob(id); addToast('Deleted', 'info'); fetchData(); } catch { addToast('Failed', 'error'); } };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div className="animate-fadeInUp">
      <div className="page-header"><div><h1>Manage Jobs</h1><p>{jobs.length} job postings</p></div><button className="btn btn-primary" onClick={() => { setForm(EMPTY); setEditing(null); setShowModal(true); }}><FaPlus /> Post Job</button></div>
      <div className="glass-card"><div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr><th>Title</th><th>Company</th><th>Type</th><th>Package</th><th>Location</th><th>Openings</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{jobs.map(j => (
            <tr key={j._id}><td style={{ fontWeight: 600 }}>{j.title}</td><td style={{ color: 'var(--accent-cyan)' }}>{j.company?.name}</td>
              <td><span className="badge badge-upcoming">{j.type}</span></td><td style={{ fontWeight: 600 }}>{j.packageLPA} LPA</td>
              <td>{j.location || '-'}</td><td>{j.openings}</td><td><span className={`badge badge-${j.status}`}>{j.status}</span></td>
              <td><div className="table-actions"><button className="btn btn-outline btn-sm" onClick={() => handleEdit(j)}><FaEdit /></button><button className="btn btn-danger btn-sm" onClick={() => handleDelete(j._id)}><FaTrash /></button></div></td>
            </tr>
          ))}</tbody>
        </table>
      </div></div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header"><h2>{editing ? 'Edit' : 'Post'} Job</h2><button className="modal-close" onClick={() => setShowModal(false)}><FaTimes /></button></div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-row"><div className="form-group"><label>Job Title *</label><input className="form-control" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div><div className="form-group"><label>Company *</label><select className="form-control" value={form.company} onChange={e => setForm({...form, company: e.target.value})} required><option value="">Select...</option>{companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div></div>
              <div className="form-row"><div className="form-group"><label>Drive</label><select className="form-control" value={form.drive} onChange={e => setForm({...form, drive: e.target.value})}><option value="">Select...</option>{drives.map(d => <option key={d._id} value={d._id}>{d.title}</option>)}</select></div><div className="form-group"><label>Type</label><select className="form-control" value={form.type} onChange={e => setForm({...form, type: e.target.value})}><option value="full-time">Full-time</option><option value="internship">Internship</option><option value="ppo">PPO</option></select></div></div>
              <div className="form-group"><label>Description</label><textarea className="form-control" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows="3" /></div>
              <div className="form-row"><div className="form-group"><label>Package (LPA) *</label><input type="number" step="0.1" className="form-control" value={form.packageLPA} onChange={e => setForm({...form, packageLPA: e.target.value})} required /></div><div className="form-group"><label>Openings</label><input type="number" className="form-control" value={form.openings} onChange={e => setForm({...form, openings: e.target.value})} /></div></div>
              <div className="form-row"><div className="form-group"><label>Location</label><input className="form-control" value={form.location} onChange={e => setForm({...form, location: e.target.value})} /></div><div className="form-group"><label>Deadline</label><input type="date" className="form-control" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} /></div></div>
              <div className="form-group"><label>Required Skills (comma-separated)</label><input className="form-control" value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} /></div>
              <div className="form-group"><label>Eligible Branches</label><div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>{BRANCHES.map(b => <button type="button" key={b} className={`btn btn-sm ${form.eligibility.branches.includes(b) ? 'btn-primary' : 'btn-outline'}`} onClick={() => toggleBranch(b)}>{b}</button>)}</div></div>
              <div className="form-row"><div className="form-group"><label>Min CGPA</label><input type="number" step="0.1" className="form-control" value={form.eligibility.minCGPA} onChange={e => setForm({...form, eligibility: {...form.eligibility, minCGPA: e.target.value}})} /></div><div className="form-group"><label>Max Backlogs</label><input type="number" min="0" className="form-control" value={form.eligibility.maxBacklogs} onChange={e => setForm({...form, eligibility: {...form.eligibility, maxBacklogs: e.target.value}})} /></div></div>
              <div className="form-group"><label>Graduation Years</label><div style={{ display: 'flex', gap: '8px' }}>{[2025, 2026, 2027, 2028].map(y => <button type="button" key={y} className={`btn btn-sm ${form.eligibility.graduationYears.includes(y) ? 'btn-primary' : 'btn-outline'}`} onClick={() => toggleYear(y)}>{y}</button>)}</div></div>
              <div className="modal-footer" style={{ padding: '16px 0 0', border: 'none' }}><button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Post'} Job</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
