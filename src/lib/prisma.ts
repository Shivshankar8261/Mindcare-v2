import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import { execSync } from "node:child_process";

declare global {
  // eslint-disable-next-line no-var
  var __mindcare_prisma__: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var __mindcare_prisma_url__: string | undefined;
  // eslint-disable-next-line no-var
  var __mindcare_prisma_sqlite_migrated__: boolean | undefined;
}

function resolveDatabaseUrl() {
  const isServerless =
    Boolean(process.env.VERCEL) ||
    Boolean(process.env.NETLIFY);

  // On serverless platforms we always use a writable sqlite DB under /tmp.
  // This avoids mismatches between whatever `DATABASE_URL` is set to (often Postgres)
  // and the fact that this prototype's Prisma schema is SQLite-based.
  if (isServerless) {
    return "/tmp/mindcare-dev.db";
  }

  const databaseUrlRaw = process.env.DATABASE_URL ?? "";
  const trimmed = databaseUrlRaw.trim();

  if (trimmed.length > 0) {
    // Our current Prisma schema is SQLite-based.
    // Ignore Postgres connection strings coming from placeholder `.env`.
    if (trimmed.startsWith("postgresql://") || trimmed.startsWith("postgres://")) {
      // Fall back to local sqlite.
    } else if (trimmed.startsWith("file:")) {
      return trimmed.slice("file:".length);
    } else {
      // Assume it's a valid filesystem path for sqlite.
      return trimmed;
    }
  }

  // Serverless fallback:
  // - Vercel / Netlify serverless runs with a read-only bundle filesystem
  // - so file-based sqlite must live under /tmp to be writable
  // - if DATABASE_URL isn't set, we bootstrap sqlite + migrations automatically.
  return path.join(process.cwd(), "dev.db");
}

const databaseUrl = resolveDatabaseUrl();

// Ensure prisma has a sqlite URL in env when we are using the sqlite fallback.
// Prisma CLI + migrate deploy use this value.
if (
  (Boolean(process.env.VERCEL) || Boolean(process.env.NETLIFY)) ||
  (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim().length === 0)
) {
  process.env.DATABASE_URL = `file:${databaseUrl}`;
}

function ensureSqliteMigratedOnce() {
  // Only mutate DB in serverless.
  if (!process.env.VERCEL && !process.env.NETLIFY) return;
  if (globalThis.__mindcare_prisma_sqlite_migrated__) return;

  let migrated = false;
  try {
    if (!fs.existsSync(path.dirname(databaseUrl))) {
      fs.mkdirSync(path.dirname(databaseUrl), { recursive: true });
    }

    // Use the local prisma binary to avoid `npx` issues in restricted environments.
    execSync("node_modules/.bin/prisma migrate deploy", {
      stdio: "ignore",
      env: { ...process.env, DATABASE_URL: `file:${databaseUrl}` },
    });

    migrated = true;
  } catch (err) {
    // Leave the flag unset so next cold/warm start retries migrations.
    // eslint-disable-next-line no-console
    console.error("Prisma migrate deploy failed:", err);
  } finally {
    if (migrated) globalThis.__mindcare_prisma_sqlite_migrated__ = true;
  }
}

ensureSqliteMigratedOnce();

const needsNewClient =
  !globalThis.__mindcare_prisma__ ||
  globalThis.__mindcare_prisma_url__ !== databaseUrl;

const prismaClient = needsNewClient
  ? new PrismaClient({
      adapter: new PrismaBetterSqlite3({ url: databaseUrl }),
    })
  : globalThis.__mindcare_prisma__;

if (!prismaClient) {
  // Should never happen, but keeps TypeScript happy in build mode.
  throw new Error("Prisma client initialization failed");
}

export const prisma = prismaClient;

if (process.env.NODE_ENV !== "production") {
  globalThis.__mindcare_prisma__ = prisma;
  globalThis.__mindcare_prisma_url__ = databaseUrl;
}

