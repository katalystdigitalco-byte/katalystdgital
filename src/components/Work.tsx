import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { supabase } from "@/integrations/supabase/client";

const fallback = [
  { tag: "Commerce", title: "Lumen Apparel", meta: "Headless Shopify · +218% AOV" },
  { tag: "Platform", title: "Northwind OS", meta: "Internal SaaS · 14 teams" },
  { tag: "Brand", title: "Halo Robotics", meta: "Identity & launch site" },
  { tag: "Growth", title: "Cinder Studio", meta: "Paid + lifecycle · 6.4× ROAS" },
];

export function Work() {
  const { data } = useQuery({
    queryKey: ["public-case-studies-preview"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("case_studies")
        .select("id,tag,title,meta")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const projects = data && data.length > 0 ? data : fallback;

  return (
    <section id="work" className="py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <div className="flex items-end justify-between">
            <h2 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[0.95] tracking-tighter">
              Selected
              <br />
              <span className="text-muted-foreground italic">work.</span>
            </h2>
            <Link
              to="/case-studies"
              data-cursor="link"
              className="hidden text-sm text-muted-foreground hover:text-foreground md:block"
            >
              All case studies →
            </Link>
          </div>
        </Reveal>

        <div className="mt-16 divide-y divide-border border-y border-border">
          {projects.map((p, i) => (
            <Reveal key={`${p.title}-${i}`} delay={i * 0.05}>
              <Link
                to="/case-studies"
                data-cursor="view"
                data-cursor-label="View"
                className="group flex items-center justify-between gap-8 py-10 transition-colors hover:bg-card/40"
              >
                <div className="flex items-baseline gap-6 md:gap-10">
                  <span className="font-display text-xs text-muted-foreground tabular-nums">
                    0{i + 1}
                  </span>
                  <span className="font-display text-3xl font-medium tracking-tight md:text-5xl">
                    {p.title}
                  </span>
                </div>
                <div className="hidden items-center gap-6 md:flex">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{p.tag}</span>
                  <span className="text-sm text-muted-foreground">{p.meta}</span>
                  <span className="h-10 w-10 rounded-full border border-border flex items-center justify-center transition-all group-hover:bg-foreground group-hover:text-background group-hover:rotate-45">↗</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
