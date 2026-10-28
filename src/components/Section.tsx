import React from "react";
import { motion } from "motion/react";
import { cn } from "../lib/cn";

/** Shared press feedback + focus ring for every tappable control. */
export const pressable =
  "transition duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 motion-safe:enabled:active:scale-[0.96]";

/** Fades content up once when it scrolls into view. MotionConfig turns the slide into a plain fade under reduced motion. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.3, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto max-w-6xl scroll-mt-14 px-4 py-16 sm:px-6 sm:py-24 lg:py-32", className)}>
      <Reveal className="mb-8 max-w-2xl sm:mb-10">
        <p className="text-sm font-medium text-amber-400">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold sm:text-4xl">{title}</h2>
        {intro && <p className="mt-3 text-base text-stone-400 sm:mt-4 sm:text-lg">{intro}</p>}
      </Reveal>
      {children}
    </section>
  );
}
