import { NavLink, Outlet } from 'react-router-dom';
import { publicNav, adminNav } from '@/data/siteData';

export function Layout() {
  return (
    <div className="app-shell">

      {/* ══ MICROSOFT-STYLE HEADER ══ */}
      <header className="ms-topbar">
        <div className="ms-topbar__inner">
          {/* Brand */}
          <div className="ms-topbar__brand">
            {/* Four-square Windows-style logo */}
            {/* <div className="ms-logo" aria-label="Logo">
              <span style={{ background: '#f25022' }} />
              <span style={{ background: '#7fba00' }} />
              <span style={{ background: '#00a4ef' }} />
              <span style={{ background: '#ffb900' }} />
            </div> */}
            <span className="ms-topbar__name">Malay Maity  | </span>
          </div>

          {/* Primary Nav */}
          <nav className="ms-nav" aria-label="Primary navigation">
            {publicNav.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `ms-nav__link${isActive ? ' ms-nav__link--active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="ms-topbar__actions">
            {adminNav.slice(0, 2).map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `ms-topbar__action-link${isActive ? ' active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      {/* ══ MICROSOFT-STYLE FOOTER ══ */}
      <footer className="ms-footer">
        {/* Rainbow accent bar */}
        <div className="ms-footer__accent" />

        <div className="ms-footer__body">
          <div className="ms-footer__inner">

            {/* Brand & tagline */}
            <div className="ms-footer__brand-col">
              {/* <div className="ms-logo ms-logo--light">
                <span style={{ background: '#f25022' }} />
                <span style={{ background: '#7fba00' }} />
                <span style={{ background: '#00a4ef' }} />
                <span style={{ background: '#ffb900' }} />
              </div> */}
              <p className="ms-footer__name">Malay Maity</p>
              <p className="ms-footer__tagline">Software Engineer · Full-stack Developer</p>
              <p className="ms-footer__sub">Building scalable, high-quality software — one clean commit at a time.</p>
              <div className="ms-footer__socials">
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="ms-footer__social">GH</a>
                <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="ms-footer__social">in</a>
                <a href="mailto:malay.official.cse@gmail.com" className="ms-footer__social">@</a>
              </div>
            </div>

            {/* Explore column */}
            <div className="ms-footer__col">
              <h3 color="black">Explore</h3>
              {publicNav.slice(0, 5).map(item => (
                <NavLink key={item.to} to={item.to} className="ms-footer__link">{item.label}</NavLink>
              ))}
            </div>

            {/* More column */}
            <div className="ms-footer__col">
              <h3>More</h3>
              {publicNav.slice(5).map(item => (
                <NavLink key={item.to} to={item.to} className="ms-footer__link">{item.label}</NavLink>
              ))}
              <NavLink to="/admin/dashboard" className="ms-footer__link">Admin</NavLink>
            </div>

            {/* Contact column */}
            <div className="ms-footer__col">
              <h3>Contact</h3>
              <a href="mailto:malay.official.cse@gmail.com" className="ms-footer__link">Email me</a>
              <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="ms-footer__link">LinkedIn</a>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="ms-footer__link">GitHub</a>
              <NavLink to="/projects" className="ms-footer__link ms-footer__link--dim">Projects</NavLink>
              <NavLink to="/certificates" className="ms-footer__link ms-footer__link--dim">Certificates</NavLink>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="ms-footer__bottom">
          <div className="ms-footer__bottom-inner">
            <p>© {new Date().getFullYear()} Malay Maity. All rights reserved.</p>
            <div className="ms-footer__legal">
              <a href="/">Privacy</a>
              <a href="/">Terms of use</a>
              <a href="/">Trademarks</a>
              <a href="/">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
