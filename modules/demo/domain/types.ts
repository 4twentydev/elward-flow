export type PortfolioCategory = "client_work" | "product" | "lab" | "demo";

export interface PortfolioItem {
  id: string;
  category: PortfolioCategory;
  title: string;
  slug: string;
  headline: string;
  problemStatement: string;
  workflowBottleneck: string;
  solutionSummary: string;
  measuredImpact: string[];
  demoOrganizationSlug?: string;
  tags: string[];
  isPublished: boolean;
}

export interface DemoGuardrailPolicy {
  interceptExternalEmails: boolean;
  interceptPaymentGateways: boolean;
  interceptExternalWebhooks: boolean;
  enforceSyntheticDataOnly: boolean;
  requireVisualWatermark: boolean;
  allowSelfServiceReset: boolean;
}

export interface DemoOrganizationContext {
  id: string;
  name: string;
  slug: string;
  industry: string;
  isDemo: true;
  guardrails: DemoGuardrailPolicy;
  seededAt: string;
  version: string;
}
