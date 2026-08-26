'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Clock, Cpu } from "lucide-react";

export function AnalyticsWorkspace() {
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const [needsAttention, setNeedsAttention] = React.useState([
    {
      id: "na_1",
      module: "Purchasing",
      severity: "critical",
      title: "Material Shortage Holding JOB-2026-104",
      description: "304 SS Sheet 0.25in: Need 8 sheets by Aug 30 to meet delivery date.",
      recommendation: "Transmit expedited purchase order to Ryerson ($420/sheet, 3d lead time).",
      tradeOff: "$150 freight fee avoids 48h shopfloor press brake idle time.",
    },
    {
      id: "na_2",
      module: "Capacity",
      severity: "warning",
      title: "Press Brake WorkCenter Overloaded (104.2%)",
      description: "CNC Press Brake Cell scheduled for 83.4 hours vs 80.0 available hours this week.",
      recommendation: "Authorize split setup on secondary 150-ton brake (EQ-BRAKE-01).",
      tradeOff: "Adds 45min setup changeover but restores on-time buffer.",
    },
  ]);

  const [metrics] = React.useState([
    {
      title: "Schedule Adherence",
      value: "94.5%",
      target: ">= 95.0%",
      status: "healthy",
      source: "JobService",
      freshness: "Live (5s ago)",
    },
    {
      title: "First Pass Quality Yield",
      value: "99.2%",
      target: ">= 98.0%",
      status: "healthy",
      source: "QualityService",
      freshness: "Live (1m ago)",
    },
    {
      title: "Fleet Availability",
      value: "97.4%",
      target: ">= 95.0%",
      status: "healthy",
      source: "MaintenanceService",
      freshness: "Live (just now)",
    },
    {
      title: "On-Time Dispatch",
      value: "98.7%",
      target: ">= 98.0%",
      status: "healthy",
      source: "ShippingService",
      freshness: "Live (10m ago)",
    },
    {
      title: "Quote Win Rate",
      value: "72.4%",
      target: ">= 65.0%",
      status: "healthy",
      source: "QuoteService",
      freshness: "Live (15m ago)",
    },
    {
      title: "Supplier On-Time Rate",
      value: "98.7%",
      target: ">= 95.0%",
      status: "healthy",
      source: "PurchasingService",
      freshness: "Live (20m ago)",
    },
  ]);

  const handleResolve = (id: string, title: string) => {
    setNeedsAttention(needsAttention.filter((n) => n.id !== id));
    setFeedback(`Action confirmed: ${title}. Mitigation applied.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="default">OPERATIONS//ANALYTICS</Badge>
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Factory Pulse, Capacity Signals & Owner Needs-Attention Queue
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Analytics & Operational Planning
          </h1>
          <p className="text-sm text-muted-foreground">
            Reconciled operational metrics, workcenter capacity signals, and constraint-aware decision support.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFeedback("All operational read models refreshed.");
              setTimeout(() => setFeedback(null), 2500);
            }}
            className="font-mono text-xs"
          >
            <Clock className="mr-1.5 size-3.5" />
            Refresh Metrics
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 p-3 text-xs font-mono text-primary">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Owner Needs Attention Queue */}
      <Card className="border-yellow-500/40 bg-yellow-500/[0.02]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-yellow-400">
              <AlertTriangle className="size-5 shrink-0" />
              <CardTitle className="text-base text-foreground">Needs Attention & Bottleneck Queue</CardTitle>
            </div>
            <Badge variant="outline" className="font-mono text-[10px] text-yellow-400 border-yellow-500/30">
              {needsAttention.length} ACTIVE ITEMS
            </Badge>
          </div>
          <CardDescription>
            Live cross-module operational exceptions requiring human decision and confirmation.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {needsAttention.length === 0 ? (
            <div className="rounded-lg border border-border p-6 text-center text-xs font-mono text-muted-foreground">
              All factory workcenters, quality checks, and supply lines operating within target boundaries.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {needsAttention.map((item) => (
                <div key={item.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`font-mono text-[9px] uppercase ${
                          item.severity === "critical"
                            ? "border-red-500/40 text-red-400 bg-red-500/10"
                            : "border-yellow-500/40 text-yellow-400 bg-yellow-500/10"
                        }`}
                      >
                        {item.severity}
                      </Badge>
                      <span className="font-mono text-xs font-bold text-foreground">{item.title}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">&bull; {item.module}</span>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground">{item.description}</p>
                    <div className="rounded bg-muted/40 p-2 text-[11px] font-mono text-foreground space-y-0.5">
                      <p><span className="text-primary font-semibold">Recommended:</span> {item.recommendation}</p>
                      <p><span className="text-yellow-400 font-semibold">Tradeoff:</span> {item.tradeOff}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleResolve(item.id, item.title)}
                      className="font-mono text-xs"
                    >
                      <CheckCircle2 className="mr-1.5 size-3.5" /> Confirm Action
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Governed Operational Metrics Matrix */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m, idx) => (
          <Card key={idx}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{m.title}</span>
                <Badge variant="default" className="font-mono text-[9px]">{m.status.toUpperCase()}</Badge>
              </div>
              <div className="flex items-baseline justify-between">
                <p className="font-mono text-2xl font-bold text-foreground">{m.value}</p>
                <span className="font-mono text-[10px] text-muted-foreground">Target: {m.target}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border font-mono text-[9px] text-muted-foreground">
                <span>Source: {m.source}</span>
                <span>{m.freshness}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* WorkCenter Capacity & Load Signals */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <Cpu className="size-5" />
            <CardTitle className="text-base">WorkCenter Capacity & Load Spectrum</CardTitle>
          </div>
          <CardDescription>Measured machine and station hours committed for current week.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-foreground">WC-LASER (6kW)</span>
                <span className="font-mono text-[10px] text-primary">78.1%</span>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground">62.5 / 80.0 hrs committed</p>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "78.1%" }} />
              </div>
            </div>

            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/[0.03] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-yellow-400">WC-BRAKE (220T)</span>
                <span className="font-mono text-[10px] text-yellow-400 font-bold">104.2%</span>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground">83.4 / 80.0 hrs committed</p>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-yellow-400" style={{ width: "100%" }} />
              </div>
            </div>

            <div className="rounded-lg border border-border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-foreground">WC-WELD (TIG/MIG)</span>
                <span className="font-mono text-[10px] text-primary">78.3%</span>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground">94.0 / 120.0 hrs committed</p>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "78.3%" }} />
              </div>
            </div>

            <div className="rounded-lg border border-border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-foreground">WC-FINISH (Coat)</span>
                <span className="font-mono text-[10px] text-primary">90.0%</span>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground">72.0 / 80.0 hrs committed</p>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "90%" }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
