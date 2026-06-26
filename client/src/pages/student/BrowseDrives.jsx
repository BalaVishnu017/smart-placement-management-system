import { useState, useEffect } from 'react';
import { getDrives, getJobs, checkEligibility, applyToJob } from '../../services/api';
import { useToast } from '../../components/Toast';
import { FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave, FaUsers, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function BrowseDrives() {
  const [drives, setDrives] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [eligibility, setEligibility] = useState({});
  const [filter, setFilter] = useState('');
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const addToast = useToast();

  useEffect(() => {
    getDrives().then(res => { setDrives(res.data.drives); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleDriveClick = async (drive) => {
    setSelectedDrive(drive._id === selectedDrive ? null : drive._id);
    if (drive._id !== selectedDrive) {
      const res = await getJobs({ drive: drive._id });
      setJobs(res.data.jobs);
      // Check eligibility for each job
      const eligMap = {};
      for (const job of res.data.jobs) {
        try {
          const eRes = await checkEligibility(job._id);
          eligMap[job._id] = eRes.data;
        } catch { eligMap[job._id] = { eligible: false, reasons: ['Unable to check'], alreadyApplied: false }; }
      }
      setEligibility(eligMap);
    }
  };

  const handleApply = async (jobId, driveId) => {
    try {
      await applyToJob({ jobId, driveId });
      addToast('Application submitted successfully!', 'success');
      setEligibility(prev => ({ ...prev, [jobId]: { ...prev[jobId], alreadyApplied: true } }));
    } catch (err) { addToast(err.response?.data?.message || 'Application failed', 'error'); }
  };

  const filtered = drives.filter(d => !filter || d.status === filter);

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div className="animate-fadeInUp">
      <div className="page-header"><div><h1>Placement Drives</h1><p>Browse upcoming and ongoing campus drives</p></div></div>
      <div className="filter-bar">
        <select className="form-control" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Drives</option><option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option>
        </select>
      </div>

      {filtered.length === 0 ? <div className="empty-state"><h3>No drives found</h3></div> : filtered.map(drive => (
        <div key={drive._id} className="drive-card" style={{ marginBottom: '16px', cursor: 'pointer' }} onClick={() => handleDriveClick(drive)}>
          <div className="drive-card-header">
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{drive.title}</h3>
              <p style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', marginTop: '4px' }}>{drive.company?.name}</p>
            </div>
            <span className={`badge badge-${drive.status}`}>{drive.status}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '12px' }}>{drive.description}</p>
          <div className="drive-card-info">
            <div className="info-item"><FaCalendarAlt /> Drive: {new Date(drive.driveDate).toLocaleDateString()}</div>
            <div className="info-item"><FaClock /> Deadline: {new Date(drive.lastDateToApply).toLocaleDateString()}</div>
            <div className="info-item"><FaMapMarkerAlt /> {drive.venue}</div>
            <div className="info-item"><FaUsers /> Branches: {drive.eligibility?.branches?.join(', ')}</div>
          </div>

          {selectedDrive === drive._id && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }} onClick={e => e.stopPropagation()}>
              <h4 style={{ marginBottom: '14px', color: 'var(--accent-purple)' }}>Jobs in this Drive</h4>
              {jobs.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No jobs posted yet</p> : jobs.map(job => {
                const elig = eligibility[job._id] || {};
                return (
                  <div key={job._id} className="job-card" style={{ marginBottom: '12px' }}>
                    <div className="job-card-header">
                      <div>
                        <div className="job-card-title">{job.title}</div>
                        <div className="job-card-company">{job.company?.name}</div>
                      </div>
                      <span className={`badge ${elig.eligible ? 'badge-eligible' : 'badge-not-eligible'}`}>
                        {elig.eligible ? <><FaCheckCircle /> Eligible</> : <><FaTimesCircle /> Not Eligible</>}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>{job.description?.substring(0, 150)}...</p>
                    <div className="job-card-details">
                      <span><FaMoneyBillWave /> {job.packageLPA} LPA</span>
                      <span><FaMapMarkerAlt /> {job.location}</span>
                      <span><FaUsers /> {job.openings} openings</span>
                      <span className={`badge badge-${job.type === 'full-time' ? 'ongoing' : job.type === 'internship' ? 'upcoming' : 'selected'}`}>{job.type}</span>
                    </div>
                    <div className="job-card-skills">{job.skills?.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}</div>
                    {!elig.eligible && elig.reasons?.length > 0 && (
                      <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(239,68,68,0.06)', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--accent-red)' }}>
                        {elig.reasons.map((r, i) => <div key={i}>• {r}</div>)}
                      </div>
                    )}
                    <div className="job-card-footer">
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                      {elig.alreadyApplied ? (
                        <span className="badge badge-applied">Already Applied</span>
                      ) : (
                        <button className="btn btn-primary btn-sm" disabled={!elig.eligible} onClick={() => handleApply(job._id, drive._id)}>Apply Now</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
