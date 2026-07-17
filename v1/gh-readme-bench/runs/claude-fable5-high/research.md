# research.md — what makes a GitHub profile README work

All sources accessed **2026-07-17**. Each entry lists what I read, what I
learned, and the concrete decision it changed in this run's README.

## 1. How the mechanism works

**Managing your profile README — GitHub Docs**
<https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme>

- The README shows on your profile when a public repository named exactly
  after your username contains a `README.md`. GitHub offers a starter
  template; to hide the README you make the repo private.
- **Decision:** write the README as if it lives at `rj11io/rj11io`, and use
  repo-relative asset paths (`assets/…`) so images resolve both in this
  benchmark folder and in a real profile repo without hardcoded raw URLs.

**github/markup README (sanitization pipeline)**
<https://github.com/github/markup/blob/master/README.md>

- GitHub sanitizes rendered HTML aggressively after markup conversion:
  `<script>`, `<style>`, inline `style=`, and `class`/`id` attributes are
  stripped. Only a whitelist of tags survives (links, images, `picture`,
  tables, `details`/`summary`, headings, `kbd`, `sub`/`sup`, etc.).
- **Decision:** no CSS-dependent layout at all. Structure comes from
  headings, one table, one code block, and a `<details>` block. The only
  HTML used is `<picture>`/`<img>` (banner) and `<details>`/`<summary>` —
  all on the survivor list.

**Include diagrams in your Markdown files with Mermaid — GitHub Blog (Feb 2022)**
<https://github.blog/developer-skills/github/include-diagrams-markdown-files-mermaid/>

- ` ```mermaid ` fences render as diagrams via a sandboxed iframe;
  requires JavaScript, falls back to raw code text without it, and the
  visual style is not controllable from the README.
- **Decision:** considered a Mermaid timeline for the career section,
  rejected it. A plain fenced `text` code block gives the same at-a-glance
  timeline, renders identically everywhere (including no-JS and API
  contexts), and fits the terminal aesthetic of a developer profile.

**Dark/light images — GitHub Blog + Changelog (2022-05-19)**
<https://github.blog/developer-skills/github/how-to-make-your-images-in-markdown-on-github-adjust-for-dark-mode-and-light-mode/>
<https://github.blog/changelog/2022-05-19-specify-theme-context-for-images-in-markdown-beta/>

- Two supported patterns: `<picture>` with
  `media="(prefers-color-scheme: dark)"` sources, or the `#gh-dark-mode-only`
  URL fragment. The `<picture>` pattern is the current documented one.
- **Decision:** the banner ships as two local SVGs (dark/light) selected by
  `<picture>`, with the light SVG plus real `alt` text as the `<img>`
  fallback so the page still opens with a name and role when images fail.

## 2. What strong profiles do (and how people scan them)

**awesome-github-profile-readme (abhisheknaiidu)**
<https://github.com/abhisheknaiidu/awesome-github-profile-readme>

- The community's own taxonomy: minimalistic, dynamic-realtime, badges,
  GIFs, retro, etc. Recurring patterns across featured profiles: stats
  automation, badge grids, and a "minimal + one dynamic element" tension —
  even sparse profiles usually keep a single signature visual.
- **Decision:** aim for the *minimalistic* lane with exactly one signature
  visual (the hand-made banner). Everything else is text that keeps working
  forever.

**orhun/orhun profile README (inspected raw)**
<https://raw.githubusercontent.com/orhun/orhun/master/README.md>

- A widely-admired real example: short greeting with personality, a
  projects table, theme-aware header images, collapsible/short sections,
  right-aligned signature. Personality and substance coexist; every section
  earns its scroll.
- **Decision:** adopted the shape — greeting with a human voice → projects
  table → career → contact — and the theme-aware header idea, but with
  static local assets instead of GIFs.

**"How to Create the Perfect GitHub Profile README" — DEV Community**
<https://dev.to/farhadrahimiklie/how-to-create-the-perfect-github-profile-readme-complete-guide-for-developers-jmf>
**"GitHub Profile README: What to Include in 2026" — devbio.me**
<https://devbio.me/blogs/github-profile-readme-guide>
**"GitHub Profile README: Standing Out in 2026" — codeboards.io**
<https://codeboards.io/blog/github-profile-readme-guide>

- Consistent guidance across current guides: a visitor should identify the
  person's specialty within ~5 seconds; the whole page should scan in under
  ~30 seconds; recruiters scan for outcomes, not tool lists; "nobody
  believes you're an expert in 47 technologies"; broken images and stale
  links are the most common credibility killer.
- **Decision:** role + specialty appear in the banner, the first text line,
  *and* the alt text. The toolbox is four short rows, not a badge wall. Each
  featured job in the timeline carries a concrete artifact name
  (AttackCapture™, CORE5, Phantasma Explorer, Attack Surface Monitoring)
  rather than adjectives.

## 3. Failure modes to avoid

**github-readme-stats — repo, issue #4431, and GitHub community discussions**
<https://github.com/anuraghazra/github-readme-stats>
<https://github.com/anuraghazra/github-readme-stats/issues/4431>
<https://github.com/orgs/community/discussions/190905>
<https://github.com/orgs/community/discussions/143996>

- The most popular dynamic-card service runs on a shared Vercel instance
  that is explicitly best-effort: per-IP rate limits (~100 req/h), exhausted
  GitHub API tokens, and periodic outages that leave broken "maximum retries
  exceeded" cards on thousands of profiles. The maintainers' own advice is
  to self-host or pre-render with an Action.
- **Decision:** zero third-party dynamic cards, stat widgets, streak
  counters, typing-SVG services, or view counters (view counters are also a
  tracking pixel by function). Every image is a static file in the repo.
  Nothing on the page can 404, rate-limit, or track a visitor.

**Common quality failures (synthesized from the guides + example survey)**

- *Badge walls*: 30 shields in a row communicate insecurity, not skill —
  replaced with a grouped plain-text toolbox.
- *Vanity metrics*: stars/followers/commit-streak cards say nothing a
  visitor can't see one click away, and this benchmark forbids invented
  activity anyway — omitted entirely.
- *Generic AI copy* ("passionate developer on a journey…") — the README
  reuses the subject's own distinctive phrasing from the extended CV
  ("self-guided missile", "management training in disguise") instead.
- *Excessive animation*: the banner's only motion is a one-shot line-draw
  inside the SVG, wrapped in `prefers-reduced-motion: no-preference` so it
  never plays for users who asked for reduced motion.
- *Color-only meaning*: the banner's accent gradient is decorative; no
  information is carried by color alone anywhere on the page.

## 4. Accessibility, narrow rendering, reliability, privacy, maintainability

Findings gathered across the sources above plus GitHub's writing docs
(<https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/quickstart-for-writing-on-github>):

- **Accessibility.** Real heading hierarchy (one implicit h2 level after the
  intro), meaningful link text (no "click here"), `alt` text on the banner,
  `role="img"` + `aria-label` inside the SVGs, reduced-motion guard on the
  animation, and no information encoded only in color or emoji.
- **Narrow/mobile rendering.** The profile column is narrower than a repo
  README, and phones are narrower still. Risks: wide tables (cells don't
  wrap well) and long code lines. Mitigation: the one table has short cells;
  timeline code-block lines are kept ≤ 72 characters so the block doesn't
  force horizontal scroll at typical mobile widths; the banner `<img>` has a
  fixed intrinsic width but GitHub caps images at `max-width: 100%`, so it
  scales down cleanly.
- **Load reliability.** All images are repo-local; the page degrades to
  pure text with a legible first line if images are blocked. No iframe/JS
  dependencies (Mermaid rejected for this reason).
- **Privacy.** No hit counters, no external image services (GitHub proxies
  external images through Camo, but a counter still logs every view by
  design) — local assets only.
- **Maintainability.** Nothing on the page goes stale on its own: no
  "currently working on X this week" claims, no dynamic stats to break, and
  dates are ranges the CV already commits to. The only future edit needed
  is appending to the timeline.
