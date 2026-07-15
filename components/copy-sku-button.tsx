"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopySkuButton({ sku }: { sku: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sku);
    } catch {
      // Fallback for browsers that block clipboard API
      const el = document.createElement("textarea");
      el.value = sku;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors ${
        copied
          ? "border-success bg-success/10 text-success"
          : "border-foreground/20 bg-transparent text-muted-foreground hover:border-foreground hover:text-foreground"
      }`}
      title={copied ? "Copied!" : "Copy SKU to clipboard"}
      aria-label={copied ? "Copied!" : "Copy SKU to clipboard"}
    >
      {copied ? (
        <Check className="h-3 w-3" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
