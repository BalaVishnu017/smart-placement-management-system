import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyApplications, getMyInterviews, getNotices, getJobs } from '../../services/api';
import { FaBriefcase, FaFileAlt, FaCalendarAlt, FaBullhorn } from 'react-icons/fa';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ jobs: 0, applications: 0, interviews: 0, notices: 0 });
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    Promise.all([getJobs({ status: 'open' }), getMyApplications(), getMyInterviews(), getNotices()])
      .then(([jobsRes, appsRes, intRes, noticesRes]) => {
        setStats({ jobs: jobsRes.data.count, applications: appsRes.data.count, interviews: intRes.data.count, notices: noticesRes.data.count });
        setNotices(noticesRes.data.notices.slice(0, 3));
      }).catch(() => {});
  }, []);

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <div><h1>Welcome, {user?.name}</h1><p>Here's your placement overview</p></div>
      </div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-card-icon"><FaBriefcase /></div><div className="stat-card-value">{stats.jobs}</div><div className="stat-card-label">Open Jobs</div></div>
        <div className="stat-card"><div className="stat-card-icon"><FaFileAlt /></div><div className="stat-card-value">{stats.applications}</div><div className="stat-card-label">My Applications</div></div>
        <div className="stat-card"><div className="stat-card-icon"><FaCalendarAlt /></div><div className="stat-card-value">{stats.interviews}</div><div className="stat-card-label">Interviews</div></div>
        <div className="stat-card"><div className="stat-card-icon"><FaBullhorn /></div><div className="stat-card-value">{stats.notices}</div><div className="stat-card-label">Notices</div></div>
      </div>

      {user?.isPlaced && (
        <div className="glass-card" style={{ marginBottom: '24px', borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.06)' }}>
          <h3 style={{ color: '#10b981', marginBottom: '6px' }}>🎉 Congratulations! You are Placed!</h3>
          <p style={{ color: '#94a3b8' }}>Company: <strong>{user.placedCompany}</strong> | Package: <strong>{user.placedPackage} LPA</strong></p>
        </div>
      )}

      <div className="glass-card">
        <h3 style={{ marginBottom: '16px' }}>📢 Recent Notices</h3>
        {notices.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No notices yet</p> : notices.map(n => (
          <div key={n._id} className="notice-card">
            <div className="notice-card-header">
              <span className="notice-card-title">{n.title}</span>
              <span className={`badge badge-${n.priority}`}>{n.priority}</span>
            </div>
            <p className="notice-card-content">{n.content.substring(0, 200)}{n.content.length > 200 ? '...' : ''}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
