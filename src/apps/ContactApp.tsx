import { useState } from 'react';
import { profile } from '../data/profile';

export function ContactApp() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };
  return (
    <div className="app contact">
      <h2>Say hi 💌</h2>
      <p className="lede">{profile.lookingFor}. Email is best (the cat reads it too).</p>
      <div className="email-row">
        <code>{profile.email}</code>
        <button className="btn" onClick={copy}>
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
      <div className="btn-row">
        <a className="btn primary" href={`mailto:${profile.email}`}>
          Send an email
        </a>
        <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn ↗
        </a>
        <a className="btn" href={profile.github} target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
      </div>
    </div>
  );
}
