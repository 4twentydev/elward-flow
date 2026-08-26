'use client';

import * as React from "react";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { Badge } from "@/components/ui/badge";
import { MobileNav } from "@/components/shell/mobile-nav";

import { OrgSwitcher } from "@/components/shell/org-switcher";
import { NotificationsDrawer } from "@/components/shell/notifications-drawer";
import { Settings } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="inline-flex items-center gap-3" aria-label={brand.name}>
            <span className="font-mono text-sm font-bold tracking-[0.24em] text-foreground">
              {brand.wordmark}<span className="text-primary">{brand.domainSuffix}</span>
            </span>
            <span className="hidden border-l border-border pl-3 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground sm:inline-block">
              {brand.systemName}
            </span>
          </Link>
          <Badge variant="default" className="hidden sm:inline-flex">v{brand.version}</Badge>
        </div>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main Navigation">
          <Link href="/audit" className="text-xs font-mono uppercase tracking-wider text-muted-foreground transition hover:text-foreground">
            Workflow Audit
          </Link>
          <Link href="/directory" className="text-xs font-mono uppercase tracking-wider text-muted-foreground transition hover:text-foreground">
            Directory
          </Link>
          <Link href="/jobs" className="text-xs font-mono uppercase tracking-wider text-muted-foreground transition hover:text-foreground">
            Jobs
          </Link>
          <Link href="/shopfloor" className="text-xs font-mono uppercase tracking-wider text-muted-foreground transition hover:text-foreground">
            Shopfloor
          </Link>
          <Link href="/inventory" className="text-xs font-mono uppercase tracking-wider text-muted-foreground transition hover:text-foreground">
            Inventory
          </Link>
          <Link href="/job-packets" className="text-xs font-mono uppercase tracking-wider text-muted-foreground transition hover:text-foreground">
            Packets
          </Link>
          <Link href="/quality" className="text-xs font-mono uppercase tracking-wider text-muted-foreground transition hover:text-foreground">
            Quality
          </Link>
          <Link href="/maintenance" className="text-xs font-mono uppercase tracking-wider text-muted-foreground transition hover:text-foreground">
            Maintenance
          </Link>
          <Link href="/packaging" className="text-xs font-mono uppercase tracking-wider text-muted-foreground transition hover:text-foreground">
            Packaging
          </Link>
          <Link href="/shipping" className="text-xs font-mono uppercase tracking-wider text-muted-foreground transition hover:text-foreground">
            Shipping
          </Link>
          <Link href="/quotes" className="text-xs font-mono uppercase tracking-wider text-muted-foreground transition hover:text-foreground">
            Quotes
          </Link>
          <Link href="/purchasing" className="text-xs font-mono uppercase tracking-wider text-muted-foreground transition hover:text-foreground">
            Purchasing
          </Link>
          <Link href="/knowledge" className="text-xs font-mono uppercase tracking-wider text-muted-foreground transition hover:text-foreground">
            KnowHow
          </Link>
          <Link href="/files" className="text-xs font-mono uppercase tracking-wider text-muted-foreground transition hover:text-foreground">
            Files
          </Link>
          <Link href="/activity" className="text-xs font-mono uppercase tracking-wider text-muted-foreground transition hover:text-foreground">
            Activity
          </Link>
          <Link href="/dashboard" className="text-xs font-mono uppercase tracking-wider text-muted-foreground transition hover:text-foreground">
            Platform
          </Link>
          <Link href="/modules" className="text-xs font-mono uppercase tracking-wider text-muted-foreground transition hover:text-foreground">
            Modules
          </Link>
          <Link href="/demo" className="text-xs font-mono uppercase tracking-wider text-muted-foreground transition hover:text-foreground">
            Demo Orgs
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <OrgSwitcher />
          <NotificationsDrawer />
          <Link
            href="/settings/organization"
            aria-label="Organization Settings"
            className="hidden rounded-lg border border-border p-1.5 text-muted-foreground transition hover:border-primary/40 hover:text-foreground sm:inline-flex"
          >
            <Settings className="size-4" />
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
