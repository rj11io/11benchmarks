<!--
  Benchmark operator: replace every {{RUN_ID}} with the assigned run id,
  save the exact result under benchmark/prompts/{{RUN_ID}}.md, hash it,
  and give that frozen copy to the agent.
-->

# Task: define and build a crypto dashboard product

You are one of several coding agents receiving this exact task and the same
Next.js/shadcn baseline. The comparison covers research, strategic judgment,
PRD quality, design specification, crypto-domain correctness, trust and risk
communication, visual execution, and frontend craft.

Your folder: `app/{{RUN_ID}}`

## Objective

Research what a high-quality crypto dashboard should be, choose a specific
defensible product wedge and primary user, define a production-ready and
GTM-ready product, then build a high-fidelity frontend demo at
`/{{RUN_ID}}`.

The category is intentionally open. Your research should determine whether the
best opportunity is portfolio intelligence, on-chain analysis, treasury/risk,
market discovery, tax/accounting, protocol operations, trading workflows, or
another focused use case. Do not build an arbitrary wall of prices and charts.

## Required process artifacts

### `research.md`

Research current:

- crypto user and buyer segments, jobs, and recurring decisions;
- representative products and category conventions;
- market, portfolio, wallet, protocol, and on-chain data models;
- volatility, liquidity, risk, provenance, latency, and uncertainty
  communication;
- wallet/security trust patterns and relevant regulatory/compliance concerns;
- effective financial and crypto data visualizations;
- positioning, monetization, acquisition, and GTM patterns for the selected
  wedge.

Include source titles, URLs, access dates, findings, and the decisions those
findings changed. Prefer primary documentation, reputable data providers,
standards, practitioner sources, and credible market research. Never fabricate
citations or current market facts.

### `prd.md`

Write a concrete production- and GTM-ready PRD containing:

- product thesis, category, positioning, and differentiated promise;
- primary/secondary users, jobs to be done, pains, and buying trigger;
- scope, non-goals, workflows, requirements, and acceptance criteria;
- data sources, freshness/provenance assumptions, calculations, and entity
  model;
- wallet/security, privacy, permissions, compliance, and risk requirements;
- onboarding, activation, retention, success metrics, and analytics;
- packaging/pricing hypothesis, launch motion, and GTM narrative;
- risks, dependencies, unknowns, and post-demo roadmap.

Prefer a focused product with a clear decision loop over a universal crypto
super-app.

### `design.md`

Specify:

- information architecture and navigation;
- critical journeys and states;
- hierarchy, comparison, filtering, and drill-down behavior;
- visualization choices, units, time ranges, provenance, and risk semantics;
- visual system direction, typography, color, density, and interaction;
- responsive behavior, accessibility, loading/empty/error states;
- how the implementation demonstrates the product differentiator.

## Frontend demo

- Create `app/{{RUN_ID}}/layout.tsx` and `app/{{RUN_ID}}/page.tsx`.
- Build a coherent interactive product experience, not a static collage.
- Use realistic but clearly labeled seeded demo data.
- Implement the PRD's core workflow. `localStorage` is allowed for persistence.
- Never imply prices, balances, transactions, returns, or wallet connections
  are live when they are not.
- No backend, wallet extension, credentials, paid API, or external service may
  be required for evaluation.
- The demo must be strong at approximately 1440×900 and usable at
  approximately 375×812.

## Hard rules

1. Write only inside `app/{{RUN_ID}}/`.
2. Do not modify `benchmark/`, `components/ui/`, `lib/`, `hooks/`,
   `app/globals.css`, the root layout, package files, or lockfiles.
3. Do not install dependencies.
4. Do not inspect or borrow from other run folders.
5. Use route-local components, data, assets, and CSS modules.
6. Do not fabricate research, market data provenance, performance claims, or
   live functionality.
7. Work autonomously and complete research, documentation, and implementation.

## Done means

- `research.md`, `prd.md`, and `design.md` are complete, cited, and consistent.
- The demo visibly implements the selected product thesis and core workflow.
- Units, timestamps, provenance, and demo/live status are understandable.
- Important controls work and state persists where appropriate.
- Empty, normal, volatile, and risk-focused states are represented.
- Mobile and desktop have no broken layouts or horizontal overflow.
- The route has no console errors.
- `npm run lint`, `npm run typecheck`, and `npm run build` pass.
