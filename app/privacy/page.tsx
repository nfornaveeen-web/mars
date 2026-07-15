import Header from "@/components/header";
import Footer from "@/components/footer";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Mars Technology Inc's privacy policy covering how personal and business information is collected, stored, and used.",
  path: "/privacy",
  noIndex: true,
});

const sections: { title: string; body: string[] }[] = [
  {
    title: "Introduction",
    body: [
      'Mars Technology Inc ("Company," "we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.',
    ],
  },
  {
    title: "Information We Collect",
    body: [
      "We collect information you provide directly to us, such as when you complete inquiry forms, place orders, or contact our sales team. This information may include your name, email address, phone number, company name, and details about your wholesale requirements.",
      "We also automatically collect certain information when you use our website, including your IP address, browser type, pages visited, and referring URLs. This information helps us improve our services and user experience.",
    ],
  },
  {
    title: "Use of Information",
    body: [
      "We use the information we collect to process your orders, respond to inquiries, provide customer support, and improve our services. We may also use your information to send you marketing communications, with your consent.",
      "Your information helps us understand your needs and preferences, allowing us to tailor our product offerings and communications accordingly.",
    ],
  },
  {
    title: "Information Sharing",
    body: [
      "We do not sell, trade, or rent your personal information to third parties. We may share information with service providers who assist us in operating our website and conducting our business, subject to strict confidentiality agreements.",
      "We may disclose information when required by law or when necessary to protect our rights, privacy, safety, or property.",
    ],
  },
  {
    title: "Data Security",
    body: [
      "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security of your information.",
    ],
  },
  {
    title: "Your Rights",
    body: [
      "You have the right to access, correct, or request deletion of your personal information. You may opt out of receiving marketing communications from us at any time. To exercise these rights, please contact us at the information provided below.",
    ],
  },
  {
    title: "Cookies and Tracking",
    body: [
      "Our website may use cookies and similar tracking technologies to enhance your experience. These technologies allow us to remember your preferences and understand how you use our site. You can control cookie settings through your browser preferences.",
    ],
  },
  {
    title: "Third-Party Links",
    body: [
      "Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing personal information.",
    ],
  },
  {
    title: "Policy Updates",
    body: [
      "We reserve the right to modify this Privacy Policy at any time. Changes will be effective immediately upon posting to the website. Your continued use of our website constitutes your acceptance of the updated Privacy Policy.",
    ],
  },
];

export default function Privacy() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
            Legal
          </p>
          <h1 className="mt-6 font-display text-4xl uppercase leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Privacy Policy
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
                <span className="mr-2 text-primary">10.</span>
                Contact Us
              </h2>
              <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground sm:text-base">
                If you have questions about this Privacy Policy or our privacy
                practices, please contact us at:
              </p>
              <div className="mt-6 border-2 border-foreground p-6">
                <p className="font-display text-lg uppercase tracking-tight text-foreground">
                  Mars Technology Inc
                </p>
                <div className="mt-3 space-y-1 font-mono text-xs text-muted-foreground">
                  <p>Email: privacy@marstechnologyinc.com</p>
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
