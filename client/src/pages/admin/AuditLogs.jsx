import { useState, useEffect } from 'react';
import { getAuditLogs } from '../../services/api';
import { useToast } from '../../components/Toast';
import { FaHistory, FaSearch, FaInfoCircle } from 'react-icons/fa';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const addToast = useToast();

  const fetchLogs = () => {
    setLoading(true);
    // Fetch logs from backend
    getAuditLogs()
      .then(res => {
        setLogs(res.data.logs);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        addToast('Failed to fetch system logs', 'error');
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionBadgeClass = (action) => {
    switch (action) {
      case 'Academic Year Transition':
        return 'badge-rejected'; // red/pink for high-impact batch resets
      case 'Update Placement Status':
        return 'badge-selected'; // green/success for placements
      case 'Update Student Profile':
        return 'badge-upcoming'; // blue for general profile edits
      default:
        return 'badge-applied'; // default/neutral
    }
  };

  // Client-side search filtering
  const filteredLogs = logs.filter(log => {
    const term = search.toLowerCase();
    return (
      log.action.toLowerCase().includes(term) ||
      log.userName.toLowerCase().includes(term) ||
      log.details.toLowerCase().includes(term) ||
      log.ipAddress.includes(term)
    );
  });

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <div>
          <h1>System Audit Logs</h1>
          <p>Historical log of portal events and critical administrative changes</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={fetchLogs} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FaHistory /> Refresh Logs
        </button>
      </div>

      <div className="filter-bar">
        <div style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '400px' }}>
          <input 
            className="form-control" 
            placeholder="Search logs by user, action, details, IP..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
          <button className="btn btn-primary btn-sm"><FaSearch /></button>
        </div>
      </div>

      {loading ? <div className="loader-container"><div className="loader"></div></div> : (
        <div className="glass-card">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Details</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log._id}>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{log.userName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {log.user?.email || 'System'}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getActionBadgeClass(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ maxWidth: '400px', fontSize: '0.86rem', lineHeight: '1.4' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                        <FaInfoCircle style={{ marginTop: '3px', flexShrink: 0, color: 'var(--accent-indigo)' }} />
                        <span>{log.details}</span>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.88rem' }}>
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                      No audit logs found matching criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
