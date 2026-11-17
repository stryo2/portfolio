import type { ReactNode } from 'react';
import { profile } from '../data/profile';
import { projects } from '../data/projects';
import type { OsApi } from '../os/types';
import { RESUME_URL, useResumePdf } from './useResumePdf';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rs-section">
      <h3 className="rs-heading">{title}</h3>
      {children}
    </section>
  );
}

function Entry({ title, meta, sub, children }: { title: string; meta?: string; sub?: ReactNode; children?: ReactNode }) {
  return (
    <div className="rs-entry">
      <div className="rs-entry-head">
        <h4>{title}</h4>
        {meta && <span className="rs-meta">{meta}</span>}
      </div>
      {sub && <div className="rs-sub">{sub}</div>}
      {children}
    </div>
  );
}

export function ResumeApp({ os }: { os: OsApi }) {
  const hasPdf = useResumePdf();
  const p = profile;
  return (
    <div className="app notepad">
      <div className="menubar">
        {hasPdf && (
          <a className="btn small" href={RESUME_URL} download>
            ⬇ Download PDF
          </a>
        )}
        <button className="btn small" onClick={() => os.setRecruiter(true)}>
          👔 Open Recruiter mode
        </button>
      </div>

      <div className="resume">
        <header className="rs-top">
          <h2>{p.name}</h2>
          <p className="rs-headline">{p.headline}</p>
          <p className="rs-meta">
            <a href={`mailto:${p.email}`}>{p.email}</a> · <a href={p.github} target="_blank" rel="noreferrer">github.com/{p.handle}</a>
          </p>
        </header>

        <Section title="Education">
          <Entry title={p.education.school} meta={p.education.years} sub={p.education.degree} />
        </Section>

        <Section title="Projects">
          {projects.map((pr) => (
            <Entry key={pr.id} title={pr.name} sub={pr.stack.slice(0, 6).join(' · ')}>
              <ul className="bullets">
                {pr.bullets.slice(0, 3).map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </Entry>
          ))}
        </Section>

        <Section title="Experience">
          {p.experience.map((e) => (
            <Entry key={e.org} title={e.role} meta={e.dates} sub={e.org}>
              <ul className="bullets">
                {e.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </Entry>
          ))}
        </Section>

        <Section title="Achievements">
          <ul className="bullets">
            {p.achievements.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </Section>

        <Section title="Skills">
          <dl className="rs-skills">
            {Object.entries(p.skills).map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </div>
    </div>
  );
}
