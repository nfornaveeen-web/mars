const BRAND_ACCENTS: Record<string, string> = {
  Apple: "28,28,30",
  Samsung: "20,96,255",
  Google: "66,133,244",
  Xiaomi: "255,106,0",
  Realme: "255,204,0",
  Motorola: "48,63,159",
  JBL: "255,111,0",
  Huawei: "199,22,43",
  Honor: "34,34,34",
};

interface BrandHeaderProps {
  name: string;
  description: string;
  logo?: string;
  productCount: number;
  category: string;
}

export default function BrandHeader({
  name,
  description,
  logo,
  productCount,
  category,
}: BrandHeaderProps) {
  const accentColor = BRAND_ACCENTS[name] ?? "99,102,110";

  return (
    <section
      className="relative overflow-hidden border-2 border-foreground"
      style={{
        background: `linear-gradient(120deg, rgba(${accentColor}, 0.12) 0%, rgba(${accentColor}, 0.04) 45%, var(--card) 100%)`,
      }}
    >
      <div className="flex flex-col justify-between gap-10 px-5 py-10 sm:px-10 sm:py-14 md:flex-row md:items-center">
        {/* Left — text */}
        <div className="max-w-2xl">
          {/* mono eyebrow with brand accent mark */}
          <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
            <span
              className="h-2.5 w-2.5 shrink-0"
              style={{ background: `rgb(${accentColor})` }}
              aria-hidden="true"
            />
            {category}
          </p>

          <h1 className="mt-4 font-display text-4xl uppercase leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {name}
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>

          {/* stats — mono row separated by hairlines */}
          <div className="mt-8 flex flex-wrap items-stretch gap-y-4">
            <div className="pr-6 sm:pr-10">
              <p className="font-display text-2xl uppercase leading-none text-foreground sm:text-3xl">
                {productCount}
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Products
              </p>
            </div>
            <div className="border-l border-foreground/25 pl-6 pr-6 sm:pl-10 sm:pr-10">
              <p className="font-display text-2xl uppercase leading-none text-foreground sm:text-3xl">
                B2B
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Wholesale
              </p>
            </div>
            <div className="border-l border-foreground/25 pl-6 sm:pl-10">
              <p className="font-display text-2xl uppercase leading-none text-foreground sm:text-3xl">
                CA&nbsp;&amp;&nbsp;US
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Markets
              </p>
            </div>
          </div>
        </div>

        {/* Right — sharp logo plate */}
        {logo && (
          <div className="flex h-36 w-36 shrink-0 items-center justify-center border-2 border-foreground bg-card p-5 sm:h-44 sm:w-44 sm:p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo}
              alt={`${name} logo`}
              className="h-full w-full object-contain"
            />
          </div>
        )}
      </div>

      {/* bottom accent bar */}
      <div
        className="h-1.5 w-full"
        style={{
          background: `linear-gradient(90deg, rgb(${accentColor}) 0%, rgb(${accentColor}) 40%, rgba(${accentColor}, 0.15) 100%)`,
        }}
      />
    </section>
  );
}
