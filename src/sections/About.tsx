import { about } from "../content";
import { Reveal, Section } from "../components/Section";

export function About() {
  return (
    <Section id="about" eyebrow="About" title={about.title}>
      <Reveal className="max-w-3xl space-y-4 text-base text-stone-300 sm:text-lg">
        {about.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </Reveal>
    </Section>
  );
}
