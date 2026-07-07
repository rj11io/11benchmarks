<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Benchmark runs

This repo benchmarks how different models build the same CV website. If
you were pointed at a folder under `app/` as your run folder, `PROMPT.md`
at the repo root is your full task spec and its rules win over everything
else. In short: write only inside your run folder, treat `content/` as
read-only, add no dependencies, and do not touch `components/ui/`,
`lib/`, `hooks/`, `app/globals.css`, or the root `app/layout.tsx`.
