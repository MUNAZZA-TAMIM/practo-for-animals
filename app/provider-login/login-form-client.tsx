"use client";

import Link from "next/link";
import { ArrowLeft, Mail, LockKeyhole } from "lucide-react";
import { loginAction, type LoginState } from "@/app/login/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/forms/submit-button";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/auth/demo-accounts";
import { useActionState } from "react";
import * as React from "react";

export function ProviderLoginFormClient({
  demos,
  notice,
}: {
  demos: { name: string; email: string; password: string; role: UserRole }[];
  notice?: string;
}) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const [loginState, loginSubmit] = useActionState(loginAction, {
    status: "idle",
  } as LoginState);

  function useDemo(demo: { name: string; email: string; password: string; role: UserRole }) {
    setEmail(demo.email);
    setPassword(demo.password);
    window.setTimeout(() => passwordRef.current?.focus(), 30);
  }

  return (
    <div className="w-full max-w-md">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[12px] font-semibold text-ink-muted transition-colors hover:text-forest-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to the public site
      </Link>

      <div className="mt-7">
        <p className="kicker">Provider access</p>
        <h1 className="mt-4 text-[40px] leading-[0.98] tracking-[-0.045em] text-forest-900 sm:text-[48px]">
          Sign in to the{" "}
          <span className="display-italic text-coral-500">provider desk.</span>
        </h1>
        <p className="mt-4 text-[13.5px] leading-6 text-ink-muted">
          Sign in to manage your listing, review appointment requests, and
          update your services. No real user data is involved.
        </p>
      </div>

      {notice === "account-setup" ? (
        <div className="mt-6 rounded-xl border border-amber-ink/15 bg-amber-bg p-3.5">
          <p className="text-[12px] font-medium text-amber-ink">
            Your provider account is not yet linked to a listing. Contact an
            administrator to link your account.
          </p>
        </div>
      ) : null}

      {loginState.status === "error" ? (
        <div
          role="alert"
          className="mt-6 flex items-start gap-2.5 rounded-xl border border-danger-ink/20 bg-danger-bg p-3.5"
        >
          <span className="mt-0.5 h-4 w-4 shrink-0 text-danger-ink" aria-hidden="true">⚠</span>
          <p className="text-[12px] leading-5 text-danger-ink">
            {loginState.message}
          </p>
        </div>
      ) : null}

      <form action={loginSubmit} className="mt-7 space-y-4">
        <input type="hidden" name="next" value="/provider-dashboard" />
        <div className="space-y-2">
          <Label htmlFor="provider-login-email">Email address</Label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted/50"
              aria-hidden="true"
            />
            <Input
              id="provider-login-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="dr.mehta@clinic.example"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-3">
            <Label htmlFor="provider-login-password">Password</Label>
            <span className="text-[10.5px] font-medium text-ink-muted/70">
              Demo only
            </span>
          </div>
          <div className="relative">
            <LockKeyhole
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted/50"
              aria-hidden="true"
            />
            <Input
              ref={passwordRef}
              id="provider-login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter the demo password"
              className="pl-10 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-ink-muted transition-colors hover:bg-ivory-100 hover:text-forest-900"
            >
              {showPassword ? (
                <span className="h-4 w-4" aria-hidden="true">🙈</span>
              ) : (
                <span className="h-4 w-4" aria-hidden="true">👁️</span>
              )}
            </button>
          </div>
        </div>

        <SubmitButton className="mt-2 w-full justify-between" pendingLabel="Signing in…">
          Enter the workspace
        </SubmitButton>
      </form>

      <div className="mt-8 border-t border-line pt-6">
        <div className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full bg-coral-500 text-[8px] font-bold uppercase tracking-[0.16em] text-ivory-50">
            Demo
          </span>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-forest-700">
            Quick-fill a demo account
          </p>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {demos.map((demo) => (
            <button
              key={demo.email}
              type="button"
              onClick={() => useDemo(demo)}
              className="rounded-xl border p-3 text-left transition-colors border-line bg-ivory-50 hover:border-forest-900/25 hover:bg-white-warm"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11.5px] font-bold text-forest-900">
                  {demo.name}
                </span>
                <span className="rounded-full bg-forest-900 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-ivory-50">
                  Provider
                </span>
              </div>
              <span className="mt-1 block truncate text-[10px] text-ink-muted">
                {demo.email}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-[10px] leading-5 text-ink-muted/80">
          Quick-fill inserts the seeded credentials into this form. They are not
          stored in the database and the session expires after eight hours.
        </p>
      </div>

      <div className="mt-7 flex items-start gap-2.5 rounded-xl bg-ivory-100 p-3.5">
        <span className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" aria-hidden="true">🔒</span>
        <p className="text-[10.5px] leading-5 text-ink-muted">
          The session is an HttpOnly, SameSite=Lax signed cookie. Provider
          routes also re-check the session on the server.
        </p>
      </div>

      <p className="mt-6 text-center text-[11.5px] text-ink-muted">
        Just exploring?{" "}
        <Link href="/find" className="font-semibold text-forest-800 link-underline">
          Browse care without an account
        </Link>
      </p>
    </div>
  );
}
