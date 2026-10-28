// All site copy lives here. Edit this file to customize the page.
import {
  AppWindow, Binary, BookOpen, Bot, Code2, Cpu, FileCheck2, FileText, Layers,
  Lock, Package, ScanSearch, Search, ShieldCheck, Target, Unlink, type LucideIcon,
} from "lucide-react";

export const site = {
  name: "Splice",
  event: "HackOHIO 2026",
  tagline: "Rebuild any app's features from its real behavior, verified against the original.",
  summary:
    "Pick features from existing software. Splice traces how they really work, writes a requirements spec checked against the original program, then has AI implement a clean version that must pass those same checks.",
  repoUrl: "https://github.com/TODO/splice", // TODO: your repo
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
];

export const stack = [
  "React", "TypeScript", "Vite", "Tailwind", "Express + SSE", "Sandpack",
  "Python", "Ghidra", "MCP (REA)", "AWS Bedrock", "Qwen3 Coder", "PostgreSQL",
  "Docker", "EC2 + S3", "GitHub Actions",
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
}

// TODO: replace with your team.
export const team: Member[] = [
  {
    name: "Teammate One",
    role: "Reverse engineering",
    bio: "Built the evidence collector and REA bridge. Replace this with 2–3 sentences about your background and what you built.",
    linkedin: "https://www.linkedin.com/in/TODO",
    github: "https://github.com/TODO",
  },
  {
    name: "Teammate Two",
    role: "Requirements extraction",
    bio: "Built spec generation and the sandbox that tests specs against the original code. Replace with your bio.",
    linkedin: "https://www.linkedin.com/in/TODO",
    github: "https://github.com/TODO",
  },
  {
    name: "Teammate Three",
    role: "Implementation + Studio",
    bio: "Built engine implementation, UI synthesis, and the Studio frontend. Replace with your bio.",
    linkedin: "https://www.linkedin.com/in/TODO",
    github: "https://github.com/TODO",
  },
  {
    name: "Teammate Four",
    role: "Native decompilation",
    bio: "Built the Ghidra pipeline, worker queue, and C reimplementation loop. Replace with your bio.",
    linkedin: "https://www.linkedin.com/in/TODO",
    github: "https://github.com/TODO",
  },
];
