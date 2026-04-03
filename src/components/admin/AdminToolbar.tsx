"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AdminToolbar({
  email,
}: {
  email: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      <div className="text-sm text-muted truncate" title={email}>
        Signed in as <span className="text-foreground font-medium">{email}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/dashboard"
          className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10"
        >
          Open student app
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10"
        >
          Home
        </Link>
        <button
          type="button"
          onClick={() =>
            void signOut({ callbackUrl: `${window.location.origin}/` })
          }
          className="rounded-xl border border-rose/35 bg-white/5 px-3 py-2 text-sm font-semibold text-rose hover:bg-white/10"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
