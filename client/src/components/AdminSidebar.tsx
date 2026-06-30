import { NavLink, useNavigate } from 'react-router-dom';

export function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  const menuItems = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/profile', label: 'Profile Info' },
    { to: '/admin/skills', label: 'Skills Set' },
    { to: '/admin/projects', label: 'Projects' },
    { to: '/admin/research', label: 'Research Papers' },
    { to: '/admin/books', label: 'Books/Chapters' },
    { to: '/admin/events', label: 'Events/Talks' },
    { to: '/admin/certificates', label: 'Certificates' },
    { to: '/admin/experiences', label: 'Experiences' },
    { to: '/admin/academics', label: 'Academics' },
    { to: '/admin/quick-links', label: 'Quick Links' },
  ];

  return (
    <aside className="admin-sidebar">
      {menuItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `admin-sidebar-link${isActive ? ' active' : ''}`}
        >
          {item.label}
        </NavLink>
      ))}
      <hr style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '12px 0' }} />
      <button
        onClick={handleLogout}
        className="admin-btn admin-btn-danger"
        style={{ width: '100%', marginTop: 'auto' }}
      >
        Sign Out
      </button>
    </aside>
  );
}
