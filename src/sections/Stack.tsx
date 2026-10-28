import { motion, useReducedMotion } from "motion/react";
import { stack } from "../content";
import { Section } from "../components/Section";

export function Stack() {
  const reduce = useReducedMotion();
  return (
    <Section
      id="stack"
      eyebrow="Under the hood"
      title="Reverse engineering, agents, and distributed systems in one pipeline"
    >
      <motion.ul
        className="flex flex-wrap gap-2"
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ show: { transition: { staggerChildren: 0.03 } } }}
      >
        {stack.map((name) => (
          <motion.li
            key={name}
            variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-stone-300"
          >
            {name}
          </motion.li>
        ))}
      </motion.ul>
    </Section>
  );
}
