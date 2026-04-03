import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/enums";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(80).optional(),
});

/**
 * One-time / dev admin setup. Requires `ADMIN_BOOTSTRAP_SECRET` in env and the
 * `x-mindcare-admin-secret` header matching it. Does not enforce university email domain.
 */
export async function POST(req: Request) {
  const configured = (process.env.ADMIN_BOOTSTRAP_SECRET ?? "").trim();
  if (!configured) {
    return NextResponse.json(
      { error: "ADMIN_BOOTSTRAP_SECRET is not configured on the server." },
      { status: 503 }
    );
  }

  const headerSecret = req.headers.get("x-mindcare-admin-secret")?.trim() ?? "";
  if (headerSecret !== configured) {
    return NextResponse.json({ error: "Invalid or missing admin secret." }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const name = parsed.data.name ?? "MindCare Administrator";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        role: Role.ADMIN,
        passwordHash,
        name: existing.name ?? name,
      },
    });
    return NextResponse.json({
      ok: true,
      message: "Existing user updated to ADMIN. You can sign in at /auth/admin.",
    });
  }

  await prisma.user.create({
    data: {
      email,
      name,
      role: Role.ADMIN,
      preferredLanguage: "en",
      passwordHash,
    },
  });

  return NextResponse.json({
    ok: true,
    message: "Admin account created. Sign in at /auth/admin.",
  });
}
