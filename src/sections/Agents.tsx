import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Lock } from "lucide-react";
import { agentRoster, orchestrator, watchdog } from "../content";
import { Section } from "../components/Section";

// Cue sheet, after the film's orchestration scene: bus, agents ticking in, watchdog, then its lock.
const BUS = 0.2;
const AGENT = (k: number) => 0.45 + k * 0.12;
const WATCHDOG = AGENT(agentRoster.length) + 0.2;
const LOCK = WATCHDOG + 0.6;

const slam = (delay: number, from = 1.25) => ({
  hidden: { opacity: 0, scale: from },
  show: { opacity: 1, scale: 1, transition: { delay, type: "spring", duration: 0.45, bounce: 0 } },
}) as const;

const dot = "absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400";

export function Agents() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduce = useReducedMotion();
  // Loops run only while on-screen.
  const loop = inView && !reduce;

  return (
    <Section
      id="agents"
      eyebrow="Agentic orchestration"
      title="A team of specialists, under supervision"
      intro="An orchestrator leases work to agents with one job each, their own model, and hard limits. A watchdog supervises, but can never edit evidence."
    >
      <motion.div ref={ref} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
        <motion.div
          variants={slam(WATCHDOG, 1.1)}
          className="mb-4 flex flex-col gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 sm:flex-row sm:items-center sm:gap-4"
        >
          <b className="text-lg font-semibold text-emerald-200">{watchdog.title}</b>
          <span className="text-sm text-stone-300">{watchdog.detail}</span>
          <motion.em
            variants={slam(LOCK, 1.5)}
            className="inline-flex items-center gap-1.5 self-start rounded-full border border-rose-400/50 px-2.5 py-1 text-xs not-italic text-rose-300 sm:ml-auto sm:self-auto"
          >
            <Lock className="size-3.5" aria-hidden />
            {watchdog.limit}
          </motion.em>
        </motion.div>

        <div className="lg:grid lg:grid-cols-[15rem_4rem_1fr] lg:items-center">
          <motion.div
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { ease: "easeOut" } } }}
            className="rounded-xl border border-white/15 bg-[#1f1c19] p-4"
          >
            <h3 className="text-xl font-semibold">{orchestrator.title}</h3>
            {orchestrator.lines.map((line) => (
              <p key={line} className="mt-1 text-xs text-stone-400">{line}</p>
            ))}
            {/* Task lane: leased work streaming out. */}
            <div aria-hidden className="relative mt-4 h-2 overflow-hidden rounded-full bg-white/5">
              {loop &&
                [0, 1, 2].map((k) => (
                  <motion.span
                    key={k}
                    className="absolute inset-0"
                    initial={{ x: "-30%" }}
                    animate={{ x: ["-30%", "100%"] }}
                    transition={{ duration: 2.4, ease: "linear", repeat: Infinity, delay: k * 0.8 }}
                  >
                    <span className="absolute inset-y-0 left-0 w-1/4 rounded-full bg-emerald-400/80" />
                  </motion.span>
                ))}
            </div>
          </motion.div>

          {/* Bus: vertical on phones, horizontal beside the grid from lg. Dots carry tasks to the agents. */}
          <div aria-hidden className="relative ml-8 h-12 w-px lg:hidden">
            <motion.span
              variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { delay: BUS, duration: 0.3, ease: "easeOut" } } }}
              className="absolute inset-0 origin-top bg-emerald-500/60"
            />
            {loop &&
              [0, 1].map((k) => (
                <motion.span
                  key={k}
                  className="absolute inset-0"
                  initial={{ y: "-50%", opacity: 0 }}
                  animate={{ y: ["-50%", "50%"], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.2, ease: "linear", repeat: Infinity, delay: BUS + 0.4 + k * 0.6 }}
                >
                  <span className={`${dot} left-1/2 top-1/2`} />
                </motion.span>
              ))}
          </div>
          <div aria-hidden className="relative hidden h-px lg:block">
            <motion.span
              variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { delay: BUS, duration: 0.3, ease: "easeOut" } } }}
              className="absolute inset-0 origin-left bg-emerald-500/60"
            />
            {loop &&
              [0, 1].map((k) => (
                <motion.span
                  key={k}
                  className="absolute inset-0"
                  initial={{ x: "-50%", opacity: 0 }}
                  animate={{ x: ["-50%", "50%"], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.2, ease: "linear", repeat: Infinity, delay: BUS + 0.4 + k * 0.6 }}
                >
                  <span className={`${dot} left-1/2 top-1/2`} />
                </motion.span>
              ))}
          </div>

          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {agentRoster.map((a, k) => (
              <motion.li
                key={a.role}
                variants={slam(AGENT(k))}
                className="relative rounded-xl border border-white/15 bg-[#1f1c19] p-3"
              >
                {/* Flash as each agent comes online (opacity only, so it stays on the compositor). */}
                <motion.span
                  aria-hidden
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: [0, 1, 0], transition: { delay: AGENT(k), duration: 0.7, times: [0, 0.15, 1] } },
                  }}
                  className="pointer-events-none absolute -inset-px rounded-xl border border-emerald-400"
                />
                <b className="block text-sm font-medium leading-tight">{a.role}</b>
                <span className="mt-1 block text-xs text-emerald-300">{a.model}</span>
                <small className="mt-1 block text-xs text-stone-500">{a.limit}</small>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
      
    </Section>
  );
}
