<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Benchmark runs

This repository benchmarks how coding agents research, extract, rewrite, and
redesign the same CV. If you are given a frozen prompt under
`benchmark/prompts/`, that prompt is the task specification and its rules take
precedence.

For a benchmark run:

- Write only inside the assigned `app/<run-id>/` folder.
- Treat `ref/`, `benchmark/`, `components/ui/`, `lib/`, `hooks/`,
  `app/globals.css`, and the root `app/layout.tsx` as read-only.
- Do not install dependencies or edit package files.
- Keep research, extracted content, design rationale, and implementation
  together in the run folder.
- Do not inspect another run folder. Earlier solutions are not references.
