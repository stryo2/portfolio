// Every app the desktop can open, keyed by id. Project windows use "project:<id>".
import { projects } from '../data/projects';
import { AboutApp } from '../apps/AboutApp';
import { ContactApp } from '../apps/ContactApp';
import { ProjectApp } from '../apps/ProjectApp';
import { ProjectsApp } from '../apps/ProjectsApp';
import { ResumeApp } from '../apps/ResumeApp';
import { TerminalApp } from '../apps/TerminalApp';
import type { AppDef } from './types';

const BASE: Record<string, AppDef> = {
  about: {
    title: 'about.txt',
    icon: '📝',
    color: '#fff4e6',
    w: 560,
    h: 560,
    petLine: "that's my human! 💖",
    render: (os) => <AboutApp os={os} />,
  },
  projects: {
    title: 'Projects',
    icon: '📁',
    color: '#ffe08a',
    w: 680,
    h: 560,
    petLine: 'so much stuff! 📦',
    render: (os) => <ProjectsApp os={os} />,
  },
  resume: {
    title: 'resume.txt',
    icon: '📄',
    color: '#ffffff',
    w: 640,
    h: 600,
    petLine: 'hire her! 🙏',
    render: (os) => <ResumeApp os={os} />,
  },
  contact: {
    title: 'contact.me',
    icon: '💌',
    color: '#ffd1dc',
    w: 520,
    h: 340,
    petLine: 'say hi! 👋',
    render: () => <ContactApp />,
  },
  terminal: {
    title: 'terminal',
    icon: '⌨️',
    color: '#d6d0e0',
    w: 600,
    h: 380,
    petLine: 'type "help"! 🤓',
    render: (os) => <TerminalApp os={os} />,
  },
};

export function getApp(id: string): AppDef | undefined {
  if (BASE[id]) return BASE[id];
  if (!id.startsWith('project:')) return undefined;
  const p = projects.find((q) => q.id === id.slice('project:'.length));
  if (!p) return undefined;
  return {
    title: p.file,
    icon: p.icon,
    color: p.color,
    w: 640,
    h: p.media ? 640 : 540,
    petLine: p.petLine,
    render: () => <ProjectApp p={p} />,
  };
}

/** What sits on the desktop, top to bottom. */
export const DESKTOP_ICONS: string[] = [
  'about',
  'projects',
  ...projects.filter((p) => p.featured).map((p) => `project:${p.id}`),
  'resume',
  'contact',
  'terminal',
];
