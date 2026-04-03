"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";

import AuthBackdrop from "@/components/auth/AuthBackdrop";
import AuthBrandingHeader from "@/components/auth/AuthBrandingHeader";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const universityHint = useMemo(() => "@vidyashilp.edu.in", []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });
      if (!res?.ok) {
        setError("Invalid email or password.");
        return;
      }
      window.location.assign("/dashboard");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AuthBackdrop />
      <AuthBrandingHeader />

      <div className="relative z-10 px-4 pb-14 flex flex-col items-center">
        <div className="w-full max-w-md glass-card p-6 sm:p-8 shadow-[0_20px_50px_rgba(11,18,32,0.12)]">
          <div className="flex justify-center mb-5">
            <div className="rounded-2xl border border-white/20 bg-white/40 p-3 shadow-sm">
              <Image
                src="/illustrations/mindcare-mascot.svg"
                alt=""
                width={88}
                height={88}
                aria-hidden
              />
            </div>
          </div>

          <div className="mb-6 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-display tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="mt-2 text-muted">
              Sign in with your university email <span className="text-foreground font-medium">{universityHint}</span>
            </p>
          </div>
          {/* method="post" prevents credentials appearing in the URL if JS fails to hydrate */}
          <form onSubmit={onSubmit} method="post" className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/60 px-3 py-2.5 text-foreground shadow-sm outline-none transition focus:border-teal/70 focus:ring-2 focus:ring-teal/25"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/60 px-3 py-2.5 text-foreground shadow-sm outline-none transition focus:border-teal/70 focus:ring-2 focus:ring-teal/25"
                required
              />
            </div>

            {error ? (
              <div
                className="rounded-xl border border-rose/40 bg-rose/10 px-3 py-2 text-sm text-rose"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-teal px-4 py-3 font-semibold text-background shadow-tealGlow transition hover:opacity-95 disabled:opacity-60"
            >
              {busy ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-5">
            <button
              type="button"
              onClick={() => void signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full rounded-xl border border-white/20 bg-white/50 px-4 py-3 font-semibold text-foreground shadow-sm transition hover:bg-white/70"
            >
              Continue with Google
            </button>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
            <Link
              href="/auth/register"
              className="text-center sm:text-left font-semibold text-teal hover:underline underline-offset-4"
            >
              Create an account
            </Link>
            <Link
              href="/resources/crisis"
              className="text-center sm:text-right font-semibold text-rose hover:underline underline-offset-4"
            >
              Crisis Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
