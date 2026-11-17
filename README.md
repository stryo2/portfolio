# PranshiOS: a portfolio

My portfolio is a tiny pastel desktop OS. Projects open as app windows, and my [desktop-pet](https://github.com/stryo2/desktop-pet) cat (or raccoon) walks along the taskbar and reacts to whatever you open. If you'd rather skip the fun, **Recruiter mode** (`/#recruiter`) shows everything on one plain page.

## Run it

```bash
npm install
npm run dev
```

## Edit the content

All the content lives in two files, so components never need editing:

- `src/data/profile.ts`: name, links, about text, experience, achievements and skills.
- `src/data/projects.ts`: projects, their bullets, links, what the pet says, and the `old_stuff/` list.

To show a **Download PDF** button, put your resume at `public/resume.pdf`. The button appears on its own once that file exists.

## How it's built

- **Stack:** Vite, React and TypeScript, with no UI libraries.
- `src/pet/`: the pet. `sprites.ts` reads the same `pet.json` text-art format as desktop-pet, and `Pet.tsx` runs its brain and draws it on a canvas. `bus.ts` lets any window make the pet react.
- `src/os/`: the window manager. It includes `Window.tsx` (drag, focus, minimize and maximize), `Taskbar.tsx` (start menu, tasks, tray and clock) and `registry.tsx`, which lists every app.
- `src/apps/`: the window contents (about, projects, resume.txt, contact and terminal).
- `src/RecruiterView.tsx`: the plain one-page view.

**On phones,** windows open full-screen and the icons become a home-screen grid.
