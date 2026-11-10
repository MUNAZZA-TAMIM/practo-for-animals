import "server-only";

import { isAuthSecretConfigured } from "@/lib/auth/token";

export type IntegrationStatus = {
  dataMode: "local-demo";
  dataLabel: string;
  dataDetail: string;
  supabaseConfigured: boolean;
  supabaseAdapterActive: boolean;
  n8nContentConfigured: boolean;
  n8nLeadConfigured: boolean;
  canvaTemplateConfigured: boolean;
  authMode: string;
  authSecretConfigured: boolean;
  emailConfigured: boolean;
  environment: string;
  siteUrl: string;
};

export function getIntegrationStatus(): IntegrationStatus {
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  const n8nContentConfigured = Boolean(process.env.N8N_CONTENT_WEBHOOK_URL);
  const n8nLeadConfigured = Boolean(process.env.N8N_LEAD_WEBHOOK_URL);

  return {
    dataMode: "local-demo",
    dataLabel: "Local JSON demo store",
    dataDetail:
      "Durable only on a persistent local/server filesystem. Vercel serverless storage is ephemeral; configure the Supabase adapter for production.",
    supabaseConfigured,
    supabaseAdapterActive: false,
    n8nContentConfigured,
    n8nLeadConfigured,
    canvaTemplateConfigured: Boolean(process.env.CANVA_TEMPLATE_URL),
    authMode: "Demo signed-cookie session",
    authSecretConfigured: isAuthSecretConfigured(),
    emailConfigured: false,
    environment: process.env.NODE_ENV ?? "development",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  };
}

export function hasN8nContent() {
  return Boolean(process.env.N8N_CONTENT_WEBHOOK_URL);
}

export function hasN8nLead() {
  return Boolean(process.env.N8N_LEAD_WEBHOOK_URL);
}

export function getN8nWebhookSecret() {
  return process.env.N8N_WEBHOOK_SECRET ?? "";
}
