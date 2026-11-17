import { useEffect, useState } from 'react';
import { getApp, DESKTOP_ICONS } from './registry';
import type { OsApi, Win } from './types';
import type { Theme } from './useTheme';

type Props = {
  os: OsApi;
  wins: Win[];
  activeApp: string | null;
  onTaskClick: (app: string) => void;
  theme: Theme;
  toggleTheme: () => void;
};

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(t);
  }, []);
  return <time className="clock">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>;
}

export function Taskbar({ os, wins, activeApp, onTaskClick, theme, toggleTheme }: Props) {
  const [startOpen, setStartOpen] = useState(false);

  useEffect(() => {
    if (!startOpen) return;
    const close = (e: Event) => {
      if (!(e.target as HTMLElement).closest('.start-menu, .start-btn')) setStartOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setStartOpen(false);
    window.addEventListener('pointerdown', close);
    window.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('pointerdown', close);
      window.removeEventListener('keydown', esc);
    };
  }, [startOpen]);

  const launch = (id: string) => {
    setStartOpen(false);
    os.open(id);
  };

  return (
    <>
      {startOpen && (
        <nav className="start-menu" aria-label="Start menu">
          <div className="start-side" aria-hidden="true">
            PranshiOS
          </div>
          <ul>
            {DESKTOP_ICONS.map((id) => {
              const d = getApp(id)!;
              return (
                <li key={id}>
                  <button onClick={() => launch(id)}>
                    <span aria-hidden="true">{d.icon}</span> {d.title}
                  </button>
                </li>
              );
            })}
            <li className="sep" role="separator" />
            <li>
              <button onClick={() => (setStartOpen(false), os.setSpecies(os.species === 'cat' ? 'raccoon' : 'cat'))}>
                <span aria-hidden="true">{os.species === 'cat' ? '🦝' : '🐱'}</span> Swap to the{' '}
                {os.species === 'cat' ? 'raccoon' : 'cat'}
              </button>
            </li>
            <li>
              <button onClick={() => (setStartOpen(false), os.setRecruiter(true))}>
                <span aria-hidden="true">👔</span> Recruiter mode
              </button>
            </li>
          </ul>
        </nav>
      )}
      <footer className="taskbar">
        <button
          className={`start-btn${startOpen ? ' on' : ''}`}
          onClick={() => setStartOpen((o) => !o)}
          aria-expanded={startOpen}
        >
          <span aria-hidden="true">✿</span> <span className="start-label">start</span>
        </button>
        <div className="tasks">
          {wins.map((w) => {
            const d = getApp(w.app)!;
            return (
              <button
                key={w.app}
                className={`task${w.app === activeApp && !w.min ? ' on' : ''}`}
                onClick={() => onTaskClick(w.app)}
                title={d.title}
              >
                <span aria-hidden="true">{d.icon}</span>
                <span className="task-label">{d.title}</span>
              </button>
            );
          })}
        </div>
        <div className="tray">
          <button
            className="tray-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            className="tray-btn"
            onClick={() => os.setSpecies(os.species === 'cat' ? 'raccoon' : 'cat')}
            title={`Swap to the ${os.species === 'cat' ? 'raccoon' : 'cat'}`}
            aria-label={`Swap to the ${os.species === 'cat' ? 'raccoon' : 'cat'}`}
          >
            {os.species === 'cat' ? '🐱' : '🦝'}
          </button>
          <button className="tray-btn recruiter-btn" onClick={() => os.setRecruiter(true)}>
            👔 <span className="tray-label">Recruiter mode</span>
          </button>
          <Clock />
        </div>
      </footer>
    </>
  );
}
