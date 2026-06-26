import { Link } from 'react-router-dom';
import { FaGraduationCap, FaBriefcase, FaBuilding, FaFileAlt, FaCalendarAlt, FaChartLine, FaShieldAlt, FaUsers } from 'react-icons/fa';

export default function Landing() {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="landing-nav-logo"><FaGraduationCap /> SPMS</div>
        <div className="landing-nav-links">
          <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
        </div>
      </nav>

      <section className="landing-hero">
        <h1>Smart Placement<br />Management System</h1>
        <p>Streamline your campus recruitment process. Connect students with top companies, manage placement drives, and track every step from application to selection.</p>
        <div className="landing-hero-btns">
          <Link to="/login" className="btn btn-primary btn-lg" style={{ minWidth: '200px' }}>Get Started</Link>
        </div>
      </section>

      <section className="landing-features">
        <h2>Everything You Need for Campus Placements</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-card-icon"><FaBriefcase /></div>
            <h3>Placement Drives</h3>
            <p>Browse upcoming and ongoing campus drives. Get all details about eligibility, schedules, and company information in one place.</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon"><FaBuilding /></div>
            <h3>Company Resources</h3>
            <p>Access previous year questions, interview experiences, tech stacks, and preparation materials for each company.</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon"><FaFileAlt /></div>
            <h3>Resume Upload</h3>
            <p>Upload your resume in PDF or DOCX format. Keep it updated for easy applications to placement drives.</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon"><FaShieldAlt /></div>
            <h3>Eligibility Check</h3>
            <p>Instantly check your eligibility for each job based on CGPA, branch, backlogs, and graduation year criteria.</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon"><FaCalendarAlt /></div>
            <h3>Interview Scheduling</h3>
            <p>View your interview schedules, venue details, and mode (online/offline) all in one convenient calendar view.</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon"><FaChartLine /></div>
            <h3>Placement Statistics</h3>
            <p>Track placement rates, highest packages, branch-wise analytics, and company-wise hiring data.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer" style={{ marginTop: '80px', padding: '24px 0', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
        <p>&copy; {new Date().getFullYear()} SPMS. All rights reserved. | <Link to="/login?role=admin" style={{ color: 'inherit', textDecoration: 'none' }}>Admin Portal</Link></p>
      </footer>
    </div>
  );
}
