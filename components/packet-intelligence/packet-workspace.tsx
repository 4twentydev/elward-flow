'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, AlertTriangle, CheckCircle2, ShieldCheck, Cpu, UploadCloud } from "lucide-react";

export function PacketWorkspace() {
  const [activeTab, setActiveTab] = React.useState<"shopfloor" | "quality" | "purchasing">("shopfloor");
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const [document, setDocument] = React.useState({
    fileName: "DWG-2026-104-REV-B.pdf",
    jobNumber: "JOB-2026-104",
    status: "flagged_inconsistency",
    model: "synthetic-packet-parser-v2.1",
    extracted: [
      { key: "part_number", label: "Part Number", value: "DWG-2026-104", confidence: 98, approved: true },
      { key: "revision", label: "Drawing Revision", value: "REV B", confidence: 96, approved: false },
      { key: "material", label: "Material Spec", value: "304 Stainless Steel 0.25in Sheet", confidence: 94, approved: true },
      { key: "quantity", label: "PO Quantity", value: "150 pcs", confidence: 99, approved: true },
    ],
    inconsistency: {
      message: "Drawing revision detected as 'REV B' but customer purchase order specifies baseline 'REV A'.",
      severity: "critical_mismatch",
    },
  });

  const handleApprove = () => {
    setDocument({
      ...document,
      status: "approved",
      extracted: document.extracted.map((e) => ({ ...e, approved: true })),
      inconsistency: { message: "", severity: "warning" },
    });
    setFeedback("Human engineer approved extracted revision truth. Inconsistency cleared.");
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="default">OPERATIONS//INTELLIGENCE</Badge>
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Job Packet Ingestion & Untrusted AI Extraction
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Job Packet Intelligence
          </h1>
          <p className="text-sm text-muted-foreground">
            Document classification, revision consistency auditing, provenance tracking, and department packet bundling.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFeedback("Document upload dialog triggered.");
              setTimeout(() => setFeedback(null), 2500);
            }}
          >
            <UploadCloud className="mr-1.5 size-4" />
            Ingest PDF / CAD
          </Button>
          {document.status !== "approved" && (
            <Button variant="default" size="sm" onClick={handleApprove}>
              <ShieldCheck className="mr-1.5 size-4" />
              Approve Extraction
            </Button>
          )}
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 p-3 text-xs font-mono text-primary">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Discrepancy Inconsistency Alert Banner */}
      {document.status === "flagged_inconsistency" && (
        <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 shrink-0 text-red-400 mt-0.5" />
            <div className="flex flex-col space-y-1">
              <span className="font-mono text-xs font-bold uppercase text-red-400">
                Critical Revision Mismatch Detected
              </span>
              <p className="font-mono text-xs text-foreground">{document.inconsistency.message}</p>
              <p className="font-mono text-[10px] text-muted-foreground pt-1">
                AI extraction is advisory. Human engineering signoff is required before shopfloor dispatch.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Document Provenance & OCR Extractions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <Cpu className="size-5" />
                <CardTitle className="text-base">Document Provenance & Extracted Metadata</CardTitle>
              </div>
              <Badge variant="outline" className="font-mono text-[10px] uppercase">
                {document.status}
              </Badge>
            </div>
            <CardDescription className="font-mono text-xs text-muted-foreground">
              Source: {document.fileName} &bull; Model: {document.model}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {document.extracted.map((entity) => (
                <div
                  key={entity.key}
                  className={`rounded-lg border p-3 flex flex-col space-y-1 ${
                    entity.approved ? "border-border bg-card" : "border-red-500/40 bg-red-500/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {entity.label}
                    </span>
                    <span className="font-mono text-[10px] text-primary">{entity.confidence}% conf</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-foreground">{entity.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Packet Assembly */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <FileText className="size-5" />
              <CardTitle className="text-base">Department Packets</CardTitle>
            </div>
            <CardDescription>Bundled packets tailored to station requirements.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              {(["shopfloor", "quality", "purchasing"] as const).map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab)}
                  className="font-mono text-[10px] uppercase capitalize"
                >
                  {tab}
                </Button>
              ))}
            </div>

            <div className="space-y-2 font-mono text-xs">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Included Documents</span>
              <div className="rounded-lg border border-border bg-card p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span>{document.fileName}</span>
                  <Badge variant="outline" className="text-[9px]">PDF</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Digital Traveler Packet</span>
                  <Badge variant="outline" className="text-[9px]">TRV</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
