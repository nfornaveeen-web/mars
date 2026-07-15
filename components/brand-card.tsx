import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Brand } from "@/lib/brands";

interface BrandCardProps {
  brand: Brand;
  index: number;
}

export default function BrandCard({ brand, index }: BrandCardProps) {
  const rowNumber = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 border-t-2 border-foreground px-1 py-6 transition-colors hover:bg-primary sm:grid-cols-[4rem_minmax(0,1fr)_auto_auto] sm:gap-6 sm:px-3 sm:py-8"
    >
      {/* Index number */}
      <span className="font-mono text-xs text-muted-foreground transition-colors group-hover:text-primary-foreground/70 sm:text-sm">
        {rowNumber}
      </span>

      {/* Brand name */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="font-display text-3xl uppercase leading-[0.95] tracking-tight text-foreground transition-colors group-hover:text-primary-foreground sm:text-5xl">
            {brand.name}
          </h2>
          {brand.featured && (
            <span className="rounded-sm border border-primary px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary transition-colors group-hover:border-primary-foreground group-hover:text-primary-foreground">
              Featured
            </span>
          )}
        </div>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-primary-foreground/80 sm:hidden">
          {brand.productCount} products
        </p>
      </div>

      {/* Product count + logo plate */}
      <div className="hidden items-center gap-6 sm:flex">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-primary-foreground/80">
          {brand.productCount} products
        </span>
        {brand.logo && (
          <span className="hidden h-14 w-28 shrink-0 items-center justify-center bg-secondary px-4 py-3 md:flex">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={brand.logo}
              alt={`${brand.name} logo`}
              className="h-full w-full object-contain"
            />
          </span>
        )}
      </div>

      {/* Arrow */}
      <ArrowUpRight className="h-5 w-5 text-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary-foreground sm:h-7 sm:w-7" />
    </Link>
  );
}
