import Image from "next/image";

const BRANDS = [
  {
    name: "Apple",
    logo: "https://1000logos.net/wp-content/uploads/2016/10/Apple-Logo-1536x864.png",
  },
  {
    name: "Samsung",
    logo: "https://images.samsung.com/is/image/samsung/assets/global/about-us/brand/logo/300_186_4.png?$568_N_PNG$",
  },
  {
    name: "Google",
    logo: "https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/resized/800x480/1520cb97ebc97cda5694fabad478e857789d84d0.png",
  },
  {
    name: "Xiaomi",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Xiaomi_logo_%282021-%29.svg/960px-Xiaomi_logo_%282021-%29.svg.png",
  },
  {
    name: "Motorola",
    logo: "https://1000logos.net/wp-content/uploads/2017/04/Motorola-Logo-1536x864.png",
  },
  {
    name: "JBL",
    logo: "https://logos-world.net/wp-content/uploads/2020/12/JBL-Logo-700x394.png",
  },
  {
    name: "Huawei",
    logo: "https://1000logos.net/wp-content/uploads/2018/08/Huawei-Logo.png",
  },
  {
    name: "Honor",
    logo: "https://static.vecteezy.com/system/resources/previews/020/927/024/non_2x/honor-brand-logo-phone-symbol-name-black-design-china-mobile-illustration-free-vector.jpg",
  },
];

export default function Services() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="border-t-2 border-foreground pt-8 sm:pt-10">
          {/* Header */}
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary sm:text-xs">
                03 / Brands
              </p>
              <h2 className="mt-4 font-display text-3xl uppercase leading-[0.95] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                The lines we move.
              </h2>
            </div>
            <p className="max-w-prose font-sans text-sm font-light leading-relaxed text-muted-foreground sm:text-base">
              Marquee names sourced in volume for North American retail.
            </p>
          </div>

          {/* Mono index strip */}
          <div className="mt-8 grid grid-cols-2 border-t border-foreground/15 sm:mt-10 sm:grid-cols-4">
            {BRANDS.map(({ name, logo }, index) => (
              <div
                key={name}
                className="group flex cursor-default items-center gap-3 border-b border-foreground/15 py-5 pr-2 sm:gap-4 sm:pr-4"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="relative h-8 w-12 grayscale opacity-50 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100">
                  <Image src={logo} alt={name} fill className="object-contain" />
                </div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-foreground">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
