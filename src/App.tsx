import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { profile } from './data/profile';
import { Pet } from './pet/Pet';
import { Confetti } from './pet/Confetti';
import { petBus } from './pet/bus';
import { PETS, petImage, type Species } from './pet/sprites';
import { DESKTOP_ICONS, getApp } from './os/registry';
import { Taskbar } from './os/Taskbar';
import { Window } from './os/Window';
import type { OsApi, Win } from './os/types';
import { RecruiterView } from './RecruiterView';
import { useTheme } from './os/useTheme';

const TASKBAR = 46;
const isRecruiterHash = () => window.location.hash === '#recruiter';

export default function App() {
  const [recruiter, setRecruiterState] = useState(isRecruiterHash);
  const [species, setSpeciesState] = useState<Species>('cat');
  const [wins, setWins] = useState<Win[]>([]);
  const [theme, toggleTheme] = useTheme();
  const z = useRef(10);
  const opened = useRef(false);

  // Recruiter mode lives in the URL (#recruiter) so it can be linked directly.
  useEffect(() => {
    const sync = () => setRecruiterState(isRecruiterHash());
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  const setRecruiter = useCallback((on: boolean) => {
    if (on) window.location.hash = 'recruiter';
    else history.replaceState(null, '', window.location.pathname + window.location.search);
    setRecruiterState(on);
  }, []);

  // The favicon is the pet.
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (link) link.href = petImage(species, 'sit', 'happy', 3);
  }, [species]);

  const setSpecies = useCallback((s: Species) => {
    setSpeciesState(s);
    window.setTimeout(() => petBus.emit({ type: 'say', line: s === 'raccoon' ? 'hehe. hi. 🦝' : 'mrrp! back! 🐱' }), 100);
  }, []);

  const open = useCallback((app: string) => {
    const def = getApp(app);
    if (!def) return;
    opened.current = true;
    const nz = ++z.current;
    setWins((ws) => {
      if (ws.some((w) => w.app === app)) return ws.map((w) => (w.app === app ? { ...w, min: false, z: nz } : w));
      const vw = window.innerWidth;
      const vh = window.innerHeight - TASKBAR;
      const w = Math.min(def.w, vw - 24);
      const h = Math.min(def.h, vh - 24);
      const n = ws.length % 5;
      const x = Math.max(12, Math.min(vw - w - 12, (vw - w) / 2 + n * 28 - 40));
      const y = Math.max(12, Math.min(vh - h - 12, (vh - h) / 2 + n * 24 - 40));
      return [...ws, { app, x, y, w, h, z: nz, min: false, max: false }];
    });
    petBus.emit({ type: 'open', app, line: def.petLine });
  }, []);

  const close = useCallback((app: string) => {
    setWins((ws) => ws.filter((w) => w.app !== app));
    petBus.emit({ type: 'close', app });
  }, []);

  const patch = (app: string, p: Partial<Win>) => setWins((ws) => ws.map((w) => (w.app === app ? { ...w, ...p } : w)));
  const focus = (app: string) => {
    const top = wins.reduce((m, w) => Math.max(m, w.z), 0);
    const w = wins.find((q) => q.app === app);
    if (w && w.z === top && !w.min) return;
    patch(app, { z: ++z.current, min: false });
  };

  const activeApp = useMemo(() => {
    const visible = wins.filter((w) => !w.min);
    return visible.length ? visible.reduce((a, b) => (a.z > b.z ? a : b)).app : null;
  }, [wins]);

  const onTaskClick = (app: string) => {
    const w = wins.find((q) => q.app === app);
    if (!w) return;
    if (app === activeApp && !w.min) patch(app, { min: true });
    else focus(app);
  };

  // Escape closes the window on top.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeApp && !document.querySelector('.start-menu')) close(activeApp);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeApp, close]);

  // A hello, and a nudge if nobody has clicked anything yet.
  useEffect(() => {
    if (recruiter) return;
    const hour = new Date().getHours();
    const t1 = window.setTimeout(
      () =>
        petBus.emit({
          type: 'say',
          line: hour >= 23 || hour < 5 ? "it's late… but hi! 🌙" : `hi! 👋 i'm ${profile.name.split(' ')[0].toLowerCase()}'s ${PETS[species].name.toLowerCase()}`,
        }),
      900,
    );
    const t2 = window.setTimeout(() => {
      if (!opened.current) petBus.emit({ type: 'say', line: 'psst… click an icon 👀' });
    }, 9000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
    // Only on first load of the desktop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recruiter]);

  const os: OsApi = { open, close, setRecruiter, species, setSpecies };

  if (recruiter) return <RecruiterView onExit={() => setRecruiter(false)} species={species} />;

  return (
    <div className="desktop" style={{ '--tb': `${TASKBAR}px` } as React.CSSProperties}>
      <div className="hero">
        <p className="hero-kicker">PranshiOS · v2027</p>
        <h1>{profile.name}</h1>
        <p className="hero-line">Backend engineer who also builds cute things.</p>
        <p className="hero-sub">
          Click an icon to look around, or{' '}
          <button className="linkish" onClick={() => setRecruiter(true)}>
            open Recruiter mode
          </button>{' '}
          for the plain one-pager.
        </p>
      </div>

      <ul className="icons" aria-label="Desktop">
        {DESKTOP_ICONS.map((id) => {
          const d = getApp(id)!;
          return (
            <li key={id}>
              <button className="icon" onClick={() => open(id)}>
                <span className="tile" style={{ background: d.color }} aria-hidden="true">
                  {d.icon}
                </span>
                <span className="icon-label">
                  {d.title.replace(/\.[^.]+$/, '')}
                  <wbr />
                  {d.title.match(/\.[^.]+$/)?.[0]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {wins.map((w) => {
        const def = getApp(w.app)!;
        return (
          <Window
            key={w.app}
            win={w}
            def={def}
            active={w.app === activeApp}
            onFocus={() => focus(w.app)}
            onClose={() => close(w.app)}
            onMinimize={() => patch(w.app, { min: true })}
            onToggleMax={() => patch(w.app, { max: !w.max })}
            onMove={(x, y) => patch(w.app, { x, y })}
          >
            {def.render(os)}
          </Window>
        );
      })}

      <Pet species={species} />
      <Taskbar os={os} wins={wins} activeApp={activeApp} onTaskClick={onTaskClick} theme={theme} toggleTheme={toggleTheme} />
      <Confetti />
    </div>
  );
}
