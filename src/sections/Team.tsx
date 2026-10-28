import { Github, Linkedin, Mail } from "lucide-react";
import { team, type Member } from "../content";
import { Reveal, Section } from "../components/Section";

const iconLink =
  "grid size-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-stone-300 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60";

function Avatar({ member }: { member: Member }) {
  if (member.photo) {
    return (
      <img
        src={`${import.meta.env.BASE_URL}${member.photo}`}
        alt={member.name}
        className="size-16 rounded-full object-cover"
      />
    );
  }
  const initials = member.name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  return (
    <span aria-hidden className="grid size-16 place-items-center rounded-full bg-emerald-500/15 text-lg font-semibold text-emerald-300">
      {initials}
    </span>
  );
}

export function Team() {
  return (
    <Section id="team" eyebrow="The team" title="Who built Splice">
      <div className="grid gap-4 sm:grid-cols-2">
        {team.map((m, i) => (
          <Reveal key={m.name} delay={i * 0.08} className="flex flex-col rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-4">
              <Avatar member={m} />
              <div className="min-w-0">
                <h3 className="truncate text-lg font-semibold">{m.name}</h3>
                <p className="text-sm text-emerald-400">{m.role}</p>
              </div>
            </div>
            <p className="mt-4 flex-1 text-stone-400">{m.bio}</p>
            <div className="mt-5 flex gap-2">
              {m.linkedin && (
                <a href={m.linkedin} target="_blank" rel="noreferrer" aria-label={`${m.name} on LinkedIn`} className={iconLink}>
                  <Linkedin className="size-4" aria-hidden />
                </a>
              )}
              {m.github && (
                <a href={m.github} target="_blank" rel="noreferrer" aria-label={`${m.name} on GitHub`} className={iconLink}>
                  <Github className="size-4" aria-hidden />
                </a>
              )}
              {m.email && (
                <a href={`mailto:${m.email}`} aria-label={`Email ${m.name}`} className={iconLink}>
                  <Mail className="size-4" aria-hidden />
                </a>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
