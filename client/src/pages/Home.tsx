import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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

const PROFILE_API = 'https://mmport-b2fzejc8h9cwfffb.centralindia-01.azurewebsites.net/api/profile';

const stats = [
  { label: 'Focus', value: 'Full-stack development' },
  { label: 'Style', value: 'Clean and reliable' },
  { label: 'Approach', value: 'User-first UI' },
];

const navLinks = [
  { to: '/projects', label: 'Projects' },
  { to: '/skills', label: 'Skills' },
  { to: '/certificates', label: 'Certificates' },
  { to: '/research', label: 'Research' },
];

const getInitials = (name?: string) => {
  if (!name) return 'M';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
};

const formatLink = (value?: string) => {
  if (!value) return '';
  return value.startsWith('http') ? value : `https://${value}`;
};

export function Home() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(PROFILE_API);
        if (isMounted) {
          setProfile(res.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const profileLinks = useMemo(
    () => [
      { label: 'Email', href: profile?.email ? `mailto:${profile.email}` : '', value: profile?.email },
      { label: 'GitHub', href: formatLink(profile?.github), value: profile?.github },
      { label: 'LinkedIn', href: formatLink(profile?.linkedin), value: profile?.linkedin },
      { label: 'Website', href: formatLink(profile?.website), value: profile?.website },
      { label: 'Twitter', href: formatLink(profile?.twitter), value: profile?.twitter },
      { label: 'Resume', href: formatLink(profile?.resume), value: profile?.resume },
    ].filter((item) => Boolean(item.value)),
    [profile]
  );

  if (loading) {
    return (
      <div className="profile-page profile-page--loading">
        <h2>Loading profile...</h2>
      </div>
    );
  }

  const name = profile?.name || 'Malay Maity';
  const title = profile?.title || 'Software Engineer';
  const bio =
    profile?.bio ||
    'Developer skilled in building efficient, scalable applications and solving real-world problems through clean and reliable code.';
  const description =
    profile?.description ||
    'Software Engineer with experience in designing, developing, and maintaining scalable web applications.';

  return (
    <section className="profile-page">
      <div className="profile-page__shell">
        <div className="profile-hero">
          <div className="profile-hero__copy">
            <p className="profile-hero__eyebrow">Profile Overview</p>
            <h1>{name}</h1>
            <h2>{title}</h2>
            <p className="profile-hero__bio">{bio}</p>
            <p className="profile-hero__description">{description}</p>

            <div className="profile-hero__actions">
              <Link to="/projects" className="profile-button profile-button--primary">
                View Projects
              </Link>
              <Link to="/certificates" className="profile-button profile-button--secondary">
                View Certificates
              </Link>
            </div>

            <div className="profile-hero__links">
              {profileLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.label === 'Email' ? undefined : '_blank'}
                  rel={item.label === 'Email' ? undefined : 'noopener noreferrer'}
                  className="profile-chip"
                >
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </a>
              ))}
            </div>
          </div>

          <div className="profile-hero__portrait-card">
            <div className="profile-portrait">
              {profile?.profileImage ? (
                <img src={profile.profileImage} alt={name} className="profile-portrait__image" />
              ) : (
                <div className="profile-portrait__fallback">{getInitials(name)}</div>
              )}
            </div>

            <div className="profile-hero__meta">
              <span className="profile-pill">Available for collaboration</span>
              <div className="profile-hero__location">
                <strong>{profile?.location || 'Kolkata, West Bengal'}</strong>
                <span>{profile?.email || 'Contact via profile email'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-grid">
          <article className="profile-card profile-card--stats">
            <p className="profile-card__eyebrow">Highlights</p>
            <div className="profile-stats">
              {stats.map((stat) => (
                <div key={stat.label} className="profile-stat">
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="profile-card profile-card--contact">
            <p className="profile-card__eyebrow">Contact</p>
            <div className="profile-contact-list">
              <div>
                <span>Email</span>
                <strong>{profile?.email || 'Not provided'}</strong>
              </div>
              <div>
                <span>Phone</span>
                <strong>{profile?.phone || 'Not provided'}</strong>
              </div>
              <div>
                <span>Location</span>
                <strong>{profile?.location || 'Not provided'}</strong>
              </div>
            </div>
          </article>

          <article className="profile-card profile-card--nav">
            <p className="profile-card__eyebrow">Explore</p>
            <div className="profile-nav-grid">
              {navLinks.map((item) => (
                <Link key={item.to} to={item.to} className="profile-nav-card">
                  <span>{item.label}</span>
                  <strong>Open section</strong>
                </Link>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
