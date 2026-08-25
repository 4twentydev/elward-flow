'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wrench, AlertTriangle, CheckCircle2, QrCode, Clock, ShieldCheck, Activity } from "lucide-react";

export function MaintenanceWorkspace() {
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const [equipmentList, setEquipmentList] = React.useState([
    {
      id: "eq_1",
      tag: "EQ-LASER-01",
      name: "Mitsubishi 4kW Fiber Laser System",
      workCenter: "WC-LASER-01",
      criticality: "Critical (Single Point)",
      status: "operational",
      runHours: "3,420 hrs",
      nextPm: "Sep 15, 2026",
      isOverdue: false,
    },
    {
      id: "eq_2",
      tag: "EQ-BRAKE-01",
      name: "Amada 150-Ton CNC Press Brake",
      workCenter: "WC-BRAKE-01",
      criticality: "High",
      status: "operational",
      runHours: "2,180 hrs",
      nextPm: "Oct 01, 2026",
      isOverdue: false,
    },
    {
      id: "eq_3",
      tag: "EQ-COMPR-01",
      name: "Ingersoll Rand 50HP Screw Compressor",
      workCenter: "WC-FACILITY",
      criticality: "Critical",
      status: "operational",
      runHours: "8,940 hrs",
      nextPm: "Aug 20, 2026",
      isOverdue: true,
    },
  ]);

  const handleReportDown = (tag: string) => {
    setEquipmentList(
      equipmentList.map((e) =>
        e.tag === tag ? { ...e, status: "down_unplanned" } : e
      )
    );
    setFeedback(`Equipment ${tag} marked UNPLANNED DOWN. Emergency work order dispatched.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleReturnToService = (tag: string) => {
    setEquipmentList(
      equipmentList.map((e) =>
        e.tag === tag ? { ...e, status: "operational", isOverdue: false } : e
      )
    );
    setFeedback(`Equipment ${tag} authorized for Return-To-Service. Status restored to OPERATIONAL.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="default">OPERATIONS//MAINTENANCE</Badge>
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Equipment Health, PM Schedules & Downtime Control
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Maintenance & Equipment Downtime
          </h1>
          <p className="text-sm text-muted-foreground">
            Asset registers, QR lookups, preventive maintenance schedules, and return-to-service authorizations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFeedback("Asset QR scanner initiated.");
              setTimeout(() => setFeedback(null), 2500);
            }}
          >
            <QrCode className="mr-1.5 size-3.5" />
            Scan Asset QR
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setFeedback("New Preventive Maintenance work order template initiated.");
              setTimeout(() => setFeedback(null), 2500);
            }}
          >
            <Wrench className="mr-1.5 size-4" />
            New PM Ticket
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 p-3 text-xs font-mono text-primary">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Fleet KPI Metric Strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Fleet Operational Uptime</span>
              <p className="font-mono text-2xl font-bold text-foreground">98.9%</p>
            </div>
            <Activity className="size-6 text-primary shrink-0" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Overdue PM Schedules</span>
              <p className="font-mono text-2xl font-bold text-yellow-400">
                {equipmentList.filter((e) => e.isOverdue).length}
              </p>
            </div>
            <AlertTriangle className="size-6 text-yellow-400 shrink-0" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Mean Time To Repair (MTTR)</span>
              <p className="font-mono text-2xl font-bold text-foreground">42 mins</p>
            </div>
            <Clock className="size-6 text-primary shrink-0" />
          </CardContent>
        </Card>
      </div>

      {/* Equipment Asset Matrix */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <Wrench className="size-5" />
            <CardTitle className="text-base">Equipment Asset Fleet & Status</CardTitle>
          </div>
          <CardDescription>Real-time machine availability, run hours, and preventive maintenance triggers.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y divide-border">
            {equipmentList.map((eq) => (
              <div key={eq.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-foreground">{eq.tag}</span>
                    <Badge
                      variant={eq.status === "operational" ? "default" : "outline"}
                      className={`font-mono text-[9px] uppercase ${
                        eq.status !== "operational" ? "border-red-500/40 text-red-400 bg-red-500/10" : ""
                      }`}
                    >
                      {eq.status}
                    </Badge>
                    {eq.isOverdue && (
                      <Badge variant="outline" className="font-mono text-[9px] border-yellow-500/40 text-yellow-400">
                        PM OVERDUE
                      </Badge>
                    )}
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">{eq.name}</p>
                  <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
                    <span>Work Center: {eq.workCenter}</span>
                    <span>&bull;</span>
                    <span>Run Time: {eq.runHours}</span>
                    <span>&bull;</span>
                    <span>Next PM: {eq.nextPm}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {eq.status === "operational" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReportDown(eq.tag)}
                      className="font-mono text-xs text-red-400 hover:bg-red-500/10"
                    >
                      <AlertTriangle className="mr-1 size-3" /> Report Down
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleReturnToService(eq.tag)}
                      className="font-mono text-xs"
                    >
                      <ShieldCheck className="mr-1 size-3" /> Authorize Service
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
