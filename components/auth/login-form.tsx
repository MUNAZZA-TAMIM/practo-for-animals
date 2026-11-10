"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { loginAction, type LoginState } from "@/app/login/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/forms/submit-button";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/auth/demo-accounts";

const initialState: LoginState = { status: "idle" };

export type DemoCredential = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export function LoginForm({
  demos,
  nextPath,
  notice,
}: {
  demos: DemoCredential[];
  nextPath: string;
  notice?: string;
}) {
  const [state, formAction] = useActionState(loginAction, initialState);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [filledRole, setFilledRole] = React.useState<string | null>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  function useDemo(demo: DemoCredential) {
    setEmail(demo.email);
    setPassword(demo.password);
    setFilledRole(demo.role);
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
        <p className="kicker">Workspace access</p>
        <h1 className="mt-4 text-[40px] leading-[0.98] tracking-[-0.045em] text-forest-900 sm:text-[48px]">
          Sign in to the{" "}
          <span className="display-italic text-coral-500">care desk.</span>
        </h1>
        <p className="mt-4 text-[13.5px] leading-6 text-ink-muted">
          This is a demonstration workspace. Two seeded accounts show the
          founder and administrator views. No real user data is involved.
        </p>
      </div>

      {notice === "signed-out" ? (
        <div className="mt-6 rounded-xl border border-forest-700/15 bg-mint-100 px-4 py-3 text-[12px] font-medium text-forest-800">
          You have been signed out. Your demo session cookie was cleared.
        </div>
      ) : null}

      {state.status === "error" ? (
        <div
          role="alert"
          className="mt-6 flex items-start gap-2.5 rounded-xl border border-danger-ink/20 bg-danger-bg p-3.5"
        >
          <TriangleAlert
            className="mt-0.5 h-4 w-4 shrink-0 text-danger-ink"
            aria-hidden="true"
          />
          <p className="text-[12px] leading-5 text-danger-ink">{state.message}</p>
        </div>
      ) : null}

      <form action={formAction} className="mt-7 space-y-4">
        <input type="hidden" name="next" value={nextPath} />
        <div className="space-y-2">
          <Label htmlFor="login-email">Email address</Label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted/50"
              aria-hidden="true"
            />
            <Input
              id="login-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-3">
            <Label htmlFor="login-password">Password</Label>
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
              id="login-password"
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
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
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
          <KeyRound className="h-3.5 w-3.5 text-coral-500" aria-hidden="true" />
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
              className={cn(
                "rounded-xl border p-3 text-left transition-colors",
                filledRole === demo.role
                  ? "border-forest-700 bg-mint-100"
                  : "border-line bg-ivory-50 hover:border-forest-900/25 hover:bg-white-warm",
              )}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-[11.5px] font-bold text-forest-900">
                  {demo.name}
                </span>
                <span className="rounded-full bg-forest-900 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-ivory-50">
                  {demo.role}
                </span>
              </span>
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
        <ShieldCheck
          className="mt-0.5 h-4 w-4 shrink-0 text-forest-600"
          aria-hidden="true"
        />
        <p className="text-[10.5px] leading-5 text-ink-muted">
          The session is an HttpOnly, SameSite=Lax signed cookie. Dashboard and
          admin routes also re-check the session on the server.
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
