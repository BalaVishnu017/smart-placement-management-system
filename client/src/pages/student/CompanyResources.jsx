import { useState, useEffect } from 'react';
import { getResources, getCompanies } from '../../services/api';
import { FaBook } from 'react-icons/fa';

const TYPE_LABELS = { pyq: 'Previous Year Questions', coding: 'Coding Questions', aptitude: 'Aptitude', technical_interview: 'Technical Interview', hr_interview: 'HR Interview', recruitment_process: 'Recruitment Process', tech_stack: 'Tech Stack', company_overview: 'Company Overview' };

export default function CompanyResources() {
  const [resources, setResources] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyFilter, setCompanyFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    Promise.all([getResources(), getCompanies()]).then(([rRes, cRes]) => {
      setResources(rRes.data.resources);
      setCompanies(cRes.data.companies);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = resources.filter(r => (!companyFilter || r.company?._id === companyFilter) && (!typeFilter || r.type === typeFilter));

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div className="animate-fadeInUp">
      <div className="page-header"><div><h1>Company Resources</h1><p>Previous year questions, interview experiences & preparation materials</p></div></div>
      <div className="filter-bar">
        <select className="form-control" value={companyFilter} onChange={e => setCompanyFilter(e.target.value)}>
          <option value="">All Companies</option>
          {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select className="form-control" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state"><FaBook /><h3>No resources found</h3><p>Try adjusting your filters</p></div>
      ) : (
        <div className="cards-grid">
          {filtered.map(r => (
            <div key={r._id} className="resource-card">
              <div className="resource-card-header">
                <span className="resource-card-title">{r.title}</span>
              </div>
              <div className="resource-card-meta">
                <span className="badge badge-upcoming">{TYPE_LABELS[r.type] || r.type}</span>
                {r.difficulty && <span className={`badge badge-${r.difficulty}`}>{r.difficulty}</span>}
                {r.year && <span className="badge" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent-indigo)' }}>{r.year}</span>}
              </div>
              <p style={{ color: 'var(--accent-cyan)', fontSize: '0.82rem', marginBottom: '10px' }}>{r.company?.name}</p>
              <div className="resource-card-content">{r.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
