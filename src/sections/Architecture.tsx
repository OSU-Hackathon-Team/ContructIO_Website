import { motion, useReducedMotion } from "motion/react";
import { archEdges, archNodes, modelRoles, type ArchNodeId } from "../content";
import { cn } from "../lib/cn";
import { useMediaQuery } from "../lib/useMediaQuery";
import { Reveal, Section } from "../components/Section";

type EdgeGeometry = { path: string; lx: number; ly: number; anchor?: "start" | "middle" | "end"; rotate?: boolean };
type Layout = {
  w: number;
  h: number;
  node: { w: number; h: number };
  pos: Record<ArchNodeId, [number, number]>;
  edges: Record<string, EdgeGeometry>;
};

// Desktop: the film's own coordinates (TechScenes.tsx runtimeNodes / runtimeEdges).
const desktop: Layout = {
  w: 1240,
  h: 474,
  node: { w: 210, h: 84 },
  pos: {
    studio: [20, 215], api: [340, 215], bedrock: [660, 40], ec2: [660, 215],
    worker: [980, 215], probes: [980, 390], s3: [660, 390], queue: [980, 40],
  },
  edges: {
    "studio-api": { path: "M230 257H340", lx: 285, ly: 247 },
    "api-bedrock": { path: "M445 215V82H660", lx: 552, ly: 72 },
    "api-ec2": { path: "M550 257H660", lx: 605, ly: 247 },
    "ec2-worker": { path: "M870 257H980", lx: 925, ly: 247 },
    "worker-bedrock": { path: "M1085 215V170H765V124", lx: 925, ly: 162 },
    "worker-probes": { path: "M1085 299V390", lx: 1125, ly: 350 },
    "ec2-s3": { path: "M765 299V390", lx: 810, ly: 350 },
    "api-s3": { path: "M445 299V432H660", lx: 552, ly: 422 },
  },
};

// Phones: the same graph re-gridded into two columns that read top to bottom.
const mobile: Layout = {
  w: 380,
  h: 572,
  node: { w: 140, h: 76 },
  pos: {
    studio: [30, 0], api: [30, 124], bedrock: [240, 124], ec2: [30, 248],
    worker: [240, 248], s3: [30, 372], probes: [240, 372], queue: [240, 496],
  },
  edges: {
    "studio-api": { path: "M100 76V124", lx: 108, ly: 104, anchor: "start" },
    "api-bedrock": { path: "M170 162H240", lx: 205, ly: 154 },
    "api-ec2": { path: "M100 200V248", lx: 108, ly: 228, anchor: "start" },
    "ec2-worker": { path: "M170 286H240", lx: 205, ly: 278 },
    "worker-bedrock": { path: "M310 248V200", lx: 302, ly: 228, anchor: "end" },
    "worker-probes": { path: "M310 324V372", lx: 302, ly: 352, anchor: "end" },
    "ec2-s3": { path: "M100 324V372", lx: 108, ly: 352, anchor: "start" },
    "api-s3": { path: "M30 182H14V410H30", lx: 9, ly: 296, rotate: true },
  },
};

const STEP = 0.35;
const pct = (v: number, total: number) => `${(v / total) * 100}%`;

export function Architecture() {
  const lg = useMediaQuery("(min-width: 1024px)");
  const reduce = useReducedMotion();
  const L = lg ? desktop : mobile;

  return (
    <Section
      id="architecture"
      eyebrow="Architecture"
      title="Where every piece runs"
      intro="One studio talks to one API. Native analysis runs in a scoped EC2 worker that probes the original program, and every result lands in private storage."
    >
      <motion.div
        key={lg ? "desktop" : "mobile"}
        role="img"
        aria-label={`Architecture: ${archEdges
          .map((e) => `${archNodes.find((n) => n.id === e.from)!.title} to ${archNodes.find((n) => n.id === e.to)!.title} via ${e.label}`)
          .join("; ")}.`}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className={cn("relative mx-auto", !lg && "max-w-md")}
        style={{ aspectRatio: `${L.w} / ${L.h}` }}
      >
        <svg viewBox={`0 0 ${L.w} ${L.h}`} className="absolute inset-0 size-full overflow-visible" aria-hidden>
          {archEdges.map((e) => {
            const g = L.edges[`${e.from}-${e.to}`];
            const delay = e.step * STEP;
            return (
              <motion.g
                key={`${e.from}-${e.to}`}
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay, duration: 0.15 } } }}
              >
                {/* Line draws from source to target, as in the film. */}
                <motion.path
                  d={g.path}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={lg ? 2 : 1.5}
                  className="text-emerald-500/60"
                  variants={{
                    hidden: { pathLength: reduce ? 1 : 0 },
                    show: { pathLength: 1, transition: { delay, duration: 0.45, ease: "easeOut" } },
                  }}
                />
                <text
                  x={g.lx}
                  y={g.ly}
                  textAnchor={g.anchor ?? "middle"}
                  transform={g.rotate ? `rotate(-90 ${g.lx} ${g.ly})` : undefined}
                  fontSize={lg ? 13 : 11}
                  className="fill-stone-400"
                  stroke="#181614"
                  strokeWidth={5}
                  strokeLinejoin="round"
                  paintOrder="stroke"
                >
                  {e.label}
                </text>
              </motion.g>
            );
          })}
        </svg>

        {archNodes.map((n) => {
          const [x, y] = L.pos[n.id];
          return (
            <motion.div
              key={n.id}
              // "Slam": lands slightly large and settles, on the beat its edge arrives.
              variants={{
                hidden: { opacity: 0, scale: 1.25 },
                show: { opacity: 1, scale: 1, transition: { delay: n.step * STEP + 0.2, type: "spring", duration: 0.45, bounce: 0 } },
              }}
              style={{ left: pct(x, L.w), top: pct(y, L.h), width: pct(L.node.w, L.w), height: pct(L.node.h, L.h) }}
              className={cn(
                "absolute flex flex-col justify-center rounded-xl border bg-[#1f1c19] px-2.5 lg:px-3.5",
                n.dashed ? "border-dashed border-white/25 opacity-85" : "border-white/15"
              )}
            >
              {lg && n.logos && (
                <span className="mb-1 flex gap-1">
                  {n.logos.map((logo) => (
                    <img key={logo} src={`${import.meta.env.BASE_URL}logos/${logo}`} alt="" className="size-5 rounded bg-stone-100 p-0.5" />
                  ))}
                </span>
              )}
              <b className="text-[13px] font-medium leading-tight lg:text-[15px]">{n.title}</b>
              <small className="mt-0.5 text-[11px] leading-snug text-stone-400 lg:text-xs">{n.detail}</small>
            </motion.div>
          );
        })}
      </motion.div>

      <Reveal delay={0.2} className="mt-8 grid grid-cols-2 gap-x-4 gap-y-3 lg:grid-cols-4">
        {modelRoles.map((r) => (
          <p key={r.role} className="border-t border-white/10 pt-2 text-xs text-stone-500">
            {r.role}
            <b className="block text-sm font-medium text-emerald-300">{r.model}</b>
          </p>
        ))}
      </Reveal>
      <p className="mt-4 text-xs text-stone-500">Model roles from models.json. Dashed: separate CLI path.</p>
    </Section>
  );
}
