import { useState } from 'react';
import type { Project } from '../data/projects';

export function ProjectApp({ p }: { p: Project }) {
  const [playing, setPlaying] = useState(false);
  return (
    <article className="app project">
      <header className="project-head">
        <span className="tile big" style={{ background: p.color }} aria-hidden="true">
          {p.icon}
        </span>
        <div>
          <h2>{p.name}</h2>
          <p className="lede">{p.tagline}</p>
        </div>
      </header>

      <div className="btn-row">
        {p.live && (
          <a className="btn primary" href={p.live} target="_blank" rel="noreferrer">
            Open live ↗
          </a>
        )}
        <a className="btn" href={p.repo} target="_blank" rel="noreferrer">
          Code on GitHub ↗
        </a>
      </div>

      {p.media?.kind === 'gif' && <img className="media" src={p.media.src} alt={p.media.alt} loading="lazy" />}
      {p.media?.kind === 'play' &&
        (playing ? (
          <div className="media play">
            <iframe src={p.media.src} title={`${p.name}, playable`} allow="fullscreen; gamepad" />
          </div>
        ) : (
          <button className="media play-cover" onClick={() => setPlaying(true)}>
            <span className="play-icon" aria-hidden="true">▶</span>
            Play {p.name} right here
            <small>WASD to move · click to push · right-click to guard · space to dash</small>
          </button>
        ))}

      <h3>What I built</h3>
      <ul className="bullets">
        {p.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>

      <h3>Stack</h3>
      <ul className="chips">
        {p.stack.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </article>
  );
}
