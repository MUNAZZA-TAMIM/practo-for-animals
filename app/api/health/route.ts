import { NextResponse } from "next/server";
import { getIntegrationStatus } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const integration = getIntegrationStatus();

  return NextResponse.json(
    {
      status: "ok",
      service: "practo-for-animals",
      version: "1.0.0-demo",
      checkedAt: new Date().toISOString(),
      environment: integration.environment,
      data: {
        mode: integration.dataMode,
        adapter: "local-json",
        durable: false,
      },
      integrations: {
        supabaseConfigured: integration.supabaseConfigured,
        supabaseAdapterActive: integration.supabaseAdapterActive,
        n8nContentConfigured: integration.n8nContentConfigured,
        n8nLeadConfigured: integration.n8nLeadConfigured,
        canvaConfigured: integration.canvaTemplateConfigured,
        emailConfigured: integration.emailConfigured,
      },
      note: "Integration flags report configuration presence only. This endpoint exposes no secret values.",
    },
    {
      status: 200,
      headers: {
        "cache-control": "no-store, max-age=0",
      },
    },
  );
}
