import { film } from "../content";
import { Reveal, Section } from "../components/Section";

export function Film() {
  const url = (path: string) => `${import.meta.env.BASE_URL}${path}`;
  return (
    <Section id="film" eyebrow={`The film · ${film.length}`} title={film.title} intro={film.blurb}>
      <Reveal>
        {/* preload="none": the 13 MB file only downloads when someone presses play. No autoplay, it's narrated. */}
        <video
          controls
          playsInline
          preload="none"
          poster={url(film.poster)}
          width={1280}
          height={720}
          className="aspect-video w-full rounded-2xl bg-black outline outline-1 -outline-offset-1 outline-white/10"
        >
          <source src={url(film.src)} type="video/mp4" />
        </video>
      </Reveal>
    </Section>
  );
}
