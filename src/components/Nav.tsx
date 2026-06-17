import { Magnetic } from "./Magnetic";

const links = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
];

export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 md:px-10">
        <a href="#top" data-cursor="link" className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_var(--color-glow)]" />
          <span className="font-display text-lg font-semibold tracking-tight">
            Katalyst<span className="text-muted-foreground">/Digital</span>
          </span>
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-cursor="link"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/auth"
            data-cursor="link"
            className="hidden rounded-full border border-border px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:bg-foreground hover:text-background md:inline-flex"
          >
            Employee Login
          </a>
          <Magnetic strength={0.4}>
            <a
              href="#contact"
              data-cursor="link"
              className="group relative inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-5 py-2.5 text-sm backdrop-blur-md transition-colors hover:bg-foreground hover:text-background"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent group-hover:bg-background" />
              Get in Touch
            </a>
          </Magnetic>
        </div>
      </div>
    </header>
  );
}
