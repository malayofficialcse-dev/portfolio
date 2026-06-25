import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const PROJECTS_API =
  "https://mmport-b2fzejc8h9cwfffb.centralindia-01.azurewebsites.net/api/projects";

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date not available" : date.toLocaleDateString();
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
          {visibleProjects.map((project) => {
            const technologies = (project.technologies ?? [])
              .map((item) => item.trim())
              .filter(Boolean)
              .slice(0, 5);
            const firstImage = project.imageUrls?.[0];
            const imageCount = project.imageUrls?.length ?? 0;

            return (
              <article key={project._id} className="project-card">
                <div className="project-card__media">
                  {firstImage ? (
                    <img
                      src={firstImage}
                      alt={project.title}
                      className="project-card__image"
                      loading="lazy"
                    />
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
                  <p className="project-card__description">
                    {project.description}
                  </p>

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
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
