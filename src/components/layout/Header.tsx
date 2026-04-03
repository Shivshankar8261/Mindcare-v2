import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import MindCareMark from "@/components/brand/MindCareMark";
import LanguageSwitcher from "./LanguageSwitcher";
import AuthButtons from "./AuthButtons";

export default async function Header() {
  const session = await getServerSession(authOptions);
  const preferredLanguage =
    session?.user?.preferredLanguage ?? "en";

  return (
    <header className="w-full">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <MindCareMark
          href="/dashboard"
          variant="sm"
          aria-label="MindCare — dashboard home"
        />

        <div className="flex items-center gap-4">
          <LanguageSwitcher currentLanguage={preferredLanguage} />
          <AuthButtons isAuthenticated={Boolean(session)} />
        </div>
      </div>
    </header>
  );
}

