'use client';

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brand } from "@/lib/brand";
import { YorksteadMark } from "@/components/brand/yorkstead-logo";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle navigation menu"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {open && (
        <div className="fixed inset-x-0 top-14 border-b border-border bg-background/95 p-6 backdrop-blur-md">
          <div className="mb-4 flex items-center gap-2.5 border-b border-border pb-3">
            <YorksteadMark size={20} />
            <span className="font-mono text-xs font-bold tracking-[0.24em] text-foreground">
              {brand.wordmark}<span className="text-primary">.{brand.domainSuffix}</span>
            </span>
          </div>
          <nav className="flex flex-col gap-4" aria-label="Mobile Navigation">
            <Link
              href="/audit"
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-primary"
            >
              Workflow Audit
            </Link>
            <Link
              href="/directory"
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-primary"
            >
              Directory
            </Link>
            <Link
              href="/jobs"
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-primary"
            >
              Jobs
            </Link>
            <Link
              href="/shopfloor"
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-primary"
            >
              Shopfloor
            </Link>
            <Link
              href="/inventory"
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-primary"
            >
              Inventory
            </Link>
            <Link
              href="/job-packets"
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-primary"
            >
              Packets
            </Link>
            <Link
              href="/quality"
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-primary"
            >
              Quality
            </Link>
            <Link
              href="/maintenance"
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-primary"
            >
              Maintenance
            </Link>
            <Link
              href="/packaging"
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-primary"
            >
              Packaging
            </Link>
            <Link
              href="/shipping"
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-primary"
            >
              Shipping
            </Link>
            <Link
              href="/quotes"
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-primary"
            >
              Quotes
            </Link>
            <Link
              href="/purchasing"
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-primary"
            >
              Purchasing
            </Link>
            <Link
              href="/knowledge"
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-primary"
            >
              KnowHow
            </Link>
            <Link
              href="/analytics"
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-primary"
            >
              Analytics
            </Link>
            <Link
              href="/files"
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-primary"
            >
              Files
            </Link>
            <Link
              href="/activity"
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-primary"
            >
              Activity
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-primary"
            >
              Platform
            </Link>
            <Link
              href="/modules"
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-primary"
            >
              Modules
            </Link>
            <Link
              href="/demo"
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-primary"
            >
              Demo Orgs
            </Link>
            <Link
              href="/settings/organization"
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-primary"
            >
              Organization Settings
            </Link>
            <Link
              href="/settings/roles"
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-primary"
            >
              Role Capabilities
            </Link>
            <Link
              href="/settings/configuration"
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-primary"
            >
              Module Entitlements
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
