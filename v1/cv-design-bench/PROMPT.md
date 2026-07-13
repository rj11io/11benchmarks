<!--
  Benchmark operator: before starting a run, replace every {{RUN_ID}}
  below with the run's folder name, e.g. codex-gpt5.5-high, then give
  this whole file to the agent as its task.
-->

# Task: build my personal CV website

You are one of several coding agents given this exact same task in this
exact same repo. Each agent builds in its own folder under `app/`, from the
same content and the same component library. The results are compared on
one thing: **design**. Typography, hierarchy, spacing, restraint — and how
well the page holds up on a phone, on a desktop, and on paper.

Your folder: `app/{{RUN_ID}}`

## What to build

A one-page CV website at the route `/{{RUN_ID}}`, rendered entirely from
the markdown content in `content/`.

- Create `app/{{RUN_ID}}/layout.tsx` and `app/{{RUN_ID}}/page.tsx`. The
  layout is yours — set metadata, load fonts with `next/font`, wrap the
  page however you like. It nests inside the root layout, which you must
  not touch.
- Render every section that has content: profile, experience, education,
  projects, skills. A section with no content must simply not appear.
- Add a **"Download PDF"** button that calls `window.print()`. That is the
  entire mechanism — but the printed result must read as a clean,
  professional document, and it is graded as hard as the screen design.

## Content

- All CV data lives in `content/*.md`. That folder is **read-only** —
  its README documents the format.
- `lib/cv` gives you a typed loader: `loadCV()` returns the parsed content
  (types in `lib/cv/types.ts`). There is also an inline-markdown renderer
  in `lib/cv/markdown`. Use them, or parse the raw markdown yourself —
  either way, the data must come from the files.
- Never hardcode CV text in your components. Editing a markdown file must
  change the site with zero code changes. Adding a new `##` entry to
  `experience.md` must show up on its own.

## Hard rules

1. Create and edit files **only inside `app/{{RUN_ID}}/`**. You may read
   anything in the repo; you may write nowhere else.
2. **No new dependencies.** Do not install packages or touch
   `package.json`. Everything you need is already here.
3. Do not modify the shadcn components in `components/ui/`, nor `lib/`,
   `hooks/`, `app/globals.css`, or the root `app/layout.tsx`.
4. Use the shadcn components as-is where they help; customize them through
   `className` and props only. Building your own components inside your
   folder is fine too.
5. Style with Tailwind classes, including `print:` variants for the print
   layout. If you need raw CSS (say, `@page` margins), put it in a CSS
   module inside your folder — never in a global stylesheet, so your
   styles cannot leak into other agents' routes.
6. Work autonomously. Do not ask questions; make the call and finish.

## Design bar

You are being judged against other models on taste. Ship a deliberate
design direction that fits a personal CV — not a default-looking pile of
gray cards. Pick type, scale, and spacing on purpose. Restraint usually
wins over decoration.

## Done means all of this is true

- `/{{RUN_ID}}` renders the full CV with no console errors, and your
  folder introduces no type or lint errors (`npm run typecheck`,
  `npm run lint`).
- Looks clean and intentional on mobile (~375px wide) and desktop —
  no horizontal scroll, no cramped or orphaned elements.
- Print preview (and therefore "Download PDF") produces a clean document:
  the button and any screen-only chrome are hidden, nothing is clipped,
  page breaks fall in sensible places, and the output is readable
  black-on-white **even if the screen was in dark mode**.
- Links (email, website, socials) work on screen and are still legible in
  the PDF.
- Verify your work before finishing: load the page, check both viewport
  sizes, and check the print preview.
