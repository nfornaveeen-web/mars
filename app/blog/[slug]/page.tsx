import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { absoluteUrl, buildMetadata, siteConfig } from "@/lib/seo";
import { blogContent, blogPosts } from "@/lib/blog";

type BlogPostParams = Promise<{ slug: string }>;

/** Per-article catalog link — ties each post into the product pages it supports. */
const catalogLinks: Record<string, { href: string; label: string }> = {
  "galaxy-z-fold-8-flip-8-retailers": { href: "/brands/samsung", label: "Browse Samsung wholesale inventory" },
  "pixel-11-preview-retailers": { href: "/brands/google", label: "Browse Google Pixel wholesale inventory" },
  "iphone-18-rumors-retailers": { href: "/brands/apple", label: "Browse Apple wholesale inventory" },
  "galaxy-s26-ultra-mid-year": { href: "/brands/samsung", label: "Browse Samsung wholesale inventory" },
  "flagship-launch-calendar-2026": { href: "/products", label: "Browse the wholesale catalog" },
  "wholesale-iphone-distributor-canada": { href: "/brands/apple", label: "Browse Apple wholesale inventory" },
  "buy-phones-in-bulk-canada": { href: "/categories/smartphones", label: "Browse wholesale smartphones" },
  "wholesale-samsung-distributor-canada": { href: "/brands/samsung", label: "Browse Samsung wholesale inventory" },
  "cell-phone-wholesale-supplier-gta": { href: "/contact", label: "Talk to our Brampton team" },
  "electronics-liquidation-ontario": { href: "/contact", label: "Discuss a liquidation manifest" },
  "how-to-open-phone-store-canada": { href: "/products", label: "Browse the wholesale catalog" },
  "wholesale-tablets-canada": { href: "/categories/tablets", label: "Browse wholesale tablets" },
  "wholesale-audio-airpods-jbl": { href: "/categories/audio", label: "Browse wholesale audio" },
  "mixed-pallet-electronics-wholesale": { href: "/contact", label: "Spec a mixed pallet with us" },
  "cross-border-electronics-canada-usa": { href: "/contact", label: "Ask about cross-border orders" },
  "factory-sealed-vs-open-box-vs-refurbished": { href: "/products", label: "Browse factory-sealed inventory" },
  "wholesale-google-pixel-canada": { href: "/brands/google", label: "Browse Google Pixel wholesale inventory" },
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

  const related = blogPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .concat(blogPosts.filter((p) => p.slug !== slug && p.category !== post.category))
    .slice(0, 3);
  const catalogLink = catalogLinks[slug] ?? {
    href: "/products",
    label: "Browse the wholesale catalog",
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.content[0]?.substring(0, 155) ?? post.title,
    datePublished: new Date(post.date).toISOString(),
    articleSection: post.category,
    mainEntityOfPage: absoluteUrl(`/blog/${slug}`),
    url: absoluteUrl(`/blog/${slug}`),
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/marstechnologyinc-logo.svg"),
      },
    },
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
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

            {/* Catalog CTA — internal link into the product pages this post supports */}
            <div className="mt-12 border-t-2 border-foreground pt-8">
              <Link
                href={catalogLink.href}
                className="inline-flex items-center gap-2 bg-primary px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                {catalogLink.label}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Related reading */}
            {related.length > 0 && (
              <div className="mt-12">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
                  Related reading
                </p>
                <div className="mt-4 border-t-2 border-foreground">
                  {related.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/blog/${rel.slug}`}
                      className="group flex items-baseline justify-between gap-6 border-b border-foreground/15 py-4"
                    >
                      <span className="font-display text-lg uppercase leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">
                        {rel.title}
                      </span>
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        {rel.category}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10">
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
