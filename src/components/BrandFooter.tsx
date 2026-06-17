import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

export function BrandFooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });

  const wordmarkY = useTransform(scrollYProgress, [0, 1], [120, 0]);
  const wordmarkOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 0.6, 1]);
  const wordmarkScale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const rimOpacity = useTransform(scrollYProgress, [0.3, 1], [0, 1]);

  // Starfield
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let stars: { x: number; y: number; r: number; a: number; s: number; vx: number; vy: number; baseX: number; baseY: number }[] = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: 180 }, () => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return {
          x, y, baseX: x, baseY: y,
          r: Math.random() * 1.2 + 0.2,
          a: Math.random() * Math.PI * 2,
          s: Math.random() * 0.015 + 0.005,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.08,
        };
      });
      setReady(true);
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        s.a += s.s;
        s.x += s.vx;
        s.y += s.vy;
        // gentle drift, wrap on edges
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;
        const alpha = 0.25 + Math.abs(Math.sin(s.a)) * 0.75;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,230,255,${alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <footer ref={sectionRef} className="relative isolate overflow-hidden border-t border-border bg-[#000005]">
      {/* Starfield canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
      />

      {/* Atmospheric horizon glow */}
      <motion.div
        style={{ opacity: rimOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-[120px] mx-auto h-[380px] w-[140%] -translate-x-[14%] rounded-[100%] bg-[radial-gradient(ellipse_at_center,_oklch(0.75_0.15_180)/0.35,_oklch(0.4_0.12_200)/0.15_40%,_transparent_70%)] blur-2xl"
      />

      {/* Subtle purple top haze */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[300px] w-[80%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,_oklch(0.4_0.18_280)/0.25,_transparent_70%)] blur-3xl" />

      {/* Animated moon/white dots */}
      <motion.div
        animate={{ x: [0, 30, -10, 0], y: [0, -12, 8, 0], opacity: [0.7, 1, 0.8, 0.7] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[58%] top-[10%] h-3 w-3 rounded-full bg-[oklch(0.85_0.04_270)] shadow-[0_0_24px_6px_oklch(0.85_0.04_270/0.5)]"
      />
      <motion.div
        animate={{ x: [0, -20, 15, 0], y: [0, 18, -6, 0], opacity: [0.5, 0.9, 0.6, 0.5] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[22%] top-[18%] h-1.5 w-1.5 rounded-full bg-white/80"
      />
      <motion.div
        animate={{ x: [0, 14, -8, 0], y: [0, -10, 6, 0], opacity: [0.4, 0.85, 0.5, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        className="pointer-events-none absolute left-[78%] top-[28%] h-1 w-1 rounded-full bg-white/70"
      />
      <motion.div
        animate={{ x: [0, -18, 10, 0], y: [0, 6, -14, 0], opacity: [0.3, 0.8, 0.5, 0.3] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="pointer-events-none absolute left-[40%] top-[6%] h-1 w-1 rounded-full bg-white/60"
      />

      <div className="relative mx-auto flex w-full max-w-[1800px] flex-col items-center px-4 pt-32 pb-12">
        {/* Massive faded brand wordmark with scroll reveal + magnetic hover glow */}
        <MagneticWordmark
          wordmarkY={wordmarkY}
          wordmarkOpacity={wordmarkOpacity}
          wordmarkScale={wordmarkScale}
        />


        {/* Planet horizon arc */}
        <div className="relative mt-2 w-full">
          <svg viewBox="0 0 1600 200" preserveAspectRatio="none" className="block h-[200px] w-full">
            <defs>
              <linearGradient id="rim" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="oklch(0.7 0.04 250)" stopOpacity="0" />
                <stop offset="20%" stopColor="oklch(0.85 0.04 220)" stopOpacity="0.9" />
                <stop offset="50%" stopColor="oklch(0.98 0.02 200)" stopOpacity="1" />
                <stop offset="80%" stopColor="oklch(0.85 0.04 220)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="oklch(0.7 0.04 250)" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="planet" cx="0.5" cy="1" r="0.6">
                <stop offset="0%" stopColor="oklch(0.06 0.02 240)" />
                <stop offset="100%" stopColor="#000005" />
              </radialGradient>
            </defs>
            <path d="M -200 220 Q 800 -80 1800 220 L 1800 220 L -200 220 Z" fill="url(#planet)" />
            <motion.path
              d="M -200 220 Q 800 -80 1800 220"
              fill="none"
              stroke="url(#rim)"
              strokeWidth="1.2"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path
              d="M -200 222 Q 800 -78 1800 222"
              fill="none"
              stroke="url(#rim)"
              strokeWidth="3"
              opacity="0.35"
              style={{ filter: "blur(6px)" }}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
        </div>

        <div className="relative z-10 mt-10 flex w-full max-w-[1400px] flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 text-xs text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} Katalyst Digital. Engineered with intent.</div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Currently accepting Q3 engagements
          </div>
        </div>
      </div>
    </footer>
  );
}

type MWProps = {
  wordmarkY: ReturnType<typeof useTransform<number, number>>;
  wordmarkOpacity: ReturnType<typeof useTransform<number, number>>;
  wordmarkScale: ReturnType<typeof useTransform<number, number>>;
};

function MagneticWordmark({ wordmarkY, wordmarkOpacity, wordmarkScale }: MWProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Raw pointer position relative to wordmark center
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  // Distance-based intensity 0..1 (1 = at center)
  const intensityRaw = useMotionValue(0);

  // Springs for smooth ramps
  const sx = useSpring(mx, { stiffness: 120, damping: 22, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 120, damping: 22, mass: 0.6 });
  const intensity = useSpring(intensityRaw, { stiffness: 80, damping: 24, mass: 0.8 });

  // Magnetic translation of the wordmark itself (subtle pull toward cursor)
  const pullX = useTransform(sx, [0, 1], [-18, 18]);
  const pullY = useTransform(sy, [0, 1], [-10, 10]);

  // Spotlight position
  const bgX = useTransform(sx, (v) => `${v * 100}%`);
  const bgY = useTransform(sy, (v) => `${v * 100}%`);

  // Drop-shadow intensity blended via motion template
  const blur1 = useTransform(intensity, [0, 1], [0, 80]);
  const blur2 = useTransform(intensity, [0, 1], [0, 160]);
  const alpha1 = useTransform(intensity, [0, 1], [0, 0.7]);
  const alpha2 = useTransform(intensity, [0, 1], [0, 0.45]);
  const filter = useMotionTemplate`drop-shadow(0 0 ${blur1}px oklch(0.88 0.16 200 / ${alpha1})) drop-shadow(0 0 ${blur2}px oklch(0.75 0.18 220 / ${alpha2}))`;

  // Spotlight overlay
  const spotAlpha = useTransform(intensity, [0, 1], [0, 0.55]);
  const spotlight = useMotionTemplate`radial-gradient(circle at ${bgX} ${bgY}, oklch(0.95 0.12 200 / ${spotAlpha}), transparent 45%)`;

  // Rim glow under text scales with intensity
  const rimOp = useTransform(intensity, [0, 1], [0.5, 1]);
  const rimScale = useTransform(intensity, [0, 1], [1, 1.25]);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    mx.set(nx);
    my.set(ny);
    // Intensity = 1 at center, falls to 0 at edges (smooth radial ramp)
    const dx = nx - 0.5;
    const dy = ny - 0.5;
    const dist = Math.min(1, Math.sqrt(dx * dx + dy * dy) * 2);
    intensityRaw.set(1 - dist * dist); // smoother easing
  };

  return (
    <motion.div
      ref={ref}
      className="relative w-full"
      style={{ y: wordmarkY, opacity: wordmarkOpacity, scale: wordmarkScale }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        intensityRaw.set(0);
        mx.set(0.5);
        my.set(0.5);
      }}
      onPointerMove={handleMove}
    >
      <motion.h2
        data-cursor="text"
        aria-label="Katalyst"
        style={{
          fontSize: "clamp(5rem, 24vw, 26rem)",
          backgroundImage:
            "linear-gradient(180deg, oklch(0.32 0.04 260) 0%, oklch(0.18 0.03 250) 35%, oklch(0.1 0.04 200) 75%, oklch(0.18 0.06 180) 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          x: pullX,
          y: pullY,
          filter,
        }}
        className="select-none text-center font-display font-medium leading-[0.85] tracking-tighter text-transparent will-change-transform"
      >
        Katalyst
      </motion.h2>

      {/* Cursor-tracked spotlight overlay clipped to text */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 select-none text-center font-display font-medium leading-[0.85] tracking-tighter mix-blend-screen"
        style={{
          fontSize: "clamp(5rem, 24vw, 26rem)",
          backgroundImage: spotlight,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          x: pullX,
          y: pullY,
        }}
      >
        Katalyst
      </motion.div>

      {/* Bright atmospheric rim under text — intensifies smoothly with cursor */}
      <motion.div
        style={{ opacity: rimOp, scaleY: rimScale }}
        className="pointer-events-none absolute inset-x-0 -bottom-2 mx-auto h-[160px] w-[120%] -translate-x-[10%] origin-top bg-[radial-gradient(ellipse_at_center,_oklch(0.85_0.08_180)/0.45,_transparent_60%)] blur-xl mix-blend-screen"
      />

      {/* Keep hovered referenced (suppresses unused warning + could drive future state) */}
      <span className="sr-only">{hovered ? "active" : "idle"}</span>
    </motion.div>
  );
}

