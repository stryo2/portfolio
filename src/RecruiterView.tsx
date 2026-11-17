// The plain one-page view: everything a recruiter needs, no windows, no cat (well, one small cat).
import { useEffect, useMemo } from 'react';
import { profile } from './data/profile';
import { projects } from './data/projects';
import { RESUME_URL, useResumePdf } from './apps/useResumePdf';
import { petImage, type Species } from './pet/sprites';

export function RecruiterView({ onExit, species }: { onExit: () => void; species: Species }) {
  const hasPdf = useResumePdf();
  const cat = useMemo(() => petImage(species, 'sit', 'happy', 3), [species]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const p = profile;
  return (
    <div className="recruiter">
      <div className="r-bar">
        <span className="muted small">Recruiter mode: everything on one page.</span>
        <button className="btn small" onClick={onExit}>
          <img src={cat} alt="" width={30} height={22} /> Back to the desktop
        </button>
      </div>
      <main className="r-main">
        <header className="r-head">
          <h1>{p.name}</h1>
          <p className="r-headline">{p.headline}</p>
          <p className="muted">
            {p.education.degree}, {p.education.school} · {p.education.years}
          </p>
          <p className="muted">
            {p.location} · {p.lookingFor}
          </p>
          <div className="btn-row">
            <a className="btn primary" href={`mailto:${p.email}`}>
              {p.email}
            </a>
            <a className="btn" href={p.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
            <a className="btn" href={p.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
            {hasPdf && (
              <a className="btn" href={RESUME_URL} download>
                ⬇ Resume (PDF)
              </a>
            )}
          </div>
        </header>

        <section>
          <h2>Projects</h2>
          {projects.map((pr) => (
            <article key={pr.id} className="r-project">
              <div className="r-project-head">
                <h3>{pr.name}</h3>
                <span className="r-links">
                  {pr.live && (
                    <a href={pr.live} target="_blank" rel="noreferrer">
                      Live ↗
                    </a>
                  )}
                  <a href={pr.repo} target="_blank" rel="noreferrer">
                    Code ↗
                  </a>
                </span>
              </div>
              <p className="muted">{pr.tagline}</p>
              <ul className="bullets">
                {pr.bullets.slice(0, pr.featured ? 3 : 2).map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <ul className="chips">
                {pr.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section>
          <h2>Experience</h2>
          {p.experience.map((e) => (
            <article key={e.org} className="r-project">
              <div className="r-project-head">
                <h3>
                  {e.role}, {e.org}
                </h3>
                <span className="muted small">{e.dates}</span>
              </div>
              <p className="muted small">{e.note}</p>
              <ul className="bullets">
                {e.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section>
          <h2>Achievements</h2>
          <ul className="bullets">
            {p.achievements.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Skills</h2>
          <dl className="r-skills">
            {Object.entries(p.skills).map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v.join(', ')}</dd>
              </div>
            ))}
          </dl>
          <p className="muted small">Coursework: {p.coursework.join(', ')}</p>
        </section>
      </main>
    </div>
  );
}
