import { problems } from "../content";
import { Reveal, Section } from "../components/Section";

export function Problem() {
  return (
    <Section id="why" eyebrow="Why it matters" title="Software outlives the people who understand it">
      <div className="grid gap-4 md:grid-cols-3">
        {problems.map(({ icon: Icon, title, body }, i) => (
          <Reveal key={title} delay={i * 0.08} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <Icon className="size-6 text-emerald-400" aria-hidden />
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-stone-400">{body}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
