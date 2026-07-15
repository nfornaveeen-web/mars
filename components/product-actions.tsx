"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { X, Check } from "lucide-react";
import { submitContactSubmission } from "@/lib/contact-submissions";

interface ProductActionsProps {
  productName: string;
  productSku: string;
  brandName: string;
}

export default function ProductActions({
  productName,
  productSku,
  brandName,
}: ProductActionsProps) {
  const defaultMessage = `I'm interested in ${productName} by ${brandName} (SKU: ${productSku}). Please send me a wholesale quote.`;
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [inquiryAdded, setInquiryAdded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: defaultMessage,
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await submitContactSubmission({
        ...formData,
        product: productName,
        sku: productSku,
        source: "product-quote",
      });
      setSubmitted(true);
      setTimeout(() => {
        setQuoteOpen(false);
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          message: defaultMessage,
        });
      }, 2500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddToInquiry = () => {
    setInquiryAdded(true);
    setTimeout(() => setInquiryAdded(false), 2500);
  };

  return (
    <>
      <div className="border-2 border-foreground bg-card p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
          Wholesale actions
        </p>

        <div className="mt-5 space-y-3">
          <button
            type="button"
            onClick={() => setQuoteOpen(true)}
            className="inline-flex w-full items-center justify-center gap-2 bg-primary px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            Request quote
          </button>
          <button
            type="button"
            onClick={handleAddToInquiry}
            className={`inline-flex w-full items-center justify-center gap-2 border-2 bg-transparent px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] transition-colors ${
              inquiryAdded
                ? "border-success bg-success/10 text-success"
                : "border-foreground text-foreground hover:bg-foreground hover:text-background"
            }`}
          >
            {inquiryAdded ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Added to inquiry
              </>
            ) : (
              "Add to inquiry"
            )}
          </button>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          Request current pricing, availability, and lead-time guidance for this
          SKU.
        </p>
        <Link
          href="/contact"
          className="mt-3 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline underline-offset-4 transition-colors hover:text-primary"
        >
          Or contact sales
        </Link>
      </div>

      {quoteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4"
          onClick={() => setQuoteOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto border-2 border-foreground bg-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-start justify-between border-b-2 border-foreground bg-card px-6 py-5">
              <div>
                <h2 className="font-display text-2xl uppercase leading-[0.95] tracking-tight text-foreground">
                  Request quote
                </h2>
                <p className="mt-2 line-clamp-1 max-w-xs font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                  {brandName} / {productName}
                </p>
              </div>
              <button
                onClick={() => setQuoteOpen(false)}
                className="mt-0.5 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {submitted ? (
                <div className="py-8 text-center">
                  <Check className="mx-auto mb-4 h-10 w-10 text-success" />
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground">
                    Quote request sent
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    We'll be in touch shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <p className="border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                      {error}
                    </p>
                  )}
                  <div>
                    <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-none border border-foreground/20 bg-transparent px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-none border border-foreground/20 bg-transparent px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full rounded-none border border-foreground/20 bg-transparent px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
                      placeholder="Your company"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-none border border-foreground/20 bg-transparent px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      className="w-full resize-none rounded-none border border-foreground/20 bg-transparent px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 bg-primary px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send quote request"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
