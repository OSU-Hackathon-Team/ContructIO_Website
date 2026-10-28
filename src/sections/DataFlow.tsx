import { Fragment, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { tracks, type Track } from "../content";
import { cn } from "../lib/cn";
import { Reveal, Section } from "../components/Section";

const STEP_MS = 3200;

const control =
  "inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-stone-200 transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60";

const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { ease: "easeOut" } } } as const;

export function DataFlow() {
  const [trackId, setTrackId] = useState<Track["id"]>("electron");
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();

  const track = tracks.find((t) => t.id === trackId)!;
  const { stages } = track;
  const stage = stages[active];
  // Loops only while on-screen; reduced motion means manual stepping only.
  const playing = inView && !paused && !reduce;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setActive((i) => (i + 1) % stages.length), STEP_MS);
    return () => clearInterval(id);
  }, [playing, stages.length]);

  const go = (i: number) => {
    setPaused(true);
    setActive((i + stages.length) % stages.length);
  };
  const switchTrack = (id: Track["id"]) => {
    setTrackId(id);
    setActive(0);
  };

  return (
    <Section
      id="flow"
      eyebrow="How it works"
      title="From original program to verified rebuild"
      intro="Every phase hands a concrete, content-addressed artifact to the next. Nothing moves forward until it has been checked against what the original actually does."
    >
      <Reveal className="mb-8 flex flex-wrap gap-2" >
        {tracks.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={t.id === trackId}
            onClick={() => switchTrack(t.id)}
            className={cn(
              control,
              "px-4 py-2 text-sm font-medium",
              t.id === trackId && "border-emerald-500/40 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/20"
            )}
          >
            {t.label}
          </button>
        ))}
      </Reveal>

      <div ref={ref} className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <motion.ol
          key={trackId}
          aria-label={`${track.label} phases`}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
        >
          {stages.map((s, i) => (
            <Fragment key={s.title}>
              {i > 0 && (
                <Connector
                  label={stages[i - 1].handoff}
                  live={i === active}
                  animate={!reduce}
                  packetKey={`${trackId}-${active}`}
                />
              )}
              <motion.li variants={item}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={i === active ? "step" : undefined}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60",
                    i === active
                      ? "border-emerald-500/50 bg-emerald-500/10"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                  )}
                >
                  <s.icon className={cn("size-5 shrink-0", i === active ? "text-emerald-400" : "text-stone-400")} aria-hidden />
                  <span className="truncate font-medium">{s.title}</span>
                  <span className="ml-auto text-xs tabular-nums text-stone-500">{i + 1}</span>
                </button>
              </motion.li>
            </Fragment>
          ))}
        </motion.ol>

        <div className="lg:sticky lg:top-8 lg:self-start">
          <div
            aria-live={playing ? "off" : "polite"}
            className="relative min-h-[22rem] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${trackId}-${active}`}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <p className="text-sm tabular-nums text-stone-500">
                  Phase {active + 1} of {stages.length} · {track.label}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-emerald-500/15">
                    <stage.icon className="size-6 text-emerald-400" aria-hidden />
                  </span>
                  <h3 className="text-2xl font-semibold">{stage.title}</h3>
                </div>
                <p className="mt-4 text-lg text-stone-300">{stage.detail}</p>
                <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                  <IO label="Takes in" value={stage.input} />
                  <IO label="Produces" value={stage.output} accent />
                </dl>
                {stage.handoff && (
                  <p className="mt-4 text-sm text-stone-400">
                    Hands off <code className="rounded bg-white/10 px-1.5 py-0.5 text-emerald-300">{stage.handoff}</code> to{" "}
                    {stages[active + 1].title.toLowerCase()}.
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button type="button" aria-label="Previous phase" onClick={() => go(active - 1)} className={cn(control, "size-9")}>
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <button type="button" aria-label="Next phase" onClick={() => go(active + 1)} className={cn(control, "size-9")}>
              <ChevronRight className="size-4" aria-hidden />
            </button>
            {!reduce && (
              <button
                type="button"
                aria-label={paused ? "Resume auto-play" : "Pause auto-play"}
                onClick={() => setPaused((p) => !p)}
                className={cn(control, "size-9")}
              >
                {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
              </button>
            )}
            <div className="ml-2 flex flex-wrap gap-1.5">
              {stages.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  aria-label={`Go to phase ${i + 1}: ${s.title}`}
                  onClick={() => go(i)}
                  className="grid size-6 place-items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                >
                  <span className={cn("size-2 rounded-full transition-colors", i === active ? "bg-emerald-400" : "bg-white/20")} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function IO({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
      <dt className="text-xs text-stone-500">{label}</dt>
      <dd className={cn("mt-1 font-medium", accent ? "text-emerald-300" : "text-stone-200")}>{value}</dd>
    </div>
  );
}

/** Vertical arrow between phases: draws on reveal, and carries a data packet into the active phase. */
function Connector({
  label,
  live,
  animate,
  packetKey,
}: {
  label?: string;
  live: boolean;
  animate: boolean;
  packetKey: string;
}) {
  return (
    <motion.li aria-hidden variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="relative ml-[1.6rem] h-9">
      <motion.span
        variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1 } }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn("absolute inset-y-0 left-0 w-px origin-top transition-colors", live ? "bg-emerald-500/70" : "bg-white/15")}
      />
      {live && animate && (
        // Wrapper is the connector's size, so y: 100% moves the dot the full length.
        <motion.span
          key={packetKey}
          className="absolute inset-0"
          initial={{ y: "-50%", opacity: 0 }}
          animate={{ y: ["-50%", "50%"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <span className="absolute left-0 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400" />
        </motion.span>
      )}
      {label && (
        // Positioning lives on a plain wrapper: motion's inline transform would override Tailwind translate classes.
        <span className="absolute inset-y-0 left-4 flex items-center">
          <motion.span
            key={live ? packetKey : "idle"}
            initial={live && animate ? { scale: 0.85, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeOut", delay: live ? 0.35 : 0 }}
            className={cn(
              "whitespace-nowrap rounded-md border px-1.5 py-0.5 font-mono text-[11px]",
              live ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300" : "border-white/10 bg-white/5 text-stone-500"
            )}
          >
            {label}
          </motion.span>
        </span>
      )}
    </motion.li>
  );
}
