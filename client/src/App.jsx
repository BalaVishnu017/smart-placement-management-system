import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import StudentLayout from './pages/student/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import BrowseDrives from './pages/student/BrowseDrives';
import MyApplications from './pages/student/MyApplications';
import InterviewSchedule from './pages/student/InterviewSchedule';
import CompanyResources from './pages/student/CompanyResources';
import ResumeUpload from './pages/student/ResumeUpload';
import StudentNotifications from './pages/student/StudentNotifications';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageCompanies from './pages/admin/ManageCompanies';
import ManageDrives from './pages/admin/ManageDrives';
import ManageJobs from './pages/admin/ManageJobs';
import ManageApplications from './pages/admin/ManageApplications';
import ScheduleInterview from './pages/admin/ScheduleInterview';
import PlacementStats from './pages/admin/PlacementStats';
import ManageNotices from './pages/admin/ManageNotices';
import ManageResources from './pages/admin/ManageResources';
import AuditLogs from './pages/admin/AuditLogs';
import './App.css';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/student" /> : <Register />} />
      <Route path="/forgot-password" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} /> : <ForgotPassword />} />

      {/* Student routes */}
      <Route path="/student" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
        <Route index element={<StudentDashboard />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="drives" element={<BrowseDrives />} />
        <Route path="applications" element={<MyApplications />} />
        <Route path="interviews" element={<InterviewSchedule />} />
        <Route path="resources" element={<CompanyResources />} />
        <Route path="resume" element={<ResumeUpload />} />
        <Route path="notifications" element={<StudentNotifications />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<ManageStudents />} />
        <Route path="companies" element={<ManageCompanies />} />
        <Route path="drives" element={<ManageDrives />} />
        <Route path="jobs" element={<ManageJobs />} />
        <Route path="applications" element={<ManageApplications />} />
        <Route path="interviews" element={<ScheduleInterview />} />
        <Route path="stats" element={<PlacementStats />} />
        <Route path="notices" element={<ManageNotices />} />
        <Route path="resources" element={<ManageResources />} />
        <Route path="logs" element={<AuditLogs />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
