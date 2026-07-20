"use client";

import type React from "react";

import { useState } from "react";
import { X, Mail, Phone, MapPin } from "lucide-react";
import { submitContactSubmission } from "@/lib/contact-submissions";

const inputClasses =
  "w-full border border-foreground/20 bg-transparent px-4 py-2.5 text-sm font-light text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-ring focus:outline-none";

const labelClasses =
  "mb-2 block font-mono text-[11px] uppercase tracking-widest text-foreground";

export default function LeadModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await submitContactSubmission({
        ...formData,
        message: formData.message || "Requested a quote via the lead modal.",
        source: "lead-modal",
      });
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          message: "",
        });
      }, 2000);
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

  return (
    <>
      {/* Lead Modal Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 bg-primary px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground shadow-lg transition-colors hover:bg-foreground hover:text-background"
      >
        Get Quote
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto border-2 border-foreground bg-card">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-foreground bg-card px-6 py-5">
              <h2 className="font-display text-xl uppercase leading-none tracking-tight text-foreground">
                Get Your Quote
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <p className="border border-destructive/40 bg-destructive/10 px-4 py-3 font-mono text-xs text-destructive">
                      {error}
                    </p>
                  )}
                  <div>
                    <label className={labelClasses}>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={inputClasses}
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={inputClasses}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className={inputClasses}
                      placeholder="Your company"
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      className={`${inputClasses} resize-none`}
                      placeholder="Tell us about your needs..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 bg-primary px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Sending..." : "Submit"}
                  </button>

                  <div className="mt-6 border-t-2 border-foreground pt-5">
                    <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
                      Quick Contact
                    </p>
                    <div className="mt-2">
                      <a
                        href="tel:+16474034735"
                        className="group flex items-center gap-3 border-t border-foreground/15 py-3 text-sm font-light text-foreground transition-colors first:border-t-0 hover:text-primary"
                      >
                        <Phone className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                        +1 (647) 403-4735
                      </a>
                      <a
                        href="mailto:gaurav@marstechnologyinc.com"
                        className="group flex items-center gap-3 border-t border-foreground/15 py-3 text-sm font-light text-foreground transition-colors hover:text-primary"
                      >
                        <Mail className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                        gaurav@marstechnologyinc.com
                      </a>
                      <div className="flex items-start gap-3 border-t border-foreground/15 py-3 text-sm font-light text-foreground">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div>
                          <p>Brampton, Ontario, Canada</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="border border-success/40 bg-success/10 px-6 py-10 text-center">
                  <svg
                    className="mx-auto h-8 w-8 text-success"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <h3 className="mt-4 font-display text-lg uppercase tracking-tight text-foreground">
                    Thank You!
                  </h3>
                  <p className="mt-2 text-sm font-light text-muted-foreground">
                    We'll be in touch within 24 hours.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
