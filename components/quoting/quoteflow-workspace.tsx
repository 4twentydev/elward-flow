'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calculator, CheckCircle2, DollarSign, Plus, ArrowRight, TrendingUp, AlertTriangle } from "lucide-react";

export function QuoteFlowWorkspace() {
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const [quotes, setQuotes] = React.useState([
    {
      id: "qte_1",
      quoteNumber: "QTE-2026-104",
      customer: "Alpine Aerospace Systems",
      title: "Precision Laser Cut Flanges Batch #4",
      amount: "$7,692.50",
      margin: "35.0%",
      status: "approved",
      revision: "Rev 1",
      expires: "In 28 days",
    },
    {
      id: "qte_2",
      quoteNumber: "QTE-2026-105",
      customer: "Summit Glass & Facades",
      title: "Custom Steel Column Cladding Profiles",
      amount: "$14,850.00",
      margin: "21.5%",
      status: "internal_review",
      revision: "Rev 2",
      expires: "In 30 days",
    },
  ]);

  const handleConvertJob = (quoteNumber: string) => {
    setQuotes(
      quotes.map((q) =>
        q.quoteNumber === quoteNumber ? { ...q, status: "converted_to_job" } : q
      )
    );
    setFeedback(`Quote ${quoteNumber} accepted. New live production Job created in workflow.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="default">OPERATIONS//QUOTEFLOW</Badge>
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Cost Breakdown Estimator, Margin Governance & Job Handoff
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            QuoteFlow & Estimating
          </h1>
          <p className="text-sm text-muted-foreground">
            Material/labor/outsourcing costing, margin threshold approvals, revisions, and one-click job conversion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setFeedback("New Quote Estimator initialized.");
              setTimeout(() => setFeedback(null), 2500);
            }}
          >
            <Plus className="mr-1.5 size-4" />
            New Quote
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 p-3 text-xs font-mono text-primary">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* QuoteFlow KPI Strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Active Pipeline Value</span>
              <p className="font-mono text-2xl font-bold text-foreground">$22,542.50</p>
            </div>
            <DollarSign className="size-6 text-primary shrink-0" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Average Target Margin</span>
              <p className="font-mono text-2xl font-bold text-foreground">28.3%</p>
            </div>
            <TrendingUp className="size-6 text-primary shrink-0" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Quote Win Rate</span>
              <p className="font-mono text-2xl font-bold text-foreground">72.4%</p>
            </div>
            <Calculator className="size-6 text-primary shrink-0" />
          </CardContent>
        </Card>
      </div>

      {/* Quote Matrix List Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <Calculator className="size-5" />
            <CardTitle className="text-base">Estimates & Quote Revisions</CardTitle>
          </div>
          <CardDescription>Multi-item costing, margin policies, and approval statuses.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y divide-border">
            {quotes.map((quote) => (
              <div key={quote.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-foreground">{quote.quoteNumber}</span>
                    <Badge
                      variant={quote.status === "approved" || quote.status === "converted_to_job" ? "default" : "outline"}
                      className={`font-mono text-[9px] uppercase ${
                        quote.status === "internal_review" ? "border-yellow-500/40 text-yellow-400 bg-yellow-500/10" : ""
                      }`}
                    >
                      {quote.status.replace(/_/g, " ")}
                    </Badge>
                    <span className="font-mono text-xs text-muted-foreground">&bull; {quote.revision}</span>
                  </div>
                  <p className="font-mono text-xs text-foreground font-semibold">{quote.title}</p>
                  <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
                    <span>Customer: {quote.customer}</span>
                    <span>&bull;</span>
                    <span>Total: {quote.amount}</span>
                    <span>&bull;</span>
                    <span className={parseFloat(quote.margin) < 25 ? "text-yellow-400 font-bold" : "text-primary font-bold"}>
                      Margin: {quote.margin}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {quote.status === "internal_review" && (
                    <div className="flex items-center gap-1 text-[11px] font-mono text-yellow-400 border border-yellow-500/30 rounded px-2 py-1 bg-yellow-500/5">
                      <AlertTriangle className="size-3.5" />
                      <span>Low Margin (&lt;25%)</span>
                    </div>
                  )}

                  {quote.status === "approved" && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleConvertJob(quote.quoteNumber)}
                      className="font-mono text-xs"
                    >
                      <ArrowRight className="mr-1 size-3" /> Convert to Job
                    </Button>
                  )}

                  {quote.status === "converted_to_job" && (
                    <div className="flex items-center gap-1.5 font-mono text-xs text-primary border border-primary/30 rounded-lg px-2.5 py-1 bg-primary/5">
                      <CheckCircle2 className="size-3.5" />
                      <span>JOB ACTIVE</span>
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
