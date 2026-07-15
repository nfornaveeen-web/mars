"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Inbox,
  Layers3,
  MessageSquareQuote,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from "lucide-react";
import AdminLogoutButton from "@/components/admin-logout-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminSidebarView = "leads" | "templates";

type AdminSidebarProps = {
  currentView: AdminSidebarView;
  sessionEmail: string;
  leadsHref: string;
  templatesHref: string;
  leadCount?: number;
  templateCount?: number;
};

type AdminSidebarItemProps = {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  isActive: boolean;
  badge?: string;
  collapsed?: boolean;
};

function AdminSidebarItem({
  href,
  icon: Icon,
  title,
  description,
  isActive,
  badge,
  collapsed = false,
}: AdminSidebarItemProps) {
  return (
    <Link
      href={href}
      title={collapsed ? title : undefined}
      className={cn(
        "block rounded-3xl border transition",
        collapsed ? "px-3 py-3" : "px-4 py-4",
        isActive
          ? "border-background/20 bg-background/12 text-background shadow-[0_20px_40px_rgba(15,23,42,0.18)]"
          : "border-background/10 bg-background/5 text-background/80 hover:border-background/20 hover:bg-background/10 hover:text-background",
      )}
    >
      <div
        className={cn(
          "flex gap-3",
          collapsed
            ? "flex-col items-center justify-center"
            : "items-start justify-between",
        )}
      >
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-background/10 text-background">
          <Icon className="h-5 w-5" />
        </div>
        {badge ? (
          <span
            className={cn(
              "inline-flex rounded-full border border-background/15 bg-background/10 font-semibold uppercase tracking-[0.16em] text-background/70",
              collapsed
                ? "min-w-7 justify-center px-1.5 py-1 text-[10px]"
                : "px-2.5 py-1 text-[11px]",
            )}
          >
            {badge}
          </span>
        ) : null}
      </div>
      {!collapsed ? (
        <div className="mt-4 space-y-1">
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-sm leading-6 text-background/60">{description}</p>
        </div>
      ) : (
        <span className="sr-only">{description}</span>
      )}
    </Link>
  );
}

export default function AdminSidebar({
  currentView,
  sessionEmail,
  leadsHref,
  templatesHref,
  leadCount,
  templateCount,
}: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "w-full lg:sticky lg:top-6 lg:shrink-0 lg:self-start lg:transition-[width] lg:duration-300",
        isCollapsed ? "lg:w-24" : "lg:w-80",
      )}
    >
      <div className="overflow-hidden rounded-4xl border border-border bg-foreground text-background shadow-[0_32px_80px_rgba(15,23,42,0.22)]">
        <div
          className={cn(
            "border-b border-background/10",
            isCollapsed ? "px-3 py-4" : "px-6 py-6",
          )}
        >
          <div
            className={cn(
              "flex items-start gap-3",
              isCollapsed ? "justify-center" : "justify-between",
            )}
          >
            {isCollapsed ? (
              ""
            ) : (
              <div>
                <p className="inline-flex rounded-full border border-background/12 bg-background/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-background/70">
                  Mars Technology Inc
                </p>
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCollapsed((currentValue) => !currentValue)}
              className="inline-flex rounded-full border-background/15 bg-background/8 text-background hover:bg-background/15 hover:text-background"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className={cn("space-y-6 py-4", isCollapsed ? "px-3" : "px-4")}>
          <div className="space-y-2">
            {!isCollapsed ? (
              <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-background/45">
                Navigation
              </p>
            ) : null}
            <div className="space-y-2">
              <AdminSidebarItem
                href={leadsHref}
                icon={Inbox}
                title="Leads"
                description="Search, filter, and update inbound submissions from one inbox."
                isActive={currentView === "leads"}
                badge={
                  typeof leadCount === "number" ? String(leadCount) : undefined
                }
                collapsed={isCollapsed}
              />
              <AdminSidebarItem
                href={templatesHref}
                icon={Layers3}
                title="Template CRUD"
                description="Create, edit, and delete reusable templates for follow-up."
                isActive={currentView === "templates"}
                badge={
                  typeof templateCount === "number"
                    ? String(templateCount)
                    : undefined
                }
                collapsed={isCollapsed}
              />
            </div>
          </div>

          {isCollapsed ? (
            <div className="flex justify-center">
              <div
                title={sessionEmail}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-background/10 bg-background/5 text-background/75"
              >
                <MessageSquareQuote className="h-5 w-5" />
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-3xl border border-background/10 bg-background/5 px-4 py-4">
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-background/10 text-background">
                    <MessageSquareQuote className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">Signed in</p>
                    <p className="text-sm leading-6 text-background/70">
                      {sessionEmail}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-background/20 bg-background/10 text-background hover:bg-background/15 hover:text-background"
                  >
                    <Link href="/contact">Open contact page</Link>
                  </Button>
                  <AdminLogoutButton />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
