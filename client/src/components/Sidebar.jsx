import { NavLink, useLocation } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';

export default function Sidebar({ links, isOpen, onClose }) {
  const location = useLocation();
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={onClose}></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon"><FaGraduationCap /></div>
          <div className="sidebar-logo-text">SPMS<span>Placement Portal</span></div>
        </div>
        <nav className="sidebar-nav">
          {links.map((section, i) => (
            <div key={i}>
              {section.title && <div className="sidebar-section-title">{section.title}</div>}
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                  end={item.end}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
