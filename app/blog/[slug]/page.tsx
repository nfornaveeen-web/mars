import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ArrowLeft } from "lucide-react";
import { buildMetadata } from "@/lib/seo";

type BlogPostParams = Promise<{ slug: string }>;

const blogContent: Record<
  string,
  { title: string; date: string; category: string; content: string[] }
> = {
  "wholesale-pricing-strategy": {
    title: "Optimizing Wholesale Pricing Strategy in 2026",
    date: "January 15, 2026",
    category: "Business Strategy",
    content: [
      "In the dynamic wholesale electronics market, pricing strategy is crucial to maintaining competitiveness while ensuring profitability. This comprehensive guide explores key considerations for developing effective wholesale pricing strategies.",
      "Market conditions in 2026 continue to shift rapidly. Retailers and resellers are increasingly demanding competitive pricing without compromising on product quality or service standards. Understanding these market dynamics is essential for sustainable growth.",
      "Key factors to consider when setting wholesale prices include cost of goods, market demand, competitor pricing, volume discounts, and seasonal variations. By carefully analyzing these elements, distributors can optimize pricing to attract customers while protecting margins.",
      "Volume-based tiering remains one of the most effective pricing strategies. Offering better rates for larger orders encourages bulk purchases and builds customer loyalty. However, it's important to ensure that tiered pricing doesn't compress margins to unsustainable levels.",
      "Transparency in pricing builds trust with customers. Clear communication about pricing structures, volume requirements, and any applicable fees helps establish long-term business relationships based on mutual understanding and respect.",
    ],
  },
  "asset-liquidation-guide": {
    title: "Complete Guide to Asset Liquidation for Retailers",
    date: "January 10, 2026",
    category: "Asset Management",
    content: [
      "Asset liquidation is a critical process for retailers managing inventory transitions, business closures, or excess stock. Proper liquidation strategies can significantly impact your bottom line and business stability.",
      "Before initiating liquidation, conduct a thorough inventory audit. Categorize products by condition, age, demand, and resale value. This categorization helps determine the most effective liquidation channel for each product segment.",
      "There are multiple liquidation channels available to retailers. Direct sales through existing channels maintain the highest margins but require more effort. Wholesale liquidation through partners like Mars Technology Inc offers faster processing and guaranteed revenue.",
      "Timing is crucial in asset liquidation. Market demand fluctuates seasonally and with technology trends. Understanding market conditions helps maximize returns on your liquidated assets.",
      "Professional liquidation services handle the complexities of bulk sales, pricing negotiations, and logistics. Partnering with experienced liquidators ensures efficient processing and fair market value for your assets.",
    ],
  },
  "supply-chain-resilience": {
    title: "Building Resilient Supply Chains in Electronics Distribution",
    date: "January 5, 2026",
    category: "Supply Chain",
    content: [
      "Supply chain resilience has become increasingly important for electronics distributors. Disruptions can significantly impact inventory availability and customer satisfaction. Building redundancy and flexibility into supply chains is essential.",
      "Diversification of suppliers reduces dependency on any single source. Maintaining relationships with multiple suppliers in different regions provides alternatives when primary suppliers experience disruptions.",
      "Inventory management plays a vital role in supply chain resilience. Maintaining strategic safety stock of high-demand items ensures availability during supply interruptions. However, this must be balanced against carrying costs and the risk of inventory obsolescence.",
      "Technology integration provides visibility across the supply chain. Real-time tracking systems enable quick identification of bottlenecks and allow for proactive problem-solving before disruptions impact customers.",
      "Building strong relationships with logistics partners ensures reliable shipping and handling of inventory. Regular communication and performance reviews help maintain service standards and identify improvement opportunities.",
    ],
  },
  "mobile-device-trends-2026": {
    title: "Mobile Device Market Trends to Watch in 2026",
    date: "December 28, 2025",
    category: "Market Trends",
    content: [
      "The mobile device market continues to evolve with technological advances and changing consumer preferences. Understanding current trends helps wholesalers and retailers anticipate demand and optimize inventory.",
      "Flagship devices remain popular despite premium pricing, as consumers value advanced features and longevity. Mid-range devices offer excellent value and continue to capture significant market share, particularly in emerging markets.",
      "Refurbished and certified pre-owned devices have gained significant traction. Environmentally conscious consumers appreciate the sustainability aspects, while retailers benefit from improved margins on these products.",
      "5G adoption continues to accelerate, influencing device specifications and customer preferences. Wholesale distributors should monitor 5G device penetration rates to guide inventory planning.",
      "Trade-in programs and device financing options are becoming increasingly important for driving consumer purchases. Retailers should consider how these programs impact wholesale demand and plan accordingly.",
    ],
  },
  "bulk-ordering-best-practices": {
    title: "Best Practices for Bulk Ordering in Wholesale Electronics",
    date: "December 20, 2025",
    category: "Wholesale Tips",
    content: [
      "Bulk ordering in wholesale electronics requires careful planning and strategic decision-making. Optimizing your bulk ordering process can result in significant cost savings and improved operational efficiency.",
      "Start with accurate demand forecasting. Analyze historical sales data, seasonal trends, and market forecasts to determine appropriate order quantities. Over-ordering strains cash flow and storage capacity, while under-ordering risks stockouts.",
      "Negotiate volume discounts effectively. Understand your distributor's pricing tiers and work with them to find the order quantity that maximizes your margin while meeting your operational needs.",
      "Diversify your product mix in bulk orders. Spreading orders across different product categories and manufacturers reduces risk and ensures you're meeting diverse customer needs.",
      "Establish strong relationships with your wholesale suppliers. Regular communication about your business needs and market conditions helps suppliers anticipate your requirements and may result in better pricing and terms.",
    ],
  },
  "certified-devices-importance": {
    title: "Why Certified Devices Matter in Wholesale Distribution",
    date: "December 15, 2025",
    category: "Product Quality",
    content: [
      "Certified devices have become increasingly important in wholesale electronics distribution. Certification ensures products meet quality standards and provides assurance to both retailers and end consumers.",
      "Certified devices are typically factory-sealed, unopened products that meet manufacturer specifications. This certification process includes quality checks, security verification, and warranty confirmation.",
      "For retailers, selling certified devices reduces the risk of customer returns and warranty claims. Customers gain confidence knowing they're purchasing genuine, quality products with proper manufacturer support.",
      "Certification also protects against counterfeit products entering the supply chain. Working with reputable distributors who verify and certify their inventory is essential for maintaining product integrity and brand reputation.",
      "In competitive markets, certified devices command premium pricing and customer loyalty. Retailers who prioritize certified inventory often experience better margins and stronger customer relationships compared to those dealing in non-certified products.",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(blogContent).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: BlogPostParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogContent[slug];
  if (!post) return { title: "Not Found" };

  return buildMetadata({
    title: post.title,
    description: post.content[0]?.substring(0, 155) ?? post.title,
    path: `/blog/${slug}`,
    type: "article",
    keywords: [
      "wholesale electronics blog",
      post.category.toLowerCase(),
      post.title.toLowerCase(),
    ],
  });
}

export default async function BlogPost({
  params,
}: {
  params: BlogPostParams;
}) {
  const { slug } = await params;
  const post = blogContent[slug];

  if (!post) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12 sm:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
            404
          </p>
          <h1 className="mt-6 font-display text-4xl uppercase leading-[0.95] tracking-tight text-foreground sm:text-6xl">
            Article not found
          </h1>
          <Link
            href="/blog"
            className="mt-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Blog
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Blog
          </Link>

          <article className="mt-10">
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.3em]">
              <span className="text-primary">{post.category}</span>
              <span className="text-muted-foreground">{post.date}</span>
            </div>
            <h1 className="mt-5 font-display text-3xl uppercase leading-[0.95] tracking-tight text-foreground sm:text-5xl">
              {post.title}
            </h1>

            <div className="mt-10 border-t-2 border-foreground pt-10">
              <div className="max-w-2xl space-y-6">
                {post.content.map((paragraph, idx) =>
                  idx === 0 ? (
                    <p
                      key={idx}
                      className="text-lg font-light leading-relaxed text-foreground sm:text-xl"
                    >
                      {paragraph}
                    </p>
                  ) : (
                    <p
                      key={idx}
                      className="font-sans text-sm font-light leading-relaxed text-foreground/85 sm:text-base"
                    >
                      {paragraph}
                    </p>
                  ),
                )}
              </div>
            </div>

            <div className="mt-12 border-t border-foreground/15 pt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Read More Articles
              </Link>
            </div>
          </article>
        </div>
      </div>
      <Footer />
    </main>
  );
}
