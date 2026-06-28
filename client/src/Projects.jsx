import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const PROJECTS_API =
  "https://mmport-b2fzejc8h9cwfffb.centralindia-01.azurewebsites.net/api/projects";

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date not available" : date.toLocaleDateString();
};

const carouselDelay = 3000;

const directions = [
  'left-to-right',
  'right-to-left',
  'top-to-bottom',
  'bottom-to-top',
];

const ProjectCard = ({ project }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection] = useState(
    () => directions[Math.floor(Math.random() * directions.length)]
  );

  const images = useMemo(
    () => (project.imageUrls ?? []).filter(Boolean),
    [project.imageUrls]
  );
  const imageCount = images.length;
  const currentImage = images[activeImageIndex];
  const nextImage = nextImageIndex !== null ? images[nextImageIndex] : null;

  useEffect(() => {
    setActiveImageIndex(0);
    setNextImageIndex(null);
    setIsTransitioning(false);
  }, [images.length]);

  const startTransition = (targetIndex) => {
    if (targetIndex === activeImageIndex || imageCount <= 1) return;
    setNextImageIndex(targetIndex);
    setIsTransitioning(true);
    window.setTimeout(() => {
      setActiveImageIndex(targetIndex);
      setNextImageIndex(null);
      setIsTransitioning(false);
    }, 600);
  };

  useEffect(() => {
    if (isPaused || imageCount <= 1) return undefined;
    const interval = window.setInterval(() => {
      startTransition((activeImageIndex + 1) % imageCount);
    }, carouselDelay);
    return () => window.clearInterval(interval);
  }, [imageCount, isPaused, activeImageIndex]);

  const technologies = (project.technologies ?? [])
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5);

  return (
    <article
      className="project-card"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="project-card__media">
        {currentImage ? (
          <div className={`project-card__slide ${slideDirection}`}>
            <img
              key={`current-${activeImageIndex}`}
              src={currentImage}
              alt={project.title}
              className="project-card__image project-card__image--current"
              loading="lazy"
            />
            {nextImage ? (
              <img
                key={`next-${nextImageIndex}`}
                src={nextImage}
                alt={project.title}
                className={`project-card__image project-card__image--next ${slideDirection} ${isTransitioning ? 'transitioning' : ''}`}
                loading="lazy"
              />
            ) : null}
          </div>
        ) : (
          <div className="project-card__image project-card__image--empty">
            No preview image
          </div>
        )}

        <div className="project-card__overlay">
          {project.featured ? (
            <span className="project-card__pill project-card__pill--featured">
              Featured
            </span>
          ) : (
            <span className="project-card__pill">Project</span>
          )}

          <span className="project-card__pill project-card__pill--count">
            {imageCount} image{imageCount === 1 ? "" : "s"}
          </span>
        </div>

        {imageCount > 1 ? (
          <div className="project-card__carousel-controls">
            <button
              type="button"
              className="project-card__carousel-button"
              onClick={() => startTransition((activeImageIndex - 1 + imageCount) % imageCount)}
              aria-label="Previous project image"
            >
              ‹
            </button>
            <button
              type="button"
              className="project-card__carousel-button"
              onClick={() => startTransition((activeImageIndex + 1) % imageCount)}
              aria-label="Next project image"
            >
              ›
            </button>
          </div>
        ) : null}
      </div>

      <div className="project-card__body">
        <div className="project-card__topline">
          <span className="project-card__date">
            {formatDate(project.createdAt)}
          </span>
          {project.projectUrl ? (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__live-link"
            >
              Live preview
            </a>
          ) : null}
        </div>

        <h2 className="project-card__title">{project.title}</h2>
        <p className="project-card__description">{project.description}</p>

        <div className="project-card__tech">
          {technologies.length > 0 ? (
            technologies.map((tech) => (
              <span key={tech} className="project-card__tech-pill">
                {tech}
              </span>
            ))
          ) : (
            <span className="project-card__tech-pill project-card__tech-pill--muted">
              No technologies listed
            </span>
          )}
        </div>

        <div className="project-card__actions">
          {project.projectUrl ? (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__button project-card__button--primary"
            >
              Open Project
            </a>
          ) : (
            <span className="project-card__button project-card__button--disabled">
              No live link
            </span>
          )}

          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__button project-card__button--secondary"
            >
              GitHub
            </a>
          ) : (
            <span className="project-card__button project-card__button--secondary project-card__button--disabled">
              Private repo
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(PROJECTS_API);
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load projects right now.");
    } finally {
      setLoading(false);
    }
  };

  const visibleProjects = useMemo(() => projects ?? [], [projects]);
  const featuredProjects = visibleProjects.filter((project) => project.featured);

  if (loading) {
    return (
      <div className="project-page project-page--loading">
        <h2>Loading Projects...</h2>
      </div>
    );
  }

  return (
    <section className="project-page">
      <div className="project-page__shell">
        <header className="project-page__intro">
          <p className="project-page__eyebrow">Projects</p>
          <div className="project-page__heading-row">
            <div>
              <h1>Selected Projects</h1>
              <p>
                A clean showcase of full-stack builds, mobile-friendly
                interfaces, and live work that can be explored from the
                portfolio header.
              </p>
            </div>

            <div className="project-page__stats">
              <div className="project-page__badge">
                <strong>{visibleProjects.length}</strong>
                <span>Total projects</span>
              </div>
              <div className="project-page__badge project-page__badge--accent">
                <strong>{featuredProjects.length}</strong>
                <span>Featured</span>
              </div>
            </div>
          </div>

          {error ? <p className="project-page__error">{error}</p> : null}
        </header>

        <div className="project-grid">
          {visibleProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
