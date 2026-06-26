import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerStudent = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const updatePassword = (data) => API.put('/auth/update-password', data);
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);

// Students
export const getStudents = (params) => API.get('/students', { params });
export const getStudent = (id) => API.get(`/students/${id}`);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);

// Companies
export const getCompanies = (params) => API.get('/companies', { params });
export const getCompany = (id) => API.get(`/companies/${id}`);
export const createCompany = (data) => API.post('/companies', data);
export const updateCompany = (id, data) => API.put(`/companies/${id}`, data);
export const deleteCompany = (id) => API.delete(`/companies/${id}`);

// Drives
export const getDrives = (params) => API.get('/drives', { params });
export const getDrive = (id) => API.get(`/drives/${id}`);
export const createDrive = (data) => API.post('/drives', data);
export const updateDrive = (id, data) => API.put(`/drives/${id}`, data);
export const deleteDrive = (id) => API.delete(`/drives/${id}`);

// Jobs
export const getJobs = (params) => API.get('/jobs', { params });
export const getJob = (id) => API.get(`/jobs/${id}`);
export const createJob = (data) => API.post('/jobs', data);
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);
export const checkEligibility = (jobId) => API.get(`/jobs/${jobId}/eligibility`);

// Applications
export const applyToJob = (data) => API.post('/applications', data);
export const getMyApplications = () => API.get('/applications/my');
export const getApplications = (params) => API.get('/applications', { params });
export const updateApplicationStatus = (id, data) => API.put(`/applications/${id}/status`, data);

// Resumes
export const uploadResume = (formData) => API.post('/resumes/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getResume = (studentId) => API.get(`/resumes/${studentId}`);
export const downloadResume = (studentId) => API.get(`/resumes/${studentId}/download`, { responseType: 'blob' });
export const deleteResume = () => API.delete('/resumes');

// Interviews
export const getMyInterviews = () => API.get('/interviews/my');
export const getInterviews = (params) => API.get('/interviews', { params });
export const createInterview = (data) => API.post('/interviews', data);
export const updateInterview = (id, data) => API.put(`/interviews/${id}`, data);
export const deleteInterview = (id) => API.delete(`/interviews/${id}`);

// Notifications
export const getNotifications = () => API.get('/notifications');
export const markAsRead = (id) => API.put(`/notifications/${id}/read`);
export const markAllRead = () => API.put('/notifications/read-all');
export const sendNotification = (data) => API.post('/notifications', data);

// Resources
export const getResources = (params) => API.get('/resources', { params });
export const createResource = (data) => API.post('/resources', data);
export const updateResource = (id, data) => API.put(`/resources/${id}`, data);
export const deleteResource = (id) => API.delete(`/resources/${id}`);

// Notices
export const getNotices = () => API.get('/notices');
export const createNotice = (data) => API.post('/notices', data);
export const updateNotice = (id, data) => API.put(`/notices/${id}`, data);
export const deleteNotice = (id) => API.delete(`/notices/${id}`);

// Stats
export const getDashboardStats = () => API.get('/stats/dashboard');

// System config and Batch reset
export const getSystemConfig = () => API.get('/students/config');
export const updateSystemConfig = (data) => API.put('/students/config', data);
export const resetBatch = () => API.post('/students/reset-batch');
export const getAuditLogs = () => API.get('/logs');

export default API;
