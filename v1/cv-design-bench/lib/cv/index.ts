// Server-side entry point: content loading + types.
// For the inline-markdown renderer (safe in client components too),
// import { Inline } from "@/lib/cv/markdown" directly — it is kept out of
// this barrel so client components don't pull in node:fs.

export { loadCV } from "./load"
export { parseDoc } from "./parse"
export type * from "./types"
