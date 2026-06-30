import React, { useEffect, useState } from 'react';

const rawApiBase = import.meta.env.VITE_API_URL;
const API_BASE = rawApiBase
  ? rawApiBase.replace(/\/$/, '')
  : 'http://localhost:4000';
const API_URL = API_BASE.endsWith('/api') ? `${API_BASE}/cv` : `${API_BASE}/api/cv`;

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div className="state">Couldn't load the CV data. {error}</div>;
  }

  if (!data) {
    return <div className="state">Loading CV…</div>;
  }

  const { profile, experience, projects, skills } = data;

  return (
    <>
      <header className="masthead">
        <div>
          <h1>{profile?.name}</h1>
          <div className="title">{profile?.title}</div>
        </div>
        <div className="contact-block">
          {profile?.email && <div>{profile.email}</div>}
          {profile?.phone && <div>{profile.phone}</div>}
          {profile?.location && <div>{profile.location}</div>}
        </div>
      </header>

      {profile?.summary && <p className="summary">{profile.summary}</p>}

      <section className="section">
        <div className="section-label">Experience</div>
        {experience?.map((e) => (
          <div className="entry" key={e.id}>
            <div className="entry-date">
              {e.start_date} — {e.end_date}
            </div>
            <div>
              <p className="entry-role">{e.role}</p>
              <p className="entry-company">{e.company}</p>
              <p className="entry-desc">{e.description}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="section">
        <div className="section-label">Projects</div>
        {projects?.map((p) => (
          <div className="project-card" key={p.id}>
            <p className="project-name">
              {p.url ? (
                <a href={p.url} target="_blank" rel="noreferrer">
                  {p.name}
                </a>
              ) : (
                p.name
              )}
            </p>
            {p.tech_stack && <p className="project-stack">{p.tech_stack}</p>}
            <p className="project-desc">{p.description}</p>
          </div>
        ))}
      </section>

      <section className="section">
        <div className="section-label">Skills</div>
        <div className="skills-grid">
          {skills?.map((s) => (
            <span className="skill-pill" key={s.id}>
              {s.name}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}
