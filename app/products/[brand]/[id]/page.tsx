import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CopySkuButton from "@/components/copy-sku-button";
import ProductGallery from "@/components/product-gallery";
import ProductActions from "@/components/product-actions";
import { permanentRedirect } from "next/navigation";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { brands, getBrandProducts } from "@/lib/brands";
import Parallax from "@/components/parallax";
import {
  getAllProductParams,
  productHref,
  resolveProduct,
} from "@/lib/product-slugs";

type ProductDetailParams = Promise<{ brand: string; id: string }>;

export async function generateMetadata({
  params,
}: {
  params: ProductDetailParams;
}): Promise<Metadata> {
  const { brand: brandSlug, id } = await params;
  const resolved = resolveProduct(brandSlug, id);
  const brand = brands.find((item) => item.slug === brandSlug);

  if (!resolved || !brand) {
    return {
      title: "Product Not Found | Mars Technology Inc",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { product, canonicalSlug } = resolved;

  return buildMetadata({
    title: `Buy ${product.name} Wholesale — Canada & USA`,
    description: `${product.description} SKU: ${product.sku}. Source ${brand.name} ${product.category.toLowerCase()} inventory through Mars Technology Inc's wholesale catalog.`,
    path: `/products/${brandSlug}/${canonicalSlug}`,
    keywords: [
      product.name,
      brand.name,
      `wholesale ${product.category.toLowerCase()}`,
      `${product.category.toLowerCase()} distributor`,
      product.sku,
    ],
    image: product.image,
  });
}

export function generateStaticParams() {
  return getAllProductParams();
}

export default async function ProductDetailPage({
  params,
}: {
  params: ProductDetailParams;
}) {
  const { brand: brandSlug, id } = await params;
  const resolved = resolveProduct(brandSlug, id);
  const brand = brands.find((b) => b.slug === brandSlug);

  // Legacy ID URLs (e.g. /products/apple/a12) permanently redirect to the
  // descriptive slug URL so old links and indexed pages carry over.
  if (resolved?.isLegacyId && brand) {
    permanentRedirect(productHref(brandSlug, resolved.product.id));
  }

  const product = resolved?.product;

  if (!product || !brand) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
              404 / Catalog
            </p>
            <h1 className="mt-5 font-display text-4xl uppercase leading-[0.95] tracking-tight text-foreground sm:text-6xl">
              Product not found
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              The product you requested is no longer available in the current
              wholesale catalog.
            </p>
            <Link
              href="/products"
              className="mt-10 inline-flex items-center gap-2 bg-primary px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              Browse catalog
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const categoryHref = `/categories/${product.category
    .toLowerCase()
    .replace(/\s+/g, "-")}`;
  const productImages = Array.from(
    new Set(
      [product.image, ...(product.gallery ?? [])].filter(
        (image): image is string => Boolean(image),
      ),
    ),
  );
  const galleryImages =
    productImages.length > 0 ? productImages : ["/placeholder.svg"];
  const relatedProducts = getBrandProducts(brand.slug)
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  const canonicalSlug = resolved.canonicalSlug;
  const productUrl = absoluteUrl(`/products/${brandSlug}/${canonicalSlug}`);
  const productImageUrls = galleryImages.map((image) => absoluteUrl(image));

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: productImageUrls,
    sku: product.sku,
    category: product.category,
    itemCondition: "https://schema.org/NewCondition",
    brand: {
      "@type": "Brand",
      name: brand.name,
    },
    url: productUrl,
  };

  const faqs = [
    {
      question: `How do I get wholesale pricing for the ${product.name}?`,
      answer: `Request a quote through the inquiry form on this page, email sales@marstechnologyinc.com, or call +1 647 403 4735. Our sales team responds within 24 hours on business days with current tier pricing and availability.`,
    },
    {
      question: `Is the ${product.name} factory-sealed and verified?`,
      answer: `Yes. Mars Technology Inc supplies verified, factory-sealed ${brand.name} inventory with serial numbers documented on the manifest, so stock arrives shelf-ready with the manufacturer's warranty intact.`,
    },
    {
      question: `What is the minimum order quantity for the ${product.name}?`,
      answer: `We sell in wholesale quantities and minimums vary with current allocation. Tell us your target volume when you request a quote and we'll confirm available tiers for the ${product.name}.`,
    },
    {
      question: `Do you ship the ${product.name} across Canada and the USA?`,
      answer: `Yes — we ship tracked bulk orders across Canada and the United States from our Brampton, Ontario warehouse, with same-day order processing on confirmed orders.`,
    },
    {
      question: `Can I combine the ${product.name} with other products in one order?`,
      answer: `Absolutely. Most buyers mix pallets across smartphones, tablets, audio, displays, and accessories — combine ${brand.name} inventory with any other lines we carry in a single bulk order.`,
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Products",
        item: absoluteUrl("/products"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: brand.name,
        item: absoluteUrl(`/brands/${brand.slug}`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="border-b border-foreground/15 py-3"
          >
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em]">
              <Link
                href="/products"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Products
              </Link>
              <span className="text-foreground/40">/</span>
              <Link
                href={`/brands/${brand.slug}`}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {brand.name}
              </Link>
              <span className="text-foreground/40">/</span>
              <span className="text-foreground">{product.name}</span>
            </div>
          </nav>

          {/* Gallery + info split */}
          <section className="py-12 sm:py-16">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-7">
                <Parallax speed={26}>
                <ProductGallery
                  images={galleryImages}
                  productName={product.name}
                />
                </Parallax>
              </div>

              <aside className="lg:col-span-5">
                <div className="space-y-8 lg:sticky lg:top-24">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.2em]">
                      <span className="flex items-center gap-2">
                        <Link
                          href={`/brands/${brand.slug}`}
                          className="text-primary transition-colors hover:text-foreground"
                        >
                          {brand.name}
                        </Link>
                        <span className="text-foreground/40">/</span>
                        <Link
                          href={categoryHref}
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {product.category}
                        </Link>
                      </span>
                      <span className="flex items-center gap-2 text-foreground">
                        {product.sku}
                        <CopySkuButton sku={product.sku} />
                      </span>
                    </div>

                    <h1 className="mt-5 font-display text-4xl uppercase leading-[0.95] tracking-tight text-foreground sm:text-5xl">
                      {product.name}
                    </h1>
                    <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {product.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 rounded-sm border border-success/30 bg-success/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-success">
                      <span className="h-1.5 w-1.5 bg-success" aria-hidden="true" />
                      In distribution
                    </span>
                  </div>

                  {/* Spec rows */}
                  <dl className="border-b border-foreground/15">
                    <div className="flex items-center justify-between gap-4 border-t border-foreground/15 py-3">
                      <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                        Brand
                      </dt>
                      <dd className="text-right text-sm text-foreground">
                        <Link
                          href={`/brands/${brand.slug}`}
                          className="transition-colors hover:text-primary"
                        >
                          {brand.name}
                        </Link>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-t border-foreground/15 py-3">
                      <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                        Category
                      </dt>
                      <dd className="text-right text-sm text-foreground">
                        <Link
                          href={categoryHref}
                          className="transition-colors hover:text-primary"
                        >
                          {product.category}
                        </Link>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-t border-foreground/15 py-3">
                      <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                        SKU
                      </dt>
                      <dd className="text-right font-mono text-sm text-foreground">
                        {product.sku}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-t border-foreground/15 py-3">
                      <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                        Brand portfolio
                      </dt>
                      <dd className="text-right text-sm text-foreground">
                        {brand.productCount} products
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-t border-foreground/15 py-3">
                      <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                        Gallery assets
                      </dt>
                      <dd className="text-right text-sm text-foreground">
                        {galleryImages.length} image
                        {galleryImages.length === 1 ? "" : "s"}
                      </dd>
                    </div>
                  </dl>

                  {/* Inquiry box */}
                  <div>
                    <ProductActions
                      productName={product.name}
                      productSku={product.sku}
                      brandName={brand.name}
                    />
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-sm border border-foreground/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                        Quote support
                      </span>
                      <span className="rounded-sm border border-foreground/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                        Same-day processing
                      </span>
                      <span className="rounded-sm border border-foreground/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                        Canada + USA coverage
                      </span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </section>

          {/* About the brand — inverted editorial band */}
          <section className="border-t border-foreground/15 py-12 sm:py-16">
            <div className="relative isolate grid gap-8 overflow-hidden bg-foreground p-6 text-background sm:p-10 lg:grid-cols-12 lg:gap-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-radial-[at_12%_0%] from-primary/20 via-transparent to-transparent"
              />
              <div className="lg:col-span-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-background/60">
                  About the brand
                </p>

                <div className="mt-5 flex items-center gap-3">
                  {brand.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      className="h-5 w-auto max-w-24 object-contain brightness-0 invert"
                    />
                  ) : null}
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-background/80">
                    {brand.name}
                  </span>
                </div>

                <h2 className="mt-5 font-display text-3xl uppercase leading-[0.95] tracking-tight sm:text-4xl">
                  The {brand.name} wholesale range
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-background/70 sm:text-base">
                  {brand.description}. Explore the wider portfolio to compare
                  related products and build out a stronger category mix.
                </p>
              </div>

              <div className="lg:col-span-5">
                <dl className="border-b border-background/20">
                  <div className="flex items-center justify-between gap-4 border-t border-background/20 py-3">
                    <dt className="font-mono text-[11px] uppercase tracking-widest text-background/60">
                      Portfolio
                    </dt>
                    <dd className="text-right text-sm text-background">
                      {brand.productCount} products
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-background/20 py-3">
                    <dt className="font-mono text-[11px] uppercase tracking-widest text-background/60">
                      Position
                    </dt>
                    <dd className="text-right text-sm text-background">
                      {brand.featured ? "Featured brand" : "Catalog brand"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-background/20 py-3">
                    <dt className="font-mono text-[11px] uppercase tracking-widest text-background/60">
                      Coverage
                    </dt>
                    <dd className="text-right text-sm text-background">
                      Canada + USA
                    </dd>
                  </div>
                </dl>

                <Link
                  href={`/brands/${brand.slug}`}
                  className="mt-8 inline-flex items-center gap-2 border-2 border-background bg-transparent px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-background transition-colors hover:bg-background hover:text-foreground"
                >
                  View {brand.name} brand page
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* Wholesale FAQ — content mirrors the FAQPage JSON-LD above */}
          <section className="border-t border-foreground/15 py-12 sm:py-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
              FAQ
            </p>
            <h2 className="mt-4 font-display text-3xl uppercase leading-[0.95] tracking-tight text-foreground sm:text-5xl">
              Wholesale questions.
            </h2>
            <div className="mt-8 border-t-2 border-foreground">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group border-b border-foreground/15"
                >
                  <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-5 font-mono text-xs uppercase tracking-[0.15em] text-foreground transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-primary transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="max-w-3xl pb-6 text-sm font-light leading-relaxed text-muted-foreground sm:text-base">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* Related products */}
          {relatedProducts.length > 0 ? (
            <section className="border-t border-foreground/15 py-12 sm:py-16">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
                    Related inventory
                  </p>
                  <h2 className="mt-4 font-display text-3xl uppercase leading-[0.95] tracking-tight text-foreground sm:text-5xl">
                    More from {brand.name}
                  </h2>
                </div>
                <Link
                  href={`/brands/${brand.slug}`}
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  View all {brand.name} products
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
                {relatedProducts.map((relatedProduct, index) => (
                  <Link
                    key={`${brand.slug}-${relatedProduct.id}`}
                    href={productHref(brand.slug, relatedProduct.id)}
                    className="group flex h-full flex-col border border-foreground/15 bg-card transition-colors hover:border-foreground"
                  >
                    <div className="aspect-square overflow-hidden bg-secondary p-6">
                      <Image
                        src={relatedProduct.image || "/placeholder.svg"}
                        alt={relatedProduct.name}
                        width={500}
                        height={500}
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-center justify-between gap-3 border-t border-foreground/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                        <span className="text-primary">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="truncate">{relatedProduct.sku}</span>
                      </div>
                      <h3 className="line-clamp-2 px-4 pb-4 pt-1 font-display text-lg uppercase leading-tight tracking-tight text-foreground">
                        {relatedProduct.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
