# Content model

This is the single source of truth for everything the CV shows. The website
renders from `content.ts`, which is a typed, structured copy of what is written
here — same facts, same wording. If the two ever disagree, this file wins and
`content.ts` should be corrected.

Two source PDFs were given:

- **`RJ_CV.pdf`** — the short, two-page version ("minified"). It already made
  hard cuts to fit two pages.
- **`RJ_CV_max.pdf`** — the long, six-page version ("the full story"). More
  detail, more roles fully written out, a more personal tone.

How to read the tags below:

- **[FACT]** — stated directly in one or both PDFs. Preserved as-is (names,
  employers, dates, links, claims).
- **[MERGE]** — the two PDFs said the same thing slightly differently; I picked
  or combined wording without changing meaning.
- **[EDIT]** — I rewrote for clarity, impact, or length. No new facts.
- **[CUT]** — present in a source but dropped to fit two pages. Recorded here so
  nothing is lost silently.
- **[?]** — an uncertainty or mild tension in the sources. Flagged, not hidden.

I invented **no** metrics, dates, employers, credentials, or links.

---

## Identity and contact

- Name: **Ricardo Jorge** [FACT]. Goes by **RJ** [FACT, max only].
- Title: **AI Product Engineer** [FACT, both].
- Location: **Lisbon, Portugal** [FACT, both].
- Email: **ricardojorgexyz@gmail.com** [FACT, both]. *(This is the address
  printed on the CV. It is intentionally the candidate's own address and is not
  changed.)*
- Web: **rj11.io** [FACT] · GitHub **github.com/rj11io** [FACT] · LinkedIn
  **linkedin.com/in/rj11io** [FACT].
- The PDFs are hosted at **cv.rj11.io**; the short one points to
  `cv.rj11.io/v1/max` for the full story [FACT]. This is site plumbing, not CV
  content, so it does not appear as a contact link. [CUT — rationale noted]

## Summary / About

The short PDF's summary is tight and professional. The long PDF's is a warm,
personal story (gaming, robotics, "self-guided missile"). For a two-page CV read
in seconds, I lead with the professional claim and keep one line of the personal
color; the rest of the story moves to a short "Beyond the résumé" block so it is
present but not competing with the career.

Final summary text [EDIT, faithful merge of both]:

> AI Product Engineer with a decade of professional TypeScript experience —
> building on React since 2016 and Next.js since 2018, an early bet on the stack
> that now runs both the web and AI products. On most teams I was the first
> frontend hire, owning architecture, tooling, the component library, and
> pipelines from day one, then growing the team around them: hiring, onboarding,
> and writing the playbooks that let new engineers ship quickly.
>
> Most of my work has been dashboards, product platforms, and proprietary data
> explorers for cybersecurity, crypto, and gaming companies — where I found a
> lasting focus on data-driven products and data visualisation. I have built
> with AI since the first releases of Copilot and ChatGPT, moving from prompt and
> context engineering to open-source agent skills and full agent harnesses, and
> today run an automated fleet of AI agents that maintains my own projects.

Source facts preserved: decade of professional TypeScript [FACT — candidate's
own claim, see uncertainty below]; React 2016, Next.js 2018 [FACT]; "first
frontend hire" ownership + team-building [FACT]; dashboards/data explorers for
cybersecurity/crypto/gaming [FACT]; AI since first Copilot/ChatGPT [FACT];
"automated fleet of AI agents that maintain my personal projects" [FACT, max].

- [?] **"A decade of professional TypeScript experience."** The short PDF says
  this outright. The long PDF says he went professional in **2015** and started
  on React in **2016**, TypeScript being the language of that stack. By 2026 that
  is ~10–11 years of professional frontend work, so "a decade" is fair as the
  candidate's own framing. I kept his wording; I did not upgrade or invent a
  precise figure.
- [MERGE] Long PDF lists AI tools as "Copilot, ChatGPT, and MidJourney"; short
  PDF says "Copilot and ChatGPT." I used the shorter pair (coding tools, on-topic
  for an engineer). MidJourney dropped. [CUT, minor]

## Beyond the résumé (personal color)

Kept as three short lines, condensed from the long PDF's opening story and the
short PDF's "Fun facts." All facts preserved:

- Started coding young for fun — modding and reverse-engineering games and
  consoles, and building a fighting game on the **MUGEN** engine. [FACT]
- Ran dedicated game servers (Counter-Strike, Minecraft, and others), and led
  teams, guilds, and clans to the top of online ladders and to LAN tournament
  wins — early, accidental management training. [MERGE of both PDFs]
- At 14, LEGO Mindstorms robotics in school → **2nd place nationally** and the
  **final four of the 2008 robotics world cup in China**. [FACT]

- [CUT] The long PDF's "self-guided missile" paragraph and "I default to product
  engineering, where I have the biggest impact" — good voice, but it repeats the
  summary's point. Dropped for space; the personality survives in the lines above.
- [CUT] "Have a nice day!" sign-off and "always open to exceptional
  opportunities / reach out" — moved to intent, not printed as body copy; the
  contact links already say "reach out."

## Skills

The long PDF has six skill groups; the short PDF folds them into four. I kept the
long PDF's fuller, clearer grouping because skills are the fastest keyword scan.
[MERGE — long PDF wins]

- **Core stack** — TypeScript · React · Next.js · AI SDK · Convex · Playwright ·
  Vercel [FACT]
- **AI engineering** — Agent automations · Custom agent skills · Harness
  engineering · Codex · Claude Code · n8n [FACT]
- **UI & design** — Tailwind CSS · shadcn/ui · Material UI · Design systems ·
  Storybook · Refactoring UI [FACT, max]
- **Data & visualisation** — Dashboards · d3 · Recharts · Nivo · Web scraping ·
  Data enrichment [FACT, max]
- **Leadership & delivery** — Team & project management · End-to-end product
  engineering · Product design · Agile [FACT]
- **Foundations** — JavaScript · Node.js · HTML5 · CSS · Git · GitHub Actions ·
  REST APIs · CI/CD · Testing [FACT, max]

## Projects

All five from the long PDF, kept. The short PDF only had the first three. [FACT]

| Name | Link | Dates | What it is |
| --- | --- | --- | --- |
| **11io** | rj11.io | 2025–Present | Personal brand for B2B freelancing |
| **11ai** | ai.rj11.io | 2026–Present | Open-source AI skills, plugins, and workflows |
| **11bench** | bench.rj11.io | 2026–Present | Open-source AI benchmarks |
| **Modern GitHub** | github.com/rj11io | 2023–Present | Current open-source AI projects |
| **Legacy GitHub** | github.com/ricardojrmcom | 2020–2023 | Earlier open-source work (2020–2023) |

- [?] The short PDF writes "Open source AI skills and plugins" for 11ai; the long
  PDF adds "and workflows." Used the long PDF's fuller wording.

## Experience

Dates and employers are taken from the **long PDF**, which gives exact months;
the short PDF's looser year ranges (e.g. "2018–2019") are consistent with them.
Where the long PDF over-lists, I trimmed to the strongest 3–4 bullets per role.
The oldest roles are compressed into one "Earlier" block, exactly as the short
PDF itself chose to do.

### 1. AI Product Engineer — rj11io · rj11.io · B2B · Remote · Mar 2025–Present [FACT]
Hands-on AI product engineering for several early-stage startups, building from
the ground up. [EDIT — condensed the long PDF's 9-item list into representative
bullets; nothing invented:]
- AI data extraction from PDFs, AI SEO analytics, and a GenAI dermatopathology
  portal. [FACT]
- Cybersecurity dashboards and proprietary data explorers; AI chat / custom GPT
  experiences. [FACT]
- AI agent harnesses, skills, and automations, plus smart-scraping agents and
  n8n workflows. [FACT]
- [CUT] "Real Estate Platform" line — folded into "several startups" to save a
  bullet; still true, just not itemised.

### 2. Product / Datavis Engineer — Hunt Intelligence, Inc. · hunt.io · B2B · Remote · Apr 2024–Mar 2025 [FACT]
- Went deep on data visualisation for a threat-intelligence product, including
  custom components such as the **IP History Widget**. [FACT]
- Built core product modules **AttackCapture™** and **HuntSQL™** on a modern
  TypeScript codebase — Next.js, shadcn/ui, Playwright, CI/CD on GitHub Actions,
  Vercel staging/production, and release changelogs wired to Slack. [MERGE of
  short + long]
- Shipped a new API documentation platform on top of OpenAPI — friendlier and
  more intuitive than Swagger. [FACT]

### 3. Senior Frontend Engineer → Team Lead — OMEGA Systems · omegasys.eu · Remote · Jun 2023–Apr 2024 [FACT]
- Built the next generation of OMEGA's iGaming platform management system
  (**CORE5**) in TypeScript and React; **promoted to lead the frontend team**.
  [FACT]
- Data visualisation for the Main and Social dashboards, plus report and
  configuration views (Cashback, Refer-a-Friend, Pending Withdrawals,
  Challenges / Leaderboards). [FACT, max]
- As lead: built the new-developer onboarding experience and set standards for
  tickets, documentation, and remote / async work. [MERGE]
- [CUT] Localisation module + internal "Tab System" UI; weekly "TED" talks.
  Good detail, dropped for space (kept the leadership headline instead).

### 4. Senior Frontend Engineer — Phantasma Chain · phantasma.info · Remote · Jan 2022–May 2023 [FACT]
- Built the frontend monorepo for all new tools and apps, the **Phantasma UI**
  Storybook, and the **Phantasma Explorer**. [FACT]
- Testing with Playwright, CI on GitHub Actions, CD on Vercel; contributed
  improvements to the Phantasma TypeScript SDK. [FACT]
- Built in-house tools: a custom React hook for the Phantasma SDK, localisation,
  white-label theming, and environment configs. [FACT, max]

### 5. Frontend Lead — BinaryEdge · Coalition, Inc. · coalitioninc.com · Remote · Feb 2020–Oct 2021 [FACT]
- Started as the solo frontend engineer and grew a team for customer-facing
  security apps and internal tools; introduced React, TypeScript, Next.js, and
  micro-frontends. [MERGE]
- Tech Lead for **Coalition Explorer** (and Explorer 2.0), the shared component
  library / Storybook, and the product's data visualisations. [FACT]
- Built **Attack Surface Monitoring** on the BinaryEdge Portal, later integrated
  into Coalition Explorer and Coalition Control. [FACT]
- Migrated the frontend CI/CD from Drone to GitHub Actions, improving pipelines,
  environments, and developer experience. [FACT, max]
- [CUT] Claims management / report generation / Executive Risks platforms; RSA &
  Security Week marketing pages.

### 6. Earlier — one compressed block [FACT, matches the short PDF's own choice]
> **Earlier:** Fullstack Engineer & co-founder at **Glaiveware** (bespoke web
> apps, 2018–2019); React Native end-to-end-encrypted chat app at **Sycret.ink**
> (2017); full-stack dashboard for the **American Heart Association** (2016);
> analytics dashboards at **NextBitt** (2015–2016); Java back-office system as an
> intern at **Science4you** (2015).

- [CUT] The long PDF's full paragraphs for these five roles (tech stacks, AWS
  services, databases, the AHA Kinect story, the Science4you internship detail).
  All real; compressed to a single line to protect the two-page limit and keep
  the recent, relevant roles prominent.
- [?] Small, normal gaps between some roles (e.g. Oct 2021 → Jan 2022; Dec 2019 →
  Feb 2020). The sources don't explain them; I did not invent filler. They read
  as ordinary transitions and need no comment on the CV.

## Education

- **IT Systems Management and Programming** — Escola Profissional de Tecnologia
  Digital, Lisbon, Portugal · 2013–2016. Portuguese title: *Técnico de Gestão e
  Programação de Sistemas Informáticos.* [FACT]
- [?] Education runs 2013–2016 while the first job (Science4you) starts Jan 2015.
  This overlap is expected — a Portuguese vocational program with a work
  placement — and both sources state it, so it stands as written.

---

## What earns space on two pages (priority order)

1. Masthead (name, title, contact) + a two-part professional summary — the
   6-second target.
2. Skills — fast keyword scan, kept full.
3. Experience — five roles with bullets, newest first, oldest compressed.
4. Projects — five, showing open-source and AI focus.
5. Education — one line.
6. Beyond the résumé — three lines of personality, deliberately last.

Everything under [CUT] is real and available in the long PDF; it was removed for
length, not because it is wrong. If a third page were allowed, the OMEGA
localisation work, the Coalition platform breadth, and the full early-career
detail are the first things I would restore.
