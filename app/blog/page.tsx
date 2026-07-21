import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ArrowUpRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Wholesale Electronics Blog",
  description:
    "Read Mars Technology Inc insights on wholesale pricing, liquidation, supply chain resilience, bulk ordering, and electronics market trends.",
  path: "/blog",
  keywords: [
    "wholesale electronics blog",
    "B2B electronics insights",
    "bulk ordering tips",
    "electronics liquidation guide",
  ],
});

const blogPosts = [
  {
    slug: "galaxy-z-fold-8-flip-8-retailers",
    title: "Z Fold 8 & Flip 8: What Unpacked Means for Retailers",
    excerpt:
      "Samsung's July Unpacked lands in London with a thinner Flip, a bigger-battery Fold, and a rumored Wide variant. The restock math for foldable shelves.",
    date: "July 22, 2026",
    category: "Launch Watch",
  },
  {
    slug: "pixel-11-preview-retailers",
    title: "Pixel 11 Preview: Tensor G6 and an August Window",
    excerpt:
      "Reports point to an August 12 event, a 2nm Tensor G6, and doubled base storage. What Google's next lineup means for your Android shelf.",
    date: "July 20, 2026",
    category: "Launch Watch",
  },
  {
    slug: "iphone-18-rumors-retailers",
    title: "iPhone 18: The September Rumors Worth Planning Around",
    excerpt:
      "A split launch, a 2nm A20 chip, and Apple's first foldable — what the rumor mill says, what's confirmed (nothing yet), and how buyers should prepare.",
    date: "July 18, 2026",
    category: "Launch Watch",
  },
  {
    slug: "galaxy-s26-ultra-mid-year",
    title: "Galaxy S26 Ultra at Mid-Year: The Restock Case",
    excerpt:
      "Four months after launch, Samsung has raised S26 production on stronger-than-expected sales. What the sell-through data means for your next order.",
    date: "July 15, 2026",
    category: "Launch Watch",
  },
  {
    slug: "flagship-launch-calendar-2026",
    title: "The H2 2026 Flagship Calendar for Retailers",
    excerpt:
      "Fold 8 in August, Pixel 11 mid-August, iPhone 18 in September. Map your open-to-buy against the launch windows that move foot traffic.",
    date: "July 10, 2026",
    category: "Launch Watch",
  },
  {
    slug: "wholesale-iphone-distributor-canada",
    title: "Buying iPhones Wholesale in Canada: A Dealer's Guide",
    excerpt:
      "Where Canadian retailers actually source sealed iPhone stock, what to verify before wiring money, and how allocation works around launch season.",
    date: "July 6, 2026",
    category: "Buying Guides",
  },
  {
    slug: "buy-phones-in-bulk-canada",
    title: "How to Buy Phones in Bulk in Canada",
    excerpt:
      "MOQs, manifests, carrier locks, and the five checks that separate a clean bulk purchase from an expensive lesson.",
    date: "July 2, 2026",
    category: "Buying Guides",
  },
  {
    slug: "wholesale-samsung-distributor-canada",
    title: "Sourcing Samsung Galaxy Stock Wholesale in Canada",
    excerpt:
      "Galaxy inventory turns fast and allocations go early. How Canadian resellers keep S-series and A-series stock on the shelf.",
    date: "June 28, 2026",
    category: "Buying Guides",
  },
  {
    slug: "cell-phone-wholesale-supplier-gta",
    title: "Choosing a Cell Phone Wholesaler in the GTA",
    excerpt:
      "A working checklist for Toronto-area retailers: verification, references, pickup vs. freight, and the questions a legitimate supplier answers easily.",
    date: "June 24, 2026",
    category: "Buying Guides",
  },
  {
    slug: "electronics-liquidation-ontario",
    title: "Electronics Liquidation in Ontario: Where Stock Goes Next",
    excerpt:
      "Closing a location, exiting a category, or clearing aged inventory — the liquidation channels available to Ontario retailers, compared honestly.",
    date: "June 20, 2026",
    category: "Asset Management",
  },
  {
    slug: "how-to-open-phone-store-canada",
    title: "Opening a Phone Store in Canada: The Inventory Playbook",
    excerpt:
      "Registration and lease aside, inventory decides whether a new phone store survives year one. The opening assortment, budget splits, and supplier setup.",
    date: "June 16, 2026",
    category: "Buying Guides",
  },
  {
    slug: "wholesale-tablets-canada",
    title: "Wholesale Tablets in Canada: What to Stock in 2026",
    excerpt:
      "Tablets are a steadier business than phones — longer cycles, calmer pricing. The models and mix that earn their shelf space.",
    date: "June 12, 2026",
    category: "Buying Guides",
  },
  {
    slug: "wholesale-audio-airpods-jbl",
    title: "The Audio Wall: Wholesale AirPods, JBL, and Margin",
    excerpt:
      "Audio is the highest-margin corner of the electronics shelf. How retailers build an audio assortment that lifts every ticket.",
    date: "June 8, 2026",
    category: "Buying Guides",
  },
  {
    slug: "mixed-pallet-electronics-wholesale",
    title: "Mixed Pallets, Explained",
    excerpt:
      "One order, five categories. Why mixed-pallet buying beats single-SKU bets for small and mid-size retailers, and how to spec one properly.",
    date: "June 4, 2026",
    category: "Wholesale Tips",
  },
  {
    slug: "cross-border-electronics-canada-usa",
    title: "Cross-Border Electronics Distribution: The Basics",
    excerpt:
      "Shipping wholesale electronics between Canada and the US involves duties, documentation, and carrier choices. A plain-language primer for buyers.",
    date: "May 30, 2026",
    category: "Supply Chain",
  },
  {
    slug: "factory-sealed-vs-open-box-vs-refurbished",
    title: "Factory-Sealed vs. Open-Box vs. Refurbished",
    excerpt:
      "Three words that describe three different products at three different prices. A field guide to inventory conditions and where each belongs.",
    date: "May 26, 2026",
    category: "Product Quality",
  },
  {
    slug: "wholesale-google-pixel-canada",
    title: "The Wholesale Case for Stocking Google Pixel",
    excerpt:
      "Pixel's retail momentum keeps building. Why Canadian resellers are adding Google's lineup — and how to size a first Pixel order.",
    date: "May 22, 2026",
    category: "Buying Guides",
  },
  {
    slug: "wholesale-pricing-strategy",
    title: "Price Like a Distributor, Not a Spreadsheet",
    excerpt:
      "Cost-plus is how margins die quietly. How the sharpest wholesale buyers price around velocity, tier discipline, and the true cost of an empty shelf.",
    date: "January 15, 2026",
    category: "Business Strategy",
  },
  {
    slug: "asset-liquidation-guide",
    title: "Liquidation Without the Fire Sale",
    excerpt:
      "Exiting inventory doesn't have to mean torching its value. A working guide to auditing, channeling, and timing a liquidation that ends in the black.",
    date: "January 10, 2026",
    category: "Asset Management",
  },
  {
    slug: "supply-chain-resilience",
    title: "Never Explain an Empty Shelf Again",
    excerpt:
      "Resilience isn't a slide in a deck — it's a set of habits. Multiple sources, honest safety stock, and partners who answer the phone at 4pm on a Friday.",
    date: "January 5, 2026",
    category: "Supply Chain",
  },
  {
    slug: "mobile-device-trends-2026",
    title: "What Moves in 2026: The Handset Report",
    excerpt:
      "Flagships hold, mid-range eats share, certified pre-owned goes mainstream. The demand signals wholesale buyers should be stocking against this year.",
    date: "December 28, 2025",
    category: "Market Trends",
  },
  {
    slug: "bulk-ordering-best-practices",
    title: "The Bulk Order, Done Right",
    excerpt:
      "Forecast honestly, buy to the tier that pays, mix the pallet, and treat your distributor like a teammate. Four disciplines that turn volume into margin.",
    date: "December 20, 2025",
    category: "Wholesale Tips",
  },
  {
    slug: "certified-devices-importance",
    title: "Sealed Is the Whole Story",
    excerpt:
      "Factory-sealed, verified stock is the difference between a return rate you brag about and one you bury. Why certification pays for itself on every pallet.",
    date: "December 15, 2025",
    category: "Product Quality",
  },
];

export default function Blog() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12 sm:py-20">
        <div className="mb-12 sm:mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
            Blog
          </p>
          <h1 className="mt-6 font-display text-4xl uppercase leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            The Wholesale Brief
          </h1>
          <p className="mt-6 max-w-xl text-sm font-light leading-relaxed text-muted-foreground sm:text-base">
            Field notes on pricing, supply, and what&apos;s actually selling —
            written for buyers, not browsers.
          </p>
        </div>

        <div>
          {blogPosts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group -mx-4 block border-t-2 border-foreground px-4 py-8 transition-colors hover:bg-primary sm:-mx-6 sm:px-6 sm:py-10"
            >
              <div className="grid gap-4 sm:grid-cols-12 sm:gap-6">
                <div className="sm:col-span-3 lg:col-span-2">
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary transition-colors group-hover:text-primary-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-primary-foreground/70">
                    {post.date}
                  </p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-primary-foreground/70">
                    {post.category}
                  </p>
                </div>
                <div className="sm:col-span-8 lg:col-span-9">
                  <h2 className="font-display text-2xl uppercase leading-[0.95] tracking-tight text-foreground transition-colors group-hover:text-primary-foreground sm:text-4xl">
                    {post.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-muted-foreground transition-colors group-hover:text-primary-foreground/80 sm:text-base">
                    {post.excerpt}
                  </p>
                </div>
                <div className="hidden sm:col-span-1 sm:flex sm:justify-end">
                  <ArrowUpRight className="h-6 w-6 text-foreground/40 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary-foreground" />
                </div>
              </div>
            </Link>
          ))}
          <div className="-mx-4 border-t-2 border-foreground sm:-mx-6" />
        </div>
      </div>
      <Footer />
    </main>
  );
}
