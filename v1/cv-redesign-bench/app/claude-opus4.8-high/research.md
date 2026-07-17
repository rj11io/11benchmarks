# Research

This file records what I read before deciding how to structure, write, and
design the CV, and which decisions each finding changed. All sources were read
on **2026-07-17**. Where a claim is a well-known industry figure I say so; I did
not fabricate any source or number.

A note on terms used throughout:

- **ATS** — "Applicant Tracking System." Software that reads a resume file and
  pulls out text (name, jobs, dates, skills) before any person looks at it.
  Many large employers filter with it first.
- **Recruiter scan** — the first, very fast human read of a resume, usually a
  few seconds, that decides "look closer" or "pass."
- **Eyebrow / kicker** — a small label above a heading (here: SUMMARY, SKILLS).
- **A4** — the standard paper size outside the US: 210 mm × 297 mm.

---

## 1. How recruiters actually read a resume

**Finding.** The widely cited figure is that a recruiter's first pass takes
roughly **6–7 seconds**. A 2025 review study put the average nearer ~11 seconds
when the reader already has role context, but the short "fit / no-fit" gate
still governs the first look. The classic TheLadders eye-tracking study found
about **80% of that first look lands on six things**: name, current title and
company, previous title and company, the dates on those two roles, and
education. Readers move down the left edge in an F-shaped path and mostly skim
the rest.

**Sources.**
- WriteCV, *How Recruiters Scan Resumes in 6 Seconds* — https://writecv.ai/blog/how-recruiters-scan-resumes
- InterviewPal, *How Long Recruiters Actually Spend Reading Your Resume (Data Study)* — https://www.interviewpal.com/blog/how-long-recruiters-actually-spend-reading-your-resume-data-study
- Leon Consulting, *The 6-Second Scan: 3 Things They Check First* — https://leonstaff.com/blogs/recruiter-resume-6-second-scan/
- College Recruiter, *The 6-Second Scan (2026)* — https://www.collegerecruiter.com/blog/2026/03/06/the-6-second-scan-how-to-pass-the-2026-resume-filter

**Decisions this changed.**
- Put the six high-value items where the eye lands first. The masthead states
  the name and the target title ("AI Product Engineer") plainly; the newest role,
  company, and dates sit at the very top of the experience list.
- Every job row leads with **title + company on the left, dates on the right**,
  so a skim down the left edge reads as a career story.
- Keep the strongest, most recent material on **page 1**. Older roles compress
  onto page 2.

## 2. Headline and quantified impact

**Finding.** A plain, literal title beats a clever one: if the reader wants a
"Senior/AI engineer" and the page says exactly that, it is an instant match; a
vague "experienced professional" makes them guess, and guessing costs the few
seconds you have. Separately, ResumeWorded's 2025 write-up reports resumes with
**quantified results** were ~48% more likely to land in the top third with
automated screeners.

**Sources.**
- Resumatic, *How to create a software engineer resume in 2025* — https://www.resumatic.ai/articles/software-engineer-resume-in-2025
- FreeResumeScan, *Survive the 6-Second Scan* — https://freeresumescan.com/how-to-write-a-resume-that-survives-the-6-second-scan/

**Decisions this changed.**
- The title under the name is literally "AI Product Engineer" — the same words
  used across both source PDFs.
- I sharpened bullets toward outcomes and named systems (AttackCapture™,
  HuntSQL™, Coalition Explorer, CORE5) instead of generic duties. I did **not**
  invent numeric metrics; the source PDFs contain almost none, and inventing
  them would break the task's honesty rule. Where impact exists it is stated in
  concrete nouns (what was built, for whom) rather than fake percentages.

## 3. One column vs. two columns, and ATS parsing

**Finding.** The "two columns always fail ATS" rule is mostly outdated, but the
underlying caution is real. Modern trackers use language models and parse many
layouts, yet several 2025–2026 tests still show text-box / table-based columns
getting read **across** both columns, scrambling order. The safe pattern:
one clear reading order, essential content in the main flow, and no reliance on
tables or text boxes for structure.

**Sources.**
- Jobscan, *Why ATS Tables and Columns Break Your Resume Parsing* — https://www.jobscan.co/blog/resume-tables-columns-ats/
- Careerflow, *One Column vs Two Column Resume Guide (2026)* — https://www.careerflow.ai/blog/one-column-vs-two-column-resume
- Resumemate, *Are Two-Column Resumes ATS Friendly? 2026 Test & Fixes* — https://www.resumemate.io/blog/two-column-resumes-ats-tests-workarounds-and-examples/

**Decisions this changed.**
- The deliverable is a **web page plus its print output**, not a Word file fed
  to a tracker, so I get the human-review benefits of a sidebar. But I still
  built it to degrade gracefully: the DOM order is header → summary → experience
  → skills → projects → education, i.e. the main career story comes first in the
  source order even though a sidebar sits beside it visually. Selectable, real
  text (no images of text), so any copy-paste or parser gets a sensible order.
- On mobile the two columns **collapse into one**, matching the finding that
  narrow screens break side-by-side layouts.

## 4. Mobile reading

**Finding.** A rising share of first reviews happen on phones (~36% in the cited
data), where scans are even shorter and side-by-side layouts shrink or break.
Only the top slice of the page shows before scrolling.

**Source.** WriteCV (as above).

**Decision this changed.** The site is built mobile-first: at ~375 px it is a
single fluid column, the masthead and the strongest summary line sit at the top,
type stays at a comfortable reading size, and there is no horizontal scrolling.

## 5. Editorial and typographic direction

**Finding.** Current editorial design leans on **one strong type family with a
clear size/weight hierarchy, generous whitespace, and a confident headline**,
rather than many fonts or heavy color. Elegant serifs optimized for screens are
back for headings; a neutral sans carries body text well. Consistency (repeating
the same heading, sub-head, and body rules) is what makes a layout read as
intentional.

**Sources.**
- Creative Boom, *8 typefaces that will elevate your editorial designs* — https://www.creativeboom.com/resources/8-remarkable-typefaces-that-will-instantly-elevate-your-editorial-designs/
- Pangram Pangram Foundry, *How to create a typographic hierarchy* — https://pangrampangram.com/blogs/journal/typographic-hierarchy
- TypeType, *Best Font for a Resume in 2025* — https://typetype.org/blog/best-font-for-a-resume-in-2025-what-do-designers-recommend/
- LYH Studio, *10 Best Fonts for Modern Editorial Design (2025)* — https://www.lyhstudio.com/tutorials/10bestfontstouse2025

**Decisions this changed.**
- I kept the source's smart instinct — a **serif display + monospace labels**
  pairing — and made it more deliberate. A high-contrast variable serif
  (**Fraunces**) carries the name, role titles, and project names; **Inter**
  carries body text; **Geist Mono** carries the small labels, dates, and links.
  Three roles, each used consistently, is the "one system" the sources argue for.
- Mostly monochrome ink on warm paper, with a **single restrained accent** used
  only for links and the small section markers. This keeps the page calm and
  keeps color off the critical path for print and accessibility.

## 6. Accessibility, links, and PDF

**Finding.** WCAG 2 (the web accessibility standard) asks for a text/background
contrast of at least **4.5:1** for normal text and 3:1 for large text. Links
should have descriptive, real text (not bare URLs or "click here"), and if color
is the only thing marking a link it needs a 3:1 contrast against surrounding
text plus a non-color cue such as an underline. For PDFs, "Print to PDF" can
strip the structure tags that assistive tech relies on; a proper export keeps
headings, lists, and links tagged.

**Sources.**
- WebAIM, *Contrast and Color Accessibility* — https://webaim.org/articles/contrast/
- WebAIM, *Contrast Checker* — https://webaim.org/resources/contrastchecker/
- DEV / Dawid Ryczko, *WCAG — Links and accessible text* — https://dev.to/dawid_ryczko/wcag-links-and-accessible-text-5bmn
- Harvard University IT, *Creating Accessible PDFs* — https://accessibility.huit.harvard.edu/pdf

**Decisions this changed.**
- Body ink on paper clears 4.5:1 in both light and dark screen themes; print is
  forced to near-black on white regardless of the screen theme.
- Links carry real labels (the actual domain, e.g. `rj11.io`) and stay
  underlined in print so a paper reader can still read the address.
- Real semantic HTML: one `<h1>`, section `<h2>`s, `<ul>`/`<li>` for bullets,
  `<a>` for links, a `<time>`-style date treatment — so screen readers and any
  PDF export get a real outline.
- The "Download PDF" button triggers the browser's own print/save dialog. I note
  in `design.md` that the crispest tagged PDF comes from the browser's
  "Save as PDF," which preserves the live text and links rather than an image.

## 7. Print as exactly two A4 pages

**Finding (technical, from CSS practice rather than a single article).** Reliable
print sizing uses `@page { size: A4; margin: 0 }` plus fixed-size page containers
in millimetres and explicit page breaks (`break-before: page`), rather than
hoping content flows into two pages by luck. Forcing colors for print
(`print-color-adjust`) and hiding screen-only controls (`@media print`) is
standard.

**Decision this changed.** I model the CV as **two fixed A4 "sheets."** Each
sheet is a real element sized to A4; a page break sits between them; screen-only
chrome is hidden in print; and print colors are pinned to black-on-white. This
gives deliberate, predictable two-page output instead of relying on content
length. Details and the fallback safety rules are in `design.md`.

---

## Limitations

- Web search here returns mostly secondary career-advice sites, not the original
  studies. I leaned on the most consistent, repeated findings (the 6-second
  scan, the six high-value items, the column caution, WCAG contrast) and treated
  single-site claims as directional, not gospel.
- Some cited figures (48% top-third, 36% mobile, 80% of gaze) originate from
  vendor studies; I use them to justify *direction*, not as guarantees.
