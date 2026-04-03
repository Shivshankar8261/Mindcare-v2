import MindCareMark from "@/components/brand/MindCareMark";

export default function AuthBrandingHeader() {
  return (
    <header className="relative z-10 mx-auto max-w-lg px-4 pt-6 pb-2">
      <MindCareMark href="/" variant="lg" aria-label="MindCare — home" />
    </header>
  );
}
