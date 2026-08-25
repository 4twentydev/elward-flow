'use client';

import * as React from "react";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { Badge } from "@/components/ui/badge";
import { MobileNav } from "@/components/shell/mobile-nav";

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

        <div className="flex items-center gap-2">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
