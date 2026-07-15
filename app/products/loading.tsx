export default function Loading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-5 pt-12 sm:px-8 sm:pt-16">
        {/* Header skeleton */}
        <div className="animate-pulse">
          <div className="h-3 w-24 bg-muted" />
          <div className="mt-5 h-12 w-72 max-w-full bg-muted sm:h-16 sm:w-96" />
          <div className="mt-8 h-1 w-full bg-muted" />
        </div>

        {/* Toolbar skeleton */}
        <div className="flex animate-pulse flex-col gap-4 border-b border-foreground/15 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="h-11 w-full bg-muted lg:max-w-sm" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-9 w-24 bg-muted" />
            ))}
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="grid animate-pulse grid-cols-2 gap-4 pb-12 pt-8 sm:grid-cols-3 sm:gap-5 sm:pb-16 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="border border-foreground/10 bg-card">
              <div className="aspect-square bg-muted" />
              <div className="space-y-2 border-t border-foreground/10 p-4">
                <div className="h-2.5 w-1/2 bg-muted" />
                <div className="h-5 w-4/5 bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
