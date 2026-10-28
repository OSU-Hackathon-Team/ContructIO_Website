import { Fragment, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { tracks, type Track } from "../content";
import { cn } from "../lib/cn";
import { pressable, Reveal, Section } from "../components/Section";

const STEP_MS = 3200;

const control = cn(
  "inline-flex min-h-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-stone-200 hover:bg-white/10",
  pressable
);

const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { ease: "easeOut" } } } as const;

export function DataFlow() {
  const [trackId, setTrackId] = useState<Track["id"]>(tracks[0].id);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLOListElement>(null);
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

  // On phones the phases are a horizontal strip: keep the active one centered in it.
  useEffect(() => {
    const strip = stripRef.current;
    const chip = strip?.querySelector<HTMLElement>('[aria-current="step"]');
    if (!strip || !chip || strip.scrollWidth <= strip.clientWidth) return;
    strip.scrollTo({
      left: chip.offsetLeft - (strip.clientWidth - chip.offsetWidth) / 2,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [active, trackId, reduce]);

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
      intro="Every phase hands a concrete artifact to the next. Nothing moves forward until it is checked against what the original actually does."
    >
      <Reveal className="mb-6 grid grid-cols-2 gap-2 sm:flex">
        {tracks.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={t.id === trackId}
            onClick={() => switchTrack(t.id)}
            className={cn(
              control,
              "px-3 text-sm font-medium sm:px-4",
              t.id === trackId && "border-emerald-500/40 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/20"
            )}
          >
            {t.label}
          </button>
        ))}
      </Reveal>

      <div ref={ref} className="grid gap-4 lg:grid-cols-[20rem_1fr] lg:gap-8">
        <motion.ol
          ref={stripRef}
          key={trackId}
          aria-label={`${track.label} phases`}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          className="relative -mx-4 flex items-center overflow-x-auto overscroll-x-contain px-4 py-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:block lg:overflow-visible lg:p-0"
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
              <motion.li variants={item} className="shrink-0">
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={i === active ? "step" : undefined}
                  className={cn(
                    "flex min-h-11 items-center gap-2 whitespace-nowrap rounded-xl border px-3 text-left lg:w-full lg:gap-3 lg:px-4 lg:py-3",
                    pressable,
                    i === active
                      ? "border-emerald-500/50 bg-emerald-500/10"
                      : "border-white/10 bg-[#1f1c19] hover:bg-[#262320]"
                  )}
                >
                  <s.icon className={cn("size-5 shrink-0", i === active ? "text-emerald-400" : "text-stone-400")} aria-hidden />
                  <span className="text-sm font-medium lg:truncate lg:text-base">{s.title}</span>
                  <span className="ml-auto hidden text-xs tabular-nums text-stone-500 lg:inline">{i + 1}</span>
                </button>
              </motion.li>
            </Fragment>
          ))}
        </motion.ol>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <div
            aria-live={playing ? "off" : "polite"}
            className="min-h-[23rem] rounded-2xl border border-white/10 bg-[#1f1c19] p-5 sm:min-h-[20rem] sm:p-8"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${trackId}-${active}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <p className="text-sm tabular-nums text-stone-500">
                  Phase {active + 1} of {stages.length}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-500/15">
                    <stage.icon className="size-6 text-emerald-400" aria-hidden />
                  </span>
                  <h3 className="text-xl font-semibold sm:text-2xl">{stage.title}</h3>
                </div>
                <p className="mt-4 text-base text-stone-300 sm:text-lg">{stage.detail}</p>
                <dl className="mt-5 grid gap-2 sm:grid-cols-2 sm:gap-3">
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

          {/* Thumb-reachable controls directly under the panel. */}
          <div className="mt-3 grid grid-cols-3 gap-2 sm:flex">
            <button type="button" aria-label="Previous phase" onClick={() => go(active - 1)} className={cn(control, "sm:w-11")}>
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            {!reduce && (
              <button
                type="button"
                aria-label={paused ? "Resume auto-play" : "Pause auto-play"}
                onClick={() => setPaused((p) => !p)}
                className={cn(control, "sm:w-11")}
              >
                {paused ? <Play className="size-5" aria-hidden /> : <Pause className="size-5" aria-hidden />}
              </button>
            )}
            <button type="button" aria-label="Next phase" onClick={() => go(active + 1)} className={cn(control, "sm:w-11")}>
              <ChevronRight className="size-5" aria-hidden />
            </button>
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

/**
 * Arrow between phases: horizontal on phones, vertical from lg. Draws on reveal and
 * carries a data packet into the active phase.
 */
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
  const line = live ? "bg-emerald-500/70" : "bg-white/15";
  const packet = { duration: 0.7, ease: "easeInOut" } as const;
  const dot = "absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400";

  return (
    <motion.li
      aria-hidden
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
      className="relative h-px w-6 shrink-0 lg:ml-[1.6rem] lg:h-9 lg:w-auto"
    >
      <motion.span
        variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn("absolute inset-0 origin-left transition-colors lg:hidden", line)}
      />
      <motion.span
        variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1 } }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn("absolute inset-y-0 left-0 hidden w-px origin-top transition-colors lg:block", line)}
      />
      {live && animate && (
        // Wrappers are the connector's size, so a 50% shift moves the dot end to end.
        <Fragment key={packetKey}>
          <motion.span
            className="absolute inset-0 lg:hidden"
            initial={{ x: "-50%", opacity: 0 }}
            animate={{ x: ["-50%", "50%"], opacity: [0, 1, 1, 0] }}
            transition={packet}
          >
            <span className={cn(dot, "left-1/2")} />
          </motion.span>
          <motion.span
            className="absolute inset-0 hidden lg:block"
            initial={{ y: "-50%", opacity: 0 }}
            animate={{ y: ["-50%", "50%"], opacity: [0, 1, 1, 0] }}
            transition={packet}
          >
            <span className={cn(dot, "left-0")} />
          </motion.span>
        </Fragment>
      )}
      {label && (
        // Desktop only: phones show the hand-off in the panel. Positioning lives on a plain
        // wrapper because motion's inline transform would override Tailwind translate classes.
        <span className="absolute inset-y-0 left-4 hidden items-center lg:flex">
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
