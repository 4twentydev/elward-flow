'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, CheckCircle2, QrCode, Plus, FileText, Send, MapPin, ShieldCheck } from "lucide-react";

export function ShippingWorkspace() {
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const [manifests, setManifests] = React.useState([
    {
      id: "shp_1",
      manifestNumber: "BOL-2026-092",
      carrier: "Old Dominion Freight Line",
      proNumber: "ODFL-88219044",
      driver: "Marcus Vance",
      destination: "Alpine Aerospace Systems (Longmont, CO)",
      packages: ["PKG-2026-081"],
      grossWeight: "45.0 lbs",
      status: "staged_for_loading",
    },
    {
      id: "shp_2",
      manifestNumber: "BOL-2026-093",
      carrier: "Dedicated Flatbed Logistics",
      proNumber: "DFL-99014",
      driver: "Sarah Jenkins",
      destination: "Summit Glass & Facades (Denver, CO)",
      packages: ["PALLET-2026-012"],
      grossWeight: "840.0 lbs",
      status: "dispatched_in_transit",
    },
  ]);

  const handleDispatch = (manifestNumber: string) => {
    setManifests(
      manifests.map((m) =>
        m.manifestNumber === manifestNumber ? { ...m, status: "dispatched_in_transit" } : m
      )
    );
    setFeedback(`Manifest ${manifestNumber} DISPATCHED. Bill of Lading stamped and sent to driver.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleConfirmDelivery = (manifestNumber: string) => {
    setManifests(
      manifests.map((m) =>
        m.manifestNumber === manifestNumber ? { ...m, status: "delivered" } : m
      )
    );
    setFeedback(`Proof of Delivery (POD) confirmed for ${manifestNumber}. Delivery signed.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="default">OPERATIONS//SHIPPING</Badge>
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Manifest Builder, Bill of Lading & Logistics Control
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Shipping & Freight Logistics
          </h1>
          <p className="text-sm text-muted-foreground">
            Multi-stop delivery sequences, carrier PRO assignments, digital BOLs, and proof of delivery tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFeedback("BOL barcode scanner opened.");
              setTimeout(() => setFeedback(null), 2500);
            }}
          >
            <QrCode className="mr-1.5 size-3.5" />
            Scan BOL
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setFeedback("New Shipping Manifest created.");
              setTimeout(() => setFeedback(null), 2500);
            }}
          >
            <Plus className="mr-1.5 size-4" />
            New BOL Manifest
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 p-3 text-xs font-mono text-primary">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Logistics KPI Strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Active Loads In Transit</span>
              <p className="font-mono text-2xl font-bold text-foreground">
                {manifests.filter((m) => m.status === "dispatched_in_transit").length} shipments
              </p>
            </div>
            <Truck className="size-6 text-primary shrink-0" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Weight In Transit</span>
              <p className="font-mono text-2xl font-bold text-foreground">840.0 lbs</p>
            </div>
            <Send className="size-6 text-primary shrink-0" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">On-Time Delivery Rate</span>
              <p className="font-mono text-2xl font-bold text-foreground">99.4%</p>
            </div>
            <ShieldCheck className="size-6 text-primary shrink-0" />
          </CardContent>
        </Card>
      </div>

      {/* Shipping Manifests List Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <FileText className="size-5" />
            <CardTitle className="text-base">Bills of Lading (BOL Manifests)</CardTitle>
          </div>
          <CardDescription>Carrier assignment, delivery stops, gross weight, and proof of delivery status.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y divide-border">
            {manifests.map((manifest) => (
              <div key={manifest.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-foreground">{manifest.manifestNumber}</span>
                    <Badge
                      variant={manifest.status === "dispatched_in_transit" ? "default" : "outline"}
                      className="font-mono text-[9px] uppercase"
                    >
                      {manifest.status.replace("_", " ")}
                    </Badge>
                    <span className="font-mono text-xs text-muted-foreground">&bull; {manifest.carrier}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs text-foreground font-semibold">
                    <MapPin className="size-3.5 text-primary shrink-0" />
                    <span>{manifest.destination}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
                    <span>PRO #: {manifest.proNumber}</span>
                    <span>&bull;</span>
                    <span>Driver: {manifest.driver}</span>
                    <span>&bull;</span>
                    <span>Gross: {manifest.grossWeight}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {manifest.status === "staged_for_loading" && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleDispatch(manifest.manifestNumber)}
                      className="font-mono text-xs"
                    >
                      <Send className="mr-1 size-3" /> Dispatch Truck
                    </Button>
                  )}

                  {manifest.status === "dispatched_in_transit" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConfirmDelivery(manifest.manifestNumber)}
                      className="font-mono text-xs"
                    >
                      <CheckCircle2 className="mr-1 size-3 text-primary" /> Confirm POD
                    </Button>
                  )}

                  {manifest.status === "delivered" && (
                    <div className="flex items-center gap-1.5 font-mono text-xs text-primary border border-primary/30 rounded-lg px-2.5 py-1 bg-primary/5">
                      <CheckCircle2 className="size-3.5" />
                      <span>DELIVERY SIGNED</span>
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
