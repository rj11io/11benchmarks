# Design

How the CV looks and why, and exactly how it prints to two A4 pages. Every
choice below traces back to a finding in `research.md` or a constraint in
`content.md`.

## The direction in one line

**A quiet editorial document** — one strong serif for the voice, a neutral sans
for reading, monospace for the small structural labels, generous whitespace, and
almost no color. It should feel like a well-set page in a design magazine, not a
template. This follows the editorial-typography finding (research §5): one type
system, clear hierarchy, whitespace doing the work.

## Type system

Three typefaces, each with one job, used consistently (research §5):

- **Fraunces** (variable serif, loaded in this route's `layout.tsx` via
  `next/font`) — the display voice: the name, section headings, role titles,
  project names. High-contrast and characterful; it carries the personality so
  the body can stay plain.
- **Inter** (already loaded app-wide) — body text and bullets. Neutral, highly
  legible, invisible in the good way.
- **Geist Mono** (already loaded app-wide) — the "machine" layer: eyebrow labels
  (SUMMARY, EXPERIENCE…), dates, contact links, project domains. Monospace makes
  metadata read as metadata and echoes the source PDFs' own instinct.

I did not add fonts to the root layout or touch `globals.css`; Fraunces is scoped
to this route only, exposed as `--font-display` on the page wrapper.

## Hierarchy (what the eye hits first)

Built around the 6-second scan and the six high-value items (research §1–2):

1. **Name** — largest element, Fraunces, top-left where the eye starts.
2. **Title "AI Product Engineer"** — directly beside/under the name, the literal
   words a recruiter matches on.
3. **Contact row** — one monospace line, immediately scannable.
4. **Role title + company** on the left of each job, **dates** hard-right, so a
   downward skim of the left edge reads as a career.
5. Section eyebrows in small-caps monospace act as quiet signposts, never
   shouting over the content.

Size/weight/color are the only hierarchy tools — no boxes, no icons, no bars.

## Grid and layout

- **Masthead** spans the full page width: name + title on the left, the site
  address `cv.rj11.io` top-right, then the contact links on a rule-separated row.
- Below it, a **two-track grid**: a narrow left rail (~34%) and a wide main
  column, with a comfortable gutter.
  - **Left rail** holds the scannable reference material: Skills (page 1),
    then Projects, Education, and "Beyond the résumé" (page 2).
  - **Main column** holds the narrative: Summary and the Experience timeline.
- The main career story is first in the DOM/source order (header → summary →
  experience → skills → projects → education), so any copy-paste, screen reader,
  or PDF export reads in a sensible order even though a rail sits beside it
  visually (research §3).

## Color and accessibility

- Warm near-white paper, near-black ink. One restrained accent
  (a muted indigo) used only for links and the tiny section markers — color is
  kept off the critical path (research §5–6).
- Body ink on paper exceeds the WCAG AA 4.5:1 contrast target in both light and
  dark screen themes; the muted-foreground gray used for meta stays above 4.5:1
  as well (research §6).
- Links have real, descriptive text (the actual domain), are underlined, and
  keep a visible focus ring — not color alone (research §6).
- Semantic HTML throughout: a single `<h1>`, `<h2>` per section, `<ul>/<li>` for
  bullets, real `<a>` elements. Section eyebrows are decorative and marked
  `aria-hidden` where they duplicate a visible `<h2>`.

## Responsive behavior

- **Mobile (~375 px):** one fluid column. The two-track grid collapses — the
  rail stacks after the summary; the A4 "sheet" framing drops to full-bleed
  content with reduced padding and type. No fixed millimetre widths, so there is
  never horizontal overflow. The name and summary lead, matching the mobile-scan
  finding (research §4).
- **Desktop (~1440 px):** the two pages render as two centered A4 "sheets" on a
  dark canvas, with a soft shadow — a true-to-print preview. The two-track grid
  is active.
- Between the two, a single breakpoint (~820 px) switches the grid on/off. Type
  scales with a couple of clamp()-based sizes so nothing is cramped at either end.

## Dark mode

The screen honors the app's light/dark toggle: in dark mode the canvas and the
sheets invert to dark paper / light ink for comfortable reading. **Print is
independent of the screen theme** — see below — so a dark-mode user still gets a
clean black-on-white PDF.

## The two-page print strategy (the core constraint)

Goal: **exactly two A4 pages, deliberate breaks, nothing clipped, no blank third
page, no screen-only controls.**

Approach — **model the document as two fixed A4 "sheets"** rather than hoping a
long column happens to fill two pages (research §7):

1. `@page { size: A4; margin: 0 }` — the browser lays out true A4 with no default
   margins; all whitespace is controlled inside the sheet via padding
   (~14–16 mm), so the safe print margin is deliberate, not the browser's.
2. Each of the two `.sheet` elements is sized in millimetres to one A4 page.
   The **content budget was set to fit each sheet** (see `content.md` priority
   list); this is why older roles are compressed and several details are cut.
3. A page break is forced **between** the sheets (`break-before: page` on the
   second sheet) and `break-inside: avoid` keeps a job block from splitting
   awkwardly. There is no break after the last sheet, so no empty page 3.
4. **Safety rails against a stray third page:** in print the sheet height is
   pinned to the A4 page box and `overflow: hidden` catches any sub-millimetre
   overflow from font rounding — but the layout is tuned so real content sits
   comfortably inside the printable area with margin to spare, so nothing
   meaningful is ever clipped. Verified in browser print preview.
5. **Print color is forced:** `print-color-adjust: exact`, background pinned to
   white, ink to near-black, links to black with underline and (optionally) the
   bare URL already visible — regardless of the screen's dark mode.
6. **Screen-only chrome hidden:** the floating toolbar and the "Download PDF"
   button are `display: none` in print. The sheet shadow, dark canvas, and
   rounded corners are also removed so the paper is edge-to-edge white.

### Page split

- **Page 1** — Masthead · Summary · Skills (rail) · Experience roles 1–3 (AI
  Product Engineer, Hunt Intelligence, OMEGA).
- **Page 2** — Experience roles 4–5 (Phantasma, Coalition) + the compressed
  "Earlier" block (main) · Projects, Education, Beyond the résumé (rail).

The split is explicit in `page.tsx` (the experience array is sliced), so it is a
deliberate editorial decision, not a reflow accident.

## Download PDF control

A visible **Download PDF** button (top-right toolbar on screen) calls
`window.print()`. The design note for the user: choosing "Save as PDF" in the
browser dialog preserves live, selectable text and working links and keeps the
two-page layout — better than a screenshot-style export (research §6).
