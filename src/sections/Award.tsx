import { Trophy } from "lucide-react";
import { about } from "../content";
import { cn } from "../lib/cn";
import { Reveal, Section } from "../components/Section";
import { Counter } from "./Results";

const { award, stats } = about;

/** Responsive photo: phones fetch the 800px copy. width/height reserve space so nothing jumps while it loads. */
function Photo({ name, alt, sizes, className }: { name: string; alt: string; sizes: string; className?: string }) {
  const src = (w: number) => `${import.meta.env.BASE_URL}images/${name}-${w}.jpg`;
  return (
    <img
      src={src(1600)}
      srcSet={`${src(800)} 800w, ${src(1600)} 1600w`}
      sizes={sizes}
      width={1600}
      height={1200}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={cn("w-full rounded-2xl object-cover outline outline-1 -outline-offset-1 outline-white/10", className)}
    />
  );
}

export function Award() {
  return (
    <Section id="award" eyebrow={award.event} title={award.name}>
      <div className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
        <Reveal>
          <blockquote className="mt-4 border-l-2 border-amber-400 pl-4 text-xl font-medium leading-snug text-stone-100 sm:text-2xl lg:text-3xl">
            “{award.criteria}”
          </blockquote>
          <p className="mt-4 text-stone-400">{award.context}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/10 pt-6 sm:grid-cols-4 lg:grid-cols-2 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="text-sm text-stone-400">{s.label}</dt>
                <dd className="text-3xl font-semibold tabular-nums text-stone-100 sm:text-4xl">
                  <Counter to={s.value} />
                  <span className="text-amber-400">{s.suffix}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}

/** Photos from the weekend, at the bottom of the page. */
export function Gallery() {
  const { win, team } = award.photos;
  return (
    <Section id="photos" eyebrow={award.event} title="From the weekend">
      <div className="grid gap-8 sm:grid-cols-2 sm:gap-4 lg:gap-6">
        {[win, team].map((photo, i) => (
          <Reveal key={photo.name} delay={i * 0.08}>
            <figure>
              <Photo name={photo.name} alt={photo.alt} sizes="(min-width: 640px) 50vw, 100vw" className="aspect-[4/3]" />
              <figcaption className="mt-3 text-sm text-stone-500">{photo.caption}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
