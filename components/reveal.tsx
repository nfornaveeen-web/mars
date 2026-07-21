"use client";

import { useEffect, useRef } from "react";
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
 * Spring physics for the entrance: F = -k·x − c·v, integrated per frame
 * (semi-implicit Euler). No fixed duration — the element has mass, the
 * spring pulls it home, damping settles it with a slight organic overshoot.
 */
const STIFFNESS = 170; // k — pull strength
const DAMPING = 20; // c — friction; below critical => subtle bounce
const MASS = 1; // m

export default function Reveal({
  delay = 0,
  distance = 28,
  className,
  children,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const settle = () => {
      el.style.opacity = "1";
      el.style.transform = "none";
    };

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      settle();
      return;
    }

    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const spring = () => {
      let x = distance; // displacement from rest
      let v = 0; // velocity
      let last = performance.now();

      const step = (now: number) => {
        // clamp dt so background tabs / long frames can't explode the sim
        const dt = Math.min((now - last) / 1000, 1 / 30);
        last = now;

        const force = -STIFFNESS * x - DAMPING * v;
        v += (force / MASS) * dt;
        x += v * dt;

        // opacity tracks progress toward rest, clamped
        const progress = Math.min(1, Math.max(0, 1 - x / distance));
        el.style.opacity = progress.toFixed(3);
        el.style.transform = `translate3d(0, ${x.toFixed(2)}px, 0)`;

        if (Math.abs(x) < 0.05 && Math.abs(v) < 0.05) {
          settle();
          return;
        }
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            io.disconnect();
            timer = setTimeout(spring, delay);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [delay, distance]);

  return (
    <div
      ref={ref}
      data-reveal=""
      className={className}
      style={{ opacity: 0, transform: `translateY(${distance}px)` }}
    >
      {children}
    </div>
  );
}
