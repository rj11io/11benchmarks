<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Benchmark runs

This repository benchmarks end-to-end crypto product work: research, product
definition, design specification, and frontend execution. The exact frozen
prompt under `benchmark/prompts/` is authoritative for a run.

For a benchmark run:

- Write only inside the assigned `app/<run-id>/` folder.
- Treat `benchmark/`, `components/ui/`, `lib/`, `hooks/`,
  `app/globals.css`, and the root `app/layout.tsx` as read-only.
- Do not install dependencies or edit package files.
- Keep `research.md`, `prd.md`, `design.md`, and the implementation together
  inside the run folder.
- Do not inspect another run folder.
