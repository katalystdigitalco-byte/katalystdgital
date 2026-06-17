import { useQuery } from "@tanstack/react-query";
import { Magnetic } from "./Magnetic";
import { Reveal } from "./Reveal";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const fallback = [
  {
    name: "Launch",
    tagline: "For founders shipping their first serious product.",
    price: "INR 20k",
    cadence: "/ project",
    features: [
      "Brand identity essentials",
      "5-page responsive site",
      "Basic SEO + analytics",
      "2 weeks of polish",
    ],
    featured: false,
    cta: "Start small",
  },
  {
    name: "Scale",
    tagline: "Our most-picked engagement for growing teams.",
    price: "INR 50k",
    cadence: "/ project",
    featured: true,
    features: [
      "Full brand + design system",
      "Custom web app or storefront",
      "CMS, integrations, dashboards",
      "Performance + SEO suite",
      "6 weeks of dedicated build",
    ],
    cta: "Build with us",
  },
  {
    name: "Engineered",
    tagline: "Bespoke IT systems & long-term partnership.",
    price: "Custom",
    cadence: "from INR 80k",
    features: [
      "Discovery + product strategy",
      "Multi-platform engineering",
      "Cloud / DevOps / AI integrations",
      "Quarterly roadmap & retainer",
    ],
    featured: false,
    cta: "Talk to engineering",
  },
];

export function Packages() {
  const { data } = useQuery({
    queryKey: ["public-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("name,tagline,price,cadence,features,featured,cta")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const tiers = data && data.length > 0 ? data : fallback;

  return (
    <section id="packages" className="relative overflow-hidden py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(ellipse_at_top,_oklch(0.78_0.14_240)/0.10,_transparent_60%)]" />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <div className="flex items-end justify-between gap-8">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Packages
              </div>
              <h2
                data-cursor="text"
                className="mt-4 font-display text-[clamp(2.5rem,7vw,6rem)] font-medium leading-[0.95] tracking-tighter"
              >
                Engagements,
                <br />
                <span className="italic text-muted-foreground">priced honestly.</span>
              </h2>
            </div>
            <p className="hidden max-w-sm text-sm text-muted-foreground md:block">
              Fixed-scope starts, retainer extensions, or fully bespoke builds — pick the shape that
              matches your stage.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal key={`${t.name}-${i}`} delay={i * 0.08}>
              <div
                data-cursor="link"
                className={[
                  "group relative flex h-full flex-col overflow-hidden rounded-2xl border p-8 backdrop-blur-xl transition-colors",
                  t.featured
                    ? "border-foreground/40 bg-gradient-to-b from-foreground/[0.06] to-card/40"
                    : "border-border bg-card/40 hover:border-foreground/30",
                ].join(" ")}
              >
                {t.featured && (
                  <div className="absolute right-6 top-6 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-accent">
                    Most picked
                  </div>
                )}
                <div className="font-display text-2xl">{t.name}</div>
                <p className="mt-2 text-sm text-muted-foreground">{t.tagline}</p>

                <div className="mt-8 flex items-baseline gap-2">
                  <div className="font-display text-5xl tracking-tighter">{t.price}</div>
                  <div className="text-sm text-muted-foreground">{t.cadence}</div>
                </div>

                <ul className="mt-8 space-y-3 text-sm">
                  {(t.features ?? []).map((f) => (
                    <li key={f} className="flex items-start gap-3 text-foreground/90">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 pt-6">
                  <Magnetic strength={0.2}>
                    <a
                      href="#contact"
                      data-cursor="view"
                      data-cursor-label="Inquire"
                      className={[
                        "inline-flex w-full items-center justify-between rounded-full px-6 py-3 text-sm font-medium transition-colors",
                        t.featured
                          ? "bg-foreground text-background hover:bg-foreground/90"
                          : "border border-border text-foreground hover:bg-foreground hover:text-background",
                      ].join(" ")}
                    >
                      {t.cta}
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </a>
                  </Magnetic>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
