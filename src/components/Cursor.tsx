import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type Variant = "default" | "link" | "text" | "view";

export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const [variant, setVariant] = useState<Variant>("default");
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  const ringX = useSpring(x, { damping: 28, stiffness: 220, mass: 0.6 });
  const ringY = useSpring(y, { damping: 28, stiffness: 220, mass: 0.6 });
  const dotX = useSpring(x, { damping: 30, stiffness: 500, mass: 0.3 });
  const dotY = useSpring(y, { damping: 30, stiffness: 500, mass: 0.3 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)?.closest<HTMLElement>("[data-cursor]");
      if (!t) {
        setVariant("default");
        setLabel("");
        return;
      }
      const v = (t.dataset.cursor as Variant) || "link";
      setVariant(v);
      setLabel(t.dataset.cursorLabel || "");
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  const ringSize = variant === "view" ? 92 : variant === "link" ? 56 : variant === "text" ? 8 : 36;
  const dotSize = variant === "text" ? 0 : variant === "view" ? 0 : 6;

  const ringTx = useTransform(ringX, (v) => v - ringSize / 2);
  const ringTy = useTransform(ringY, (v) => v - ringSize / 2);
  const dotTx = useTransform(dotX, (v) => v - dotSize / 2);
  const dotTy = useTransform(dotY, (v) => v - dotSize / 2);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        style={{
          x: ringTx,
          y: ringTy,
          width: ringSize,
          height: ringSize,
          mixBlendMode: "difference",
        }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full border border-white flex items-center justify-center"
        animate={{
          backgroundColor: variant === "view" ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)",
        }}
        transition={{ type: "spring", damping: 25, stiffness: 250 }}
      >
        {variant === "view" && label && (
          <span className="text-[11px] font-semibold tracking-widest uppercase text-black">
            {label}
          </span>
        )}
      </motion.div>
      <motion.div
        style={{
          x: dotTx,
          y: dotTy,
          width: dotSize,
          height: dotSize,
          mixBlendMode: "difference",
        }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-white"
      />
    </>
  );
}
