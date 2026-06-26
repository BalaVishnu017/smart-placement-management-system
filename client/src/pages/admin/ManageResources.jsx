import { useState, useEffect } from 'react';
import { getResources, createResource, deleteResource, getCompanies } from '../../services/api';
import { useToast } from '../../components/Toast';
import { FaPlus, FaTrash, FaTimes, FaBook } from 'react-icons/fa';

const TYPE_OPTIONS = [
  { value: 'pyq', label: 'Previous Year Questions' },
  { value: 'coding', label: 'Coding Questions' },
  { value: 'aptitude', label: 'Aptitude Questions' },
  { value: 'technical_interview', label: 'Technical Interview' },
  { value: 'hr_interview', label: 'HR Interview' },
  { value: 'recruitment_process', label: 'Recruitment Process' },
  { value: 'tech_stack', label: 'Tech Stack' },
  { value: 'company_overview', label: 'Company Overview' }
];

const EMPTY = { company: '', type: 'pyq', title: '', content: '', year: new Date().getFullYear(), difficulty: 'medium' };

export default function ManageResources() {
  const [resources, setResources] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [companyFilter, setCompanyFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const addToast = useToast();

  const fetchData = () => {
    const params = {};
    if (companyFilter) params.company = companyFilter;
    if (typeFilter) params.type = typeFilter;
    Promise.all([getResources(params), getCompanies()])
      .then(([rRes, cRes]) => {
        setResources(rRes.data.resources);
        setCompanies(cRes.data.companies);
        setLoading(false);
      }).catch(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, [companyFilter, typeFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createResource({ ...form, year: Number(form.year) });
      addToast('Resource added', 'success');
      setShowModal(false);
      setForm(EMPTY);
      fetchData();
    } catch (err) { addToast(err.response?.data?.message || 'Failed', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource?')) return;
    try { await deleteResource(id); addToast('Deleted', 'info'); fetchData(); } catch { addToast('Failed', 'error'); }
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <div><h1>Company Resources</h1><p>Manage PYQs, interview experiences & preparation materials</p></div>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY); setShowModal(true); }}><FaPlus /> Add Resource</button>
      </div>

      <div className="filter-bar">
        <select className="form-control" value={companyFilter} onChange={e => setCompanyFilter(e.target.value)}>
          <option value="">All Companies</option>
          {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select className="form-control" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          {TYPE_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {resources.length === 0 ? (
        <div className="empty-state"><FaBook /><h3>No resources found</h3></div>
      ) : (
        <div className="cards-grid">
          {resources.map(r => (
            <div key={r._id} className="resource-card">
              <div className="resource-card-header">
                <span className="resource-card-title">{r.title}</span>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r._id)}><FaTrash /></button>
              </div>
              <div className="resource-card-meta">
                <span className="badge badge-upcoming">{TYPE_OPTIONS.find(t => t.value === r.type)?.label || r.type}</span>
                {r.difficulty && <span className={`badge badge-${r.difficulty}`}>{r.difficulty}</span>}
                {r.year && <span className="badge" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent-indigo)' }}>{r.year}</span>}
              </div>
              <p style={{ color: 'var(--accent-cyan)', fontSize: '0.82rem', marginBottom: '10px' }}>{r.company?.name}</p>
              <div className="resource-card-content">{r.content}</div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div className="modal-header"><h2>Add Resource</h2><button className="modal-close" onClick={() => setShowModal(false)}><FaTimes /></button></div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-row">
                <div className="form-group"><label>Company *</label><select className="form-control" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} required><option value="">Select...</option>{companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
                <div className="form-group"><label>Type *</label><select className="form-control" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>{TYPE_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
              </div>
              <div className="form-group"><label>Title *</label><input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Google Online Test Questions 2024" /></div>
              <div className="form-group"><label>Content *</label><textarea className="form-control" rows="8" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required placeholder="Enter questions, interview experience, tech stack details..." /></div>
              <div className="form-row">
                <div className="form-group"><label>Year</label><input type="number" className="form-control" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} /></div>
                <div className="form-group"><label>Difficulty</label><select className="form-control" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div>
              </div>
              <div className="modal-footer" style={{ padding: '16px 0 0', border: 'none' }}><button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">Add Resource</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
