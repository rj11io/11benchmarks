// Canonical CV content, derived directly from ./content.md.
// This is the single structured source the page renders from. Any change to
// the facts should be made in content.md first, then mirrored here.

export interface ContactLink {
  label: string
  href: string
  /** Short text shown in print (usually the bare domain). */
  print: string
}

export interface SkillGroup {
  label: string
  items: string[]
}

export interface Project {
  name: string
  href: string
  domain: string
  period: string
  blurb: string
}

export interface ExperienceItem {
  role: string
  company: string
  href?: string
  domain?: string
  meta?: string
  period: string
  lead?: string
  bullets: string[]
}

export const cv = {
  name: "Ricardo Jorge",
  nickname: "RJ",
  title: "AI Product Engineer",
  location: "Lisbon, Portugal",
  email: "ricardojorgexyz@gmail.com",
  site: "cv.rj11.io",

  links: [
    { label: "rj11.io", href: "https://rj11.io", print: "rj11.io" },
    {
      label: "github.com/rj11io",
      href: "https://github.com/rj11io",
      print: "github.com/rj11io",
    },
    {
      label: "linkedin.com/in/rj11io",
      href: "https://linkedin.com/in/rj11io",
      print: "linkedin.com/in/rj11io",
    },
  ] as ContactLink[],

  summary: [
    "AI Product Engineer with a decade of professional TypeScript experience — building on React since 2016 and Next.js since 2018, an early bet on the stack that now runs both the web and AI products. On most teams I was the first frontend hire, owning architecture, tooling, the component library, and pipelines from day one, then growing the team around them: hiring, onboarding, and writing the playbooks that let new engineers ship quickly.",
    "Most of my work has been dashboards, product platforms, and proprietary data explorers for cybersecurity, crypto, and gaming companies — where I found a lasting focus on data-driven products and data visualisation. I have built with AI since the first releases of Copilot and ChatGPT, moving from prompt and context engineering to open-source agent skills and full agent harnesses, and today run an automated fleet of AI agents that maintains my own projects.",
  ],

  skills: [
    {
      label: "Core stack",
      items: [
        "TypeScript",
        "React",
        "Next.js",
        "AI SDK",
        "Convex",
        "Playwright",
        "Vercel",
      ],
    },
    {
      label: "AI engineering",
      items: [
        "Agent automations",
        "Custom agent skills",
        "Harness engineering",
        "Codex",
        "Claude Code",
        "n8n",
      ],
    },
    {
      label: "UI & design",
      items: [
        "Tailwind CSS",
        "shadcn/ui",
        "Material UI",
        "Design systems",
        "Storybook",
        "Refactoring UI",
      ],
    },
    {
      label: "Data & visualisation",
      items: [
        "Dashboards",
        "d3",
        "Recharts",
        "Nivo",
        "Web scraping",
        "Data enrichment",
      ],
    },
    {
      label: "Leadership & delivery",
      items: [
        "Team & project management",
        "End-to-end product engineering",
        "Product design",
        "Agile",
      ],
    },
    {
      label: "Foundations",
      items: [
        "JavaScript",
        "Node.js",
        "HTML5",
        "CSS",
        "Git",
        "GitHub Actions",
        "REST APIs",
        "CI/CD",
        "Testing",
      ],
    },
  ] as SkillGroup[],

  projects: [
    {
      name: "11io",
      href: "https://rj11.io",
      domain: "rj11.io",
      period: "2025 — Present",
      blurb: "Personal brand for B2B freelancing.",
    },
    {
      name: "11ai",
      href: "https://ai.rj11.io",
      domain: "ai.rj11.io",
      period: "2026 — Present",
      blurb: "Open-source AI skills, plugins, and workflows.",
    },
    {
      name: "11bench",
      href: "https://bench.rj11.io",
      domain: "bench.rj11.io",
      period: "2026 — Present",
      blurb: "Open-source AI benchmarks.",
    },
    {
      name: "Modern GitHub",
      href: "https://github.com/rj11io",
      domain: "github.com/rj11io",
      period: "2023 — Present",
      blurb: "Current open-source AI projects.",
    },
    {
      name: "Legacy GitHub",
      href: "https://github.com/ricardojrmcom",
      domain: "github.com/ricardojrmcom",
      period: "2020 — 2023",
      blurb: "Earlier open-source work.",
    },
  ] as Project[],

  // Roles carrying full bullets, newest first. Rendered across the two pages.
  experience: [
    {
      role: "AI Product Engineer",
      company: "rj11io",
      href: "https://rj11.io",
      domain: "rj11.io",
      meta: "B2B · Remote",
      period: "Mar 2025 — Present",
      lead: "Hands-on AI product engineering for several early-stage startups, building from the ground up.",
      bullets: [
        "AI data extraction from PDFs, AI SEO analytics, and a GenAI dermatopathology portal.",
        "Cybersecurity dashboards and proprietary data explorers; AI chat and custom GPT experiences.",
        "AI agent harnesses, skills, and automations, plus smart-scraping agents and n8n workflows.",
      ],
    },
    {
      role: "Product / Datavis Engineer",
      company: "Hunt Intelligence, Inc.",
      href: "https://hunt.io",
      domain: "hunt.io",
      meta: "B2B · Remote",
      period: "Apr 2024 — Mar 2025",
      bullets: [
        "Went deep on data visualisation for a threat-intelligence product, including custom components such as the IP History Widget.",
        "Built core product modules AttackCapture™ and HuntSQL™ on a modern TypeScript codebase — Next.js, shadcn/ui, Playwright, CI/CD on GitHub Actions, Vercel environments, and release changelogs wired to Slack.",
        "Shipped a new API documentation platform on top of OpenAPI — friendlier and more intuitive than Swagger.",
      ],
    },
    {
      role: "Senior Frontend Engineer → Team Lead",
      company: "OMEGA Systems",
      href: "https://omegasys.eu",
      domain: "omegasys.eu",
      meta: "Remote",
      period: "Jun 2023 — Apr 2024",
      bullets: [
        "Built the next generation of OMEGA's iGaming platform management system (CORE5) in TypeScript and React; promoted to lead the frontend team.",
        "Data visualisation for the Main and Social dashboards, plus report and configuration views (Cashback, Refer-a-Friend, Pending Withdrawals, Challenges / Leaderboards).",
        "As lead: built the new-developer onboarding experience and set standards for tickets, documentation, and remote / async work.",
      ],
    },
    {
      role: "Senior Frontend Engineer",
      company: "Phantasma Chain",
      href: "https://phantasma.info",
      domain: "phantasma.info",
      meta: "Remote",
      period: "Jan 2022 — May 2023",
      bullets: [
        "Built the frontend monorepo for all new tools and apps, the Phantasma UI Storybook, and the Phantasma Explorer.",
        "Testing with Playwright, CI on GitHub Actions, CD on Vercel; contributed improvements to the Phantasma TypeScript SDK.",
        "Built in-house tools: a custom React hook for the Phantasma SDK, localisation, white-label theming, and environment configs.",
      ],
    },
    {
      role: "Frontend Lead",
      company: "BinaryEdge · Coalition, Inc.",
      href: "https://coalitioninc.com",
      domain: "coalitioninc.com",
      meta: "Remote",
      period: "Feb 2020 — Oct 2021",
      bullets: [
        "Started as the solo frontend engineer and grew a team for customer-facing security apps and internal tools; introduced React, TypeScript, Next.js, and micro-frontends.",
        "Tech Lead for Coalition Explorer (and Explorer 2.0), the shared component library / Storybook, and the product's data visualisations.",
        "Built Attack Surface Monitoring on the BinaryEdge Portal, later integrated into Coalition Explorer and Coalition Control.",
        "Migrated the frontend CI/CD from Drone to GitHub Actions, improving pipelines, environments, and developer experience.",
      ],
    },
  ] as ExperienceItem[],

  // The oldest roles, compressed to one line (mirrors the short PDF's choice).
  earlier: {
    label: "Earlier",
    entries: [
      "Fullstack Engineer & co-founder at Glaiveware (bespoke web apps, 2018–2019)",
      "React Native end-to-end-encrypted chat app at Sycret.ink (2017)",
      "full-stack dashboard for the American Heart Association (2016)",
      "analytics dashboards at NextBitt (2015–2016)",
      "Java back-office system as an intern at Science4you (2015)",
    ],
  },

  education: [
    {
      program: "IT Systems Management and Programming",
      school: "Escola Profissional de Tecnologia Digital",
      place: "Lisbon, Portugal",
      period: "2013 — 2016",
      note: "Técnico de Gestão e Programação de Sistemas Informáticos",
    },
  ],

  beyond: [
    "Started coding young for fun — modding and reverse-engineering games and consoles, and building a fighting game on the MUGEN engine.",
    "Ran dedicated game servers (Counter-Strike, Minecraft, and more) and led teams, guilds, and clans to the top of online ladders and to LAN wins — accidental management training.",
    "At 14, LEGO Mindstorms robotics took our team to 2nd nationally and the final four of the 2008 robotics world cup in China.",
  ],
} as const

export type CV = typeof cv
