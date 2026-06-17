import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, MessageCircle, Phone, Globe, Mail } from "lucide-react";

const PHONE = "919050893815";
const MESSAGE = "Hi Katalyst — I'd like to chat about a project.";

const items = [
  { icon: Home, href: "#top", label: "Home" },
  {
    icon: MessageCircle,
    href: `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`,
    label: "WhatsApp",
  },
  { icon: Phone, href: "#contact", label: "Call" },
  { icon: Globe, href: "#work", label: "Work" },
  {
    icon: Mail,
    href: "mailto:connect@katalystdigital.co.in",
    label: "Email",
  },
];

export function FloatingDock() {
  const [tinted, setTinted] = useState(false);

  useEffect(() => {
    const onScroll = () => setTinted(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        delay: 0.6,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
      aria-label="Quick navigation"
    >
      <div
  className={`flex items-center gap-1 rounded-full border border-border px-3 py-2 backdrop-blur-xl overflow-visible transition-colors duration-500 ${
    tinted
      ? "bg-[oklch(0.78_0.14_240)/0.18] shadow-[0_8px_40px_-12px_oklch(0.78_0.14_240/0.5)]"
      : "bg-card/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]"
  }`}
>
        {items.map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            data-cursor="link"
            target={
              href.startsWith("http") || href.startsWith("mailto")
                ? "_blank"
                : undefined
            }
            rel={
              href.startsWith("http")
                ? "noopener noreferrer"
                : undefined
            }
            className="group relative grid h-11 w-11 place-items-center rounded-full text-muted-foreground transition-all duration-300 hover:scale-110 hover:bg-foreground hover:text-background"
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
<span
  className="
    pointer-events-none
    absolute
    left-1/2
    -top-12
    -translate-x-1/2
    whitespace-nowrap
    rounded-md
    border
    border-border
    bg-card
    backdrop-blur-xl
    px-2.5
    py-1
    text-xs
    font-medium
    text-foreground
    shadow-lg
    z-[999]
    opacity-0
    transition-all
    duration-200
    group-hover:opacity-100
    group-hover:-translate-y-1
  "
>
  {label}
</span>
          </a>
        ))}
      </div>
    </motion.nav>
  );
}