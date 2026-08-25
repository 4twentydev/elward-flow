'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileUp, FileText, Download, ShieldAlert, CheckCircle2 } from "lucide-react";

interface FileItem {
  id: string;
  filename: string;
  mimeType: string;
  size: string;
  status: "clean" | "quarantined";
  uploadedBy: string;
  createdAt: string;
}

export function FileManager() {
  const [files, setFiles] = React.useState<FileItem[]>([
    {
      id: "fil_1",
      filename: "front-range-laser-cutting-cad.dxf",
      mimeType: "application/dxf",
      size: "4.2 MB",
      status: "clean",
      uploadedBy: "Brandon York",
      createdAt: "Today at 14:30",
    },
    {
      id: "fil_2",
      filename: "work-center-capacity-study.csv",
      mimeType: "text/csv",
      size: "340 KB",
      status: "clean",
      uploadedBy: "Alex Mercer",
      createdAt: "Today at 11:15",
    },
  ]);

  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleSimulateDownload = (file: FileItem) => {
    if (file.status === "quarantined") {
      setFeedback("Download blocked: File is in quarantine state.");
      setTimeout(() => setFeedback(null), 3000);
      return;
    }
    setFeedback(`Generated authorized expiring URL (15m TTL) for ${file.filename}.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newFile: FileItem = {
      id: `fil_${Date.now()}`,
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      status: "clean",
      uploadedBy: "Current User",
      createdAt: "Just now",
    };

    setFiles([newFile, ...files]);
    setFeedback(`File ${file.name} uploaded to private tenant storage and verified.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="default">CORE//FILES</Badge>
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Private Storage & Expiring Presigned URLs
          </span>
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          File Storage & Attachments
        </h1>
        <p className="text-sm text-muted-foreground">
          Tenant-isolated storage port with expiring signed download URLs, MIME verification, and quarantine policies.
        </p>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 p-3 text-xs font-mono text-primary">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <FileUp className="size-5" />
              <CardTitle className="text-base">Upload Document</CardTitle>
            </div>
            <CardDescription>Private tenant-isolated document upload.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-primary/50 transition">
              <FileUp className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-2 font-mono text-xs text-foreground">Click to upload file</p>
              <p className="font-mono text-[10px] text-muted-foreground">PDF, PNG, JPG, CSV, DXF, STEP (Max 25MB)</p>
              <input
                type="file"
                onChange={handleSimulateUpload}
                className="mt-3 block w-full text-xs text-muted-foreground file:mr-2 file:rounded-md file:border file:border-border file:bg-secondary file:px-2.5 file:py-1 file:font-mono file:text-xs file:text-foreground"
              />
            </div>

            <div className="rounded-lg border border-border bg-background/50 p-3 text-xs text-muted-foreground space-y-1">
              <span className="font-mono text-[10px] uppercase font-semibold text-foreground">Storage Security Policy:</span>
              <p>Files are private by default. Access is granted exclusively through authorized signed URLs with 15-minute expiration.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <FileText className="size-5" />
                <CardTitle className="text-base">Stored Files ({files.length})</CardTitle>
              </div>
            </div>
            <CardDescription>Active organization attachments and CAD drawings.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y divide-border">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-md border border-border bg-secondary p-2 text-primary">
                      <FileText className="size-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-semibold text-foreground">{file.filename}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {file.size} &bull; Uploaded by {file.uploadedBy} &bull; {file.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {file.status === "clean" ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleSimulateDownload(file)}
                        className="font-mono text-xs"
                      >
                        <Download className="mr-1.5 size-3.5" />
                        Signed URL
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-red-400 border-red-500/30">
                        <ShieldAlert className="mr-1 size-3" />
                        Quarantined
                      </Badge>
                    )}
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
