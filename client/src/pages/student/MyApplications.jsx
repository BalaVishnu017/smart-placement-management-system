import { useState, useEffect } from 'react';
import { getMyApplications } from '../../services/api';
import { FaBriefcase } from 'react-icons/fa';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    getMyApplications().then(res => { setApplications(res.data.applications); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = applications.filter(a => !filter || a.status === filter);

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div className="animate-fadeInUp">
      <div className="page-header"><div><h1>My Applications</h1><p>Track your job application statuses</p></div></div>
      <div className="filter-bar">
        <select className="form-control" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Status</option><option value="applied">Applied</option><option value="shortlisted">Shortlisted</option>
          <option value="interview">Interview</option><option value="selected">Selected</option><option value="rejected">Rejected</option>
        </select>
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state"><FaBriefcase /><h3>No applications found</h3><p>Start applying to placement drives</p></div>
      ) : (
        <div className="glass-card">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead><tr><th>Job Title</th><th>Company</th><th>Drive</th><th>Applied On</th><th>Status</th><th>Remarks</th></tr></thead>
              <tbody>
                {filtered.map(app => (
                  <tr key={app._id}>
                    <td style={{ fontWeight: 600 }}>{app.job?.title}</td>
                    <td style={{ color: 'var(--accent-cyan)' }}>{app.job?.company?.name}</td>
                    <td>{app.drive?.title || '-'}</td>
                    <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td><span className={`badge badge-${app.status}`}>{app.status}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>{app.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
