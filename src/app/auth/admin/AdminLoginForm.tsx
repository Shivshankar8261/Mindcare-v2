"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import AuthBackdrop from "@/components/auth/AuthBackdrop";
import AuthBrandingHeader from "@/components/auth/AuthBrandingHeader";

const inputClass =
  "w-full rounded-xl border border-white/20 bg-white/60 px-3 py-2.5 text-foreground shadow-sm outline-none transition focus:border-teal/70 focus:ring-2 focus:ring-teal/25";

export default function AdminLoginForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialError = useMemo(() => {
    const code = params.get("error");
    if (code === "not_admin") return "This account is not an admin account.";
    return null;
  }, [params]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/admin",
      });
      if (!res?.ok) {
        setError("Invalid admin credentials.");
        return;
      }
      window.location.assign("/admin");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AuthBackdrop />
      <AuthBrandingHeader />

      <main className="relative z-10 px-4 pb-14 flex flex-col items-center">
        <div className="w-full max-w-md glass-card p-6 sm:p-8 shadow-[0_20px_50px_rgba(11,18,32,0.12)]">
          <div className="text-sm font-medium text-teal">Administration</div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-display tracking-tight text-foreground">
            Admin Login
          </h1>
          <p className="mt-2 text-muted">Sign in with an account that has the ADMIN role.</p>

          <form onSubmit={onSubmit} method="post" className="mt-6 space-y-4">
            <div className="space-y-1">
              <label htmlFor="admin-email" className="text-sm font-medium text-foreground">
                Admin email
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="admin-password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className={inputClass}
                required
              />
            </div>

            {error || initialError ? (
              <div
                className="rounded-xl border border-rose/40 bg-rose/10 px-3 py-2 text-sm text-rose"
                role="alert"
              >
                {error ?? initialError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-saffron px-4 py-3 font-semibold text-background shadow-saffronGlow disabled:opacity-60"
            >
              {busy ? "Signing in..." : "Enter Admin Panel"}
            </button>
          </form>

          <p className="mt-6 text-xs text-muted leading-relaxed">
            First admin? Set <code className="text-foreground/90">ADMIN_BOOTSTRAP_SECRET</code> in{" "}
            <code className="text-foreground/90">.env.local</code>, then{" "}
            <code className="text-foreground/90">POST /api/auth/bootstrap-admin</code> with header{" "}
            <code className="text-foreground/90">x-mindcare-admin-secret</code> and JSON{" "}
            <code className="text-foreground/90">{`{ "email", "password" }`}</code>.
          </p>

          <div className="mt-6 flex flex-wrap justify-between gap-3 text-sm">
            <Link href="/" className="font-semibold text-teal hover:underline underline-offset-4">
              ← Back to home
            </Link>
            <Link href="/auth/login" className="font-semibold text-muted hover:text-foreground">
              Student login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
