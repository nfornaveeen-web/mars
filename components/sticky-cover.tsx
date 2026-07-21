"use client";

import { useEffect, useRef } from "react";
import type React from "react";

type StickyCoverProps = {
  /** Pin offset from the viewport top (px) — clears the sticky header. */
  top?: number;
  /** How much the pinned section scales down when fully covered. */
  scale?: number;
  /** The section that scrolls up and over the pinned children. */
  cover: React.ReactNode;
  children: React.ReactNode;
};

/**
 * Section-level stacking: `children` pin via position: sticky while the
 * `cover` section (solid background, higher z) scrolls up over them. The
 * pinned section recedes — lerp-smoothed scale + dim — as it's covered.
 * Sticky behavior from md up; recede respects prefers-reduced-motion.
 */
export default function StickyCover({
  top = 80,
  scale = 0.06,
  cover,
  children,
}: StickyCoverProps) {
  const pinRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pin = pinRef.current;
    const coverEl = coverRef.current;
    if (!pin || !coverEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let target = 0;
    let current = 0;
    let raf = 0;
    let running = false;

    const measure = () => {
      if (!window.matchMedia("(min-width: 768px)").matches) {
        target = 0;
        return;
      }
      const vh = window.innerHeight || 1;
      const coverTop = coverEl.getBoundingClientRect().top;
      const p = 1 - (coverTop - top) / Math.max(vh - top, 1);
      target = Math.max(0, Math.min(1, p));
    };

    const tick = () => {
      current += (target - current) * 0.15;
      if (Math.abs(target - current) < 0.001) {
        current = target;
        running = false;
      }
      pin.style.transform =
        current > 0.001 ? `scale(${(1 - scale * current).toFixed(4)})` : "";
      pin.style.filter =
        current > 0.001 ? `brightness(${(1 - 0.12 * current).toFixed(3)})` : "";
      if (running) raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      measure();
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    wake();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    return () => {
      running = false;
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [top, scale]);

  return (
    <div className="relative">
      <div
        ref={pinRef}
        className="md:sticky"
        style={{ top, transformOrigin: "center top" }}
      >
        {children}
      </div>
      <div ref={coverRef} className="relative z-10 bg-background">
        {cover}
      </div>
    </div>
  );
}
