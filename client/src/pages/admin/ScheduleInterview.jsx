import { useState, useEffect } from 'react';
import { getInterviews, createInterview, deleteInterview, getApplications, getJobs, getDrives } from '../../services/api';
import { useToast } from '../../components/Toast';
import { FaPlus, FaTrash, FaTimes, FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const EMPTY = { student: '', job: '', drive: '', date: '', time: '', venue: '', mode: 'offline', meetingLink: '', instructions: '' };

export default function ScheduleInterview() {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const addToast = useToast();

  const fetchData = () => {
    Promise.all([getInterviews(), getApplications({ status: 'shortlisted' })])
      .then(([iRes, aRes]) => {
        setInterviews(iRes.data.interviews);
        setApplications(aRes.data.applications);
        setLoading(false);
      }).catch(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Find the selected application to get student, job, drive IDs
      const app = applications.find(a => a._id === form.application);
      const data = {
        application: form.application,
        student: app?.student?._id,
        job: app?.job?._id,
        drive: app?.drive?._id,
        date: form.date,
        time: form.time,
        venue: form.venue,
        mode: form.mode,
        meetingLink: form.meetingLink,
        instructions: form.instructions
      };
      await createInterview(data);
      addToast('Interview scheduled!', 'success');
      setShowModal(false);
      setForm(EMPTY);
      fetchData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to schedule', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this interview?')) return;
    try {
      await deleteInterview(id);
      addToast('Interview deleted', 'info');
      fetchData();
    } catch {
      addToast('Delete failed', 'error');
    }
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <div><h1>Schedule Interviews</h1><p>{interviews.length} interviews scheduled</p></div>
        <button className="btn btn-primary" onClick={() => { setForm({ ...EMPTY }); setShowModal(true); }}><FaPlus /> Schedule Interview</button>
      </div>

      {interviews.length === 0 ? (
        <div className="empty-state"><FaCalendarAlt /><h3>No interviews scheduled</h3><p>Shortlist applications first, then schedule interviews</p></div>
      ) : (
        <div className="glass-card">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr><th>Student</th><th>Job</th><th>Company</th><th>Date</th><th>Time</th><th>Venue</th><th>Mode</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {interviews.map(iv => (
                  <tr key={iv._id}>
                    <td style={{ fontWeight: 600 }}>{iv.student?.name}<div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{iv.student?.rollNo} • {iv.student?.branch}</div></td>
                    <td>{iv.job?.title}</td>
                    <td style={{ color: 'var(--accent-cyan)' }}>{iv.job?.company?.name}</td>
                    <td>{new Date(iv.date).toLocaleDateString()}</td>
                    <td>{iv.time}</td>
                    <td>{iv.venue || '-'}</td>
                    <td><span className={`badge ${iv.mode === 'online' ? 'badge-upcoming' : 'badge-ongoing'}`}>{iv.mode}</span></td>
                    <td><span className={`badge badge-${iv.status === 'scheduled' ? 'upcoming' : iv.status === 'completed' ? 'completed' : 'rejected'}`}>{iv.status}</span></td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(iv._id)}><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Schedule Interview</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label>Select Shortlisted Application *</label>
                <select className="form-control" value={form.application || ''} onChange={e => setForm({ ...form, application: e.target.value })} required>
                  <option value="">Select a shortlisted student...</option>
                  {applications.map(a => (
                    <option key={a._id} value={a._id}>
                      {a.student?.name} ({a.student?.branch}) — {a.job?.title} at {a.job?.company?.name}
                    </option>
                  ))}
                </select>
                {applications.length === 0 && <p className="form-error">No shortlisted applications found. Shortlist students first.</p>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input type="date" className="form-control" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Time *</label>
                  <input type="time" className="form-control" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Mode</label>
                  <select className="form-control" value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })}>
                    <option value="offline">Offline</option>
                    <option value="online">Online</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Venue</label>
                  <input className="form-control" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} placeholder="Room 201, Block A" />
                </div>
              </div>
              {form.mode === 'online' && (
                <div className="form-group">
                  <label>Meeting Link</label>
                  <input className="form-control" value={form.meetingLink} onChange={e => setForm({ ...form, meetingLink: e.target.value })} placeholder="https://meet.google.com/..." />
                </div>
              )}
              <div className="form-group">
                <label>Instructions</label>
                <textarea className="form-control" value={form.instructions} onChange={e => setForm({ ...form, instructions: e.target.value })} rows="3" placeholder="Bring ID card, dress formally..." />
              </div>
              <div className="modal-footer" style={{ padding: '16px 0 0', border: 'none' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={applications.length === 0}>Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
