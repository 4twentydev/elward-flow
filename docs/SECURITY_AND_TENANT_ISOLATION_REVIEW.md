# Security & Tenant Isolation Threat Model and Verification

## 1. Executive Summary

This document establishes the verified security architecture and tenant boundary threat model for **Yorkstead Operations** (`https://ops.yorkstead.com`). In adherence to `AGENTS.md` and `docs/ARCHITECTURE.md`, multi-tenant isolation, server-side authorization, tamper-evident audit logging, and least-privilege security controls are enforced throughout every layer of the software stack.

---

## 2. Comprehensive Threat Modeling Matrix

| Threat Vector | Attack Mechanism | Mitigating Architecture & Policy | Verification Status |
| :--- | :--- | :--- | :--- |
| **Insecure Direct Object Reference (IDOR)** | Attacker alters resource ID in API request to access another tenant's record | Every database query carries a mandatory server-side \`organizationId\` clause. Cross-tenant queries return \`404 Not Found\` or \`403 Forbidden\`. | **Verified in automated tests** |
| **Unauthorized Privilege Escalation** | Client modifies role payload to claim administrative access | Roles and permissions are evaluated exclusively server-side. Role changes require administrative session approval and generate audit events. | **Verified in identity suite** |
| **CSV / Formula Injection** | Malicious CSV cells containing \`=cmd\|\`, \`+calc\`, or \`@SUM\` execute on estimator spreadsheets | All imported and exported tabular cells strip or escape leading formula symbols (\`=\`, \`+\`, \`-\`, \`@\`). | **Verified in import sanitizer test** |
| **Path Traversal & Unsafe Files** | Attacker crafts \`../../etc/passwd\` file keys to escape private storage root | File storage adapter enforces strict alphanumeric UUID keys and validates path containment before resolving URLs. | **Verified in file storage suite** |
| **Replay & Idempotency Abuse** | Duplicate network POST requests cause duplicate stock deductions or double billing | Critical financial and inventory endpoints require client \`Idempotency-Key\` headers and deduplicate identical transactions. | **Verified in ledger suite** |
| **Demo Sandbox Contamination** | Demo operations leak synthetic records into live production customer accounts | Demo organizations operate under distinct synthetic \`org_demo_*\` namespaces isolated from production schemas. | **Verified in demo framework** |
| **AI / Retrieval Injection** | Adversarial prompt injected into SOP documents alters AI knowledge answers | Procedure embeddings are filtered by strict \`organizationId\` before semantic search. LLM outputs require cited passage references. | **Verified in KnowHow suite** |
| **Secret & Credential Leakage** | Database passwords or API tokens accidentally logged in error traces | Audit loggers and exception handlers automatically scrub sensitive keys (\`password\`, \`token\`, \`secret\`, \`authorization\`). | **Verified in audit suite** |

---

## 3. Server-Side Tenant Isolation Standard

All database models and service methods follow this mandatory implementation contract:

\`\`\`typescript
// Mandatory Tenant Scoping Rule:
export async function getTenantJob(organizationId: string, jobId: string) {
  const job = await db.jobs.findFirst({
    where: {
      id: jobId,
      organizationId: organizationId, // Server-enforced boundary
    },
  });

  if (!job) {
    throw new NotFoundError("Job record not found in organization context.");
  }
  return job;
}
\`\`\`

---

## 4. Input Sanitization & Data Integrity

1. **Integer-Cents Financial Math**: All currency fields are stored and computed as integer cents (e.g. \`$45.00\` is \`4500\`), completely eliminating floating-point rounding attacks and drift.
2. **Schema Validation**: All HTTP payloads are validated against strict Zod / TypeScript schemas at the trust boundary; extra unrecognized properties are stripped.
3. **No Unsanitized Customer Data in CI**: Automated tests use 100% synthetic fixtures generated from deterministic seed generators.

---

## 5. Security Audit Sign-off

- **Lead Security Architect**: Brandon York
- **Verification Date**: 2026-08-25
- **Status**: **PASS (Zero High-Risk or Unmitigated Vulnerabilities)**
