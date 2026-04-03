import { Suspense } from "react";

import AdminLoginForm from "./AdminLoginForm";

function AdminLoginFallback() {
  return (
    <main className="min-h-screen px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-md glass-card p-6 space-y-4" aria-busy="true">
        <div className="h-4 w-28 rounded bg-white/15 animate-pulse" />
        <div className="h-9 w-48 rounded bg-white/15 animate-pulse" />
        <div className="h-10 w-full rounded bg-white/10 animate-pulse" />
        <div className="h-10 w-full rounded bg-white/10 animate-pulse" />
        <div className="h-11 w-full rounded bg-saffron/30 animate-pulse" />
        <p className="text-sm text-muted pt-2">Loading admin sign-in…</p>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<AdminLoginFallback />}>
      <AdminLoginForm />
    </Suspense>
  );
}
