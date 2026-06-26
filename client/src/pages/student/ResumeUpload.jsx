import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { uploadResume, getResume, deleteResume } from '../../services/api';
import { useToast } from '../../components/Toast';
import { FaCloudUploadAlt, FaFileAlt, FaTrash } from 'react-icons/fa';

export default function ResumeUpload() {
  const { user } = useAuth();
  const addToast = useToast();
  const fileRef = useRef();
  const [resume, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getResume(user._id).then(res => { setResumeData(res.data.resume); setLoading(false); }).catch(() => setLoading(false));
  }, [user._id]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('resume', file);
    setUploading(true);
    try {
      const res = await uploadResume(formData);
      setResumeData(res.data.resume);
      addToast('Resume uploaded successfully!', 'success');
    } catch (err) { addToast(err.response?.data?.message || 'Upload failed', 'error'); }
    finally { setUploading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete your resume?')) return;
    try {
      await deleteResume();
      setResumeData(null);
      addToast('Resume deleted', 'info');
    } catch (err) { addToast('Delete failed', 'error'); }
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div className="animate-fadeInUp">
      <div className="page-header"><div><h1>Resume</h1><p>Upload and manage your resume</p></div></div>
      <div className="glass-card" style={{ maxWidth: '600px' }}>
        <input type="file" ref={fileRef} accept=".pdf,.docx" style={{ display: 'none' }} onChange={handleUpload} />
        <div className="file-upload-area" onClick={() => fileRef.current?.click()}>
          <FaCloudUploadAlt />
          <h3>{uploading ? 'Uploading...' : 'Click to upload your resume'}</h3>
          <p>Accepted formats: PDF, DOCX (Max 5MB)</p>
        </div>
        {resume && (
          <div className="file-info">
            <FaFileAlt />
            <div className="file-info-details" style={{ flex: 1 }}>
              <h4>{resume.fileName}</h4>
              <p>Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()} • {(resume.fileSize / 1024).toFixed(1)} KB</p>
            </div>
            <button className="btn btn-danger btn-sm" onClick={handleDelete}><FaTrash /></button>
          </div>
        )}
      </div>
    </div>
  );
}
