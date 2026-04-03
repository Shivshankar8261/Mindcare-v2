import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import AdminToolbar from "@/components/admin/AdminToolbar";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/enums";

export const dynamic = "force-dynamic";

function AdminDataError({ message }: { message: string }) {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="glass-card p-6 border-rose/30">
        <div className="text-sm text-muted">Administration</div>
        <h1 className="mt-2 text-2xl font-display tracking-tight">Database unavailable</h1>
        <p className="mt-2 text-muted whitespace-pre-wrap">{message}</p>
        <p className="mt-4 text-sm text-muted">
          Restart the dev server from the <code className="text-foreground">mindcare</code> folder
          after ensuring <code className="text-foreground">DATABASE_URL</code> is set, or run{" "}
          <code className="text-foreground">npx prisma migrate dev</code> locally.
        </p>
      </div>
    </main>
  );
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/auth/admin");
  if (session.user.role !== Role.ADMIN) redirect("/auth/admin?error=not_admin");

  let users: number;
  let moods: number;
  let journals: number;
  let chats: number;
  let appointments: number;
  type RecentUserRow = {
    id: string;
    email: string;
    name: string | null;
    role: Role;
    department: string | null;
    createdAt: Date;
    preferredLanguage: string;
  };
  let recentUsers: RecentUserRow[];

  try {
    [users, moods, journals, chats, appointments, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.moodEntry.count(),
      prisma.journalEntry.count(),
      prisma.chatSession.count(),
      prisma.appointment.count(),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          department: true,
          createdAt: true,
          preferredLanguage: true,
        },
      }),
    ]);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error loading admin data.";
    return <AdminDataError message={message} />;
  }

  const cards = [
    { label: "Total users", value: users },
    { label: "Mood entries", value: moods },
    { label: "Journal entries", value: journals },
    { label: "Chat sessions", value: chats },
    { label: "Appointments", value: appointments },
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <section className="glass-card p-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-sm text-muted">Administration</div>
          <h1 className="mt-1 text-3xl font-display tracking-tight">MindCare Admin Panel</h1>
          <p className="mt-2 text-muted max-w-xl">
            University-level usage overview, recent accounts, and quick links. Create the first
            admin with <code className="text-foreground/90 text-sm">POST /api/auth/bootstrap-admin</code>{" "}
            when <code className="text-foreground/90 text-sm">ADMIN_BOOTSTRAP_SECRET</code> is set.
          </p>
        </div>
        <AdminToolbar email={session.user.email} />
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="glass-card p-5">
            <div className="text-sm text-muted">{c.label}</div>
            <div className="mt-2 text-3xl font-display tabular-nums">{c.value}</div>
          </div>
        ))}
      </section>

      <section className="glass-card p-5 overflow-x-auto">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-display tracking-tight">Recent users</h2>
          <span className="text-sm text-muted">Newest 20</span>
        </div>
        {recentUsers.length === 0 ? (
          <p className="text-sm text-muted py-6">
            No users yet. Students can register from the landing page, or bootstrap an admin account
            to get started.
          </p>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-muted">
                <th className="py-2 pr-3 font-medium">Email</th>
                <th className="py-2 pr-3 font-medium">Name</th>
                <th className="py-2 pr-3 font-medium">Role</th>
                <th className="py-2 pr-3 font-medium hidden md:table-cell">Dept.</th>
                <th className="py-2 pr-3 font-medium hidden sm:table-cell">Lang</th>
                <th className="py-2 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="py-2 pr-3 font-medium text-foreground break-all">{u.email}</td>
                  <td className="py-2 pr-3 text-muted">{u.name ?? "—"}</td>
                  <td className="py-2 pr-3">
                    <span
                      className={
                        u.role === Role.ADMIN
                          ? "rounded-full bg-saffron/20 text-saffron px-2 py-0.5 text-xs font-semibold"
                          : "rounded-full bg-white/10 px-2 py-0.5 text-xs"
                      }
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2 pr-3 text-muted hidden md:table-cell">
                    {u.department ?? "—"}
                  </td>
                  <td className="py-2 pr-3 text-muted hidden sm:table-cell">
                    {u.preferredLanguage}
                  </td>
                  <td className="py-2 text-muted whitespace-nowrap">
                    {u.createdAt.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
