import { NavLink, Outlet } from 'react-router-dom';
import { publicNav, adminNav } from '@/data/siteData';

export function Layout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar__inner">
          <div className="brand">
            <span className="brand-mark" />
            <div>
              <strong>MALAY</strong>
              <span>React portfolio client</span>
            </div>
          </div>

          <nav className="nav">
            {publicNav.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {item.label}
              </NavLink>
            ))}
            <span className="nav-divider" />
            {adminNav.slice(0, 2).map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link nav-link-soft ${isActive ? 'active' : ''}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer__shell">
          <div className="footer__brand">
            <div className="brand">
              <span className="brand-mark" />
              <div>
                <strong>MALAY</strong>
                <span>React portfolio client</span>
              </div>
            </div>
            <p>Simple, professional, and clean. Built with a Microsoft-inspired visual system.</p>
          </div>

          <div className="footer__grid">
            <div className="footer__col">
              <h3>Explore</h3>
              {publicNav.slice(0, 4).map((item) => (
                <NavLink key={item.to} to={item.to} className="footer__link">
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="footer__col">
              <h3>More</h3>
              {publicNav.slice(4).map((item) => (
                <NavLink key={item.to} to={item.to} className="footer__link">
                  {item.label}
                </NavLink>
              ))}
              {adminNav.slice(0, 2).map((item) => (
                <NavLink key={item.to} to={item.to} className="footer__link footer__link--soft">
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="footer__col">
              <h3>Contact</h3>
              <a className="footer__link" href="mailto:malay.official.cse@gmail.com">
                malay.official.cse@gmail.com
              </a>
              <a className="footer__link" href="/projects">
                Featured projects
              </a>
              <a className="footer__link" href="/certificates">
                Certificates
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
