import { profile } from '../data/profile';
import { petImage } from '../pet/sprites';
import type { OsApi } from '../os/types';
import { useMemo } from 'react';

export function AboutApp({ os }: { os: OsApi }) {
  const avatar = useMemo(() => petImage(os.species, 'sit', 'love', 6), [os.species]);
  return (
    <article className="app about">
      <header className="about-head">
        <img className="avatar" src={avatar} alt="" />
        <div>
          <h2>Hi, I'm {profile.name.split(' ')[0]} 👋</h2>
          <p className="lede">{profile.headline}</p>
          <p className="muted small">(photo not to scale. or species.)</p>
        </div>
      </header>
      {profile.about.map((para) => (
        <p key={para}>{para}</p>
      ))}
      <ul className="facts">
        <li>
          <span aria-hidden="true">🎓</span> {profile.education.degree}, {profile.education.school} ({profile.education.years})
        </li>
        <li>
          <span aria-hidden="true">🏆</span> {profile.achievements[0]}
        </li>
        <li>
          <span aria-hidden="true">⚔️</span> {profile.achievements[1]}
        </li>
        <li>
          <span aria-hidden="true">📍</span> {profile.location}
        </li>
        <li>
          <span aria-hidden="true">🔎</span> Looking for: {profile.lookingFor}
        </li>
      </ul>
      <div className="btn-row">
        <button className="btn primary" onClick={() => os.open('projects')}>
          See my projects
        </button>
        <button className="btn" onClick={() => os.open('contact')}>
          Say hi
        </button>
      </div>
    </article>
  );
}
