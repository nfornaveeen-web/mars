
import { Mail, MapPin, Phone } from "lucide-react"
import Link from "next/link"

export function TopBar() {
  return (
    <div className="hidden w-full border-b border-background/10 bg-foreground text-background sm:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-2 font-mono text-[10px] uppercase tracking-widest sm:px-8 sm:text-xs">
        <div className="flex items-center gap-5 lg:gap-7">
          <Link
            href="tel:+16474034735"
            className="flex items-center gap-2 whitespace-nowrap text-background/80 transition-colors hover:text-background"
          >
            <Phone className="h-3 w-3 shrink-0 text-background/50" aria-hidden="true" />
            +1 647 403 4735
          </Link>
          <Link
            href="mailto:gaurav@marstechnologyinc.com"
            className="flex items-center gap-2 whitespace-nowrap text-background/80 transition-colors hover:text-background"
          >
            <Mail className="h-3 w-3 shrink-0 text-background/50" aria-hidden="true" />
            gaurav@marstechnologyinc.com
          </Link>
        </div>
        <div className="flex items-center gap-5 lg:gap-7">
          <div className="hidden items-center gap-2 whitespace-nowrap text-background/80 md:flex">
            <MapPin className="h-3 w-3 shrink-0 text-background/50" aria-hidden="true" />
            <span>Brampton, Canada</span>
          </div>
          <span className="hidden whitespace-nowrap border-l border-background/20 pl-5 text-background/50 lg:inline-block lg:pl-7">
            Global B2B Distributor
          </span>
        </div>
      </div>
    </div>
  )
}
