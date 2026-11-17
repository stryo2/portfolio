import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { profile } from '../data/profile';
import { projects } from '../data/projects';
import { petBus } from '../pet/bus';
import type { OsApi } from '../os/types';

type Line = { kind: 'in' | 'out'; text: string };

const PROMPT = `${profile.handle}@pranshi-os:~$`;
const HELP = [
  'commands:',
  '  whoami            who is this?',
  '  ls                list my projects',
  '  open <project>    open a project window (try: open devpulse)',
  '  skills            what I work with',
  '  contact           ways to reach me',
  '  resume            open resume.txt',
  '  recruiter         switch to the plain one-page view',
  '  pet               pet the pet',
  '  sudo hire-pranshi ✨',
  '  clear             clear the screen',
].join('\n');

export function TerminalApp({ os }: { os: OsApi }) {
  const [lines, setLines] = useState<Line[]>([
    { kind: 'out', text: `PranshiOS terminal. Type "help" to see what I can do.` },
  ]);
  const [input, setInput] = useState('');
  const history = useRef<string[]>([]);
  const histIdx = useRef(-1);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Braces matter: newer browsers return a Promise from scrollIntoView, and an effect may only return a cleanup.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [lines]);

  const run = (raw: string): string | null => {
    const [cmd = '', ...args] = raw.trim().split(/\s+/);
    const arg = args.join(' ').toLowerCase();
    switch (cmd.toLowerCase()) {
      case '':
        return '';
      case 'help':
      case '?':
        return HELP;
      case 'whoami':
        return `${profile.name}\n${profile.headline}\n${profile.education.degree}, IIT Roorkee ('27)`;
      case 'ls':
        return projects.map((p) => `${p.file.padEnd(18)} ${p.tagline}`).join('\n');
      case 'open':
      case 'cd': {
        const p = projects.find((q) => q.id === arg || q.name.toLowerCase().replace(/\s+/g, '') === arg.replace(/\s+/g, '') || q.file.toLowerCase() === arg);
        if (!p) return `open: no project named "${arg}". Try "ls".`;
        os.open(`project:${p.id}`);
        return `opening ${p.file}…`;
      }
      case 'skills':
        return Object.entries(profile.skills)
          .map(([k, v]) => `${k.padEnd(10)} ${v.join(', ')}`)
          .join('\n');
      case 'contact':
        os.open('contact');
        return `email     ${profile.email}\nlinkedin  ${profile.linkedin}\ngithub    ${profile.github}`;
      case 'resume':
        os.open('resume');
        return 'opening resume.txt…';
      case 'about':
        os.open('about');
        return 'opening about.txt…';
      case 'recruiter':
        os.setRecruiter(true);
        return 'switching to Recruiter mode…';
      case 'pet':
      case 'meow':
        petBus.emit({ type: 'say', line: 'purr~ 💖' });
        return '*purr*';
      case 'sudo':
        if (arg.startsWith('hire')) {
          petBus.emit({ type: 'celebrate', line: 'yay!! 🎉' });
          os.open('contact');
          return 'permission granted. ✨ opening contact…';
        }
        return `sudo: nice try.`;
      case 'rm':
        return 'rm: the cat sat on the keyboard and stopped you.';
      case 'date':
        return new Date().toString();
      case 'echo':
        return args.join(' ');
      case 'exit':
        os.close('terminal');
        return null;
      case 'clear':
        setLines([]);
        return null;
      default:
        return `${cmd}: command not found. Type "help".`;
    }
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const raw = input;
      setInput('');
      if (raw.trim()) history.current.unshift(raw);
      histIdx.current = -1;
      setLines((ls) => [...ls, { kind: 'in', text: raw }]);
      const out = run(raw);
      if (out) setLines((ls) => [...ls, { kind: 'out', text: out }]);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const h = history.current;
      histIdx.current = Math.max(-1, Math.min(h.length - 1, histIdx.current + (e.key === 'ArrowUp' ? 1 : -1)));
      setInput(histIdx.current === -1 ? '' : h[histIdx.current]);
    }
  };

  return (
    <div className="app terminal" onClick={() => inputRef.current?.focus()}>
      {lines.map((l, i) => (
        <pre key={i} className={l.kind}>
          {l.kind === 'in' ? (
            <>
              <span className="prompt">{PROMPT}</span> {l.text}
            </>
          ) : (
            l.text
          )}
        </pre>
      ))}
      <div className="term-input" ref={endRef}>
        <label className="prompt" htmlFor="term-in">
          {PROMPT}
        </label>
        <input
          id="term-in"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
