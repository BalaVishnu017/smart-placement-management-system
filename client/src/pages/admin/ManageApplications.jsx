import { useState, useEffect } from 'react';
import { getApplications, updateApplicationStatus, getJobs, downloadResume } from '../../services/api';
import { useToast } from '../../components/Toast';
import { FaDownload } from 'react-icons/fa';

export default function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const addToast = useToast();

  const handleExportCSV = () => {
    if (applications.length === 0) {
      addToast('No applications to export', 'warning');
      return;
    }
    const headers = ['Student Name', 'Student Email', 'Roll Number', 'Branch', 'CGPA', 'Job Title', 'Company', 'Applied Date', 'Status'];
    const rows = applications.map(a => [
      a.student?.name,
      a.student?.email,
      a.student?.rollNo || '-',
      a.student?.branch,
      a.student?.cgpa,
      a.job?.title,
      a.job?.company?.name,
      new Date(a.appliedAt).toLocaleDateString(),
      a.status
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Job_Applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    addToast('CSV exported successfully', 'success');
  };

  const handleDownloadResume = async (studentId, studentName) => {
    try {
      addToast('Downloading resume...', 'info');
      const response = await downloadResume(studentId);
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${studentName.replace(/\s+/g, '_')}_Resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      addToast('No resume file uploaded or download failed', 'error');
    }
  };

  const fetchApps = () => {
    const params = {};
    if (statusFilter) params.status = statusFilter;
    if (jobFilter) params.job = jobFilter;
    getApplications(params).then(res => { setApplications(res.data.applications); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { fetchApps(); }, [statusFilter, jobFilter]);
  useEffect(() => { getJobs().then(res => setJobs(res.data.jobs)).catch(() => {}); }, []);

  const handleStatusChange = async (id, status) => {
    const remarks = status === 'rejected' ? prompt('Rejection remarks (optional):') : '';
    try {
      await updateApplicationStatus(id, { status, remarks: remarks || undefined });
      addToast(`Status updated to ${status}`, 'success');
      fetchApps();
    } catch (err) { addToast(err.response?.data?.message || 'Failed', 'error'); }
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div className="animate-fadeInUp">
      <div className="page-header"><div><h1>Manage Applications</h1><p>{applications.length} applications</p></div></div>
      <div className="filter-bar" style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
        <select className="form-control" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option><option value="applied">Applied</option><option value="shortlisted">Shortlisted</option><option value="interview">Interview</option><option value="selected">Selected</option><option value="rejected">Rejected</option>
        </select>
        <select className="form-control" value={jobFilter} onChange={e => setJobFilter(e.target.value)}>
          <option value="">All Jobs</option>{jobs.map(j => <option key={j._id} value={j._id}>{j.title} - {j.company?.name}</option>)}
        </select>
        <button 
          onClick={handleExportCSV} 
          className="btn btn-outline btn-sm" 
          style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <FaDownload /> Export CSV
        </button>
      </div>
      <div className="glass-card"><div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr><th>Student</th><th>Branch</th><th>CGPA</th><th>Job</th><th>Company</th><th>Applied</th><th>Status</th><th>Resume</th><th>Action</th></tr></thead>
          <tbody>{applications.map(a => (
            <tr key={a._id}>
              <td><div style={{ fontWeight: 600 }}>{a.student?.name}</div><div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{a.student?.email}</div></td>
              <td><span className="badge badge-upcoming">{a.student?.branch}</span></td>
              <td style={{ fontWeight: 600 }}>{a.student?.cgpa}</td>
              <td>{a.job?.title}</td>
              <td style={{ color: 'var(--accent-cyan)' }}>{a.job?.company?.name}</td>
              <td>{new Date(a.appliedAt).toLocaleDateString()}</td>
              <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
              <td>
                {a.student?.hasResume ? (
                  <button 
                    onClick={() => handleDownloadResume(a.student._id, a.student.name)} 
                    className="btn btn-outline btn-sm" 
                    style={{ padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                  >
                    <FaDownload /> Download
                  </button>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No file</span>
                )}
              </td>
              <td>
                <select className="status-select" value={a.status} onChange={e => handleStatusChange(a._id, e.target.value)}>
                  <option value="applied">Applied</option><option value="shortlisted">Shortlist</option><option value="interview">Interview</option><option value="selected">Select</option><option value="rejected">Reject</option>
                </select>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div></div>
    </div>
  );
}
