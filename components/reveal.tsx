"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";

type RevealProps = {
  /** Stagger delay in ms — use with element index for cascades. */
  delay?: number;
  /** Starting translateY offset in px. */
  distance?: number;
  className?: string;
  children: React.ReactNode;
};

/**
 * Framer-style appear-on-scroll: children start faded + shifted down and
 * spring into place when entering the viewport. Fires once per element.
 * Respects prefers-reduced-motion (renders instantly). A <noscript> rule in
 * the root layout unhides everything when JavaScript is unavailable.
 */
export default function Reveal({
  delay = 0,
  distance = 28,
  className,
  children,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${distance}px)`,
        transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
