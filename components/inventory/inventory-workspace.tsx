'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, QrCode, ArrowDownToLine, ArrowUpFromLine, AlertTriangle, Plus, Search, CheckCircle2 } from "lucide-react";

interface StockItem {
  id: string;
  code: string;
  description: string;
  category: string;
  uom: string;
  onHand: number;
  available: number;
  reorderPoint: number;
  isLowStock: boolean;
  cost: string;
}

export function InventoryWorkspace() {
  const [stock, setStock] = React.useState<StockItem[]>([
    {
      id: "i1",
      code: "ALUM-6061-0.25-48X96",
      description: "6061-T6 Aluminum Sheet 0.250in x 48in x 96in",
      category: "Raw Material",
      uom: "SHEET",
      onHand: 18,
      available: 14,
      reorderPoint: 5,
      isLowStock: false,
      cost: "$185.00",
    },
    {
      id: "i2",
      code: "SS-304-14GA-48X120",
      description: "304 Stainless Steel Sheet 14GA 2B Finish",
      category: "Raw Material",
      uom: "SHEET",
      onHand: 4,
      available: 2,
      reorderPoint: 8,
      isLowStock: true,
      cost: "$215.00",
    },
    {
      id: "i3",
      code: "FAST-M6-FLANGE-SS",
      description: "M6-1.00 x 20mm Serrated Flange Bolt 316 SS",
      category: "Hardware",
      uom: "EA",
      onHand: 1250,
      available: 850,
      reorderPoint: 200,
      isLowStock: false,
      cost: "$0.45",
    },
  ]);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleReceiveStock = (itemCode: string) => {
    setStock(
      stock.map((s) =>
        s.code === itemCode ? { ...s, onHand: s.onHand + 10, available: s.available + 10, isLowStock: false } : s
      )
    );
    setFeedback(`Received +10 units of ${itemCode} into primary location. Ledger transaction recorded.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const filteredStock = stock.filter(
    (s) =>
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="default">OPERATIONS//INVENTORY</Badge>
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Immutable Transaction Ledger & Stock Control
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Inventory & Materials Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Barcode/QR-first receiving, job issue, scrap tracking, negative stock policy, and lot traceability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFeedback("Barcode scanner camera opened.");
              setTimeout(() => setFeedback(null), 2500);
            }}
          >
            <QrCode className="mr-1.5 size-3.5" />
            Scan QR
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setFeedback("Receive Material dialog opened.");
              setTimeout(() => setFeedback(null), 2500);
            }}
          >
            <Plus className="mr-1.5 size-4" />
            Receive PO
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 p-3 text-xs font-mono text-primary">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Search and Summary Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
          <span>Catalog Items: <strong className="text-foreground">{stock.length}</strong></span>
          <span>&bull;</span>
          <span className="text-yellow-400">Low Stock Reorders: <strong>{stock.filter((s) => s.isLowStock).length}</strong></span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SKU code or description..."
            className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Stock Levels Ledger Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <Package className="size-5" />
            <CardTitle className="text-base">Stock Balances (Transaction Ledger Derived)</CardTitle>
          </div>
          <CardDescription>All balances computed directly from verified debit/credit transaction history.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y divide-border">
            {filteredStock.map((item) => (
              <div key={item.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-foreground">{item.code}</span>
                    <Badge variant="outline" className="font-mono text-[9px] uppercase">{item.category}</Badge>
                    {item.isLowStock && (
                      <Badge variant="outline" className="font-mono text-[9px] border-yellow-500/40 text-yellow-400">
                        <AlertTriangle className="mr-1 size-2.5" /> REORDER REQUIRED
                      </Badge>
                    )}
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">{item.description}</p>
                  <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
                    <span>Std Cost: {item.cost} / {item.uom}</span>
                    <span>&bull;</span>
                    <span>Reorder Point: {item.reorderPoint} {item.uom}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end sm:self-center">
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-sm font-bold text-foreground">{item.onHand} {item.uom}</span>
                    <span className="font-mono text-[10px] text-primary">{item.available} available</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleReceiveStock(item.code)}
                      className="font-mono text-xs"
                    >
                      <ArrowDownToLine className="mr-1 size-3" /> Receive
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFeedback(`Issue material modal opened for ${item.code}.`);
                        setTimeout(() => setFeedback(null), 2500);
                      }}
                      className="font-mono text-xs"
                    >
                      <ArrowUpFromLine className="mr-1 size-3" /> Issue
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
