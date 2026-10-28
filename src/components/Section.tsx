import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../lib/cn";

/** Fades content up once when it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
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
    <section id={id} className={cn("mx-auto max-w-6xl scroll-mt-8 px-4 py-20 sm:px-6", className)}>
      <Reveal className="mb-10 max-w-2xl">
        <p className="text-sm font-medium text-emerald-400">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">{title}</h2>
        {intro && <p className="mt-4 text-lg text-stone-400">{intro}</p>}
      </Reveal>
      {children}
    </section>
  );
}
