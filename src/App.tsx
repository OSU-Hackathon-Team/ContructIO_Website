import { MotionConfig, motion, useScroll, useTransform } from "motion/react";
import { site } from "./content";
import { Backdrop } from "./components/Backdrop";
import { Hero } from "./sections/Hero";
import { Problem } from "./sections/Problem";
import { DataFlow } from "./sections/DataFlow";
import { Architecture } from "./sections/Architecture";
import { Agents } from "./sections/Agents";
import { Stack } from "./sections/Stack";
import { Results } from "./sections/Results";
import { Team } from "./sections/Team";

const nav = [
  { href: "#flow", label: "How it works" },
  { href: "#results", label: "Results" },
  { href: "#team", label: "Team" },
];

const navLink = "flex min-h-11 items-center rounded-lg px-2.5 text-stone-400 transition-colors hover:text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 sm:px-3";

function Header() {
  const { scrollY, scrollYProgress } = useScroll();
  // Transparent over the hero, solid once content scrolls under it (opacity only).
  const solid = useTransform(scrollY, [0, 80], [0, 1]);

  return (
    <header className="sticky top-0 z-40 pt-[env(safe-area-inset-top)]">
      <motion.div style={{ opacity: solid }} className="absolute inset-0 border-b border-white/10 bg-[#181614]/95" />
      <nav aria-label="Sections" className="relative mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="-ml-2 flex min-h-11 items-center rounded-lg px-2 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60">
          {site.name}
        </a>
        <ul className="-mr-2.5 flex text-sm sm:-mr-3">
          {nav.map((n) => (
            <li key={n.href}>
              <a href={n.href} className={navLink}>{n.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      {/* Reading progress. */}
      <motion.div style={{ scaleX: scrollYProgress }} className="absolute inset-x-0 bottom-0 h-px origin-left bg-emerald-400/70" />
    </header>
  );
}

export function App() {
  return (
    // "user": under prefers-reduced-motion, motion drops transforms and keeps opacity fades.
    <MotionConfig reducedMotion="user">
      <Backdrop />
      <Header />
      <main>
        <Hero />
        <Problem />
        <DataFlow />
        <Architecture />
        <Agents />
        <Stack />
        <Results />
        <Team />
      </main>
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 pt-8 pb-[max(2rem,env(safe-area-inset-bottom))] text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>{site.name} · {site.award}, {site.event}</p>
          <div className="-ml-2.5 flex flex-wrap sm:ml-0 sm:-mr-3">
            <a href={site.repoUrl} className={navLink}>GitHub</a>
            <a href={`mailto:${site.contactEmail}`} className={navLink}>{site.contactEmail}</a>
          </div>
        </div>
      </footer>
    </MotionConfig>
  );
}
