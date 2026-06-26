import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { FaTachometerAlt, FaUser, FaBuilding, FaBriefcase, FaCalendarAlt, FaBook, FaFileAlt, FaBell } from 'react-icons/fa';

const studentLinks = [
  { title: 'Menu', items: [
    { path: '/student', label: 'Dashboard', icon: <FaTachometerAlt />, end: true },
    { path: '/student/profile', label: 'My Profile', icon: <FaUser /> },
    { path: '/student/drives', label: 'Browse Drives', icon: <FaBuilding /> },
    { path: '/student/applications', label: 'My Applications', icon: <FaBriefcase /> },
    { path: '/student/interviews', label: 'Interview Schedule', icon: <FaCalendarAlt /> },
    { path: '/student/resources', label: 'Company Resources', icon: <FaBook /> },
    { path: '/student/resume', label: 'Resume', icon: <FaFileAlt /> },
    { path: '/student/notifications', label: 'Notifications', icon: <FaBell /> },
  ]}
];

export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="dashboard-layout">
      <Sidebar links={studentLinks} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={{ flex: 1 }}>
        <Navbar title="Student Portal" onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="main-content"><Outlet /></main>
      </div>
    </div>
  );
}
