import type { DefaultSession } from "next-auth";
import type { Role, WellnessLevel } from "@/generated/prisma/enums";

import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      department: string | null;
      year: number | null;
      preferredLanguage: string;
      streak: number;
      xpPoints: number;
      wellnessLevel: WellnessLevel;
      consentCounselor: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    department?: string | null;
    year?: number | null;
    preferredLanguage?: string;
    streak?: number;
    xpPoints?: number;
    wellnessLevel?: WellnessLevel;
    consentCounselor?: boolean;
  }
}

