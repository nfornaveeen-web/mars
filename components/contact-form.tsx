"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Check } from "lucide-react";
import { submitContactSubmission } from "@/lib/contact-submissions";

const inputClasses =
  "w-full border border-foreground/20 bg-transparent px-4 py-3 text-sm font-light text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-ring focus:outline-none";

const labelClasses =
  "mb-2 block font-mono text-[11px] uppercase tracking-widest text-foreground";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
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
        source: "contact-page",
      });
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
        Inquiry
      </p>
      <h2 className="mt-4 font-display text-2xl uppercase leading-[0.95] tracking-tight text-foreground sm:text-3xl">
        Send us a message
      </h2>
      {submitted ? (
        <div className="mt-8 border border-success/40 bg-success/10 px-6 py-12 text-center">
          <Check className="mx-auto h-10 w-10 text-success" />
          <p className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-success">
            Message sent successfully!
          </p>
          <p className="mt-3 text-sm font-light text-muted-foreground">
            We'll respond within 24 hours on business days.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <p className="border border-destructive/40 bg-destructive/10 px-4 py-3 font-mono text-xs text-destructive">
              {error}
            </p>
          )}
          <div>
            <label className={labelClasses}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label className={labelClasses}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label className={labelClasses}>Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Your company"
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>Phone (Optional)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your inquiry..."
              rows={5}
              className={`${inputClasses} resize-none`}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 bg-primary px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          <p className="pt-1 text-center text-xs font-light text-muted-foreground">
            We typically respond within 24 hours on business days.
          </p>
        </form>
      )}
    </div>
  );
}
