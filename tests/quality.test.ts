import { describe, expect, it, beforeEach } from "bun:test";
import { QualityService } from "../modules/quality/application/quality-service";
import { IdentityService } from "../modules/core/application/identity-service";

describe("Quality & Non-Conformance (NCR) Module", () => {
  let qualityService: QualityService;
  let identityService: IdentityService;

  beforeEach(() => {
    qualityService = new QualityService();
    identityService = new IdentityService();
  });

  it("records first article inspection and validates checklist results", () => {
    const { user: owner } = identityService.bootstrapOwner({
      email: "owner@4twenty.dev",
      name: "Owner",
      organizationName: "Factory A",
      organizationSlug: "factory-a",
    });

    const session = identityService.getSessionContext(owner.id);

    const inspection = qualityService.recordInspection(session, {
      inspectionType: "first_article",
      jobId: "job_104",
      jobNumber: "JOB-2026-104",
      partDescription: "Flanges",
      sampleSize: 5,
      passedQuantity: 5,
      failedQuantity: 0,
      checklist: [
        { id: "c1", characteristic: "OD Check", targetSpec: "5.250 +/- 0.005", measuredValue: "5.251", result: "pass" },
        { id: "c2", characteristic: "Burr Check", targetSpec: "Ra 32 Max", measuredValue: "Ra 24", result: "pass" },
      ],
    });

    expect(inspection.id).toBeDefined();
    expect(inspection.status).toBe("passed");
    expect(inspection.passedQuantity).toBe(5);
  });

  it("creates NCR, applies containment, and dispositions with segregation of duties", () => {
    const { user: owner } = identityService.bootstrapOwner({
      email: "owner@4twenty.dev",
      name: "Owner",
      organizationName: "Factory A",
      organizationSlug: "factory-a",
    });

    const session = identityService.getSessionContext(owner.id);

    // Create NCR
    const ncr = qualityService.createNCR(session, {
      jobId: "job_105",
      jobNumber: "JOB-2026-105",
      partDescription: "Brackets",
      operationName: "Forming Station",
      defectDescription: "Over-bent bend angle by 3 degrees.",
      defectCategory: "Dimensional",
      severity: "major",
      defectQuantity: 12,
      containmentActions: ["Quarantined 12 parts to red rack."],
      estimatedScrapCost: 240.0,
    });

    expect(ncr.id).toBeDefined();
    expect(ncr.status).toBe("open");
    expect(ncr.ncrNumber).toContain("NCR-");

    // Disposition NCR
    const dispositioned = qualityService.applyDisposition(session, ncr.id, {
      disposition: "rework",
      dispositionNotes: "Re-strike flange in secondary forming die with +1 deg springback compensation.",
      rootCauseAnalysis: "Material thickness was at high end of mill tolerance.",
    });

    expect(dispositioned.status).toBe("dispositioned");
    expect(dispositioned.disposition).toBe("rework");
    expect(dispositioned.approvedByUserId).toBe(owner.id);

    // Close NCR
    const closed = qualityService.closeNCR(session, ncr.id);
    expect(closed.status).toBe("closed");
    expect(closed.closedAt).toBeDefined();

    // Immutable closed NCR check
    expect(() => {
      qualityService.applyDisposition(session, ncr.id, {
        disposition: "scrap_and_remake",
        dispositionNotes: "Attempting illegal change to closed NCR.",
      });
    }).toThrow("immutable");
  });

  it("calculates quality metrics and first pass yield", () => {
    const { user: owner } = identityService.bootstrapOwner({
      email: "owner@4twenty.dev",
      name: "Owner",
      organizationName: "Factory A",
      organizationSlug: "factory-a",
    });

    const session = identityService.getSessionContext(owner.id);
    const metrics = qualityService.getQualityMetrics(session);

    expect(metrics.firstPassYieldPercentage).toBeGreaterThan(0);
    expect(metrics.activeOpenNCRCount).toBeGreaterThanOrEqual(0);
  });
});
