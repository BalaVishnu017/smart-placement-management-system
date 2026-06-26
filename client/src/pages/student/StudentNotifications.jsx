import { useState, useEffect } from 'react';
import { getNotifications, markAsRead, markAllRead } from '../../services/api';
import { FaBell } from 'react-icons/fa';

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    getNotifications().then(res => { setNotifications(res.data.notifications); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleMarkRead = async (id) => {
    await markAsRead(id);
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAll = async () => {
    await markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <div><h1>Notifications</h1><p>Stay updated on your placement activities</p></div>
        {notifications.some(n => !n.isRead) && <button className="btn btn-outline btn-sm" onClick={handleMarkAll}>Mark All Read</button>}
      </div>
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        {notifications.length === 0 ? (
          <div className="empty-state"><FaBell /><h3>No notifications</h3></div>
        ) : notifications.map(n => (
          <div key={n._id} className={`notification-item ${!n.isRead ? 'unread' : ''}`} onClick={() => !n.isRead && handleMarkRead(n._id)}>
            <div className={`notification-dot ${n.type}`}></div>
            <div className="notification-content" style={{ flex: 1 }}>
              <h4>{n.title}</h4>
              <p>{n.message}</p>
              <div className="notification-time">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
