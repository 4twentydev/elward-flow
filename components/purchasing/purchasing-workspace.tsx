'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, CheckCircle2, AlertTriangle, Plus, ArrowRight, DollarSign, Clock, ShieldCheck } from "lucide-react";

export function PurchasingWorkspace() {
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const [shortages] = React.useState([
    {
      id: "sh_1",
      job: "JOB-2026-104",
      item: "RAW-SS-304-0250",
      description: "304 Stainless Steel Sheet 0.25in (48x120)",
      needed: "8 sheets",
      urgency: "urgent",
      preferredSupplier: "Ryerson Metal Solutions ($420.00 / 3 days)",
    },
  ]);

  const [purchaseOrders, setPurchaseOrders] = React.useState([
    {
      id: "po_1",
      poNumber: "PO-2026-042",
      vendor: "Ryerson Metal Solutions",
      item: "RAW-SS-304-0250 (8 sheets)",
      amount: "$3,510.00",
      status: "sent_to_vendor",
      expectedDate: "Aug 28, 2026",
    },
    {
      id: "po_2",
      poNumber: "PO-2026-043",
      vendor: "Alro Steel Distribution",
      item: "BAR-ALUM-6061-100 (20 bars)",
      amount: "$6,240.00",
      status: "pending_approval",
      expectedDate: "Sep 01, 2026",
    },
  ]);

  const handleApprovePO = (poNumber: string) => {
    setPurchaseOrders(
      purchaseOrders.map((p) =>
        p.poNumber === poNumber ? { ...p, status: "approved" } : p
      )
    );
    setFeedback(`Purchase Order ${poNumber} approved. Ready to transmit to vendor.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleReceivePO = (poNumber: string) => {
    setPurchaseOrders(
      purchaseOrders.map((p) =>
        p.poNumber === poNumber ? { ...p, status: "received_complete" } : p
      )
    );
    setFeedback(`PO ${poNumber} received at dock. Inventory ledger updated.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="default">OPERATIONS//PURCHASING</Badge>
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Requisitions, Supplier Options & PO Receiving Control
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Purchasing & Material Sourcing
          </h1>
          <p className="text-sm text-muted-foreground">
            Job-linked shortage signals, supplier comparisons, spend approval governance, and dock receiving.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setFeedback("New Purchase Order requisition created.");
              setTimeout(() => setFeedback(null), 2500);
            }}
          >
            <Plus className="mr-1.5 size-4" />
            New Purchase Order
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 p-3 text-xs font-mono text-primary">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Purchasing KPI Strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Committed Open Spend</span>
              <p className="font-mono text-2xl font-bold text-foreground">$9,750.00</p>
            </div>
            <DollarSign className="size-6 text-primary shrink-0" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Active Shortage Signals</span>
              <p className="font-mono text-2xl font-bold text-yellow-400">1 urgent</p>
            </div>
            <AlertTriangle className="size-6 text-yellow-400 shrink-0" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Supplier On-Time Rate</span>
              <p className="font-mono text-2xl font-bold text-foreground">98.7%</p>
            </div>
            <ShieldCheck className="size-6 text-primary shrink-0" />
          </CardContent>
        </Card>
      </div>

      {/* Material Shortage Signals Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-yellow-400">
            <AlertTriangle className="size-5" />
            <CardTitle className="text-base text-foreground">Job Material Shortages & Demand Signals</CardTitle>
          </div>
          <CardDescription>Live component deficits derived from released job packets.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y divide-border">
            {shortages.map((sh) => (
              <div key={sh.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-foreground">{sh.item}</span>
                    <Badge variant="outline" className="font-mono text-[9px] uppercase border-red-500/40 text-red-400 bg-red-500/10">
                      {sh.urgency}
                    </Badge>
                    <span className="font-mono text-xs text-muted-foreground">&bull; {sh.job}</span>
                  </div>
                  <p className="font-mono text-xs text-foreground font-semibold">{sh.description}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    Required Shortage: <span className="text-foreground font-bold">{sh.needed}</span> &bull; Preferred: {sh.preferredSupplier}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      setFeedback("PO generated for shortage signal.");
                      setTimeout(() => setFeedback(null), 2500);
                    }}
                    className="font-mono text-xs"
                  >
                    <ShoppingCart className="mr-1 size-3" /> Auto-Create PO
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders Matrix Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <ShoppingCart className="size-5" />
            <CardTitle className="text-base">Purchase Orders & Expected Receipts</CardTitle>
          </div>
          <CardDescription>Approved PO transmissions, approval workflows, and dock receiving.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y divide-border">
            {purchaseOrders.map((po) => (
              <div key={po.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-foreground">{po.poNumber}</span>
                    <Badge
                      variant={po.status === "received_complete" ? "default" : "outline"}
                      className={`font-mono text-[9px] uppercase ${
                        po.status === "pending_approval" ? "border-yellow-500/40 text-yellow-400 bg-yellow-500/10" : ""
                      }`}
                    >
                      {po.status.replace(/_/g, " ")}
                    </Badge>
                    <span className="font-mono text-xs text-muted-foreground">&bull; {po.vendor}</span>
                  </div>
                  <p className="font-mono text-xs text-foreground font-semibold">{po.item}</p>
                  <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
                    <span>Total: {po.amount}</span>
                    <span>&bull;</span>
                    <span>Expected: {po.expectedDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {po.status === "pending_approval" && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleApprovePO(po.poNumber)}
                      className="font-mono text-xs"
                    >
                      <ShieldCheck className="mr-1 size-3" /> Approve PO
                    </Button>
                  )}

                  {po.status === "sent_to_vendor" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReceivePO(po.poNumber)}
                      className="font-mono text-xs text-primary"
                    >
                      <CheckCircle2 className="mr-1 size-3" /> Dock Receipt
                    </Button>
                  )}

                  {po.status === "received_complete" && (
                    <div className="flex items-center gap-1.5 font-mono text-xs text-primary border border-primary/30 rounded-lg px-2.5 py-1 bg-primary/5">
                      <CheckCircle2 className="size-3.5" />
                      <span>FULFILLED</span>
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
