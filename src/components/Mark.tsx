import { motion } from "motion/react";

// The Splice mark from the launch film (HackOHIO_2026_Video/.../src/Film.tsx): two halves that
// outline a cube. `assemble` replays the film's AssembleMark: the halves slide together on load.
const TOP = "M10 5h17l-9 13H1L10 5Z";
const BOTTOM = "M22 22h17l-9 13H13l9-13Z";

export function Mark({ className, assemble = false }: { className?: string; assemble?: boolean }) {
  const half = (d: string, from: { x: number; y: number }, delay: number) => (
    <motion.path
      d={d}
      fill="currentColor"
      initial={assemble ? { opacity: 0, ...from } : false}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ type: "spring", duration: 0.6, bounce: 0, delay }}
    />
  );
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      {half(TOP, { x: -10, y: -6 }, 0)}
      {half(BOTTOM, { x: 10, y: 6 }, 0.1)}
    </svg>
  );
}
