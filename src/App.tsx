import { site } from "./content";
import { Hero } from "./sections/Hero";
import { Problem } from "./sections/Problem";
import { DataFlow } from "./sections/DataFlow";
import { Stack } from "./sections/Stack";
import { Results } from "./sections/Results";
import { Team } from "./sections/Team";

export function App() {
  return (
    <>
      <Hero />
      <main>
        <Problem />
        <DataFlow />
        <Stack />
        <Results />
        <Team />
      </main>
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-stone-500 sm:px-6">
          <p>{site.name} · Built at {site.event}</p>
          <div className="flex gap-4">
            <a href={site.repoUrl} className="hover:text-stone-300">GitHub</a>
            <a href={`mailto:${site.contactEmail}`} className="hover:text-stone-300">{site.contactEmail}</a>
          </div>
        </div>
      </footer>
    </>
  );
}
