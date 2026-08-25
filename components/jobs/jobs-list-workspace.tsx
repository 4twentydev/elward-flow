'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, ArrowRight, Clock, Plus, Search, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";

interface JobItem {
  id: string;
  jobNumber: string;
  title: string;
  customerName: string;
  status: "intake_review" | "engineering_ready" | "released_to_shopfloor" | "in_progress" | "completed";
  priority: "standard" | "rush" | "critical";
  revision: string;
  dueDate: string;
  laborHours: number;
}

export function JobsListWorkspace() {
  const [jobs, setJobs] = React.useState<JobItem[]>([
    {
      id: "job_1",
      jobNumber: "JOB-2026-104",
      title: "Precision Laser Cut Mounting Flanges (150 pcs)",
      customerName: "Alpine Aerospace Systems",
      status: "released_to_shopfloor",
      priority: "rush",
      revision: "B",
      dueDate: "Tomorrow at 17:00",
      laborHours: 14.5,
    },
    {
      id: "job_2",
      jobNumber: "JOB-2026-105",
      title: "Architectural Aluminum Fascia Bracket Assemblies",
      customerName: "Summit Architectural Glass",
      status: "engineering_ready",
      priority: "standard",
      revision: "A",
      dueDate: "In 4 days",
      laborHours: 28.0,
    },
    {
      id: "job_3",
      jobNumber: "JOB-2026-106",
      title: "Custom Enclosure Base Plates - 0.25in 6061-T6",
      customerName: "Frontier Precision Works",
      status: "intake_review",
      priority: "critical",
      revision: "A",
      dueDate: "In 2 days",
      laborHours: 8.5,
    },
  ]);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleAdvanceStatus = (jobId: string) => {
    setJobs(
      jobs.map((j) => {
        if (j.id !== jobId) return j;
        if (j.status === "intake_review") return { ...j, status: "engineering_ready" };
        if (j.status === "engineering_ready") return { ...j, status: "released_to_shopfloor" };
        if (j.status === "released_to_shopfloor") return { ...j, status: "in_progress" };
        if (j.status === "in_progress") return { ...j, status: "completed" };
        return j;
      })
    );
    setFeedback(`Workflow state advanced successfully.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="default">CORE//WORKFLOW</Badge>
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Work Order Pipeline & Release Readiness
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Jobs & Workflow Operations
          </h1>
          <p className="text-sm text-muted-foreground">
            Canonical work order aggregate, engineering revisions, customer links, and guarded workflow progression.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setFeedback(`New Job Intake modal opened.`);
              setTimeout(() => setFeedback(null), 2500);
            }}
          >
            <Plus className="mr-1.5 size-4" />
            Create Work Order
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 p-3 text-xs font-mono text-primary">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span>Active Pipeline:</span>
          <span className="font-bold text-foreground">{jobs.length} Jobs</span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search job #, customer, title..."
            className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Jobs List */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <Briefcase className="size-5" />
            <CardTitle className="text-base">Work Orders</CardTitle>
          </div>
          <CardDescription>Active work orders tracked through release to shopfloor digital travelers.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y divide-border">
            {filteredJobs.map((job) => (
              <div key={job.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-bold text-foreground">{job.jobNumber}</span>
                    <Badge variant="outline" className="font-mono text-[10px]">Rev {job.revision}</Badge>
                    <Badge
                      variant={
                        job.priority === "critical"
                          ? "default"
                          : job.priority === "rush"
                          ? "secondary"
                          : "outline"
                      }
                      className="font-mono text-[9px] uppercase"
                    >
                      {job.priority}
                    </Badge>
                    <Badge variant="secondary" className="font-mono text-[9px] uppercase">
                      {job.status.replace(/_/g, " ")}
                    </Badge>
                  </div>

                  <p className="font-mono text-xs font-semibold text-foreground">{job.title}</p>
                  <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
                    <span>Customer: <strong className="text-foreground">{job.customerName}</strong></span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" /> Due {job.dueDate}
                    </span>
                    <span>&bull;</span>
                    <span>{job.laborHours} est. hours</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {job.status !== "completed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAdvanceStatus(job.id)}
                      className="font-mono text-xs"
                    >
                      Advance State <ArrowRight className="ml-1.5 size-3.5" />
                    </Button>
                  )}
                  <Button asChild variant="ghost" size="sm" className="font-mono text-xs text-primary">
                    <Link href={`/jobs/${job.id}`}>
                      Details <ChevronRight className="ml-1 size-3" />
                    </Link>
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
