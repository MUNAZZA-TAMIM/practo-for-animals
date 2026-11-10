"use client";

import * as React from "react";
import {
  Check,
  Clipboard,
  Globe,
  Mail,
  MessageCircle,
  Phone,
  ShieldAlert,
} from "lucide-react";
import type { Provider } from "@/lib/data/providers";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

function CopyRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex items-start justify-between gap-4 border-b border-line py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="text-[9.5px] font-bold uppercase tracking-[0.13em] text-ink-muted/70">
          {label}
        </p>
        <p className="mt-1 break-words text-[12.5px] font-semibold text-forest-900">
          {href ? (
            <a href={href} className="underline-offset-4 hover:underline">
              {value}
            </a>
          ) : (
            value
          )}
        </p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="mt-0.5 inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-white-warm px-2.5 text-[10px] font-semibold text-forest-800 transition-colors hover:border-forest-900/30"
        aria-label={`Copy ${label.toLowerCase()}`}
      >
        {copied ? (
          <Check className="h-3 w-3" aria-hidden="true" />
        ) : (
          <Clipboard className="h-3 w-3" aria-hidden="true" />
        )}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export function SampleContactActions({ provider }: { provider: Provider }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full justify-between px-5">
          View contact details
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent
        title="Sample contact details"
        description="This profile is illustrative. Please do not treat these details as a real business."
      >
        <div className="flex items-start gap-3 rounded-xl border border-amber-ink/15 bg-amber-bg p-3.5">
          <ShieldAlert
            className="mt-0.5 h-4 w-4 shrink-0 text-amber-ink"
            aria-hidden="true"
          />
          <p className="text-[11.5px] leading-5 text-amber-ink">
            This is a demonstration listing created for an internship concept. No real clinic,
            verification, rating or partnership is represented.
          </p>
        </div>

        <div className="rounded-xl border border-line bg-white-warm px-4">
          <CopyRow label="Phone" value={provider.phone} />
          {provider.email ? <CopyRow label="Email" value={provider.email} /> : null}
          {provider.website ? (
            <CopyRow
              label="Website"
              value={provider.website.replace(/^https?:\/\//, "")}
            />
          ) : null}
          <CopyRow label="Area" value={`${provider.area}, ${provider.city}`} />
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-100 px-3 py-1.5 text-[10px] font-semibold text-forest-800">
            <Phone className="h-3 w-3" aria-hidden="true" />
            Call disabled in demo
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-100 px-3 py-1.5 text-[10px] font-semibold text-forest-800">
            <Mail className="h-3 w-3" aria-hidden="true" />
            Email disabled in demo
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-100 px-3 py-1.5 text-[10px] font-semibold text-forest-800">
            <Globe className="h-3 w-3" aria-hidden="true" />
            External links disabled
          </span>
        </div>

        <p className="text-[10.5px] leading-5 text-ink-muted">
          In a live directory, these actions would connect to the provider directly. For now, the
          copy action is the only functional contact control.
        </p>
      </DialogContent>
    </Dialog>
  );
}
