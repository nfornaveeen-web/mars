import Header from "@/components/header";
import Footer from "@/components/footer";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "Mars Technology Inc's terms and conditions for using its website, wholesale services, and business communications.",
  path: "/terms",
  noIndex: true,
});

const sections: { title: string; body: string[] }[] = [
  {
    title: "Agreement",
    body: [
      "By accessing and using the Mars Technology Inc website and services, you agree to be bound by these Terms of Service. If you do not agree to any part of these terms, you may not use our services.",
    ],
  },
  {
    title: "Product Information",
    body: [
      "We strive to provide accurate descriptions and pricing for all products. However, we do not warrant that product descriptions, pricing, or other content is accurate, complete, or error-free. We reserve the right to correct any errors and to change or update information at any time without prior notice.",
    ],
  },
  {
    title: "Wholesale Orders",
    body: [
      "All orders are subject to acceptance by Mars Technology Inc. We reserve the right to reject or cancel any order at our sole discretion. Prices are subject to change without notice. Volume discounts and special pricing are contingent on order quantities and are not guaranteed unless confirmed in writing.",
    ],
  },
  {
    title: "Payment Terms",
    body: [
      "Payment terms are negotiated individually and must be confirmed in writing before order fulfillment. Standard payment methods include wire transfer, credit card, and purchase orders for qualified customers. We reserve the right to require payment in advance for certain transactions.",
    ],
  },
  {
    title: "Shipping and Delivery",
    body: [
      "We make reasonable efforts to meet estimated delivery dates but do not guarantee delivery timeframes. Shipping costs and methods are specified at checkout and may vary based on order size and destination. Risk of loss for products transfers to you upon delivery to the carrier.",
    ],
  },
  {
    title: "Product Warranty",
    body: [
      'Products are sold as described with manufacturer warranties where applicable. We do not provide additional warranties beyond those offered by manufacturers. Some products may be sold "as-is" for liquidation purposes, without warranty.',
    ],
  },
  {
    title: "Returns and Refunds",
    body: [
      "Returns are accepted within 14 days of delivery for defective or damaged items with proof of damage. Returns must be authorized in advance. Restocking fees may apply to non-defective returned items. Refunds are processed within 10-15 business days of receipt and verification of returned items.",
    ],
  },
  {
    title: "Limitation of Liability",
    body: [
      "In no event shall Mars Technology Inc be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or services, even if advised of the possibility of such damages. Our total liability is limited to the amount paid for the products in question.",
    ],
  },
  {
    title: "Intellectual Property",
    body: [
      "All content on our website, including text, graphics, logos, and images, is the property of Mars Technology Inc or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, or transmit any content without our prior written permission.",
    ],
  },
  {
    title: "User Conduct",
    body: [
      "You agree not to use our website for any unlawful purpose or in any way that infringes upon the rights of others or restricts their use and enjoyment. Prohibited behavior includes harassing, causing distress or inconvenience, and transmitting obscene or offensive content.",
    ],
  },
  {
    title: "Modifications",
    body: [
      "We reserve the right to modify these Terms of Service at any time. Your continued use of our website and services following any modifications constitutes your acceptance of the new terms.",
    ],
  },
  {
    title: "Governing Law",
    body: [
      "These Terms of Service are governed by and construed in accordance with the laws of the jurisdictions where Mars Technology Inc operates, and you irrevocably submit to the exclusive jurisdiction of the courts located in such jurisdictions.",
    ],
  },
];

export default function Terms() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
            Legal
          </p>
          <h1 className="mt-6 font-display text-4xl uppercase leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Terms of Service
          </h1>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Last updated: January 2026
          </p>

          <div className="mt-12 sm:mt-16">
            {sections.map((section, index) => (
              <section
                key={section.title}
                className="border-t border-foreground/15 py-8 first:border-t-2 first:border-foreground"
              >
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground">
                  <span className="mr-2 text-primary">
                    {String(index + 1).padStart(2, "0")}.
                  </span>
                  {section.title}
                </h2>
                <div className="mt-4 space-y-3">
                  {section.body.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="text-sm font-light leading-relaxed text-muted-foreground sm:text-base"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            <section className="border-t border-foreground/15 py-8">
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground">
                <span className="mr-2 text-primary">13.</span>
                Contact Information
              </h2>
              <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground sm:text-base">
                For questions about these Terms of Service, please contact us
                at:
              </p>
              <div className="mt-6 border-2 border-foreground p-6">
                <p className="font-display text-lg uppercase tracking-tight text-foreground">
                  Mars Technology Inc
                </p>
                <div className="mt-3 space-y-1 font-mono text-xs text-muted-foreground">
                  <p>Email: legal@marstechnologyinc.com</p>
                  <p>Phone: +1 647 403 4735</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
