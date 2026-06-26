import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/api';
import { FaTrophy, FaChartLine, FaPercentage, FaUsers } from 'react-icons/fa';

export default function PlacementStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(res => { setStats(res.data.stats); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div className="animate-fadeInUp">
      <div className="page-header"><div><h1>Placement Statistics</h1><p>Comprehensive placement analytics</p></div></div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-card-icon"><FaUsers /></div>
          <div className="stat-card-value">{stats?.studentsPlaced} / {stats?.totalStudents}</div>
          <div className="stat-card-label">Students Placed</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon"><FaPercentage /></div>
          <div className="stat-card-value">{stats?.placementPercent}%</div>
          <div className="stat-card-label">Placement Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon"><FaTrophy /></div>
          <div className="stat-card-value">{stats?.highestPackage} LPA</div>
          <div className="stat-card-label">Highest Package</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon"><FaChartLine /></div>
          <div className="stat-card-value">{stats?.averagePackage} LPA</div>
          <div className="stat-card-label">Average Package</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📊 Branch-wise Placement Breakdown
          </h3>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr><th>Branch</th><th>Total Students</th><th>Placed</th><th>Unplaced</th><th>Placement %</th></tr>
              </thead>
              <tbody>
                {stats?.branchWise?.map(b => {
                  const percent = b.total > 0 ? ((b.placed / b.total) * 100).toFixed(1) : 0;
                  return (
                    <tr key={b._id}>
                      <td><span className="badge badge-upcoming" style={{ fontWeight: 700 }}>{b._id || 'N/A'}</span></td>
                      <td style={{ fontWeight: 600 }}>{b.total}</td>
                      <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{b.placed}</td>
                      <td style={{ color: 'var(--accent-red)' }}>{b.total - b.placed}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ flex: 1, height: '8px', background: 'rgba(99,102,241,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${percent}%`, height: '100%', background: 'var(--gradient-success)', borderRadius: '4px', transition: 'width 1s ease' }}></div>
                          </div>
                          <span style={{ fontWeight: 600, fontSize: '0.85rem', minWidth: '45px' }}>{percent}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🏢 Company-wise Hiring Summary
          </h3>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr><th>Company</th><th>Students Hired</th><th>Avg Package</th></tr>
              </thead>
              <tbody>
                {stats?.companyWise?.length > 0 ? stats.companyWise.map(c => (
                  <tr key={c._id}>
                    <td style={{ fontWeight: 600 }}>{c._id}</td>
                    <td>
                      <span style={{ background: 'var(--gradient-primary)', color: 'white', padding: '3px 12px', borderRadius: '12px', fontWeight: 600, fontSize: '0.82rem' }}>
                        {c.count}
                      </span>
                    </td>
                    <td style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{Math.round(c.avgPackage * 100) / 100} LPA</td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No placements recorded yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '18px' }}>📋 Overall Summary</h3>
        <div className="detail-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
          <div className="detail-item"><div className="detail-item-label">Total Students</div><div className="detail-item-value">{stats?.totalStudents}</div></div>
          <div className="detail-item"><div className="detail-item-label">Total Companies</div><div className="detail-item-value">{stats?.totalCompanies}</div></div>
          <div className="detail-item"><div className="detail-item-label">Total Drives</div><div className="detail-item-value">{stats?.totalDrives}</div></div>
          <div className="detail-item"><div className="detail-item-label">Active Drives</div><div className="detail-item-value">{stats?.activeDrives}</div></div>
          <div className="detail-item"><div className="detail-item-label">Total Jobs</div><div className="detail-item-value">{stats?.totalJobs}</div></div>
          <div className="detail-item"><div className="detail-item-label">Open Jobs</div><div className="detail-item-value">{stats?.openJobs}</div></div>
          <div className="detail-item"><div className="detail-item-label">Total Applications</div><div className="detail-item-value">{stats?.totalApplications}</div></div>
          <div className="detail-item"><div className="detail-item-label">Total Offers</div><div className="detail-item-value">{stats?.studentsPlaced}</div></div>
        </div>
      </div>
    </div>
  );
}
