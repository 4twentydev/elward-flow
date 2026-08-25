'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  Plus,
  TrendingUp,
} from "lucide-react";

export function QualityWorkspace() {
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const [ncrs, setNcrs] = React.useState([
    {
      id: "ncr_42",
      ncrNumber: "NCR-2026-042",
      jobNumber: "JOB-2026-104",
      part: "Precision Laser Cut Flanges - 0.25in 304 SS",
      station: "WC-BRAKE-01 // Forming",
      defect: "Flange return angle measured at 92.5° exceeding ±0.5° spec.",
      severity: "major",
      status: "open",
      qty: 8,
      disposition: "pending_review",
      cost: "$140.00",
    },
  ]);

  const [checklist] = React.useState([
    { id: "c1", label: "Outer Diameter: 5.250 ± 0.005 in", target: "5.250 in", measured: "5.251 in", result: "pass" },
    { id: "c2", label: "Flange Angle: 90.0° ± 0.5°", target: "90.0 deg", measured: "90.2 deg", result: "pass" },
    { id: "c3", label: "Surface Finish & Burr Free Check", target: "Ra 32 Max", measured: "Ra 24", result: "pass" },
    { id: "c4", label: "Material Test Report (MTR) Verified", target: "304 SS Cert", measured: "Heat #8912A", result: "pass" },
  ]);

  const handleDisposition = (ncrId: string, action: string) => {
    setNcrs(
      ncrs.map((n) =>
        n.id === ncrId ? { ...n, status: "dispositioned", disposition: action } : n
      )
    );
    setFeedback(`NCR disposition recorded as '${action}'. Segregation of duties verified.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="default">OPERATIONS//QUALITY</Badge>
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Inspection Plans, NCRs & Yield Control
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Quality Assurance & Non-Conformance (NCR)
          </h1>
          <p className="text-sm text-muted-foreground">
            First Article Inspection (FAI), in-process defect capture, segregation of duties, and disposition workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFeedback("New FAI Inspection template initiated.");
              setTimeout(() => setFeedback(null), 2500);
            }}
          >
            <Plus className="mr-1.5 size-4" />
            New FAI Sheet
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setFeedback("Raise Floor Defect dialog opened.");
              setTimeout(() => setFeedback(null), 2500);
            }}
          >
            <AlertOctagon className="mr-1.5 size-4" />
            Raise NCR
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 p-3 text-xs font-mono text-primary">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Quality Summary KPI Strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">First Pass Yield (FPY)</span>
              <p className="font-mono text-2xl font-bold text-foreground">98.4%</p>
            </div>
            <TrendingUp className="size-6 text-primary shrink-0" />
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Active Open NCRs</span>
              <p className="font-mono text-2xl font-bold text-yellow-400">{ncrs.filter((n) => n.status === "open").length}</p>
            </div>
            <AlertOctagon className="size-6 text-yellow-400 shrink-0" />
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Scrap Loss Valuation</span>
              <p className="font-mono text-2xl font-bold text-foreground">$140.00</p>
            </div>
            <ShieldCheck className="size-6 text-primary shrink-0" />
          </CardContent>
        </Card>
      </div>

      {/* NCR Defect Containment & FAI Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active NCRs Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <AlertOctagon className="size-5 text-red-400" />
                <CardTitle className="text-base">Non-Conformance Reports (NCR Log)</CardTitle>
              </div>
              <Badge variant="outline" className="font-mono text-[10px] border-red-500/40 text-red-400">
                1 ACTION REQUIRED
              </Badge>
            </div>
            <CardDescription>Defect containment, root cause analysis, and engineering disposition.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {ncrs.map((ncr) => (
              <div key={ncr.id} className="rounded-xl border border-red-500/40 bg-red-500/5 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-red-400">{ncr.ncrNumber}</span>
                    <Badge variant="default" className="font-mono text-[9px] uppercase">{ncr.severity}</Badge>
                    <span className="font-mono text-xs text-muted-foreground">&bull; {ncr.jobNumber}</span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">{ncr.station}</span>
                </div>

                <div className="space-y-1">
                  <p className="font-mono text-xs font-semibold text-foreground">{ncr.part}</p>
                  <p className="font-mono text-xs text-muted-foreground">{ncr.defect}</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-red-500/20 pt-3">
                  <div className="flex items-center gap-4 font-mono text-[10px] text-muted-foreground">
                    <span>Defect Qty: <strong className="text-foreground">{ncr.qty} pcs</strong></span>
                    <span>&bull;</span>
                    <span>Scrap Cost: <strong className="text-foreground">{ncr.cost}</strong></span>
                  </div>

                  {ncr.status === "open" ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleDisposition(ncr.id, "rework")}
                        className="font-mono text-xs"
                      >
                        Approve Rework
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisposition(ncr.id, "scrap_and_remake")}
                        className="font-mono text-xs text-red-400 hover:bg-red-500/10"
                      >
                        Scrap & Remake
                      </Button>
                    </div>
                  ) : (
                    <Badge variant="outline" className="font-mono text-[10px] text-primary border-primary/40">
                      DISPOSITIONED: {ncr.disposition.toUpperCase()}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* First Article Inspection (FAI) Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck className="size-5" />
              <CardTitle className="text-base">First Article Inspection</CardTitle>
            </div>
            <CardDescription>JOB-2026-104 &bull; Operation 10</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {checklist.map((item) => (
              <div key={item.id} className="rounded-lg border border-border bg-card p-2.5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-semibold text-foreground">{item.label}</span>
                  <span className="font-mono text-[9px] text-muted-foreground">
                    Spec: {item.target} &bull; Measured: {item.measured}
                  </span>
                </div>
                <CheckCircle2 className="size-4 text-primary shrink-0" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
