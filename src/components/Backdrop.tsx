import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

// One continuous scene behind the whole page. Every layer is scroll-linked (nothing moves
// while the reader is still), animates transform/opacity only, and stays faint.

const ROW = 24; // px, matches leading-6
const ROWS = 50; // one block of hex rows, rendered twice so the loop is seamless
const BLOCK = ROW * ROWS;
const DOT = 28;

const hexRows = Array.from({ length: ROWS }, (_, i) => {
  const bytes = Array.from({ length: 8 }, (_, j) => ((i * 37 + j * 91 + 17) % 256).toString(16).padStart(2, "0"));
  return `${(0x401000 + i * 8).toString(16)}  ${bytes.join(" ")}`;
});

function HexColumn({ y, className }: { y?: MotionValue<number>; className: string }) {
  return (
    // 2xl only: below 1536px the side gutters are too narrow and the column would sit behind text.
    <motion.div style={{ y }} className={`absolute top-0 hidden whitespace-pre font-mono text-[11px] leading-6 text-stone-100/[0.06] 2xl:block ${className}`}>
      {[...hexRows, ...hexRows].map((row, i) => (
        <div key={i}>{row}</div>
      ))}
    </motion.div>
  );
}

export function Backdrop() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  // Repeating layers wrap with modulo, so they work for any page length.
  const dotsY = useTransform(scrollY, (v) => -((v * 0.08) % DOT));
  const hexY = useTransform(scrollY, (v) => -((v * 0.15) % BLOCK));
  // Strands lead the hero, then settle back so they never compete with content.
  const strandsY = useTransform(scrollY, [0, 2000], [0, -400]);
  const strandsOpacity = useTransform(scrollY, [0, 900], [1, 0.35]);

  const bind = <T,>(value: T) => (reduce ? undefined : value);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.svg style={{ y: bind(dotsY) }} className="absolute inset-x-0 top-0 h-[calc(100%+28px)] w-full text-stone-100/[0.07]">
        <defs>
          <pattern id="dots" width={DOT} height={DOT} patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </motion.svg>

      <HexColumn y={bind(hexY)} className="left-6" />
      <HexColumn y={bind(hexY)} className="right-6 text-right" />

      <motion.svg
        style={{ y: bind(strandsY), opacity: bind(strandsOpacity) }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-x-0 top-0 h-[140dvh] w-full text-emerald-500"
        fill="none"
        stroke="currentColor"
      >
        {/* Two strands that run apart and rejoin: the splice. */}
        <path d="M-100 690C300 470 620 930 920 610S1300 300 1600 430" strokeWidth="1.5" strokeOpacity="0.4" />
        <path d="M-100 760C330 560 640 980 950 660S1320 380 1600 520" strokeWidth="1.5" strokeOpacity="0.22" />
        <path d="M-100 190C380 360 720 40 1100 250S1500 150 1600 90" strokeWidth="1" strokeOpacity="0.15" />
      </motion.svg>
    </div>
  );
}
