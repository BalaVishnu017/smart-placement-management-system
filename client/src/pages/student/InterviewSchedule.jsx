import { useState, useEffect } from 'react';
import { getMyInterviews } from '../../services/api';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaVideo, FaBuilding } from 'react-icons/fa';

export default function InterviewSchedule() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    getMyInterviews()
      .then(res => {
        setInterviews(res.data.interviews);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  // Split interviews into Upcoming and Past
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingInterviews = interviews.filter(iv => {
    const ivDate = new Date(iv.date);
    return ivDate >= today && iv.status === 'scheduled';
  });

  const pastInterviews = interviews.filter(iv => {
    const ivDate = new Date(iv.date);
    return ivDate < today || iv.status === 'completed' || iv.status === 'cancelled';
  });

  const displayList = activeTab === 'upcoming' ? upcomingInterviews : pastInterviews;

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <div>
          <h1>Interview Schedule</h1>
          <p>Track your placement drive interview rounds</p>
        </div>
      </div>

      <div className="auth-tabs" style={{ width: 'fit-content', marginBottom: '24px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '8px' }}>
        <button 
          className={`auth-tab ${activeTab === 'upcoming' ? 'active' : ''}`} 
          onClick={() => setActiveTab('upcoming')}
          style={{ padding: '8px 16px', fontSize: '0.9rem', borderRadius: '6px' }}
        >
          Upcoming ({upcomingInterviews.length})
        </button>
        <button 
          className={`auth-tab ${activeTab === 'past' ? 'active' : ''}`} 
          onClick={() => setActiveTab('past')}
          style={{ padding: '8px 16px', fontSize: '0.9rem', borderRadius: '6px' }}
        >
          Past / History ({pastInterviews.length})
        </button>
      </div>

      {displayList.length === 0 ? (
        <div className="empty-state" style={{ padding: '40px 20px' }}>
          <FaCalendarAlt style={{ fontSize: '2.5rem', color: 'rgba(255,255,255,0.2)' }} />
          <h3>No {activeTab} interviews</h3>
          <p>
            {activeTab === 'upcoming' 
              ? 'You will see schedules here when recruiters shortlist your applications.' 
              : 'Your past completed or cancelled interviews will show here.'}
          </p>
        </div>
      ) : (
        <div className="cards-grid">
          {displayList.map(iv => (
            <div key={iv._id} className="interview-card" style={{ borderLeft: `4px solid ${iv.status === 'scheduled' ? '#6366f1' : iv.status === 'completed' ? '#10b981' : '#ef4444'}` }}>
              <div className="interview-card-header">
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{iv.job?.title}</h3>
                  <p style={{ color: 'var(--accent-cyan)', fontSize: '0.88rem', margin: '4px 0 0 0' }}>{iv.job?.company?.name}</p>
                </div>
                <span className={`badge badge-${iv.status === 'scheduled' ? 'upcoming' : iv.status === 'completed' ? 'completed' : 'rejected'}`}>{iv.status}</span>
              </div>
              <div className="interview-datetime" style={{ marginTop: '12px' }}>
                <span><FaCalendarAlt /> {new Date(iv.date).toLocaleDateString()}</span>
                <span><FaClock /> {iv.time}</span>
              </div>
              <div className="interview-datetime">
                <span>{iv.mode === 'online' ? <FaVideo /> : <FaBuilding />} {iv.mode}</span>
                <span><FaMapMarkerAlt /> {iv.venue || 'N/A'}</span>
              </div>
              {iv.meetingLink && (
                <p style={{ marginTop: '12px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🔗 <a href={iv.meetingLink} target="_blank" rel="noreferrer" style={{ color: '#818cf8', fontWeight: 'bold' }}>Join Online Interview</a>
                </p>
              )}
              {iv.instructions && (
                <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  <strong>Instructions:</strong> {iv.instructions}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
