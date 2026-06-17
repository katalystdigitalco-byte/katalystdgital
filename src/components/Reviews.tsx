import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Reveal } from "./Reveal";
import { WriteReview } from "./WriteReview";
import { supabase } from "@/integrations/supabase/client";
import { useFocusTrap } from "@/hooks/use-focus-trap";

type ReviewItem = {
  name: string;
  role_title: string;
  quote: string;
  rating: number;
};

const staticReviews: ReviewItem[] = [
  {
    quote:
      "Katalyst rebuilt our commerce stack in six weeks. Conversion lifted 41% in the first quarter — they think like operators, not vendors.",
    name: "Ananya Mehra",
    role_title: "VP Growth, Maison Noir",
    rating: 5,
  },
  {
    quote:
      "An honest, sharp team. Their engineers shipped infra we'd been quoted 6 months for in under 30 days, and the dashboards are gorgeous.",
    name: "David Okafor",
    role_title: "CTO, Northwind Labs",
    rating: 5,
  },
  {
    quote:
      "We hired Katalyst for a rebrand and ended up with a full digital operating system. The detail in every pixel and every API is unreal.",
    name: "Priya Raghavan",
    role_title: "Founder, Stratus Hotels",
    rating: 5,
  },
  {
    quote:
      "Working with them feels like having an in-house studio. Strategic, fast, and obsessed with craft. Easy 10/10.",
    name: "Marcus Lin",
    role_title: "Head of Product, Halo Finance",
    rating: 5,
  },
];

const PREVIEW_LIMIT = 180;

export function Reviews() {
  const [active, setActive] = useState<ReviewItem | null>(null);

  const { data } = useQuery({
    queryKey: ["approved-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id,name,role_title,quote,rating")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(12);
      if (error) throw error;
      return data ?? [];
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const reviews: ReviewItem[] = (data && data.length > 0)
    ? data.map((r) => ({ name: r.name, role_title: r.role_title ?? "", quote: r.quote, rating: r.rating }))
    : staticReviews;

  return (
    <section id="reviews" className="relative overflow-hidden py-32">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <span className="h-px w-10 bg-border" />
                Client Voices
              </div>
              <h2 className="mt-6 font-display text-[clamp(2.5rem,7vw,6rem)] font-medium leading-[0.95] tracking-tighter">
                <span data-cursor="text">Trusted by teams</span>
                <span className="block italic text-muted-foreground" data-cursor="text">
                  building the next era.
                </span>
              </h2>
            </div>
            <div className="flex flex-col items-end gap-4">
              <div className="hidden font-display text-sm text-muted-foreground md:block">
                4.9 / 5 · 80+ reviews
              </div>
              <WriteReview />
            </div>
          </div>
        </Reveal>

        <div className="mt-20 grid gap-6 md:grid-cols-2">
          {reviews.map((r, i) => {
            const isLong = r.quote.length > PREVIEW_LIMIT;
            const preview = isLong ? r.quote.slice(0, PREVIEW_LIMIT).trimEnd() + "…" : r.quote;
            return (
              <Reveal key={`${r.name}-${i}`} delay={i * 0.08}>
                <article
                  data-cursor="link"
                  className="group relative flex h-[340px] flex-col overflow-hidden rounded-2xl border border-border bg-card/40 p-8 backdrop-blur-xl transition-colors hover:border-foreground/30 md:p-10"
                >
                  <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent/10 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="flex gap-1 text-accent">
                    {Array.from({ length: r.rating || 5 }).map((_, k) => (
                      <span key={k}>★</span>
                    ))}
                  </div>
                  <p className="mt-6 line-clamp-5 font-display text-xl leading-snug md:text-2xl">
                    "{preview}"
                  </p>
                  {isLong && (
                    <button
                      type="button"
                      onClick={() => setActive(r)}
                      data-cursor="link"
                      className="mt-3 self-start text-xs uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Read more →
                    </button>
                  )}
                  <div className="mt-auto flex items-center justify-between border-t border-border pt-6">
                    <div>
                      <div className="font-display text-base">{r.name}</div>
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {r.role_title}
                      </div>
                    </div>
                    <div className="grid h-10 w-10 place-items-center rounded-full border border-border text-xs">
                      {r.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>

      <ReviewDrawer review={active} onClose={() => setActive(null)} />
    </section>
  );
}

function ReviewDrawer({ review, onClose }: { review: ReviewItem | null; onClose: () => void }) {
  const open = !!review;
  const trapRef = useFocusTrap<HTMLElement>(open, onClose);
  return (
    <div
      className={`fixed inset-0 z-[100] transition-opacity duration-300 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      onClick={onClose}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
      <aside
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label="Client review"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={`absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto border-l border-border bg-card p-8 shadow-2xl outline-none transition-transform duration-500 ease-out md:p-12 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <span className="h-px w-10 bg-border" />
            Client review
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {review && (
          <>
            <div className="mt-8 flex gap-1 text-accent text-lg">
              {Array.from({ length: review.rating || 5 }).map((_, k) => (
                <span key={k}>★</span>
              ))}
            </div>
            <p className="mt-6 whitespace-pre-wrap font-display text-2xl leading-snug md:text-3xl">
              "{review.quote}"
            </p>
            <div className="mt-10 flex items-center gap-4 border-t border-border pt-6">
              <div className="grid h-12 w-12 place-items-center rounded-full border border-border text-sm">
                {review.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <div className="font-display text-lg">{review.name}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {review.role_title}
                </div>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
