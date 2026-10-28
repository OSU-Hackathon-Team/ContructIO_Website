import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, Github, Trophy } from "lucide-react";
import { site } from "../content";
import { cn } from "../lib/cn";
import { pressable } from "../components/Section";

const button = cn(
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-5 font-medium",
  pressable
);

// Intentional page-load entrance; MotionConfig reduces it to a fade.
const fade = (delay: number) =>
  ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut", delay },
  }) as const;

export function Hero() {
  const words = site.tagline.split(" ");
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // As the reader scrolls on, the hero drifts up and fades: scroll-linked, so it never moves on its own.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <motion.section
      ref={ref}
      id="top"
      style={reduce ? undefined : { y, opacity }}
      className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-6xl flex-col justify-center px-4 py-12 sm:px-6 sm:py-20"
    >
      {/* Award badge lands first, slightly large, then settles. */}
      <motion.p
        initial={{ opacity: 0, scale: 1.15 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.45, bounce: 0 }}
        className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-500/40 bg-emerald-500/10 py-1.5 pl-2 pr-3 text-sm font-medium text-emerald-200"
      >
        <Trophy className="size-4 text-emerald-400" aria-hidden />
        {site.award} · {site.event}
      </motion.p>
      <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-tight sm:mt-4 sm:text-5xl lg:text-6xl">
        {words.map((word, i) => (
          <span key={i}>
            <motion.span {...fade(0.05 + i * 0.03)} className="inline-block">
              {word}
            </motion.span>{" "}
          </span>
        ))}
      </h1>
      <motion.p {...fade(0.4)} className="mt-5 max-w-2xl text-base text-stone-400 sm:mt-6 sm:text-lg">
        {site.summary}
      </motion.p>
      <motion.div {...fade(0.5)} className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">
        <a href="#flow" className={cn(button, "border-emerald-500/30 bg-emerald-600 text-white hover:bg-emerald-500")}>
          See how it works <ArrowDown className="size-4" aria-hidden />
        </a>
        <a href={site.repoUrl} className={cn(button, "border-white/10 bg-white/10 text-stone-200 hover:bg-white/15")}>
          <Github className="size-4" aria-hidden /> View the code
        </a>
      </motion.div>
    </motion.section>
  );
}
