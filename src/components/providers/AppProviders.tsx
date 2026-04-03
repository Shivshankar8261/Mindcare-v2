"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

import MindcareI18nProvider from "@/components/providers/I18nProvider";

/**
 * Root providers: SessionProvider must wrap any route that calls `signIn` / `useSession`
 * from `next-auth/react` (admin login, dashboard shells, etc.).
 */
export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <MindcareI18nProvider>{children}</MindcareI18nProvider>
    </SessionProvider>
  );
}
