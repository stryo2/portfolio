// The projects shown on the desktop, in the Projects folder and in Recruiter mode.

export type Project = {
  id: string;
  /** Desktop icon label, like a file name. */
  file: string;
  name: string;
  tagline: string;
  icon: string;
  color: string;
  stack: string[];
  bullets: string[];
  repo: string;
  live?: string;
  /** Something to look at inside the window. */
  media?: { kind: 'gif'; src: string; alt: string } | { kind: 'play'; src: string };
  /** Shown on the desktop and in Recruiter mode; the rest live in the Projects folder. */
  featured: boolean;
  /** What the pet says when this window opens. */
  petLine: string;
};

export const projects: Project[] = [
  {
    id: 'devpulse',
    file: 'DevPulse.app',
    name: 'DevPulse',
    tagline: 'Developer analytics across GitHub, LeetCode and Codeforces, in one dashboard.',
    icon: '📈',
    color: '#bfe6ff',
    stack: ['Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Redis', 'BullMQ', 'JWT', 'OAuth', 'Docker', 'React'],
    bullets: [
      'Architected a backend that integrates GitHub, LeetCode and Codeforces through dedicated adapters and normalizers, persisting heterogeneous activity data in PostgreSQL.',
      'Decoupled third-party API syncing from HTTP requests with BullMQ + Redis background jobs: exponential retry and backoff, three-attempt failure handling and per-user job deduplication.',
      'Made syncs idempotent with platform-specific activity models, stable source keys and PostgreSQL uniqueness constraints, so repeated syncs never duplicate history.',
      'GitHub OAuth and JWT auth with bcrypt, AES-256 encrypted token storage, signed OAuth state and Zod request validation.',
      'Containerized local infrastructure with Docker; CI enforces linting, builds and Prisma schema validation.',
    ],
    repo: 'https://github.com/stryo2/devPulse',
    live: 'https://dev-pulse-lake.vercel.app',
    featured: true,
    petLine: 'ooh, graphs! 📈',
  },
  {
    id: 'findash',
    file: 'FinDash.app',
    name: 'FinDash',
    tagline: 'A finance dashboard backend with role-based access control.',
    icon: '💰',
    color: '#c9f2c7',
    stack: ['Node.js', 'Express', 'PostgreSQL', 'JWT', 'RBAC'],
    bullets: [
      'RESTful backend for financial records in PostgreSQL with search, filtering, pagination and soft deletion.',
      'JWT authentication and role-based access control across Viewer, Analyst and Admin roles, including protected admin user management.',
      'Request validation, structured error handling and API rate limiting.',
      'SQL-backed analytics: summary metrics, category breakdowns, monthly trends and recent activity.',
    ],
    repo: 'https://github.com/stryo2/finance-dashboard',
    featured: true,
    petLine: 'can i have some coins? 🪙',
  },
  {
    id: 'laststop',
    file: 'TheLastStop.exe',
    name: 'The Last Stop',
    tagline: 'A murder mystery where every suspect is an LLM that knows only its own truths, secrets and lies.',
    icon: '🔎',
    color: '#e3d4ff',
    stack: ['TypeScript', 'React', 'Vite', 'Express', 'LLMs'],
    bullets: [
      'Each suspect is an LLM-driven character that knows only its own truths, secrets and lies, so you solve the case by questioning them.',
      'Express + TypeScript engine with a prompt builder, a consistency checker and shared world state; a Vite + React client; types shared across both.',
      'The case itself is written and versioned like a spec, with change lists that close solvability holes in the evidence.',
    ],
    repo: 'https://github.com/stryo2/AI-murder-mystery',
    live: 'https://ai-murder-mystery-eosin.vercel.app',
    featured: true,
    petLine: "it wasn't me. 🙀",
  },
  {
    id: 'desktoppet',
    file: 'DesktopPet.exe',
    name: 'Desktop Pet',
    tagline: 'A tiny pixel roommate that lives on your Windows taskbar. Yes, the one walking down there.',
    icon: '🐱',
    color: '#ffd9b3',
    stack: ['Electron', 'TypeScript', 'Canvas'],
    bullets: [
      'A cat or a raccoon that walks, naps, grooms and has moods and stats saved between runs.',
      'Reacts to your day: stretch and water reminders, bedtime nudges, and a confetti party for every git commit and push.',
      'Sprites are text-art JSON drawn on a plain canvas, with no framework and no bundler. This website reuses the exact same sprite files.',
      'Shipped as a Windows installer with settings and start-with-Windows.',
    ],
    repo: 'https://github.com/stryo2/desktop-pet',
    media: { kind: 'gif', src: '/pet-cat.gif', alt: 'The cat walking, grooming, celebrating a commit and napping' },
    featured: true,
    petLine: "hey, that's me! 💖",
  },
  {
    id: 'hexpush',
    file: 'HexPush.exe',
    name: 'HexPush',
    tagline: 'A fast 1v1 browser brawler: push your opponent off a shrinking hex arena.',
    icon: '⬢',
    color: '#ffc8d6',
    stack: ['JavaScript', 'HTML5 Canvas', 'CSS'],
    bullets: [
      'Built in vanilla JavaScript and HTML5 Canvas with no frameworks or build tools.',
      'An AI opponent with four difficulty levels and real-time combat (push, guard, dash, stagger) on a shrinking arena with collapsing tiles.',
      'Playable on desktop and mobile with a virtual joystick, an interactive tutorial and configurable themes, arena size and match speed.',
    ],
    repo: 'https://github.com/stryo2/HexPush',
    live: 'https://hexpush.netlify.app',
    media: { kind: 'play', src: 'https://hexpush.netlify.app' },
    featured: true,
    petLine: "i'll hide till it's over…",
  },
  {
    id: 'ridnet',
    file: 'RIDNet.ipynb',
    name: 'RIDNet image denoising',
    tagline: 'A deep-learning model that removes noise from images while keeping the detail.',
    icon: '🖼️',
    color: '#fff3b0',
    stack: ['Python', 'TensorFlow', 'Deep learning'],
    bullets: [
      'Implemented the RIDNet architecture with Enhanced Attention Modules to capture multi-scale features.',
      'Trained on paired clean/noisy images with the Adam optimizer and MSE loss.',
      'Reached 19.96 dB PSNR on the final model.',
    ],
    repo: 'https://github.com/stryo2/imagedenoising',
    featured: false,
    petLine: 'so many pixels 👀',
  },
];

/** Older and smaller repos, shown in the "old stuff" corner of the Projects folder. */
export const oldStuff = [
  { name: 'BlogSite', note: 'A pastel journal app (Node, Express, EJS)', repo: 'https://github.com/stryo2/BlogSite' },
  { name: 'web_annotator', note: 'Chrome extension to annotate websites', repo: 'https://github.com/stryo2/web_annotator' },
  { name: 'angryBirds', note: 'A physics game in JavaScript', repo: 'https://github.com/stryo2/angryBirds' },
  { name: 'TodoList-App', note: 'My first app, in vanilla JS', repo: 'https://github.com/stryo2/TodoList-App' },
];
