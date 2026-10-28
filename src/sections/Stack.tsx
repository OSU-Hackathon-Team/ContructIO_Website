import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { stack } from "../content";
import { cn } from "../lib/cn";
import { pressable, Section } from "../components/Section";

const tile = "grid size-8 shrink-0 place-items-center rounded-lg";
const control = cn(
  "grid size-11 place-items-center rounded-lg border border-white/10 bg-white/5 text-stone-200 hover:bg-white/10 disabled:opacity-40",
  pressable
);

export function Stack() {
  const ref = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const [edges, setEdges] = useState({ start: true, end: false });

  const updateEdges = () => {
    const el = ref.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 1, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 });
  };

  // Page by one card width (snap settles the exact position).
  const page = (dir: 1 | -1) => {
    const el = ref.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.clientWidth + 12), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <Section
      id="stack"
      eyebrow="Under the hood"
      title="Reverse engineering, agents, and distributed systems in one pipeline"
    >
      <div className="-mt-4 mb-4 flex justify-end gap-2 sm:-mt-6">
        <button type="button" aria-label="Previous technologies" onClick={() => page(-1)} disabled={edges.start} className={control}>
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <button type="button" aria-label="Next technologies" onClick={() => page(1)} disabled={edges.end} className={control}>
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>

      <ul
        ref={ref}
        onScroll={updateEdges}
        tabIndex={0}
        aria-label="Technologies by layer"
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto overscroll-x-contain px-4 pb-2 [scrollbar-width:none] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 sm:-mx-6 sm:scroll-px-6 sm:px-6 [&::-webkit-scrollbar]:hidden"
      >
        {stack.map((layer) => (
          // 85% wide on phones so the next card peeks in and invites a swipe.
          <li key={layer.title} className="w-[85%] shrink-0 snap-start sm:w-[22rem]">
            {/* No card-level fade: it would hide the peeking card that signals the row scrolls. */}
            <div className="h-full rounded-xl border border-white/10 bg-[#141414] p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <layer.icon className="size-5 text-amber-400" aria-hidden />
                <h3 className="text-lg font-semibold">{layer.title}</h3>
              </div>
              <p className="mt-1 text-sm text-stone-400">{layer.blurb}</p>
              {/* Logos pop in one after another once the card scrolls into view. */}
              <motion.ul
                className="mt-4 space-y-3"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                variants={{ show: { transition: { delayChildren: 0.15, staggerChildren: 0.06 } } }}
              >
                {layer.items.map((item) => (
                  <li key={item.name} className="flex items-center gap-3">
                    <motion.span
                      variants={{ hidden: { opacity: 0, scale: 0.6 }, show: { opacity: 1, scale: 1 } }}
                      transition={{ type: "spring", duration: 0.35, bounce: 0 }}
                      className={cn(tile, item.logo ? "bg-stone-100 p-1.5" : "bg-amber-500/15 p-1.5 text-amber-300")}
                    >
                      {item.logo ? (
                        <img src={`${import.meta.env.BASE_URL}logos/${item.logo}`} alt="" className="size-full object-contain" />
                      ) : (
                        item.icon && <item.icon className="size-full" aria-hidden />
                      )}
                    </motion.span>
                    <span className="min-w-0">
                      <b className="block text-sm font-medium">{item.name}</b>
                      <small className="block text-xs text-stone-400">{item.what}</small>
                    </span>
                  </li>
                ))}
              </motion.ul>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
