<!--
  Benchmark operator: replace every {{RUN_ID}} with the assigned run id,
  save the exact result under benchmark/prompts/{{RUN_ID}}.md, hash it,
  and give that frozen copy to the agent.
-->

# Task: define and build a cybersecurity dashboard product

You are one of several coding agents receiving this exact task and the same
Next.js/shadcn baseline. The comparison covers the entire product-development
chain: research, strategic judgment, PRD quality, design specification,
cybersecurity domain fitness, visual execution, and frontend craft.

Your folder: `app/{{RUN_ID}}`

## Objective

Research what a high-quality cybersecurity dashboard should be, choose a
specific defensible product wedge and primary user, define a production-ready
and GTM-ready product, then build a high-fidelity frontend demo at
`/{{RUN_ID}}`.

The broad category is intentionally open. Your research and product judgment
should determine whether the strongest opportunity is, for example, security
operations, exposure management, executive risk, cloud security, incident
response, threat intelligence, or another focused workflow. Do not build a
random collection of security widgets.

## Required process artifacts

Create all three files inside your run folder.

### `research.md`

Research current:

- cybersecurity buyer/user segments and painful workflows;
- existing product categories and representative competitors;
- dashboard and security-operations information architecture;
- alert fatigue, prioritization, explainability, trust, collaboration, and
  remediation workflows;
- appropriate security metrics and data visualizations;
- accessibility and responsive considerations for dense operational tools;
- market positioning and GTM patterns relevant to the selected wedge.

Include source titles, URLs, access dates, findings, and the decisions each
finding changed. Prefer authoritative security standards, practitioner
sources, primary product documentation, and credible market research. Do not
fabricate sources.

### `prd.md`

Write a concrete production- and GTM-ready PRD containing:

- product thesis, category, positioning, and differentiated promise;
- primary and secondary users, jobs to be done, pains, and buying trigger;
- scope, non-goals, core workflows, functional requirements, and acceptance
  criteria;
- information/data model and assumptions about integrations;
- security, privacy, permissions, auditability, and trust requirements;
- onboarding, activation, retention, success metrics, and analytics;
- packaging or pricing hypothesis, launch motion, and GTM narrative;
- risks, dependencies, unknowns, and a credible post-demo roadmap.

Be decisive. A coherent narrow product is better than an imaginary platform
that solves all of cybersecurity.

### `design.md`

Specify:

- information architecture and navigation;
- critical user journeys and states;
- dashboard hierarchy and prioritization logic;
- visualization choices and why they fit the data;
- design system direction, typography, color semantics, density, and
  component behavior;
- responsive behavior, accessibility, loading/empty/error states, and
  interaction feedback;
- how the implementation demonstrates the PRD's differentiator.

## Frontend demo

- Create `app/{{RUN_ID}}/layout.tsx` and `app/{{RUN_ID}}/page.tsx`.
- Build a coherent product experience, not only a static dashboard screenshot.
- Implement the core workflow from the PRD with realistic seeded demo data.
- Include meaningful interactions and state changes. `localStorage` is allowed
  for persistence.
- Clearly treat all data as demo data. Do not imply that fake alerts or
  integrations are live.
- No backend, authentication service, external credentials, or paid API may be
  required to evaluate the result.
- The demo must be strong at approximately 1440×900 and remain usable at
  approximately 375×812.

## Hard rules

1. Write only inside `app/{{RUN_ID}}/`.
2. Do not modify `benchmark/`, `components/ui/`, `lib/`, `hooks/`,
   `app/globals.css`, the root layout, package files, or lockfiles.
3. Do not install dependencies.
4. Do not inspect or borrow from other run folders.
5. Use route-local components, data, assets, and CSS modules.
6. Do not fabricate research citations or present demo functionality as a
   production security control.
7. Work autonomously and complete research, documentation, and implementation.

## Done means

- `research.md`, `prd.md`, and `design.md` are complete, cited, and consistent.
- The built product visibly implements the core thesis and workflow.
- Important controls work and state persists where the design calls for it.
- Empty, normal, and high-attention states are represented.
- Mobile and desktop have no broken layouts or horizontal overflow.
- The route has no console errors.
- `npm run lint`, `npm run typecheck`, and `npm run build` pass.
