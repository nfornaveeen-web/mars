"use client";

import { useEffect, useRef } from "react";
import type React from "react";

type ParallaxProps = {
  /**
   * Max drift in px when the element is at the viewport edges.
   * Positive = lags behind the scroll (background feel);
   * negative = moves against it (foreground feel).
   */
  speed?: number;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
};

/** Interpolation factor per frame — lower = floatier glide. */
const LERP = 0.12;

/**
 * Lerp-smoothed scroll parallax: the outer div is measured, the inner div is
 * transformed. Rather than mapping scroll position directly, the transform
 * glides toward its target each frame (current += (target - current) * ease),
 * converting discrete wheel steps into fluid motion. Transform-only,
 * rAF-driven with an idle cutoff, disabled for prefers-reduced-motion.
 */
export default function Parallax({
  speed = 24,
  className,
  innerClassName,
  children,
}: ParallaxProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let target = 0;
    let current = 0;
    let raf = 0;
    let running = false;

    const measure = () => {
      const rect = outer.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const center = rect.top + rect.height / 2;
      const progress = (center - vh / 2) / (vh / 2 + rect.height / 2);
      target = Math.max(-1, Math.min(1, progress)) * speed;
    };

    const tick = () => {
      current += (target - current) * LERP;
      if (Math.abs(target - current) < 0.05) {
        current = target;
        running = false;
      }
      inner.style.transform = `translate3d(0, ${current.toFixed(2)}px, 0)`;
      if (running) raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      measure();
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    // settle to the correct position immediately on mount (no glide-in jump)
    measure();
    current = target;
    inner.style.transform = `translate3d(0, ${current.toFixed(2)}px, 0)`;

    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    return () => {
      running = false;
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div ref={outerRef} className={className}>
      <div
        ref={innerRef}
        className={innerClassName}
        style={{ willChange: "transform" }}
      >
        {children}
      </div>
    </div>
  );
}
