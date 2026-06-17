import { useQuery } from "@tanstack/react-query";
import { Reveal } from "./Reveal";
import { supabase } from "@/integrations/supabase/client";

const fallback = [
  {
    number_label: "01",
    title: "E-Commerce & Retail Scale",
    description:
      "End-to-end commerce management — storefronts, ops, conversion engineering, and growth systems that compound month over month.",
    points: ["Shopify / Headless builds", "Catalog & ops automation", "CRO & retention loops"],
  },
  {
    number_label: "02",
    title: "Custom IT Systems & Web Dev",
    description:
      "Production-grade applications, internal platforms, and modern architectures designed for resilience, speed, and scale.",
    points: ["SaaS & internal tools", "Cloud-native platforms", "AI-augmented workflows"],
  },
  {
    number_label: "03",
    title: "Digital Marketing & Social Growth",
    description:
      "Brand systems, performance media, and the social engine that turns attention into pipeline and pipeline into revenue.",
    points: ["Brand & identity systems", "Paid & lifecycle media", "Content & social ops"],
  },
];

export function Services() {
  const { data } = useQuery({
    queryKey: ["public-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("number_label,title,description,points")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const services = data && data.length > 0 ? data : fallback;

  return (
    <section id="services" className="relative py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <div className="flex items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <span className="h-px w-10 bg-border" />
                Capabilities
              </div>
              <h2 className="mt-6 font-display text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[0.95] tracking-tighter">
                Three engines.
                <br />
                <span className="text-muted-foreground">One operating system.</span>
              </h2>
            </div>
            <p className="hidden max-w-sm text-sm text-muted-foreground md:block">
              Every engagement blends engineering, brand, and commerce — calibrated to your stage,
              not a template.
            </p>
          </div>
        </Reveal>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={`${s.title}-${i}`} delay={i * 0.08}>
              <article
                data-cursor="view"
                data-cursor-label="View"
                className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card/40 p-8 backdrop-blur-xl transition-colors hover:bg-card/70"
              >
                <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-accent/10 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-display tracking-widest">{s.number_label}</span>
                  <span className="h-px flex-1 mx-4 bg-border" />
                  <span>Service</span>
                </div>
                <h3 className="mt-10 font-display text-2xl font-medium leading-tight tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                <ul className="mt-8 space-y-2 border-t border-border pt-6 text-sm">
                  {(s.points ?? []).map((p) => (
                    <li key={p} className="flex items-center gap-3 text-foreground/80">
                      <span className="h-1 w-1 rounded-full bg-accent" />
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
