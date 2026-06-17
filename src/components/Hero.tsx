import { Magnetic } from "./Magnetic";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section id="top" className="relative min-h-screen overflow-hidden pt-32 pb-24">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-accent/20 blur-[140px] animate-orb" />
      <div className="pointer-events-none absolute top-1/3 right-0 h-[460px] w-[460px] rounded-full bg-[oklch(0.7_0.15_280)]/20 blur-[160px] animate-orb [animation-delay:-6s]" />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground"
        >
          <span className="h-px w-10 bg-border" />
          Digital Solutions · IT Studio · Est. 2026
        </motion.div>

        <h1 className="mt-10 font-display text-[clamp(3rem,9vw,9.5rem)] font-medium leading-[0.92] tracking-tighter">
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="block"
            data-cursor="text"
          >
            Accelerating
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="block text-muted-foreground"
            data-cursor="text"
          >
            business into the
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="block italic"
            data-cursor="text"
          >
            digital era.
          </motion.span>
        </h1>

        <div className="mt-16 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-xl text-base text-muted-foreground md:text-lg"
          >
            Katalyst Digital is a hybrid studio building bespoke IT systems, scaling e-commerce
            engines, and engineering the brand presence modern teams need to win the next decade.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center gap-4 md:justify-end"
          >
            <Magnetic strength={0.3}>
              <a
                href="#services"
                data-cursor="view"
                data-cursor-label="Explore"
                className="group inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-4 text-sm font-medium text-background transition-transform"
              >
                Start a project
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </a>
            </Magnetic>
            <a
              href="#work"
              data-cursor="link"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-4 text-sm text-foreground transition-colors hover:bg-secondary"
            >
              See our work
            </a>
          </motion.div>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative mt-32 overflow-hidden border-y border-border py-6">
        <div className="flex w-max gap-16 animate-marquee whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-16">
              {["Strategy", "Engineering", "Commerce", "Brand", "Growth", "AI Systems", "Cloud", "Design"].map((t) => (
                <span key={t} className="font-display text-2xl text-muted-foreground">
                  {t} <span className="mx-8 text-accent">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
