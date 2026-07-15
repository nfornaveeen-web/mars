"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { getAllCategories, getProductsByCategory } from "@/lib/brands"
import ProductCard from "@/components/product-card"

export default function ProductsContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const categories = getAllCategories()

  const allProducts = useMemo(() => {
    return categories.flatMap((cat) => getProductsByCategory(cat))
  }, [categories])

  const filteredProducts = useMemo(() => {
    let results = allProducts

    if (selectedCategory) {
      results = results.filter((p) => p.category === selectedCategory)
    }

    if (searchQuery) {
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return results
  }, [allProducts, selectedCategory, searchQuery])

  return (
    <main className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-foreground/15">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] sm:px-8">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <span className="text-foreground/40">/</span>
          <span className="text-foreground">All Products</span>
        </div>
      </div>

      {/* Page header */}
      <section className="mx-auto max-w-7xl px-5 pt-12 sm:px-8 sm:pt-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
          Catalog
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="font-display text-4xl uppercase leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            All Products
          </h1>
          <p className="pb-1 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {filteredProducts.length} / {allProducts.length} SKUs
          </p>
        </div>
        <div className="mt-8 h-1 w-full bg-foreground" aria-hidden="true" />
      </section>

      {/* Toolbar: search + category filters */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-4 border-b border-foreground/15 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="SEARCH PRODUCTS, SKUS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-none border border-foreground/20 bg-transparent py-3 pl-10 pr-4 font-mono text-xs tracking-widest text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`border px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
                selectedCategory === null
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/20 bg-transparent text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`border px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
                  selectedCategory === cat
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/20 bg-transparent text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-8 sm:px-8 sm:pb-16">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-foreground/15 bg-card px-6 py-16 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
              No results
            </p>
            <p className="mt-4 font-display text-2xl uppercase leading-[0.95] tracking-tight text-foreground sm:text-3xl">
              Nothing matches that filter
            </p>
            <button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory(null)
              }}
              className="mt-8 inline-flex items-center gap-2 border-2 border-foreground bg-transparent px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={`${product.brand}-${product.id}`} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
