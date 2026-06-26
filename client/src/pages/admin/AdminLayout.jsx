import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { FaTachometerAlt, FaUsers, FaBuilding, FaRoad, FaBriefcase, FaFileAlt, FaCalendarAlt, FaChartBar, FaBullhorn, FaBook, FaHistory } from 'react-icons/fa';

const adminLinks = [
  { title: 'Overview', items: [
    { path: '/admin', label: 'Dashboard', icon: <FaTachometerAlt />, end: true },
  ]},
  { title: 'Management', items: [
    { path: '/admin/students', label: 'Students', icon: <FaUsers /> },
    { path: '/admin/companies', label: 'Companies', icon: <FaBuilding /> },
    { path: '/admin/drives', label: 'Drives', icon: <FaRoad /> },
    { path: '/admin/jobs', label: 'Jobs', icon: <FaBriefcase /> },
    { path: '/admin/applications', label: 'Applications', icon: <FaFileAlt /> },
    { path: '/admin/interviews', label: 'Interviews', icon: <FaCalendarAlt /> },
  ]},
  { title: 'Analytics & Content', items: [
    { path: '/admin/stats', label: 'Placement Stats', icon: <FaChartBar /> },
    { path: '/admin/notices', label: 'Notices', icon: <FaBullhorn /> },
    { path: '/admin/resources', label: 'Resources', icon: <FaBook /> },
    { path: '/admin/logs', label: 'Audit Logs', icon: <FaHistory /> },
  ]}
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="dashboard-layout">
      <Sidebar links={adminLinks} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={{ flex: 1 }}>
        <Navbar title="Admin Panel" onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="main-content"><Outlet /></main>
      </div>
    </div>
  );
}
