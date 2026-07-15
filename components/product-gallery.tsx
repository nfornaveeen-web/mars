"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const resolvedImages = images.length > 0 ? images : ["/placeholder.svg"];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = resolvedImages[selectedIndex] ?? resolvedImages[0];

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden border border-foreground/15 bg-secondary">
        {resolvedImages.length > 1 ? (
          <div className="absolute right-4 top-4 z-10 border border-foreground/20 bg-background px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
            {String(selectedIndex + 1).padStart(2, "0")} /{" "}
            {String(resolvedImages.length).padStart(2, "0")}
          </div>
        ) : null}

        <div className="aspect-square">
          <Image
            src={selectedImage}
            alt={productName}
            width={1000}
            height={1000}
            priority
            className="h-full w-full object-contain p-8 sm:p-12"
          />
        </div>
      </div>

      {resolvedImages.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {resolvedImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "overflow-hidden border-2 bg-secondary transition-colors",
                selectedIndex === index
                  ? "border-primary"
                  : "border-foreground/15 hover:border-foreground",
              )}
              aria-label={`Show ${productName} image ${index + 1}`}
            >
              <div className="aspect-square">
                <Image
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  width={240}
                  height={240}
                  className="h-full w-full object-contain p-3"
                />
              </div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
