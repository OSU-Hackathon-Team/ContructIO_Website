// All site copy lives here. Edit this file to customize the page.
import {
  AppWindow, Binary, BookOpen, Bot, Boxes, Cloud, Code2, Cpu, Eye, FileCheck2, FileText, Layers,
  Lock, Package, Radio, ScanSearch, Search, Server, ShieldCheck, Syringe, Target, Unlink, type LucideIcon,
} from "lucide-react";

export const site = {
  name: "Splice",
  event: "HackOHIO 2026",
  award: "Most Original Award",
  tagline: "Rebuild any app's features from its real behavior, verified against the original.",
  summary:
    "Pick features from existing software. Splice traces how they really work, writes a requirements spec checked against the original program, then has AI implement a clean version that must pass those same checks.",
  repoUrl: "https://github.com/OSU-Hackathon-Team/HackOHIO_2026", // TODO: your repo
  contactEmail: "team@example.com", // TODO
};

export const problems: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Lock,
    title: "Features locked inside old software",
    body: "Valuable behavior lives in desktop apps and native binaries nobody can easily read, extend, or port.",
  },
  {
    icon: Unlink,
    title: "Rewrites drift from the original",
    body: "Manual ports quietly change edge-case behavior. Teams find out in production, not in review.",
  },
  {
    icon: Bot,
    title: "AI code nobody checks",
    body: "Generated code looks right but rarely gets tested against what the original program actually does.",
  },
];

export interface Stage {
  icon: LucideIcon;
  title: string;
  detail: string;
  input: string;
  output: string;
  /** Artifact this stage hands to the next one; shown on the connector. */
  handoff?: string;
}

export interface Track {
  id: "electron" | "native";
  label: string;
  blurb: string;
  stages: Stage[];
}

export const tracks: Track[] = [
  {
    id: "native",
    label: "Native binary track",
    blurb: "Compiled executables and libraries: from machine code to a behavioral spec and a fresh C rebuild.",
    stages: [
      {
        icon: Binary,
        title: "Native binary",
        detail: "Any executable or shared library, such as a subsystem of LibreOffice Calc. No source code required.",
        input: "Executable / .so",
        output: "Content-addressed binary",
        handoff: "Binary SHA-256",
      },
      {
        icon: ScanSearch,
        title: "Ghidra index",
        detail: "Ghidra imports the binary once and indexes every function, import, string, and call. Results are cached and reused.",
        input: "Binary",
        output: "Function index + exports",
        handoff: "Index manifest",
      },
      {
        icon: Target,
        title: "Subsystem scope",
        detail: "Splice discovers a bounded subsystem from seed functions, following calls and shared data, and records its boundaries.",
        input: "Index + query",
        output: "Scoped function set",
        handoff: "Scope artifact",
      },
      {
        icon: Layers,
        title: "Parallel workers",
        detail: "A PostgreSQL task queue leases work to 16+ LLM reasoning workers. Each writes evidence-cited claims about one function.",
        input: "Scope tasks",
        output: "Semantic claims",
        handoff: "Claims",
      },
      {
        icon: ShieldCheck,
        title: "Review + probes",
        detail: "Independent reviewer models check each claim, and probes run the ORIGINAL binary to record what it really does.",
        input: "Claims",
        output: "Reviewed claims + observations",
        handoff: "Observations",
      },
      {
        icon: BookOpen,
        title: "Dossier",
        detail: "An immutable behavioral dossier. It stays partial or blocked until the evidence is strong enough to call ready.",
        input: "Reviewed evidence",
        output: "Ready dossier",
        handoff: "Dossier",
      },
      {
        icon: FileText,
        title: "Spec",
        detail: "A public spec that must cite every supported invariant and observed effect, or it is rejected.",
        input: "Dossier",
        output: "Implementation-facing spec",
        handoff: "NativeSubsystemSpec",
      },
      {
        icon: Code2,
        title: "C rebuild",
        detail: "A model writes plain C from the spec, repairs it against public cases, then is graded once on hidden cases it never saw.",
        input: "Spec",
        output: "Verified C library",
      },
    ],
  },
  {
    id: "electron",
    label: "Desktop app track",
    blurb: "Electron apps: from a packaged app to a new app you can edit, built from verified engines.",
    stages: [
      {
        icon: Package,
        title: "Original app",
        detail: "The user picks a feature from a pantry of real desktop apps, shipped as packaged Electron archives.",
        input: "Packaged app (.asar)",
        output: "Feature seed",
        handoff: "Feature seed",
      },
      {
        icon: Search,
        title: "Evidence collection",
        detail: "REA, an MCP server, inspects the archive and traces the real code behind the feature, citing every source line.",
        input: "Archive + feature seed",
        output: "Cited source evidence",
        handoff: "RawEvidence",
      },
      {
        icon: FileCheck2,
        title: "Requirements spec",
        detail: "An LLM writes numbered behaviors, a TypeScript interface, and acceptance tests. The tests run against the ORIGINAL code in a sandbox, so the spec matches reality.",
        input: "RawEvidence",
        output: "Spec + tests the original passes",
        handoff: "FeatureSpec",
      },
      {
        icon: Cpu,
        title: "Clean engine",
        detail: "A model implements a pure TypeScript engine from the spec alone, then repairs it until every acceptance test passes.",
        input: "FeatureSpec",
        output: "Locked, passing engine",
        handoff: "FeatureBlueprint",
      },
      {
        icon: AppWindow,
        title: "Fused app",
        detail: "Selected engines are combined unchanged, a React UI is generated around them, and it runs live in Sandpack. You can refine it by chat.",
        input: "FeatureBlueprints + prompt",
        output: "Running app bundle",
      },
    ],
  },
];

// Architecture + orchestration data ported from the launch film
// (HackOHIO_2026_Video/.../src/TechScenes.tsx), which audited it against docs/ARCHITECTURE.md and models.json.

export type ArchNodeId = "studio" | "api" | "bedrock" | "ec2" | "worker" | "probes" | "s3" | "queue";

/** `step` orders the build-up animation. `logos` are files in public/logos (see CREDITS.md there). */
export const archNodes: { id: ArchNodeId; title: string; detail: string; logos?: string[]; step: number; dashed?: boolean }[] = [
  { id: "studio", title: "Studio", detail: "React · Zustand · Sandpack", logos: ["react.svg", "vite.svg"], step: 0 },
  { id: "api", title: "API", detail: "Node · Express · Zod · SSE", logos: ["node.svg", "express.svg", "zod.svg"], step: 1 },
  { id: "bedrock", title: "Amazon Bedrock", detail: "Converse · role models", logos: ["bedrock.png"], step: 2 },
  { id: "ec2", title: "EC2 runner", detail: "SSM · scoped native run", logos: ["ec2.png", "docker.svg"], step: 2 },
  { id: "worker", title: "Native worker", detail: "OpenCode · Ghidra MCP", logos: ["python.svg", "opencode.svg", "ghidra.png"], step: 3 },
  { id: "probes", title: "Original program", detail: "Frida · UNO / CLI probes", step: 3.4 },
  { id: "s3", title: "Private S3", detail: "results · library · cache", logos: ["s3.png"], step: 4 },
  { id: "queue", title: "Engine CLI queue", detail: "PostgreSQL · separate path", logos: ["postgresql.svg"], step: 5, dashed: true },
];

export const archEdges: { from: ArchNodeId; to: ArchNodeId; label: string; step: number }[] = [
  { from: "studio", to: "api", label: "REST + SSE", step: 1 },
  { from: "api", to: "bedrock", label: "Converse", step: 2 },
  { from: "api", to: "ec2", label: "SSM", step: 2 },
  { from: "ec2", to: "worker", label: "scoped run", step: 3 },
  { from: "worker", to: "bedrock", label: "native roles", step: 3.2 },
  { from: "worker", to: "probes", label: "probe", step: 3.4 },
  { from: "ec2", to: "s3", label: "artifacts", step: 4 },
  { from: "api", to: "s3", label: "library", step: 4.2 },
];

export const modelRoles = [
  { role: "Spec · engine · UI", model: "Qwen3 Coder 480B" },
  { role: "Adjudicator · broker", model: "DeepSeek V3.2" },
  { role: "Watchdog", model: "GLM-5" },
  { role: "Independent review", model: "Claude Opus 4.6" },
];

export const orchestrator = {
  title: "Orchestrator",
  lines: ["Express jobs · POST-SSE", "EC2 scoped runner", "CLI lease queue · PostgreSQL"],
};

export const watchdog = {
  title: "Watchdog",
  detail: "GLM-5 · adjusts routing and budgets",
  limit: "Cannot edit evidence, probes, or claims",
};

// Checked against HackOHIO_2026/models.json (dev, 1401ac8) and the code that resolves each role;
// re-check there if models.json changes.
export const agentRoster: { role: string; model: string; limit: string }[] = [
  { role: "Semantic agent", model: "Qwen3 Coder 480B", limit: "cites evidence" },
  { role: "Independent reviewer", model: "Qwen3 32B / Claude Opus 4.6", limit: "verdicts only" },
  { role: "Investigator", model: "Qwen3 Coder 480B", limit: "read-only REA / Ghidra MCP" },
  { role: "Adjudicator", model: "DeepSeek V3.2", limit: "independent gap review" },
  { role: "Discovery agent", model: "Qwen3 Coder 480B", limit: "up to five capabilities" },
  { role: "Spec writer", model: "Qwen3 Coder 480B", limit: "public contract" },
  { role: "Engine writer", model: "Qwen3 Coder 480B", limit: "source withheld" },
  { role: "Conformance oracle", model: "trusted checks, not a model", limit: "leak · purity · tests" },
  { role: "UI synthesizer", model: "Qwen3 Coder 480B", limit: "locked engines" },
  { role: "Cleanroom broker", model: "DeepSeek V3.2", limit: "disclosure filter" },
  { role: "Cleanroom implementer", model: "Qwen3 Coder 480B", limit: "disposable container · public artifacts only" },
];

/**
 * `logo` is a file in public/logos (see CREDITS.md there). Brands with no openly licensed mark
 * (Zustand, Frida, GLM, the SSE protocol) get a generic `icon` instead.
 */
export const stack: {
  icon: LucideIcon;
  title: string;
  blurb: string;
  items: { name: string; logo?: string; icon?: LucideIcon; what: string }[];
}[] = [
    {
      icon: AppWindow,
      title: "Interface",
      blurb: "The Studio where people pick features and edit the app they built.",
      items: [
        { name: "React + Vite", logo: "react.svg", what: "Studio UI and fast dev builds" },
        { name: "TypeScript", logo: "typescript.svg", what: "One typed language from contracts to UI" },
        { name: "Tailwind", logo: "tailwindcss.svg", what: "Styling for Studio and generated apps" },
        { name: "Zustand", icon: Boxes, what: "Session state and pipeline orchestration" },
        { name: "Sandpack", logo: "codesandbox.svg", what: "Runs generated apps live in the browser" },
      ],
    },
    {
      icon: Server,
      title: "API",
      blurb: "One backend that streams every pipeline step as it happens.",
      items: [
        { name: "Node + Express", logo: "node.svg", what: "Extraction, implementation, and synthesis routes" },
        { name: "Server-Sent Events", icon: Radio, what: "Live progress for each phase" },
        { name: "Zod", logo: "zod.svg", what: "Shared schemas validate every handoff" },
      ],
    },
    {
      icon: Bot,
      title: "AI models",
      blurb: "Each agent role gets its own model, routed from one config file.",
      items: [
        { name: "AWS Bedrock Converse", logo: "bedrock.png", what: "One API for every model role" },
        { name: "Qwen3 Coder 480B · Qwen3 32B", logo: "qwen.svg", what: "Claims, specs, engines, UI, and review" },
        { name: "DeepSeek V3.2", logo: "deepseek.svg", what: "Adjudication and the cleanroom broker" },
        { name: "GLM-5", icon: Eye, what: "Watchdog supervision" },
        { name: "Claude Opus 4.6", logo: "claude.svg", what: "Independent review" },
        { name: "OpenCode", logo: "opencode.svg", what: "Worker runtime, with tools denied" },
      ],
    },
    {
      icon: ScanSearch,
      title: "Reverse engineering",
      blurb: "How Splice reads programs it has no source code for.",
      items: [
        { name: "Ghidra", logo: "ghidra.png", what: "Indexes and decompiles every function" },
        { name: "REA over MCP", logo: "modelcontextprotocol.svg", what: "Traces real code inside Electron apps" },
        { name: "Frida", icon: Syringe, what: "Runtime probes on the original program" },
        { name: "Python", logo: "python.svg", what: "Decompilation engine and CLI" },
      ],
    },
    {
      icon: Cloud,
      title: "Infrastructure",
      blurb: "Scales to 16+ parallel workers and keeps the cleanroom sealed.",
      items: [
        { name: "PostgreSQL", logo: "postgresql.svg", what: "Lease queue for parallel workers" },
        { name: "Docker", logo: "docker.svg", what: "Worker images and the sealed cleanroom" },
        { name: "EC2 + SSM", logo: "ec2.png", what: "Scoped native analysis runs" },
        { name: "S3", logo: "s3.png", what: "Private, content-addressed artifact cache" },
        { name: "GitHub Actions + Playwright", logo: "githubactions.svg", what: "CI builds and end-to-end Studio tests" },
      ],
    },
  ];

export const results: { value: number; suffix?: string; label: string; caveat: string }[] = [
  {
    value: 99,
    suffix: "/99",
    label: "held-out original cases passed",
    caveat: "Generated C for LibreOffice Calc's FormulaGrammar subsystem.",
  },
  {
    value: 16,
    label: "concurrent worker leases",
    caveat: "Measured on our telemetry fixture with PostgreSQL.",
  },
  {
    value: 39,
    suffix: "/39",
    label: "functions exported",
    caveat: "Ghidra on an optimized (-O2) shared library build.",
  },
  {
    value: 0,
    label: "hidden test cases shown to the model",
    caveat: "Grading cases never enter prompts or repair feedback.",
  },
];

export interface Member {
  name: string;
  role: string;
  bio: string;
  /** Path under public/, e.g. "team/alex.jpg". Leave empty to show initials. */
  photo?: string;
  linkedin?: string;
  github?: string;
  email?: string;
  /** A PDF under public/, e.g. "team/alex-resume.pdf", or a full URL. */
  resume?: string;
}

// TODO: replace with your team.
export const team: Member[] = [
  {
    name: "Jason Seh",
    role: "Cloud Infrastructure & Feature Implementation",
    photo: "team/jason.jpg",
    bio: "Jason Seh is an AI Engineering Intern at the Center for Software Innovation, working with Honda, and an AI/ML Research Engineer at the NSF ICICLE AI Institute. His work spans machine learning research, AI-powered software development, and the design of scalable systems that apply artificial intelligence to real-world problems.",
    linkedin: "https://www.linkedin.com/in/jason-seh/",
    github: "https://github.com/JassehXia",
    resume: "resumes/Seh_Resume.pdf",
  },
  {
    name: "Mitchell Eickhoff",
    role: "Reverse Engineering Engine",
    photo: "team/mitch.jpg",
    bio: "Mitchell Eickhoff is a Computer Science and Engineering major with experience in every major programming language, a love for low level development, and cybersecurity. With experience in CTFs, hackathons, hardware hacking, and open source contribution.",
    linkedin: "https://www.linkedin.com/in/mitchell-eickhoff-182a3a35a/",
    github: "https://github.com/PsychedelicPalimpsest",
    resume: "resumes/Eickhoff_Mitchell_Resume_Aug26.pdf",
  },
  {
    name: "Konrád Gózon",
    role: "Feature and Spec Extraction",
    photo: "team/konrad.jpg",
    bio: "Konrád Gózon is a Computer Science and Engineering student at Ohio State who builds AI-powered software, from real-time voice and vision tools to full-stack web apps. He has won experience through hackathons like HackAI and HackOHI/O, competes in CTFs, and develops computer vision software for the OSU's underwater robotics team. Previously, he interned at Planck AI, where he built an AI red-teaming pipeline.",
    linkedin: "https://www.linkedin.com/in/konrad-gozon/",
    github: "https://github.com/25kgozon",
    resume: "resumes/Konrad_Resume_OCT26.pdf",
  },
  {
    name: "Rocky Shao",
    role: "Slideshow and Video",
    photo: "team/rocky.jpg",
    bio: "Rocky Shao is a Computer Engineering student at Ohio State with experience in embedded systems, FPGA design, and autonomous vehicle software. He brings hands-on hardware and coding skills to turn ambitious ideas into working prototypes.",
    linkedin: "https://www.linkedin.com/in/rocky-shao/",
    github: "https://github.com/Rocky0Shao",
    resume: "resumes/Rocky Shao Resume.pdf",
  },
];

// Event facts from hack.osu.edu/2026 (checked 2026-10-27). The site does not publish registrations;
// 1,100+ is the team's own figure from the organizers.
export const about = {
  title: "What Splice is",
  body: [
    "Splice rebuilds software features from how they actually behave. Point it at a desktop app or a compiled binary: AI agents trace what a feature really does, write a spec that is checked against the original program, and rebuild the feature as clean, tested code. No source code required.",
    "Every claim is backed by evidence from the original, and every rebuild is graded on test cases the model never saw.",
  ],
  award: {
    name: "Most Original Award",
    event: "HackOHIO 2026",
    criteria: "Given to the project with the most unique and innovative concept.",
    context: "HackOHI/O is Ohio State's largest annual hackathon: 24 hours of building at the Ohio Union, October 24–25, 2026.",
    team: "Team 4C²",
    // Web copies in public/images (metadata stripped); originals live in the git-ignored photo-originals/.
    photos: {
      win: {
        name: "win",
        alt: "Two members of Team 4C² on the HackOHIO stage, holding their awards in front of a slide describing Splice.",
        caption: "On stage at HackOHIO 2026, in front of the slide that introduced Splice.",
      },
      team: {
        name: "team",
        alt: "The four members of Team 4C² holding up a HackOHIO shirt in the Ohio Union ballroom.",
        caption: "Team 4C², left to right: Mitchell Eickhoff, Konrád Gózon, Jason Seh, and Rocky Shao.",
      },
    },
  },
  stats: [
    { value: 1100, suffix: "+", label: "signed up" },
    { value: 800, suffix: "+", label: "students competing" },
    { value: 60, suffix: "+", label: "majors represented" },
    { value: 24, label: "hours to build" },
  ],
};

// H.264 web copy of the launch film (original HEVC in the git-ignored photo-originals/; HEVC won't play in Firefox).
export const film = {
  title: "Splice in under three minutes",
  blurb: "The launch film from HackOHIO: the problem, the pipeline, and the results, narrated end to end.",
  src: "video/splice-film.mp4",
  poster: "video/splice-film-poster.jpg",
  length: "2:50",
};
