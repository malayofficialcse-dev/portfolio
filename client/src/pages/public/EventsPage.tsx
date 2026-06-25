import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

type EventItem = {
  _id: string;
  name: string;
  type?: string;
  description: string;
  location?: string;
  date?: string;
  skills?: string[];
  certificateUrls?: string[];
  imageUrls?: string[];
  createdAt?: string;
};

const EVENTS_API =
  'https://mmport-b2fzejc8h9cwfffb.centralindia-01.azurewebsites.net/api/events';

const formatDate = (value?: string) => {
  if (!value) return 'Date not available';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date not available' : date.toLocaleDateString();
};

const normalizeUrl = (value?: string) => {
  if (!value) return '';
  return value.startsWith('http') ? value : `https://mmport-b2fzejc8h9cwfffb.centralindia-01.azurewebsites.net${value}`;
};

const carouselDelay = 3000;

export function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchEvents = async () => {
      try {
        const res = await axios.get(EVENTS_API);
        if (active) {
          setEvents(res.data ?? []);
        }
      } catch (err) {
        console.error(err);
        if (active) {
          setError('Unable to load events right now.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchEvents();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!events.length) return undefined;

    const interval = window.setInterval(() => {
      setActiveImageIndex((current) => {
        const currentImages = events[activeEventIndex]?.imageUrls ?? [];
        if (!currentImages.length) return 0;
        return (current + 1) % currentImages.length;
      });
    }, carouselDelay);

    return () => window.clearInterval(interval);
  }, [events, activeEventIndex]);

  const stats = useMemo(
    () => [
      { label: 'Events', value: String(events.length).padStart(2, '0') },
      { label: 'Certificates', value: String(events.reduce((count, item) => count + (item.certificateUrls?.length ?? 0), 0)).padStart(2, '0') },
      { label: 'Skills', value: String(events.reduce((count, item) => count + (item.skills?.length ?? 0), 0)).padStart(2, '0') },
    ],
    [events]
  );

  if (loading) {
    return (
      <section className="events-page events-page--loading">
        <h2>Loading events...</h2>
      </section>
    );
  }

  const currentEvent = events[activeEventIndex];
  const currentImage = currentEvent?.imageUrls?.[activeImageIndex];
  const currentImages = currentEvent?.imageUrls ?? [];

  return (
    <section className="events-page">
      <div className="events-page__shell">
        <header className="events-hero">
          <div className="events-hero__copy">
            <p className="events-hero__eyebrow">Events</p>
            <h1>Events & Highlights</h1>
            <p className="events-hero__lead">
              A clean showcase of hackathons, meetups, and public moments with an auto-rotating image carousel every 3 seconds.
            </p>

            <div className="events-hero__stats">
              {stats.map((stat) => (
                <div key={stat.label} className="events-stat">
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="events-hero__panel">
            <div className="events-hero__panel-inner">
              <span className="events-pill">Carousel preview</span>
              <strong>{currentEvent?.name || 'No events available'}</strong>
              <p>{currentEvent?.description || 'Event details will appear here.'}</p>
            </div>
          </div>
        </header>

        {error ? <p className="events-page__error">{error}</p> : null}

        {currentEvent ? (
          <article className="event-card">
            <div className="event-card__media">
              {currentImage ? (
                <img src={currentImage} alt={currentEvent.name} className="event-card__image" loading="lazy" />
              ) : (
                <div className="event-card__image event-card__image--empty">Events</div>
              )}

              <div className="event-card__overlay">
                <span className="event-card__badge">{currentEvent.type?.trim() || 'Event'}</span>
                <span className="event-card__badge event-card__badge--count">
                  {currentImages.length} image{currentImages.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            <div className="event-card__body">
              <div className="event-card__topline">
                <span className="event-card__date">{formatDate(currentEvent.date || currentEvent.createdAt)}</span>
                {currentEvent.location ? <span className="event-card__location">{currentEvent.location}</span> : null}
              </div>

              <h2 className="event-card__title">{currentEvent.name}</h2>
              <p className="event-card__description">{currentEvent.description}</p>

              <div className="event-card__chips">
                {(currentEvent.skills ?? []).length > 0 ? (
                  currentEvent.skills!.map((skill) => (
                    <span key={skill} className="event-chip">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="event-chip event-chip--muted">No skills listed</span>
                )}
              </div>

              <div className="event-card__gallery">
                {currentImages.slice(0, 4).map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={`event-gallery-thumb ${index === activeImageIndex ? 'event-gallery-thumb--active' : ''}`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img src={image} alt={`${currentEvent.name} preview ${index + 1}`} loading="lazy" />
                  </button>
                ))}
              </div>

              <div className="event-card__links">
                {currentEvent.certificateUrls?.length ? (
                  <a
                    href={normalizeUrl(currentEvent.certificateUrls[0])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="event-button event-button--primary"
                  >
                    View Certificate
                  </a>
                ) : (
                  <span className="event-button event-button--disabled">Certificate unavailable</span>
                )}

                <span className="event-button event-button--secondary">{currentImage ? 'Carousel active' : 'No carousel image'}</span>
              </div>
            </div>
          </article>
        ) : null}
      </div>
    </section>
  );
}
