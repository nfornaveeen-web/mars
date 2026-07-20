"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Palette, X } from "lucide-react";

const STORAGE_KEY = "mars-scheme";

type Scheme = {
  slug: string;
  name: string;
  note: string;
  /** display swatches: [background, primary, foreground, extra?] */
  swatches: string[];
};

const SCHEMES: Scheme[] = [
  {
    slug: "gallery-rust",
    name: "Gallery Rust",
    note: "White · iron-oxide rust · ink",
    swatches: ["#FFFFFF", "#C1440E", "#1A1210"],
  },
  {
    slug: "mission-control",
    name: "Mission Control",
    note: "White · signal orange · graphite",
    swatches: ["#FFFFFF", "#E4572E", "#20242A"],
  },
  {
    slug: "crimson-white",
    name: "Crimson White",
    note: "White · crimson · maroon",
    swatches: ["#FFFFFF", "#A31D1D", "#2B1512"],
  },
  {
    slug: "terracotta-soft",
    name: "Terracotta Soft",
    note: "White · terracotta · clay",
    swatches: ["#FFFFFF", "#B7410E", "#3E2723"],
  },
  {
    slug: "polar-white",
    name: "Polar White",
    note: "White · deep rust · ice accent",
    swatches: ["#FFFFFF", "#9C2B1B", "#231512", "#6FAEB6"],
  },
];

function applyScheme(slug: string) {
  const root = document.documentElement;
  if (slug === "gallery-rust") {
    delete root.dataset.scheme;
  } else {
    root.dataset.scheme = slug;
  }
  try {
    localStorage.setItem(STORAGE_KEY, slug);
  } catch {
    /* storage unavailable — scheme still applies for this visit */
  }
}

export default function SchemePicker() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("gallery-rust");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SCHEMES.some((s) => s.slug === stored)) {
        setActive(stored);
        applyScheme(stored);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  const select = (slug: string) => {
    setActive(slug);
    applyScheme(slug);
  };

  return (
    <div ref={panelRef} className="fixed bottom-20 left-6 z-40">
      {open && (
        <div className="mb-3 w-72 border-2 border-foreground bg-card shadow-xl">
          <div className="flex items-center justify-between border-b-2 border-foreground px-4 py-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
              Color scheme
            </p>
            <button
              type="button"
              aria-label="Close scheme picker"
              onClick={() => setOpen(false)}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div>
            {SCHEMES.map((scheme) => {
              const isActive = active === scheme.slug;
              return (
                <button
                  key={scheme.slug}
                  type="button"
                  onClick={() => select(scheme.slug)}
                  aria-pressed={isActive}
                  className="group flex w-full items-center gap-3 border-t border-foreground/15 px-4 py-3 text-left transition-colors first:border-t-0 hover:bg-secondary"
                >
                  <span className="flex shrink-0 -space-x-1">
                    {scheme.swatches.map((color) => (
                      <span
                        key={color}
                        className="h-5 w-5 rounded-full border border-foreground/25"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[11px] uppercase tracking-[0.15em] text-foreground">
                      {scheme.name}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] font-light text-muted-foreground">
                      {scheme.note}
                    </span>
                  </span>
                  {isActive && (
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label="Choose color scheme"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 w-11 items-center justify-center border-2 border-foreground bg-card text-foreground shadow-lg transition-colors hover:bg-primary hover:border-primary hover:text-primary-foreground"
      >
        <Palette className="h-5 w-5" />
      </button>
    </div>
  );
}
