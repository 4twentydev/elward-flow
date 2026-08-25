'use client';

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          <nav className="flex flex-col gap-4" aria-label="Mobile Navigation">
            <Link
              href="/audit"
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-primary"
            >
              Workflow Audit
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
          </nav>
        </div>
      )}
    </div>
  );
}
