import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, Github } from "lucide-react";
import { site } from "../content";

const button =
  "inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60";

export function Hero() {
  const reduce = useReducedMotion();
  const words = site.tagline.split(" ");
  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut", delay },
  } as const);

  return (
    <header className="mx-auto flex min-h-[85dvh] max-w-6xl flex-col justify-center px-4 py-20 sm:px-6">
      <motion.p {...fade(0)} className="text-sm font-medium text-emerald-400">
        {site.name} · {site.event}
      </motion.p>
      <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl">
        {words.map((word, i) => (
          <span key={i}>
            <motion.span {...fade(0.05 + i * 0.03)} className="inline-block">
              {word}
            </motion.span>{" "}
          </span>
        ))}
      </h1>
      <motion.p {...fade(0.4)} className="mt-6 max-w-2xl text-lg text-stone-400">
        {site.summary}
      </motion.p>
      <motion.div {...fade(0.5)} className="mt-10 flex flex-wrap gap-3">
        <a href="#flow" className={`${button} border-emerald-500/30 bg-emerald-600 text-white hover:bg-emerald-500`}>
          See how it works <ArrowDown className="size-4" aria-hidden />
        </a>
        <a href={site.repoUrl} className={`${button} border-white/10 bg-white/10 text-stone-200 hover:bg-white/15`}>
          <Github className="size-4" aria-hidden /> View the code
        </a>
      </motion.div>
    </header>
  );
}
