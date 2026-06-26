import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/api';
import { FaUsers, FaBuilding, FaRoad, FaBriefcase, FaFileAlt, FaCheckCircle } from 'react-icons/fa';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(res => { setStats(res.data.stats); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div className="animate-fadeInUp">
      <div className="page-header"><div><h1>Admin Dashboard</h1><p>Overview of placement activities</p></div></div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-card-icon"><FaUsers /></div><div className="stat-card-value">{stats?.totalStudents}</div><div className="stat-card-label">Total Students</div></div>
        <div className="stat-card"><div className="stat-card-icon"><FaBuilding /></div><div className="stat-card-value">{stats?.totalCompanies}</div><div className="stat-card-label">Companies</div></div>
        <div className="stat-card"><div className="stat-card-icon"><FaRoad /></div><div className="stat-card-value">{stats?.activeDrives}</div><div className="stat-card-label">Active Drives</div></div>
        <div className="stat-card"><div className="stat-card-icon"><FaBriefcase /></div><div className="stat-card-value">{stats?.openJobs}</div><div className="stat-card-label">Open Jobs</div></div>
        <div className="stat-card"><div className="stat-card-icon"><FaFileAlt /></div><div className="stat-card-value">{stats?.totalApplications}</div><div className="stat-card-label">Applications</div></div>
        <div className="stat-card"><div className="stat-card-icon"><FaCheckCircle /></div><div className="stat-card-value">{stats?.studentsPlaced}</div><div className="stat-card-label">Students Placed</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-green)' }}>{stats?.placementPercent}%</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Placement Rate</div>
        </div>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{stats?.highestPackage} LPA</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Highest Package</div>
        </div>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-purple)' }}>{stats?.averagePackage} LPA</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Average Package</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '14px' }}>Branch-wise Placements</h3>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead><tr><th>Branch</th><th>Total</th><th>Placed</th><th>%</th></tr></thead>
              <tbody>
                {stats?.branchWise?.map(b => (
                  <tr key={b._id}>
                    <td style={{ fontWeight: 600 }}>{b._id || 'N/A'}</td>
                    <td>{b.total}</td>
                    <td style={{ color: 'var(--accent-green)' }}>{b.placed}</td>
                    <td>{b.total > 0 ? ((b.placed / b.total) * 100).toFixed(0) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="glass-card">
          <h3 style={{ marginBottom: '14px' }}>Company-wise Hiring</h3>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead><tr><th>Company</th><th>Hired</th><th>Avg Package</th></tr></thead>
              <tbody>
                {stats?.companyWise?.length > 0 ? stats.companyWise.map(c => (
                  <tr key={c._id}>
                    <td style={{ fontWeight: 600 }}>{c._id}</td>
                    <td>{c.count}</td>
                    <td style={{ color: 'var(--accent-cyan)' }}>{Math.round(c.avgPackage * 100) / 100} LPA</td>
                  </tr>
                )) : <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No data yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
