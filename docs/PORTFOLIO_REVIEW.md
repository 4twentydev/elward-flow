# Portfolio Publication Review & Engineering Handoff

**Reviewer**: Brandon York (Principal Product Engineer)  
**Review Date**: 2026-08-25  
**Review Status**: **APPROVED FOR PRODUCTION & PUBLICATION**  
**Commercial Platform**: Yorkstead Operations (`https://ops.yorkstead.com`)  
**Public Website**: Yorkstead Systems (`https://yorkstead.com`)  

---

## 1. Artifact & Demo Classification Matrix

| Artifact / Experience | Classification | Synthetic Data Labeling | Sandbox Isolation | Visual System Adherence |
| :--- | :--- | :--- | :--- | :--- |
| **Front Range Precision Manufacturing** | Interactive Synthetic Demo | Yes (\`DEMO MODE // SYNTHETIC DATA\`) | \`org_front_range_mfg\` | 100% compliant |
| **Summit Facility Services** | Interactive Synthetic Demo | Yes (\`DEMO MODE // SYNTHETIC DATA\`) | \`org_summit_facility\` | 100% compliant |
| **Mile High Signworks** | Interactive Synthetic Demo | Yes (\`DEMO MODE // SYNTHETIC DATA\`) | \`org_mile_high_signworks\` | 100% compliant |
| **Peak Mobile Detail** | Interactive Synthetic Demo | Yes (\`DEMO MODE // SYNTHETIC DATA\`) | \`org_peak_mobile_detail\` | 100% compliant |
| **Workflow Audit Sales Deliverable** | Commercial Sales Tool | Yes (Evidence Fact Taxonomy) | Organization-scoped | 100% compliant |
| **Build Your System Tool** | Interactive Configurator | Yes (Non-binding discussion brief) | Public (Zero PII required) | 100% compliant |
| **Implementation Library** | Internal Playbook / Templates | Yes (Sanitized & org-neutral) | Template repository | 100% compliant |
| **Public Demos Experience** | Public Showcase (\`/demos\`) | Yes (Live status check API) | Static fallback enabled | 100% compliant |

---

## 2. Evidence & Contract Compliance Checklist

- [x] **No Unreviewed Client Data**: All names, work orders, CAD drawings, telemetry metrics, and financial records use 100% synthetic fixtures generated from deterministic seed data.
- [x] **Clear Separation Between Repositories**:
  - `yorkstead-website`: Public corporate showcase, portfolio narratives, static build on Netlify.
  - `yorkstead-operations`: Multi-tenant operations application, live database, file vault, demo sandboxes on Netlify.
- [x] **Zero Speculative ROI**: Financial quoting operates exclusively in integer cents with transparent margin formulas; no invented dollar savings claims.
- [x] **Screen-Share Safety**: Guided demo mode provides an instant **Audience View** toggle to hide internal talk tracks during live prospect calls.
- [x] **WCAG 2.2 AA Conformance**: Audited high-contrast focus rings, screen reader landmarks, and 44px minimum touch targets across all routes.
- [x] **Global Visual Identity**: *No existing global visual identity was changed.* The authoritative Yorkstead visual system is strictly preserved.

---

## 3. Owner & Administrator Handoff Guide

### 3.1 Daily Operations & Monitoring
- **Deployment Platform**: Netlify Edge (`yorkstead-operations` and `yorkstead-website`).
- **Database Engine**: Neon Serverless Postgres with continuous WAL archiving.
- **Service Health Check**: `GET https://ops.yorkstead.com/api/health/readiness` (returns subsystem checks and uptime).
- **Public Demo Health**: `GET https://ops.yorkstead.com/api/public/demo-health` (unauthenticated manifest for public website deep-linking).

### 3.2 Environment Variables Configuration
| Variable Name | Description | Default Environment Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `NEXT_PUBLIC_APP_URL` | Base application URL | `https://ops.yorkstead.com` |
| `NEXT_PUBLIC_PUBLIC_SITE_URL` | Public company website URL | `https://yorkstead.com` |
| `DEMO_PRESENTER_KEY` | Presenter mode unlock passcode | `yorkstead-presenter-2026` |

---

## 4. Prioritized Next-Release Roadmap (Milestone 2)

1. **CAM Automated Nesting Bridge**: Ingest DXF cut files directly into laser CAM nesting engines with remnant sheet tracking.
2. **Field Mobile Technician Offline Sync**: Service worker caching and background sync for facility technicians in basement mechanical rooms.
3. **Advanced Machine Modbus Telemetry Adapter**: Real-time OPC-UA / Modbus TCP bridge for automated spindle vibration and cycle count logging.
4. **QuickBooks Online Direct Accounting Sync**: Two-way sync of purchase order receipts and completed job customer invoices.
