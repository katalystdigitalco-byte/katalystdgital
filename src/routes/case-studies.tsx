import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Cursor } from "@/components/Cursor";
import { Nav } from "@/components/Nav";
import { BrandFooter } from "@/components/BrandFooter";
import { Reveal } from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";
import { useFocusTrap } from "@/hooks/use-focus-trap";

const TITLE = "Case Studies — Katalyst Digital";
const DESCRIPTION =
  "Selected case studies from Katalyst Digital — commerce, platforms, brand, and growth engagements.";

export const Route = createFileRoute("/case-studies")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/case-studies" }],
  }),
  component: CaseStudiesPage,
});

type CaseStudy = {
  id: string;
  tag: string | null;
  title: string;
  meta: string | null;
  summary: string | null;
  body: string | null;
  image_url: string | null;
};

function CaseStudiesPage() {
  const [active, setActive] = useState<CaseStudy | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["public-case-studies-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("case_studies")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as CaseStudy[];
    },
    refetchOnMount: "always",
  });

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Cursor />
      <Nav />
      <main className="mx-auto max-w-[1400px] px-6 py-32 md:px-10">
        <Reveal>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <span className="h-px w-10 bg-border" />
            Case Studies
          </div>
          <h1 className="mt-6 font-display text-[clamp(2.5rem,7vw,6rem)] font-medium leading-[0.95] tracking-tighter">
            Work that <span className="italic text-muted-foreground">moved the needle.</span>
          </h1>
        </Reveal>

        <div className="mt-20 grid gap-6 md:grid-cols-2">
          {isLoading && (
            <div className="text-sm text-muted-foreground">Loading…</div>
          )}
          {data?.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.06}>
              <button
                type="button"
                onClick={() => setActive(c)}
                data-cursor="view"
                data-cursor-label="Open"
                className="group relative h-full w-full overflow-hidden rounded-2xl border border-border bg-card/40 p-8 text-left backdrop-blur-xl transition-colors hover:border-foreground/30 md:p-10"
              >
                {c.image_url && (
                  <img
                    src={c.image_url}
                    alt={c.title}
                    loading="lazy"
                    className="mb-6 h-48 w-full rounded-lg object-cover"
                  />
                )}
                <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  {c.tag}
                </div>
                <h2 className="mt-4 font-display text-3xl tracking-tight md:text-4xl">{c.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{c.meta}</p>
                {c.summary && (
                  <p className="mt-6 line-clamp-3 text-base leading-relaxed text-foreground/90">
                    {c.summary}
                  </p>
                )}
                <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground transition-colors group-hover:text-foreground">
                  View case study →
                </span>
              </button>
            </Reveal>
          ))}
          {!isLoading && (data?.length ?? 0) === 0 && (
            <div className="text-sm text-muted-foreground">No case studies yet.</div>
          )}
        </div>

        <div className="mt-20">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back home
          </Link>
        </div>
      </main>
      <BrandFooter />

      <CaseStudyDrawer study={active} onClose={() => setActive(null)} />
    </div>
  );
}

function CaseStudyDrawer({ study, onClose }: { study: CaseStudy | null; onClose: () => void }) {
  const open = !!study;
  const trapRef = useFocusTrap<HTMLElement>(open, onClose);
  return (
    <div
      className={`fixed inset-0 z-[100] transition-opacity duration-300 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      onClick={onClose}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-background/85 backdrop-blur-md" />
      <aside
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label={study?.title ?? "Case study"}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={`absolute right-0 top-0 h-full w-full max-w-3xl overflow-y-auto border-l border-border bg-card shadow-2xl outline-none transition-transform duration-500 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/90 px-8 py-5 backdrop-blur-md md:px-12">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {study?.tag ?? "Case Study"}
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {study && (
          <div className="px-8 py-10 md:px-12 md:py-14">
            <h2 className="font-display text-4xl tracking-tight md:text-6xl">{study.title}</h2>
            {study.meta && (
              <p className="mt-3 text-sm text-muted-foreground">{study.meta}</p>
            )}
            {study.image_url && (
              <img
                src={study.image_url}
                alt={study.title}
                className="mt-8 w-full rounded-xl object-cover"
              />
            )}
            {study.summary && (
              <p className="mt-10 font-display text-xl leading-snug text-foreground/90 md:text-2xl">
                {study.summary}
              </p>
            )}
            {study.body && (
              <div className="mt-8 whitespace-pre-wrap text-base leading-relaxed text-muted-foreground">
                {study.body}
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
