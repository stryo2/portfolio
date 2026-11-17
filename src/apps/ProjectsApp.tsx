import { oldStuff, projects } from '../data/projects';
import { profile } from '../data/profile';
import type { OsApi } from '../os/types';

export function ProjectsApp({ os }: { os: OsApi }) {
  return (
    <div className="app explorer">
      <div className="addressbar" aria-hidden="true">
        C:\Users\{profile.handle}\projects
      </div>
      <ul className="file-grid">
        {projects.map((p) => (
          <li key={p.id}>
            <button className="file" onClick={() => os.open(`project:${p.id}`)}>
              <span className="tile" style={{ background: p.color }} aria-hidden="true">
                {p.icon}
              </span>
              <span className="file-name">{p.file}</span>
              <span className="file-desc">{p.tagline}</span>
            </button>
          </li>
        ))}
      </ul>
      <h3>old_stuff/</h3>
      <p className="muted small">Where it all started. Be kind.</p>
      <ul className="old-list">
        {oldStuff.map((o) => (
          <li key={o.name}>
            <a href={o.repo} target="_blank" rel="noreferrer">
              {o.name} ↗
            </a>
            <span className="muted"> · {o.note}</span>
          </li>
        ))}
      </ul>
      <p>
        <a href={profile.github + '?tab=repositories'} target="_blank" rel="noreferrer">
          Everything else on GitHub ↗
        </a>
      </p>
    </div>
  );
}
