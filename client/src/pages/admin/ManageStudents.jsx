import { useState, useEffect } from 'react';
import { 
  getStudents, 
  downloadResume, 
  updateStudent, 
  getSystemConfig, 
  resetBatch 
} from '../../services/api';
import { useToast } from '../../components/Toast';
import { 
  FaSearch, 
  FaDownload, 
  FaUserEdit, 
  FaCog, 
  FaGraduationCap, 
  FaTimes, 
  FaCheck, 
  FaExclamationTriangle 
} from 'react-icons/fa';

export default function ManageStudents() {
  const addToast = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [placedFilter, setPlacedFilter] = useState('');
  const [activeBatchYear, setActiveBatchYear] = useState(2026);
  
  // Advanced filters state
  const [minCgpa, setMinCgpa] = useState('');
  const [maxCgpa, setMaxCgpa] = useState('');
  const [maxBacklogs, setMaxBacklogs] = useState('');
  
  // Modals state
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const [placementForm, setPlacementForm] = useState({
    isPlaced: false,
    placedCompany: '',
    placedPackage: ''
  });
  const [placementLoading, setPlacementLoading] = useState(false);

  const filteredStudents = students.filter(s => {
    if (minCgpa && s.cgpa < Number(minCgpa)) return false;
    if (maxCgpa && s.cgpa > Number(maxCgpa)) return false;
    if (maxBacklogs && s.backlogs > Number(maxBacklogs)) return false;
    return true;
  });

  const handleExportCSV = () => {
    if (filteredStudents.length === 0) {
      addToast('No student records to export', 'warning');
      return;
    }
    const headers = ['Name', 'Email', 'Roll Number', 'Branch', 'Department', 'Graduation Year', 'CGPA', 'Backlogs', 'Placement Status', 'Placed Company', 'Placed Package (LPA)', 'Archived'];
    const rows = filteredStudents.map(s => [
      s.name,
      s.email,
      s.rollNo || '-',
      s.branch,
      s.department || '-',
      s.graduationYear,
      s.cgpa,
      s.backlogs,
      s.isPlaced ? 'Placed' : 'Not Placed',
      s.placedCompany || '-',
      s.placedPackage || '-',
      s.isArchived ? 'Yes' : 'No'
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Student_Registry_Batch_${activeBatchYear}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    addToast('CSV exported successfully', 'success');
  };

  const fetchConfig = () => {
    getSystemConfig()
      .then(res => {
        if (res.data.activeGraduationYear) {
          setActiveBatchYear(res.data.activeGraduationYear);
        }
      })
      .catch(err => console.error('Error fetching system config:', err));
  };

  const fetchStudents = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (branchFilter) params.branch = branchFilter;
    if (placedFilter) params.placed = placedFilter;
    
    getStudents(params)
      .then(res => {
        setStudents(res.data.students);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        addToast('Failed to fetch students', 'error');
      });
  };

  useEffect(() => {
    fetchConfig();
    fetchStudents();
  }, [branchFilter, placedFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  // Resume Download Handler
  const handleDownloadResume = async (studentId, studentName) => {
    try {
      addToast('Downloading resume...', 'info');
      const response = await downloadResume(studentId);
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${studentName.replace(/\s+/g, '_')}_Resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      addToast('No resume file uploaded or download failed', 'error');
    }
  };

  // Placement Edit Handlers
  const openPlacementModal = (student) => {
    setSelectedStudent(student);
    setPlacementForm({
      isPlaced: student.isPlaced || false,
      placedCompany: student.placedCompany || '',
      placedPackage: student.placedPackage || ''
    });
    setShowPlacementModal(true);
  };

  const handlePlacementSave = async (e) => {
    e.preventDefault();
    setPlacementLoading(true);
    try {
      await updateStudent(selectedStudent._id, {
        isPlaced: placementForm.isPlaced,
        placedCompany: placementForm.isPlaced ? placementForm.placedCompany : '',
        placedPackage: placementForm.isPlaced ? Number(placementForm.placedPackage) : null
      });
      addToast('Student placement status updated successfully', 'success');
      setShowPlacementModal(false);
      fetchStudents();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update placement status', 'error');
    } finally {
      setPlacementLoading(false);
    }
  };

  // Batch Reset Handler (Academic Transition)
  const handleBatchReset = async () => {
    if (resetConfirmText !== 'RESET') {
      addToast('Please type RESET to confirm', 'warning');
      return;
    }
    setResetLoading(true);
    try {
      const res = await resetBatch();
      addToast(res.data.message || 'Batch reset completed successfully', 'success');
      setShowConfigModal(false);
      setResetConfirmText('');
      fetchConfig();
      fetchStudents();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to transition academic year', 'error');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="animate-fadeInUp">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Manage Students</h1>
          <p>{students.length} students registered</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, background: 'rgba(99, 102, 241, 0.1)' }}>
            <FaGraduationCap style={{ color: '#818cf8' }} />
            <span>Active Batch: <strong>{activeBatchYear}</strong></span>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => setShowConfigModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaCog /> Year Transition
          </button>
        </div>
      </div>

      <div className="filter-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
          <input className="form-control" placeholder="Search by name, email, roll no..." value={search} onChange={e => setSearch(e.target.value)} />
          <button type="submit" className="btn btn-primary btn-sm"><FaSearch /></button>
        </form>
        <select className="form-control" value={branchFilter} onChange={e => setBranchFilter(e.target.value)}>
          <option value="">All Branches</option>
          <option value="CS">CSE</option>
          <option value="IT">IT</option>
          <option value="ECE">ECE</option>
          <option value="EE">EE</option>
          <option value="ME">ME</option>
          <option value="CE">CE</option>
        </select>
        <select className="form-control" value={placedFilter} onChange={e => setPlacedFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="true">Placed</option>
          <option value="false">Not Placed</option>
        </select>

        {/* Advanced Filters */}
        <input 
          type="number" 
          step="0.01" 
          placeholder="Min CGPA" 
          className="form-control" 
          style={{ maxWidth: '100px' }} 
          value={minCgpa} 
          onChange={e => setMinCgpa(e.target.value)} 
        />
        <input 
          type="number" 
          step="0.01" 
          placeholder="Max CGPA" 
          className="form-control" 
          style={{ maxWidth: '100px' }} 
          value={maxCgpa} 
          onChange={e => setMaxCgpa(e.target.value)} 
        />
        <input 
          type="number" 
          placeholder="Max Backlogs" 
          className="form-control" 
          style={{ maxWidth: '120px' }} 
          value={maxBacklogs} 
          onChange={e => setMaxBacklogs(e.target.value)} 
        />

        <button 
          onClick={handleExportCSV} 
          className="btn btn-outline btn-sm" 
          style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <FaDownload /> Export CSV
        </button>
      </div>

      {loading ? <div className="loader-container"><div className="loader"></div></div> : (
        <div className="glass-card">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Roll No</th>
                  <th>Branch</th>
                  <th>CGPA</th>
                  <th>Backlogs</th>
                  <th>Year</th>
                  <th>Placement Status</th>
                  <th>Resume</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(s => (
                  <tr key={s._id}>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{s.email}</td>
                    <td>{s.rollNo || '-'}</td>
                    <td><span className="badge badge-upcoming">{s.branch}</span></td>
                    <td style={{ fontWeight: 600 }}>{s.cgpa}</td>
                    <td>{s.backlogs}</td>
                    <td>{s.graduationYear}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className={`badge ${s.isPlaced ? 'badge-selected' : 'badge-applied'}`}>
                          {s.isPlaced ? `Placed - ${s.placedCompany} (${s.placedPackage} LPA)` : 'Not Placed'}
                        </span>
                        {s.isArchived && (
                          <span className="badge badge-rejected" style={{ fontSize: '0.75rem', padding: '2px 6px', width: 'fit-content' }}>
                            Archived (Past Batch)
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      {s.hasResume ? (
                        <button 
                          onClick={() => handleDownloadResume(s._id, s.name)} 
                          className="btn btn-outline btn-sm" 
                          style={{ padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                        >
                          <FaDownload /> Download
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No file</span>
                      )}
                    </td>
                    <td>
                      <button 
                        onClick={() => openPlacementModal(s)} 
                        className="btn btn-primary btn-sm" 
                        style={{ padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                      >
                        <FaUserEdit /> Edit Placement
                      </button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PLACEMENT EDIT MODAL */}
      {showPlacementModal && (
        <div className="modal-backdrop">
          <div className="modal-content glass-card" style={{ maxWidth: '450px', animation: 'scaleUp 0.2s ease-out' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Edit Placement Status</h3>
              <button className="btn-close" onClick={() => setShowPlacementModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes /></button>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Update placement records for <strong>{selectedStudent?.name}</strong>.
            </p>
            <form onSubmit={handlePlacementSave}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500' }}>
                  <input 
                    type="checkbox" 
                    checked={placementForm.isPlaced} 
                    onChange={e => setPlacementForm({ ...placementForm, isPlaced: e.target.checked })} 
                  />
                  Mark student as Placed
                </label>
              </div>
              {placementForm.isPlaced && (
                <>
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label>Placed Company Name *</label>
                    <input 
                      className="form-control" 
                      placeholder="e.g. Microsoft" 
                      value={placementForm.placedCompany} 
                      onChange={e => setPlacementForm({ ...placementForm, placedCompany: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label>Salary Package (LPA) *</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      className="form-control" 
                      placeholder="e.g. 15" 
                      value={placementForm.placedPackage} 
                      onChange={e => setPlacementForm({ ...placementForm, placedPackage: e.target.value })} 
                      required 
                    />
                  </div>
                </>
              )}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowPlacementModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={placementLoading}>
                  {placementLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACADEMIC YEAR TRANSITION MODAL */}
      {showConfigModal && (
        <div className="modal-backdrop">
          <div className="modal-content glass-card" style={{ maxWidth: '500px', animation: 'scaleUp 0.2s ease-out' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaExclamationTriangle /> Academic Year Transition
              </h3>
              <button className="btn-close" onClick={() => setShowConfigModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes /></button>
            </div>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'rgba(255,255,255,0.85)', marginBottom: '16px' }}>
              <p>You are about to transition the portal to the next academic year. This process will:</p>
              <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                <li><strong>Permanently delete</strong> all students belonging to the batch of <strong>{activeBatchYear}</strong> and older.</li>
                <li><strong>Permanently delete</strong> their uploaded resumes, job applications, and interview schedules.</li>
                <li><strong>Increment</strong> the active graduating batch from <strong>{activeBatchYear}</strong> to <strong>{activeBatchYear + 1}</strong>.</li>
              </ul>
              <p style={{ color: '#f87171', fontWeight: 'bold', marginTop: '12px' }}>
                WARNING: This action is irreversible. All older student data will be lost.
              </p>
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>To confirm, please type <strong>RESET</strong> below:</label>
                <input 
                  className="form-control" 
                  placeholder="RESET" 
                  value={resetConfirmText} 
                  onChange={e => setResetConfirmText(e.target.value)} 
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowConfigModal(false)}>Cancel</button>
              <button 
                type="button" 
                className="btn btn-primary btn-sm" 
                style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }} 
                onClick={handleBatchReset} 
                disabled={resetLoading || resetConfirmText !== 'RESET'}
              >
                {resetLoading ? 'Resetting...' : 'Confirm Reset & Roll Year'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
