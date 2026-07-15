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
    slug: "wholesale-pricing-strategy",
    title: "Optimizing Wholesale Pricing Strategy in 2026",
    excerpt:
      "Learn how to develop competitive pricing strategies that maximize margins while staying competitive in the wholesale electronics market.",
    date: "January 15, 2026",
    category: "Business Strategy",
  },
  {
    slug: "asset-liquidation-guide",
    title: "Complete Guide to Asset Liquidation for Retailers",
    excerpt:
      "Discover how to effectively liquidate excess inventory and transition assets. Expert tips for maximizing returns on unwanted stock.",
    date: "January 10, 2026",
    category: "Asset Management",
  },
  {
    slug: "supply-chain-resilience",
    title: "Building Resilient Supply Chains in Electronics Distribution",
    excerpt:
      "Explore strategies for maintaining supply chain stability and managing disruptions in wholesale electronics distribution.",
    date: "January 5, 2026",
    category: "Supply Chain",
  },
  {
    slug: "mobile-device-trends-2026",
    title: "Mobile Device Market Trends to Watch in 2026",
    excerpt:
      "Stay ahead of the curve with insights into emerging trends in mobile device distribution and consumer electronics.",
    date: "December 28, 2025",
    category: "Market Trends",
  },
  {
    slug: "bulk-ordering-best-practices",
    title: "Best Practices for Bulk Ordering in Wholesale Electronics",
    excerpt:
      "Master the art of bulk ordering to optimize inventory management and reduce per-unit costs.",
    date: "December 20, 2025",
    category: "Wholesale Tips",
  },
  {
    slug: "certified-devices-importance",
    title: "Why Certified Devices Matter in Wholesale Distribution",
    excerpt:
      "Understand the importance of certified, factory-sealed devices and how they impact your business reputation.",
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
            Insights
          </h1>
          <p className="mt-6 max-w-xl text-sm font-light leading-relaxed text-muted-foreground sm:text-base">
            Industry insights and wholesale distribution expertise
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
