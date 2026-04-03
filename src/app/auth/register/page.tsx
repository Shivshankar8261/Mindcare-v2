"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";

import AuthBackdrop from "@/components/auth/AuthBackdrop";
import AuthBrandingHeader from "@/components/auth/AuthBrandingHeader";

const goalOptions = [
  { id: "ANXIETY", label: "Anxiety & Stress Management" },
  { id: "SLEEP", label: "Sleep & Recovery" },
  { id: "FOCUS", label: "Focus & Productivity" },
  { id: "RESILIENCE", label: "Emotional Resilience" },
  { id: "SOCIAL", label: "Social Connection" },
] as const;

const languageOptions: Array<{ code: string; label: string }> = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "bn", label: "বাংলা" },
  { code: "te", label: "తెలుగు" },
  { code: "mr", label: "मराठी" },
  { code: "ta", label: "தமிழ்" },
  { code: "ur", label: "اردو" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "od", label: "ଓଡ଼ିଆ" },
  { code: "ml", label: "മലയാളം" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "as", label: "অসমীয়া" },
  { code: "mai", label: "मैथिली" },
  { code: "sa", label: "संस्कृत" },
  { code: "kok", label: "कोंकणी" },
  { code: "sd", label: "سنڌي" },
  { code: "doi", label: "डोगरी" },
  { code: "mni", label: "ꯃꯅꯤꯇꯩ" },
  { code: "brx", label: "बोडो" },
  { code: "sat", label: "ᱥᱟᱱᱛᱟᱡᱤ" },
  { code: "ks", label: "कश्मीरी" },
  { code: "ne", label: "नेपाली" },
];

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [department, setDepartment] = useState("");
  const [year, setYear] = useState<number>(1);
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const universityHint = useMemo(() => "@vidyashilp.edu.in", []);

  function toggleGoal(id: string) {
    setSelectedGoals((prev) => {
      if (prev.includes(id)) return prev.filter((g) => g !== id);
      if (prev.length >= 5) return prev; // hard cap
      return [...prev, id];
    });
  }

  async function onContinue(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setStep(2);
  }

  async function onRegister(e: FormEvent) {
    e.preventDefault();
    if (selectedGoals.length < 1) {
      setError("Select at least 1 wellness goal.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
          department,
          year,
          preferredLanguage,
          wellnessGoals: selectedGoals,
        }),
      });

      const json = (await res.json().catch(() => null)) as
        | { error?: string; ok?: boolean }
        | null;

      if (!res.ok || !json?.ok) {
        setError(json?.error ?? "Registration failed.");
        return;
      }

      const signin = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (!signin?.ok) {
        setError("Account created, but sign-in failed. Try again.");
        return;
      }

      window.location.href = "/dashboard";
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/20 bg-white/60 px-3 py-2.5 text-foreground shadow-sm outline-none transition focus:border-teal/70 focus:ring-2 focus:ring-teal/25";

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AuthBackdrop />
      <AuthBrandingHeader />

      <div className="relative z-10 px-4 pb-14 flex flex-col items-center">
        <div className="w-full max-w-lg glass-card p-6 sm:p-8 shadow-[0_20px_50px_rgba(11,18,32,0.12)]">
          <div className="flex justify-center mb-5">
            <div className="rounded-2xl border border-white/20 bg-white/40 p-3 shadow-sm">
              <Image
                src="/illustrations/journal-sticker.svg"
                alt=""
                width={88}
                height={88}
                aria-hidden
              />
            </div>
          </div>
          <div className="mb-6 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-display tracking-tight text-foreground">
              Student Registration
            </h1>
            <p className="mt-2 text-muted">
              Create your MindCare account using{" "}
              <span className="text-foreground font-medium">{universityHint}</span>
            </p>
          </div>

        {step === 1 ? (
          <form onSubmit={onContinue} method="post" className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                University Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                required
                minLength={8}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                required
                maxLength={80}
              />
            </div>

            {error ? (
              <div
                className="rounded-lg border border-rose/40 bg-rose/10 px-3 py-2 text-rose"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-xl bg-teal px-4 py-3 font-semibold text-background shadow-tealGlow"
            >
              Continue
            </button>
          </form>
        ) : (
          <form onSubmit={onRegister} method="post" className="space-y-5">
            <div className="space-y-1">
              <label htmlFor="department" className="text-sm font-medium text-foreground">
                Department
              </label>
              <input
                id="department"
                name="department"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="year" className="text-sm font-medium text-foreground">
                Year
              </label>
              <input
                id="year"
                name="year"
                type="number"
                min={1}
                max={10}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="preferredLanguage" className="text-sm font-medium text-foreground">
                Preferred Language
              </label>
              <select
                id="preferredLanguage"
                name="preferredLanguage"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className={inputClass}
              >
                {languageOptions.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted">Wellness Goals (pick up to 5)</div>
              <div className="grid grid-cols-1 gap-3">
                {goalOptions.map((g) => {
                  const checked = selectedGoals.includes(g.id);
                  return (
                    <label
                      key={g.id}
                      className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/45 px-3 py-2.5 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleGoal(g.id)}
                        aria-label={g.label}
                      />
                      <span>{g.label}</span>
                    </label>
                  );
                })}
              </div>
              <div className="text-xs text-muted">
                Selected: {selectedGoals.length}/5
              </div>
            </div>

            {error ? (
              <div
                className="rounded-lg border border-rose/40 bg-rose/10 px-3 py-2 text-rose"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            ) : null}

            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 rounded-xl border border-white/20 bg-white/50 px-4 py-3 font-semibold"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={busy}
                className="flex-1 rounded-xl bg-teal px-4 py-3 font-semibold text-background shadow-tealGlow disabled:opacity-60"
              >
                {busy ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>
        )}

          <p className="mt-8 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-teal hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

