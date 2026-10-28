import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { results } from "../content";
import { Reveal, Section } from "../components/Section";

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const value = useMotionValue(reduce ? to : 0);
  const rounded = useTransform(value, (v) => Math.round(v));

  useEffect(() => {
    if (!inView) return;
    if (reduce) return value.set(to);
    const controls = animate(value, to, { duration: 1, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, reduce, to, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export function Results() {
  return (
    <Section
      id="results"
      eyebrow="Results"
      title="Measured against the original, not against itself"
      intro="Numbers from recorded runs in our repo. Each comes with its scope, because honest evidence is the whole point."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {results.map((r, i) => (
          <Reveal key={r.label} delay={i * 0.08} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-4xl font-semibold tabular-nums text-emerald-400">
              <Counter to={r.value} />
              {r.suffix}
            </p>
            <p className="mt-2 font-medium">{r.label}</p>
            <p className="mt-3 text-sm text-stone-500">{r.caveat}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
