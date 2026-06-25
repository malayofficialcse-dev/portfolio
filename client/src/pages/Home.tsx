import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaGithub,
  FaLinkedin,
  FaDocker,
} from "react-icons/fa";
import {
  SiDocker,
  SiKubernetes,
  SiTerraform,
  SiRedis,
  SiApachekafka
} from "react-icons/si";
import {
  SiGooglescholar,
  SiResearchgate,
  SiOrcid,
  SiLeetcode,
  SiGeeksforgeeks,
} from "react-icons/si";

/* ─── Type definitions ──────────────────────────────────────────── */

type ProfileData = {
  _id?: string;
  name?: string;
  title?: string;
  bio?: string;
  description?: string;
  profileImage?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  resume?: string;
};

type ProjectItem = {
  _id: string;
  title: string;
  description?: string;
  imageUrls?: string[];
  tags?: string[];
  liveUrl?: string;
  githubUrl?: string;
};

type BookItem = {
  _id: string;
  title: string;
  authors?: string[];
  description?: string;
  coverImageUrl?: string;
  imageUrls?: string[];
  type?: string;
  publisher?: string;
};

type CertItem = {
  _id: string;
  title: string;
  issuer?: string;
  issuingOrganization?: string;
  imageUrl?: string;
  imageUrls?: string[];
  issueDate?: string;
  credentialUrl?: string;
};

type ResearchPaper = {
  _id: string;
  title: string;
  abstract?: string;
  imageUrls?: string[];
  journal?: string;
  conference?: string;
  keywords?: string[];
  publicationDate?: string;
};

type ExperienceItem = {
  _id: string;
  company: string;
  role: string;
  joinDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  imageUrls?: string[];
  skills?: { _id: string; name: string; iconUrl?: string }[];
};

type TechnicalSkill = {
  _id: string;
  name: string;
  level: number;
  category?: string;
  iconUrl?: string;
};

type SkillsRecord = {
  technicalSkills?: TechnicalSkill[];
};

/* ─── API base ──────────────────────────────────────────────────── */

const API = 'https://mmport-b2fzejc8h9cwfffb.centralindia-01.azurewebsites.net/api';

/* ─── Helpers ───────────────────────────────────────────────────── */

const fmtLink = (v?: string) => (v ? (v.startsWith('http') ? v : `https://${v}`) : '');
const clamp = (n: number) => Math.max(0, Math.min(100, n));

/* ─── Reusable carousel hook ────────────────────────────────────── */

function useCarousel(count: number, interval = 4000) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused || count === 0) return;
    timerRef.current = setInterval(() => setIdx(i => (i + 1) % count), interval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, count, interval]);

  const prev = () => setIdx(i => (i - 1 + count) % count);
  const next = () => setIdx(i => (i + 1) % count);

  return { idx, setIdx, prev, next, paused, setPaused };
}

/* ─── Carousel UI ───────────────────────────────────────────────── */

function CarouselDots({ count, idx, setIdx }: { count: number; idx: number; setIdx: (i: number) => void }) {
  return (
    <div className="hc-dots">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          className={`hc-dot${i === idx ? ' active' : ''}`}
          onClick={() => setIdx(i)}
          aria-label={`Slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

/* ─── Quick nav links ───────────────────────────────────────────── */

// const quickLinks = [
//   { to: '/projects', icon: '', label: 'GitHub' },
//   { to: '/skills', icon: '⚙️', label: 'LinkedIn' },
//   { to: '/certificates', icon: '🏆', label: 'Google Scholar' },
//   { to: '/research', icon: '🔬', label: 'Research Gate' },
//   { to: '/books', icon: '📚', label: 'Orcid' },
//   { to: '/experiences', icon: '💼', label: 'DockerHub' },
//   { to: '/events', icon: '📅', label: 'Leetcode' },
//   { to: '/academic', icon: '🎓', label: 'GeeksforGeeks' },
// ];

const quickLinks = [
  { to: "/projects", icon: <FaGithub />, label: "GitHub", text: "900+ Contributions" },
  { to: "/skills", icon: <FaLinkedin />, label: "LinkedIn", text: "1.5k+ Connections" },
  { to: "/certificates", icon: <SiGooglescholar />, label: "Google Scholar", text: "9+ Publications" },
  { to: "/research", icon: <SiResearchgate />, label: "Research Gate", text: "60+ Publications" },
  { to: "/books", icon: <SiOrcid />, label: "ORCID", text: "0211-0000-0000" },
  { to: "/experiences", icon: <FaDocker />, label: "DockerHub", text: "10+ Images" },
  { to: "/events", icon: <SiLeetcode />, label: "LeetCode", text: "Top 22%" },
  { to: "/academic", icon: <SiGeeksforgeeks />, label: "GeeksforGeeks", text: "Top 8%" },
];
/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */

export function Home() {
  /* profile */
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  /* section data */
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [books, setBooks] = useState<BookItem[]>([]);
  const [certs, setCerts] = useState<CertItem[]>([]);
  const [research, setResearch] = useState<ResearchPaper[]>([]);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [skills, setSkills] = useState<TechnicalSkill[]>([]);

  /* hero slide */
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);

  /* carousels */
  const projCar = useCarousel(Math.max(projects.length, 1), 5000);
  const bookCar = useCarousel(Math.max(books.length, 1), 6000);
  const certCar = useCarousel(Math.max(certs.length, 1), 5500);
  const resCar = useCarousel(Math.max(research.length, 1), 6500);
  const expCar = useCarousel(Math.max(experiences.length, 1), 5800);

  /* fetch everything */
  useEffect(() => {
    let m = true;
    axios.get(`${API}/profile`).then(r => { if (m) setProfile(r.data); }).catch(console.error).finally(() => { if (m) setProfileLoading(false); });
    axios.get(`${API}/projects`).then(r => { if (m) setProjects(r.data ?? []); }).catch(console.error);
    axios.get(`${API}/books`).then(r => { if (m) setBooks(r.data ?? []); }).catch(console.error);
    axios.get(`${API}/certificates`).then(r => { if (m) setCerts(r.data ?? []); }).catch(console.error);
    axios.get(`${API}/research`).then(r => { if (m) setResearch(r.data ?? []); }).catch(console.error);
    axios.get(`${API}/experiences`).then(r => { if (m) setExperiences(r.data ?? []); }).catch(console.error);
    axios.get(`${API}/skills`).then(r => { if (m) setSkills(r.data?.[0]?.technicalSkills ?? []); }).catch(console.error);
    return () => { m = false; };
  }, []);

  /* hero auto-rotate */
  useEffect(() => {
    if (heroPaused) return;
    const id = setInterval(() => setHeroSlide(s => (s + 1) % 2), 4000);
    return () => clearInterval(id);
  }, [heroPaused]);

  const name = profile?.name ?? 'Malay Maity';
  const title = profile?.title ?? 'Software Engineer';
  const bio = profile?.bio ?? 'Developer skilled in building efficient, scalable applications and solving real-world problems through clean and reliable code.';

  const profileLinks = useMemo(() => [
    { label: 'Email', href: profile?.email ? `mailto:${profile.email}` : '', value: profile?.email },
    { label: 'GitHub', href: fmtLink(profile?.github), value: profile?.github },
    { label: 'LinkedIn', href: fmtLink(profile?.linkedin), value: profile?.linkedin },
    { label: 'Website', href: fmtLink(profile?.website), value: profile?.website },
  ].filter(i => Boolean(i.value)), [profile]);

  const topSkills = useMemo(() => [...skills].sort((a, b) => b.level - a.level).slice(0, 12), [skills]);

  const heroSlides = [
    {
      eyebrow: 'Portfolio · Full-Stack Engineer',
      heading: name,
      sub: title,
      body: bio,
      cta: { label: 'View Projects', to: '/projects' },
      ctaAlt: { label: 'Download Resume', to: profile?.resume ? fmtLink(profile.resume) : '/certificates' },
      bg: 'linear-gradient(135deg, #f5f0e8 0%, #ede8dc 45%, #e4ddd0 100%)',
      light: true,
    },
    {
      eyebrow: 'Open to opportunities',
      heading: 'Let\'s build something great.',
      sub: profile?.location ?? 'Kolkata, West Bengal',
      body: 'Full-stack engineer with a passion for clean code, great UX, and scalable architecture. Available for full-time roles and freelance projects.',
      cta: { label: 'Get in touch', to: profile?.email ? (`mailto:${profile.email}` as any) : '/admin/login' },
      ctaAlt: { label: 'Explore skills', to: '/skills' },
      bg: 'linear-gradient(135deg, #eef3f8 0%, #e6edf5 40%, #dde8f0 100%)',
      light: true,
    },
  ];

  const cur = heroSlides[heroSlide];

  if (profileLoading) {
    return (
      <div className="ms-loading">
        <span className="ms-loading__spinner" />
        <p>Loading…</p>
      </div>
    );
  }

  const resolveUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `https://mmport-b2fzejc8h9cwfffb.centralindia-01.azurewebsites.net${url}`;
    return url;
  };

  /* ─── helpers for image fallbacks ── */
  const projImg = (p: ProjectItem) => resolveUrl(p.imageUrls?.[0]);
  const bookImg = (b: BookItem) => resolveUrl(b.coverImageUrl || b.imageUrls?.[0]);
  const certImg = (c: CertItem) => resolveUrl(c.imageUrl || c.imageUrls?.[0]);
  const resImg = (r: ResearchPaper) => resolveUrl(r.imageUrls?.[0]);
  const expImg = (e: ExperienceItem) => resolveUrl(e.imageUrls?.[0]);

  const isLight = cur.light === true;

  return (
    <div className="ms-home">

      {/* ══════════ HERO BANNER ══════════ */}
      <section
        className={`ms-hero${isLight ? ' ms-hero--light' : ''}`}
        style={{ background: cur.bg }}
        onMouseEnter={() => setHeroPaused(true)}
        onMouseLeave={() => setHeroPaused(false)}
      >
        {/* animated particles */}
        <div className="hero-particles" aria-hidden="true">
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i} className="hero-particle" style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>

        <div className="ms-hero__inner">
          <div className="ms-hero__copy" key={heroSlide}>
            <p className="ms-hero__eyebrow">{cur.eyebrow}</p>
            <h1 className="ms-hero__heading">{cur.heading}</h1>
            <p className="ms-hero__sub">{cur.sub}</p>
            <p className="ms-hero__body">{cur.body}</p>
            <div className="ms-hero__actions">
              <Link to={cur.cta.to} className="ms-btn ms-btn--primary">{cur.cta.label}</Link>
              <Link to={cur.ctaAlt.to} className={isLight ? 'ms-btn ms-btn--outline-dark' : 'ms-btn ms-btn--ghost'}>{cur.ctaAlt.label}</Link>
            </div>
            {/* <div className="ms-hero__techs">
              <div className="ms-tech">
                <SiKubernetes />
              </div>

              <div className="ms-tech">
                <SiDocker />
              </div>

              <div className="ms-tech">
                <SiTerraform />
              </div>

              <div className="ms-tech">
                <SiRedis />
              </div>

              <div className="ms-tech">
                <SiApachekafka />
              </div>
            </div> */}

            {/* <div className="hero-floating-tech kubernetes">
              <SiKubernetes />
            </div>

            <div className="hero-floating-tech docker">
              <SiDocker />
            </div>

            <div className="hero-floating-tech terraform">
              <SiTerraform />
            </div>

            <div className="hero-floating-tech redis">
              <SiRedis />
            </div>

            <div className="hero-floating-tech kafka">
              <SiApachekafka />
            </div> */}
          </div>

          <div className="ms-hero__visual" key={`v-${heroSlide}`}>
            {profile?.profileImage
              ? (
                <div className="hero-photo-frame">
                  <img src={resolveUrl(profile.profileImage)} alt={name} className="ms-hero__photo" />
                  <div className="hero-photo-badge">
                    <span className="hero-badge-dot" />
                    Available for collaboration
                  </div>
                </div>
              )
              : (
                <div className="ms-hero__stats-panel">
                  <div className="ms-hero__stat"><span>Focus</span><strong>Full-stack Dev</strong></div>
                  <div className="ms-hero__stat"><span>Style</span><strong>Clean & Reliable</strong></div>
                  <div className="ms-hero__stat"><span>Approach</span><strong>User-first UI</strong></div>
                  <div className="ms-hero__stat"><span>Location</span><strong>{profile?.location ?? 'West Bengal, IN'}</strong></div>
                </div>
              )
            }
          </div>
        </div>

        {/* slide controls */}
        <div className="ms-hero__controls">
          <button className="ms-hero__arrow" onClick={() => setHeroSlide(s => (s - 1 + heroSlides.length) % heroSlides.length)}>‹</button>
          {heroSlides.map((_, i) => (
            <button key={i} className={`ms-hero__dot ${i === heroSlide ? 'active' : ''}`} onClick={() => setHeroSlide(i)} />
          ))}
          <button className="ms-hero__arrow" onClick={() => setHeroSlide(s => (s + 1) % heroSlides.length)}>›</button>
        </div>
      </section>

      {/* ══════════ QUICK NAV ══════════ */}
      <section className="ms-quick">
        <div className="ms-quick__inner">
          {quickLinks.map(item => (
            <Link key={item.to} to={item.to} className="ms-quick__item">
              <span className="ms-quick__icon">{item.icon}</span>
              {/* <span className="ms-quick__label">{item.label}</span> */}
              <span className="ms-quick__subtitle">{item.text}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════ STATS STRIP ══════════ */}
      <section className="home-stats-strip">
        <div className="home-stats-strip__inner">
          <div className="home-stat-item">
            <strong>{projects.length || '—'}</strong>
            <span>Projects Built</span>
          </div>
          <div className="home-stat-item">
            <strong>{certs.length || '—'}</strong>
            <span>Certifications</span>
          </div>
          <div className="home-stat-item">
            <strong>{research.length || '—'}</strong>
            <span>Research Papers</span>
          </div>
          <div className="home-stat-item">
            <strong>{books.length || '—'}</strong>
            <span>Publications</span>
          </div>
          <div className="home-stat-item">
            <strong>{experiences.length || '—'}</strong>
            <span>Work Experiences</span>
          </div>
          <div className="home-stat-item">
            <strong>{skills.length || '—'}</strong>
            <span>Technical Skills</span>
          </div>
        </div>
      </section>

      {/* ══════════ PROJECTS CAROUSEL ══════════ */}
      {projects.length > 0 && (
        <section className="home-carousel-section home-carousel-section--dark">
          <div className="home-carousel-section__header">
            <div className="home-carousel-section__label">Open Source</div>
            <h2 className="home-carousel-section__title">Projects &amp; Builds</h2>
            <p className="home-carousel-section__sub">Explore full-stack web apps, CLI tools, and research prototypes.</p>
            <Link to="/projects" className="home-carousel-section__link">View all projects →</Link>
          </div>

          <div
            className="home-carousel"
            onMouseEnter={() => projCar.setPaused(true)}
            onMouseLeave={() => projCar.setPaused(false)}
          >
            <button className="hc-arrow hc-arrow--left" onClick={projCar.prev} aria-label="Previous">‹</button>

            <div className="hc-track">
              {projects.map((p, i) => (
                <div
                  key={p._id}
                  className={`hc-slide ${i === projCar.idx ? 'active' : ''}`}
                  aria-hidden={i !== projCar.idx}
                >
                  <div className="hc-card">
                    <div className="hc-card__media">
                      {projImg(p)
                        ? <img src={projImg(p)} alt={p.title} loading="lazy" />
                        : <div className="hc-card__placeholder"><span>Project</span></div>
                      }
                      <div className="hc-card__overlay-badge">Project #{String(i + 1).padStart(2, '0')}</div>
                    </div>
                    <div className="hc-card__body">
                      <h3 className="hc-card__title">{p.title}</h3>
                      {p.description && <p className="hc-card__text">{p.description.slice(0, 140)}{p.description.length > 140 ? '…' : ''}</p>}
                      {p.tags && p.tags.length > 0 && (
                        <div className="hc-card__chips">
                          {p.tags.slice(0, 4).map(t => <span key={t} className="hc-chip">{t}</span>)}
                        </div>
                      )}
                      <div className="hc-card__actions">
                        <Link to="/projects" className="hc-card__btn hc-card__btn--primary">View Project</Link>
                        {p.githubUrl && <a href={fmtLink(p.githubUrl)} target="_blank" rel="noopener noreferrer" className="hc-card__btn hc-card__btn--ghost">GitHub</a>}
                        {p.liveUrl && <a href={fmtLink(p.liveUrl)} target="_blank" rel="noopener noreferrer" className="hc-card__btn hc-card__btn--ghost">Live Demo</a>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="hc-arrow hc-arrow--right" onClick={projCar.next} aria-label="Next">›</button>
          </div>

          <CarouselDots count={projects.length} idx={projCar.idx} setIdx={projCar.setIdx} />
        </section>
      )}

      {/* ══════════ TECHNICAL SKILLS ══════════ */}
      {topSkills.length > 0 && (
        <section className="home-skills-section">
          <div className="home-skills-section__inner">
            <div className="home-skills-section__header">
              <div className="home-carousel-section__label" style={{ color: '#0078d4' }}>Stack</div>
              <h2 className="home-skills-section__title">Technical Skills</h2>
              <p className="home-skills-section__sub">React · Node.js · TypeScript · Python · MongoDB · Azure · and more</p>
              <Link to="/skills" className="home-carousel-section__link" style={{ color: '#0078d4' }}>Full skills overview →</Link>
            </div>

            <div className="home-skills-grid">
              {topSkills.map(skill => (
                <div key={skill._id} className="home-skill-card">
                  <div className="home-skill-card__icon">
                    {skill.iconUrl
                      ? <img src={skill.iconUrl} alt={skill.name} loading="lazy" />
                      : <span>{skill.name.slice(0, 2).toUpperCase()}</span>
                    }
                  </div>
                  <div className="home-skill-card__info">
                    <div className="home-skill-card__topline">
                      <strong>{skill.name}</strong>
                      {/* <span>{clamp(skill.level)}%</span> */}
                    </div>
                    {/* <div className="home-skill-bar">
                      <div className="home-skill-bar__fill" style={{ width: `${clamp(skill.level)}%` }} />
                    </div> */}
                    {skill.category && <p className="home-skill-card__cat">{skill.category.replace(/[-_]/g, ' ')}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════ CERTIFICATES CAROUSEL ══════════ */}
      {certs.length > 0 && (
        <section className="home-carousel-section home-carousel-section--light">
          <div className="home-carousel-section__header">
            <div className="home-carousel-section__label" style={{ color: '#c55a11' }}>Achievements</div>
            <h2 className="home-carousel-section__title" style={{ color: '#1a1a1a' }}>Certifications</h2>
            <p className="home-carousel-section__sub" style={{ color: '#555' }}>Industry-recognised credentials and completed courses.</p>
            <Link to="/certificates" className="home-carousel-section__link" style={{ color: '#c55a11' }}>Browse all certificates →</Link>
          </div>

          <div
            className="home-carousel"
            onMouseEnter={() => certCar.setPaused(true)}
            onMouseLeave={() => certCar.setPaused(false)}
          >
            <button className="hc-arrow hc-arrow--left hc-arrow--dark" onClick={certCar.prev} aria-label="Previous">‹</button>

            <div className="hc-track">
              {certs.map((c, i) => (
                <div
                  key={c._id}
                  className={`hc-slide ${i === certCar.idx ? 'active' : ''}`}
                  aria-hidden={i !== certCar.idx}
                >
                  <div className="hc-card hc-card--light">
                    <div className="hc-card__media">
                      {certImg(c)
                        ? <img src={certImg(c)} alt={c.title} loading="lazy" />
                        : <div className="hc-card__placeholder hc-card__placeholder--light">🏆<span>Certificate</span></div>
                      }
                      {(c.issuer || c.issuingOrganization) && <div className="hc-card__overlay-badge">{c.issuer || c.issuingOrganization}</div>}
                    </div>
                    <div className="hc-card__body">
                      <h3 className="hc-card__title" style={{ color: '#1a1a1a' }}>{c.title}</h3>
                      {(c.issuer || c.issuingOrganization) && <p className="hc-card__text" style={{ color: '#555' }}>Issued by {c.issuer || c.issuingOrganization}</p>}
                      {c.issueDate && <p className="hc-card__meta-text">{new Date(c.issueDate).toLocaleDateString()}</p>}
                      <div className="hc-card__actions">
                        <Link to="/certificates" className="hc-card__btn hc-card__btn--accent">View Certificate</Link>
                        {c.credentialUrl && (
                          <a href={fmtLink(c.credentialUrl)} target="_blank" rel="noopener noreferrer" className="hc-card__btn hc-card__btn--ghost-dark">Verify</a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="hc-arrow hc-arrow--right hc-arrow--dark" onClick={certCar.next} aria-label="Next">›</button>
          </div>

          <CarouselDots count={certs.length} idx={certCar.idx} setIdx={certCar.setIdx} />
        </section>
      )}

      {/* ══════════ RESEARCH CAROUSEL ══════════ */}
      {research.length > 0 && (
        <section className="home-carousel-section home-carousel-section--purple">
          <div className="home-carousel-section__header">
            <div className="home-carousel-section__label" style={{ color: '#c4b5fd' }}>Academic</div>
            <h2 className="home-carousel-section__title">Research &amp; Papers</h2>
            <p className="home-carousel-section__sub">Published work spanning AI, distributed systems, and web engineering.</p>
            <Link to="/research" className="home-carousel-section__link" style={{ color: '#c4b5fd' }}>Read all papers →</Link>
          </div>

          <div
            className="home-carousel"
            onMouseEnter={() => resCar.setPaused(true)}
            onMouseLeave={() => resCar.setPaused(false)}
          >
            <button className="hc-arrow hc-arrow--left" onClick={resCar.prev} aria-label="Previous">‹</button>

            <div className="hc-track">
              {research.map((r, i) => {
                const src = r.journal || r.conference || 'Research';
                return (
                  <div
                    key={r._id}
                    className={`hc-slide ${i === resCar.idx ? 'active' : ''}`}
                    aria-hidden={i !== resCar.idx}
                  >
                    <div className="hc-card">
                      <div className="hc-card__media">
                        {resImg(r)
                          ? <img src={resImg(r)} alt={r.title} loading="lazy" />
                          : <div className="hc-card__placeholder hc-card__placeholder--purple">🔬<span>Research</span></div>
                        }
                        <div className="hc-card__overlay-badge">{src}</div>
                      </div>
                      <div className="hc-card__body">
                        <h3 className="hc-card__title">{r.title}</h3>
                        {r.abstract && <p className="hc-card__text">{r.abstract.slice(0, 160)}{r.abstract.length > 160 ? '…' : ''}</p>}
                        {r.keywords && r.keywords.length > 0 && (
                          <div className="hc-card__chips">
                            {r.keywords.slice(0, 4).map(k => <span key={k} className="hc-chip hc-chip--purple">{k}</span>)}
                          </div>
                        )}
                        <div className="hc-card__actions">
                          <Link to="/research" className="hc-card__btn hc-card__btn--purple">Read Paper</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="hc-arrow hc-arrow--right" onClick={resCar.next} aria-label="Next">›</button>
          </div>

          <CarouselDots count={research.length} idx={resCar.idx} setIdx={resCar.setIdx} />
        </section>
      )}

      {/* ══════════ BOOKS CAROUSEL ══════════ */}
      {books.length > 0 && (
        <section className="home-carousel-section home-carousel-section--light">
          <div className="home-carousel-section__header">
            <div className="home-carousel-section__label" style={{ color: '#107c41' }}>Publications</div>
            <h2 className="home-carousel-section__title" style={{ color: '#1a1a1a' }}>Books &amp; Publications</h2>
            <p className="home-carousel-section__sub" style={{ color: '#555' }}>Academic publications and learning resources.</p>
            <Link to="/books" className="home-carousel-section__link" style={{ color: '#107c41' }}>See all publications →</Link>
          </div>

          <div
            className="home-carousel"
            onMouseEnter={() => bookCar.setPaused(true)}
            onMouseLeave={() => bookCar.setPaused(false)}
          >
            <button className="hc-arrow hc-arrow--left hc-arrow--dark" onClick={bookCar.prev} aria-label="Previous">‹</button>

            <div className="hc-track">
              {books.map((b, i) => (
                <div
                  key={b._id}
                  className={`hc-slide ${i === bookCar.idx ? 'active' : ''}`}
                  aria-hidden={i !== bookCar.idx}
                >
                  <div className="hc-card hc-card--light">
                    <div className="hc-card__media hc-card__media--book">
                      {bookImg(b)
                        ? <img src={bookImg(b)} alt={b.title} loading="lazy" />
                        : <div className="hc-card__placeholder hc-card__placeholder--green">📚<span>Book</span></div>
                      }
                      {b.type && <div className="hc-card__overlay-badge">{b.type.replace(/[-_]/g, ' ')}</div>}
                    </div>
                    <div className="hc-card__body">
                      <h3 className="hc-card__title" style={{ color: '#1a1a1a' }}>{b.title}</h3>
                      {b.authors && b.authors.length > 0 && (
                        <p className="hc-card__meta-text" style={{ color: '#107c41' }}>
                          <strong>Authors:</strong> {b.authors.join(', ')}
                        </p>
                      )}
                      {b.description && <p className="hc-card__text" style={{ color: '#555' }}>{b.description.slice(0, 130)}{b.description.length > 130 ? '…' : ''}</p>}
                      {b.publisher && <p className="hc-card__meta-text"><strong>Publisher:</strong> {b.publisher}</p>}
                      <div className="hc-card__actions">
                        <Link to="/books" className="hc-card__btn hc-card__btn--green">View Book</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="hc-arrow hc-arrow--right hc-arrow--dark" onClick={bookCar.next} aria-label="Next">›</button>
          </div>

          <CarouselDots count={books.length} idx={bookCar.idx} setIdx={bookCar.setIdx} />
        </section>
      )}

      {/* ══════════ EXPERIENCE CAROUSEL ══════════ */}
      {experiences.length > 0 && (
        <section className="home-carousel-section home-carousel-section--dark">
          <div className="home-carousel-section__header">
            <div className="home-carousel-section__label" style={{ color: '#ffb900' }}>Professional</div>
            <h2 className="home-carousel-section__title">Work Experience</h2>
            <p className="home-carousel-section__sub">Roles, internships, and professional contributions.</p>
            <Link to="/experiences" className="home-carousel-section__link" style={{ color: '#ffb900' }}>Full timeline →</Link>
          </div>

          <div
            className="home-carousel"
            onMouseEnter={() => expCar.setPaused(true)}
            onMouseLeave={() => expCar.setPaused(false)}
          >
            <button className="hc-arrow hc-arrow--left" onClick={expCar.prev} aria-label="Previous">‹</button>

            <div className="hc-track">
              {experiences.map((e, i) => (
                <div
                  key={e._id}
                  className={`hc-slide ${i === expCar.idx ? 'active' : ''}`}
                  aria-hidden={i !== expCar.idx}
                >
                  <div className="hc-card">
                    <div className="hc-card__media">
                      {expImg(e)
                        ? <img src={expImg(e)} alt={e.company} loading="lazy" />
                        : <div className="hc-card__placeholder hc-card__placeholder--yellow">💼<span>Experience</span></div>
                      }
                      <div className="hc-card__overlay-badge">{e.isCurrent ? '🟢 Current' : 'Past role'}</div>
                    </div>
                    <div className="hc-card__body">
                      <h3 className="hc-card__title">{e.role}</h3>
                      <p className="hc-card__meta-text" style={{ color: '#ffb900' }}>{e.company}</p>
                      {e.joinDate && (
                        <p className="hc-card__text">
                          {new Date(e.joinDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                          {' – '}
                          {e.isCurrent ? 'Present' : (e.endDate ? new Date(e.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Present')}
                        </p>
                      )}
                      {e.skills && e.skills.length > 0 && (
                        <div className="hc-card__chips">
                          {e.skills.slice(0, 4).map(s => <span key={s._id} className="hc-chip hc-chip--yellow">{s.name}</span>)}
                        </div>
                      )}
                      <div className="hc-card__actions">
                        <Link to="/experiences" className="hc-card__btn hc-card__btn--yellow">View Experience</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="hc-arrow hc-arrow--right" onClick={expCar.next} aria-label="Next">›</button>
          </div>

          <CarouselDots count={experiences.length} idx={expCar.idx} setIdx={expCar.setIdx} />
        </section>
      )}



      {/* ══════════ PROFILE STRIP ══════════ */}
      <section className="ms-profile-strip">
        <div className="ms-profile-strip__inner">
          <div className="ms-profile-strip__photo">
            {profile?.profileImage
              ? <img src={profile.profileImage} alt={name} />
              : <div className="ms-profile-strip__mono">{name.split(' ').map(p => p[0]).join('').slice(0, 2)}</div>
            }
          </div>
          <div className="ms-profile-strip__copy">
            <p className="ms-profile-strip__eyebrow">About me</p>
            <h2 className="ms-profile-strip__name">{name}</h2>
            <p className="ms-profile-strip__title">{title}</p>
            <p className="ms-profile-strip__bio">{profile?.description ?? bio}</p>
            <div className="ms-profile-strip__links">
              {profileLinks.map(item => (
                <a key={item.label} href={item.href}
                  target={item.label === 'Email' ? undefined : '_blank'}
                  rel={item.label === 'Email' ? undefined : 'noopener noreferrer'}
                  className="ms-pill"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>




      {/* ══════════ CTA BAND ══════════ */}
      <section className="ms-cta-band">
        <div className="ms-cta-band__inner">
          <h2>Ready to collaborate?</h2>
          <p>Open to full-time roles, freelance projects, and research collaborations.</p>
          <div className="ms-cta-band__actions">
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="ms-btn ms-btn--primary">Send an email</a>
            )}
            {profile?.linkedin && (
              <a href={fmtLink(profile.linkedin)} target="_blank" rel="noopener noreferrer" className="ms-btn ms-btn--ghost">
                Connect on LinkedIn
              </a>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
