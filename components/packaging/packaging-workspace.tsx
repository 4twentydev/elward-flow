'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Box, Layers, CheckCircle2, QrCode, Plus, Scale, ShieldCheck } from "lucide-react";

export function PackagingWorkspace() {
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const [packages, setPackages] = React.useState([
    {
      id: "pkg_1",
      packageNumber: "PKG-2026-081",
      containerType: "Box (18x14x10 in)",
      job: "JOB-2026-104",
      part: "Precision Laser Cut Flanges - 0.25in 304 SS",
      qty: 50,
      grossWeight: "45.0 lbs",
      capacity: "70.0 lbs",
      capacityPercent: 64,
      status: "sealed_ready_for_shipping",
      barcode: "PKG-2026-081",
    },
    {
      id: "pkg_2",
      packageNumber: "PALLET-2026-012",
      containerType: "Wood Pallet (48x40x48 in)",
      job: "JOB-2026-105",
      part: "Heavy-Duty Channel Brackets - A36 Steel",
      qty: 120,
      grossWeight: "840.0 lbs",
      capacity: "2200.0 lbs",
      capacityPercent: 38,
      status: "in_pack",
      barcode: "PALLET-2026-012",
    },
  ]);

  const handleSealPackage = (pkgNumber: string) => {
    setPackages(
      packages.map((p) =>
        p.packageNumber === pkgNumber ? { ...p, status: "sealed_ready_for_shipping" } : p
      )
    );
    setFeedback(`Container ${pkgNumber} sealed. Shipping label barcode generated.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="default">OPERATIONS//PACKAGING</Badge>
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Container Specifications, Palletization & Weight Control
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Packaging & Palletization
          </h1>
          <p className="text-sm text-muted-foreground">
            Box/crate/pallet packing, weight verification, overpack guardrails, and shipping readiness handoffs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFeedback("Package label QR scan initiated.");
              setTimeout(() => setFeedback(null), 2500);
            }}
          >
            <QrCode className="mr-1.5 size-3.5" />
            Scan Label
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setFeedback("New Box / Pallet container created.");
              setTimeout(() => setFeedback(null), 2500);
            }}
          >
            <Plus className="mr-1.5 size-4" />
            New Pallet / Box
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 p-3 text-xs font-mono text-primary">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Packaging KPI Strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Ready For Shipping</span>
              <p className="font-mono text-2xl font-bold text-foreground">
                {packages.filter((p) => p.status === "sealed_ready_for_shipping").length} units
              </p>
            </div>
            <ShieldCheck className="size-6 text-primary shrink-0" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Active Packing Containers</span>
              <p className="font-mono text-2xl font-bold text-yellow-400">
                {packages.filter((p) => p.status === "in_pack").length} active
              </p>
            </div>
            <Box className="size-6 text-yellow-400 shrink-0" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Total Packed Weight</span>
              <p className="font-mono text-2xl font-bold text-foreground">885.0 lbs</p>
            </div>
            <Scale className="size-6 text-primary shrink-0" />
          </CardContent>
        </Card>
      </div>

      {/* Active Containers List Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <Layers className="size-5" />
            <CardTitle className="text-base">Packaging Units & Pallet Manifests</CardTitle>
          </div>
          <CardDescription>Real-time gross weight, capacity utilization, and sealed status.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y divide-border">
            {packages.map((pkg) => (
              <div key={pkg.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-foreground">{pkg.packageNumber}</span>
                    <Badge
                      variant={pkg.status === "sealed_ready_for_shipping" ? "default" : "outline"}
                      className={`font-mono text-[9px] uppercase ${
                        pkg.status === "in_pack" ? "border-yellow-500/40 text-yellow-400" : ""
                      }`}
                    >
                      {pkg.status === "sealed_ready_for_shipping" ? "SEALED / READY" : "IN PACKING"}
                    </Badge>
                    <span className="font-mono text-xs text-muted-foreground">&bull; {pkg.containerType}</span>
                  </div>
                  <p className="font-mono text-xs text-foreground font-semibold">{pkg.part}</p>
                  <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
                    <span>Job: {pkg.job}</span>
                    <span>&bull;</span>
                    <span>Quantity: {pkg.qty} pcs</span>
                    <span>&bull;</span>
                    <span>Gross: {pkg.grossWeight} / {pkg.capacity} ({pkg.capacityPercent}% cap)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {pkg.status === "in_pack" ? (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleSealPackage(pkg.packageNumber)}
                      className="font-mono text-xs"
                    >
                      <ShieldCheck className="mr-1 size-3" /> Seal & Sign Off
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1.5 font-mono text-xs text-primary border border-primary/30 rounded-lg px-2.5 py-1 bg-primary/5">
                      <QrCode className="size-3.5" />
                      <span>{pkg.barcode}</span>
                    </div>
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
