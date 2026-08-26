'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, CheckCircle2, ShieldAlert, Sparkles, Plus, FileText, CheckCircle, HelpCircle } from "lucide-react";

export function KnowHowWorkspace() {
  const [searchQuery, setSearchQuery] = React.useState("laser lens cleaning");
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const [articles] = React.useState([
    {
      id: "know_1",
      code: "KNOW-2026-001",
      title: "Fiber Laser Cutter Daily Startup & Lens Cleaning",
      category: "SOP",
      equipment: "EQ-LASER-01",
      revision: "Rev 1",
      status: "published",
      stepsCount: 3,
    },
    {
      id: "know_2",
      code: "KNOW-2026-002",
      title: "Press Brake Tonnage Limits & Tooling Clamping Sequence",
      category: "Safety",
      equipment: "EQ-BRAKE-02",
      revision: "Rev 2",
      status: "published",
      stepsCount: 4,
    },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="default">OPERATIONS//KNOWHOW</Badge>
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Controlled Procedures, Equipment SOPs & Cited Search
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            KnowHow & Standard Procedures
          </h1>
          <p className="text-sm text-muted-foreground">
            Version-controlled operating procedures, equipment manuals, and citation-backed shopfloor guidance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setFeedback("New Knowledge Procedure Editor initialized.");
              setTimeout(() => setFeedback(null), 2500);
            }}
          >
            <Plus className="mr-1.5 size-4" />
            New Procedure
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 p-3 text-xs font-mono text-primary">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* KnowHow KPI Strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Published SOP Library</span>
              <p className="font-mono text-2xl font-bold text-foreground">24 Procedures</p>
            </div>
            <BookOpen className="size-6 text-primary shrink-0" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Citation Accuracy</span>
              <p className="font-mono text-2xl font-bold text-foreground">99.4%</p>
            </div>
            <CheckCircle className="size-6 text-primary shrink-0" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Verified Queries Answered</span>
              <p className="font-mono text-2xl font-bold text-foreground">142</p>
            </div>
            <HelpCircle className="size-6 text-primary shrink-0" />
          </CardContent>
        </Card>
      </div>

      {/* Verified AI Search & Cited Answer Card */}
      <Card className="border-primary/30 bg-primary/[0.02]">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="size-5" />
            <CardTitle className="text-base">Cited Procedure Search & Guidance Engine</CardTitle>
          </div>
          <CardDescription>Direct answers synthesized with verifiable source passage citations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="relative">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask an operational question or search SOPs..."
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-4 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="rounded-lg border border-primary/20 bg-background p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="font-mono text-[9px] uppercase">VERIFIED CITATION</Badge>
                <span className="font-mono text-xs font-bold text-foreground">KNOW-2026-001 (Rev 1)</span>
              </div>
              <span className="font-mono text-[10px] text-primary font-bold">Confidence: 96.5%</span>
            </div>

            <p className="font-mono text-xs text-foreground leading-relaxed">
              &ldquo;Step 2: Inspect protective cover glass for spatter or micro-cracks using 10x illuminated loupe. Wipe in circular motions from center outward with reagent-grade isopropyl alcohol.&rdquo;
            </p>

            <div className="flex items-center gap-2 rounded border border-yellow-500/30 bg-yellow-500/5 p-2 text-[10px] font-mono text-yellow-400">
              <ShieldAlert className="size-3.5 shrink-0" />
              <span>Safety Note: De-energize 480V breaker and verify LOTO state prior to optic removal.</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Procedures Library Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <FileText className="size-5" />
            <CardTitle className="text-base">Standard Operating Procedures & Knowledge Assets</CardTitle>
          </div>
          <CardDescription>Controlled shopfloor guidelines and training documents.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y divide-border">
            {articles.map((art) => (
              <div key={art.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-foreground">{art.code}</span>
                    <Badge variant="default" className="font-mono text-[9px] uppercase">
                      {art.status}
                    </Badge>
                    <span className="font-mono text-xs text-muted-foreground">&bull; {art.revision}</span>
                    <span className="font-mono text-xs text-muted-foreground">&bull; {art.category}</span>
                  </div>
                  <p className="font-mono text-xs text-foreground font-semibold">{art.title}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    Equipment: {art.equipment} &bull; {art.stepsCount} Structured Steps
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFeedback(`Viewing ${art.code} procedure manual.`);
                      setTimeout(() => setFeedback(null), 2500);
                    }}
                    className="font-mono text-xs text-primary"
                  >
                    <BookOpen className="mr-1 size-3" /> View SOP
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
