'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Package } from 'lucide-react'

import { Product } from '@/lib/brands'
import { productHref } from '@/lib/product-slugs'

export default function ProductCard({ product }: { product: Product & { brand: string } }) {
  const [imageError, setImageError] = useState(false)

  return (
    <Link
      href={productHref(product.brand, product.id)}
      className="group flex h-full flex-col border border-foreground/15 bg-card transition-colors hover:border-foreground"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {!imageError ? (
          <Image
            src={product.image || `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(product.name)}`}
            alt={`${product.name} — wholesale ${product.category.toLowerCase()}, factory-sealed`}
            fill
            className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.02]"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary">
            <div className="text-center">
              <Package className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                No image
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-3 border-t border-foreground/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          <span className="truncate">{product.sku}</span>
          <span className="shrink-0 text-primary">{product.category}</span>
        </div>

        <h3 className="line-clamp-2 px-4 pb-4 pt-1 font-display text-lg uppercase leading-tight tracking-tight text-foreground">
          {product.name}
        </h3>
      </div>
    </Link>
  )
}
