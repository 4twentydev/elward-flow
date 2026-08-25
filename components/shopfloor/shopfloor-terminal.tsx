'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  QrCode,
  Play,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from "lucide-react";

interface Step {
  id: string;
  seq: number;
  wc: string;
  title: string;
  status: "pending" | "running" | "completed" | "blocked";
  qty: string;
}

export function ShopfloorTerminal() {
  const [activeTab, setActiveTab] = React.useState<"today" | "dispatch" | "scan">("today");
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const [activeTraveler] = React.useState({
    travelerNumber: "TRV-2026-104",
    jobNumber: "JOB-2026-104",
    part: "Precision Laser Cut Flanges - 0.25in 304 SS",
    customer: "Alpine Aerospace Systems",
    totalQty: 150,
    priority: "rush",
    currentStep: "WC-LASER-01 // Laser Cutting",
  });

  const [steps, setSteps] = React.useState<Step[]>([
    { id: "s1", seq: 10, wc: "WC-LASER-01", title: "CNC Fiber Laser Contour Profile Cut", status: "running", qty: "150 / 150 pcs" },
    { id: "s2", seq: 20, wc: "WC-BRAKE-01", title: "Form 90° Return Flanges on 150T Brake", status: "pending", qty: "0 / 150 pcs" },
    { id: "s3", seq: 30, wc: "WC-QC-01", title: "First Article & CMM Tolerance Verification", status: "pending", qty: "0 / 150 pcs" },
    { id: "s4", seq: 40, wc: "WC-PACK-01", title: "Degrease, Barcode Label & Box Packaging", status: "pending", qty: "0 / 150 pcs" },
  ]);

  const handleStartStep = (stepId: string) => {
    setSteps(steps.map((s) => (s.id === stepId ? { ...s, status: "running" } : s)));
    setFeedback("Station running. Production timer active.");
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleCompleteStep = (stepId: string) => {
    setSteps(
      steps.map((s) => {
        if (s.id === stepId) return { ...s, status: "completed" };
        return s;
      })
    );
    setFeedback("Step completed. Routed to next work center.");
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleReportBlocker = (stepId: string) => {
    setSteps(steps.map((s) => (s.id === stepId ? { ...s, status: "blocked" } : s)));
    setFeedback("Blocker logged. Dispatch signal sent to production manager.");
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="default">OPERATIONS//SHOPFLOOR</Badge>
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Mobile Operator Terminal & Digital Traveler
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Shopfloor Execution & Routing
          </h1>
          <p className="text-sm text-muted-foreground">
            Digital traveler dispatch, station execution timers, blocker signals, and QR routing control.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === "today" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("today")}
            className="font-mono text-xs uppercase"
          >
            My Station
          </Button>
          <Button
            variant={activeTab === "dispatch" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("dispatch")}
            className="font-mono text-xs uppercase"
          >
            Dispatch Board
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 p-3 text-xs font-mono text-primary">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Operator Terminal Card */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Traveler Header Card */}
        <Card className="lg:col-span-1 border-primary/40">
          <CardHeader className="bg-primary/5 pb-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-primary">{activeTraveler.travelerNumber}</span>
              <Badge variant="default" className="font-mono text-[9px] uppercase">{activeTraveler.priority}</Badge>
            </div>
            <CardTitle className="text-base mt-1">{activeTraveler.part}</CardTitle>
            <CardDescription className="font-mono text-xs text-muted-foreground">
              Customer: {activeTraveler.customer} &bull; Qty: {activeTraveler.totalQty} pcs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="rounded-lg border border-border bg-card p-3 space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Current Active Step</span>
              <p className="font-mono text-xs font-semibold text-foreground">{activeTraveler.currentStep}</p>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="font-mono text-xs text-muted-foreground">QR Traveler Tag</span>
              <div className="flex items-center gap-1.5 font-mono text-xs text-primary">
                <QrCode className="size-4" />
                <span>SCAN-VERIFIED</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sequenced Routing Steps Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <Layers className="size-5" />
              <CardTitle className="text-base">Sequenced Routing Operations</CardTitle>
            </div>
            <CardDescription>Follow strict station sequence from raw material laser cutting to shipping prep.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`rounded-xl border p-4 transition ${
                    step.status === "running"
                      ? "border-primary bg-primary/5"
                      : step.status === "blocked"
                      ? "border-red-500/50 bg-red-500/5"
                      : step.status === "completed"
                      ? "border-border bg-card/40 opacity-70"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-xs font-bold text-muted-foreground">Seq {step.seq}</span>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-foreground">{step.title}</span>
                          <Badge
                            variant={
                              step.status === "running"
                                ? "default"
                                : step.status === "blocked"
                                ? "outline"
                                : step.status === "completed"
                                ? "secondary"
                                : "outline"
                            }
                            className={`font-mono text-[9px] uppercase ${
                              step.status === "blocked" ? "border-red-500/40 text-red-400" : ""
                            }`}
                          >
                            {step.status}
                          </Badge>
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          Work Center: {step.wc} &bull; Quantity: {step.qty}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {step.status === "pending" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleStartStep(step.id)}
                          className="font-mono text-xs"
                        >
                          <Play className="mr-1 size-3" /> Start Step
                        </Button>
                      )}

                      {step.status === "running" && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleCompleteStep(step.id)}
                            className="font-mono text-xs"
                          >
                            <CheckCircle2 className="mr-1 size-3" /> Complete
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReportBlocker(step.id)}
                            className="font-mono text-xs text-red-400 hover:bg-red-500/10"
                          >
                            <AlertTriangle className="size-3" />
                          </Button>
                        </>
                      )}

                      {step.status === "blocked" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartStep(step.id)}
                          className="font-mono text-xs"
                        >
                          Clear & Resume
                        </Button>
                      )}

                      {step.status === "completed" && (
                        <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
                          <CheckCircle2 className="size-3.5 text-primary" /> Done
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
