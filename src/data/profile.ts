// Everything personal on the site lives here. Facts come from job-hunt-pipeline/resume/master.yaml.
// Edit this file (and projects.ts) to update the site; no component holds content of its own.

export const profile = {
  name: 'Pranshi Singh',
  handle: 'stryo2',
  headline: 'Backend engineer · Node.js, PostgreSQL, Redis',
  education: {
    school: 'Indian Institute of Technology, Roorkee',
    degree: 'B.S. & M.S. (Dual Degree) in Mathematics and Computing',
    years: '2022 – 2027',
  },
  location: 'Roorkee, India · open to Bengaluru or remote',
  lookingFor: 'Backend / software engineering roles starting 2027',
  email: 'preu2727@gmail.com',
  github: 'https://github.com/stryo2',
  linkedin: 'https://www.linkedin.com/in/pranshi-singh-iitr/',
  about: [
    "I'm a final-year dual-degree student in Mathematics and Computing at IIT Roorkee, focused on backend engineering.",
    'I like building systems that stay correct when things go wrong. In DevPulse I moved all third-party syncing into BullMQ + Redis background jobs with retries, backoff and per-user deduplication, and made syncs idempotent with stable source keys and PostgreSQL uniqueness constraints.',
    'I also build things that are just fun: a pixel cat that lives on my taskbar (it is walking around down there right now), a murder mystery where every suspect is an LLM, and a hex arena brawler.',
    "Outside code, I've led editorial at WatchOut!, IIT Roorkee's media body, and coordinated recruitment for 2,000+ students at the Placement & Internship Cell.",
  ],
  skills: {
    Languages: ['C++', 'JavaScript', 'TypeScript', 'Python', 'SQL'],
    Backend: ['Node.js', 'Express.js', 'REST APIs', 'JWT', 'OAuth', 'Redis', 'BullMQ', 'Zod'],
    Databases: ['PostgreSQL', 'Prisma ORM', 'Relational design'],
    Tools: ['Docker', 'Git', 'GitHub Actions', 'Linux'],
    Other: ['React', 'HTML5 Canvas', 'Electron', 'TensorFlow'],
  } as Record<string, string[]>,
  experience: [
    {
      org: 'Placement & Internship Cell, IIT Roorkee',
      role: 'Coordinator',
      dates: 'May 2024 – Jan 2025',
      note: 'Promoted from Associate Coordinator (Jul 2023 – Jul 2024)',
      bullets: [
        'Coordinated end-to-end recruitment workflows for 2,000+ students, working across recruiters, students and institute stakeholders to support 500+ successful placements.',
      ],
    },
    {
      org: 'WatchOut!, IIT Roorkee',
      role: 'Joint Secretary, News & Editor',
      dates: 'May 2024 – Apr 2025',
      note: 'Editor since Mar 2023',
      bullets: [
        "Led editorial and content strategy for IIT Roorkee's official media body, coordinating writers and designers to cover campus events and interviews.",
        'Managed the publication workflow for 50+ articles, from story selection and editing to final publication.',
      ],
    },
  ],
  achievements: [
    'Selected for the Salesforce Futureforce Tech Accelerator Program (top 100 nationally).',
    'Codeforces Pupil, max rating 1301.',
    'Global rank 1840 in Codeforces Round 948 (Div. 2).',
  ],
  coursework: ['Data Structures & Algorithms', 'DBMS', 'OOP', 'Operating Systems', 'Probability', 'Linear Algebra'],
};
