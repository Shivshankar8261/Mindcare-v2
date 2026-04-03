"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {
  href: string;
  /** Screen-reader label */
  "aria-label"?: string;
  /** Tailwind classes for the outer link */
  className?: string;
  /** `sm` = dashboard header, `lg` = marketing bar */
  variant?: "sm" | "lg";
};

/**
 * Uses Shipped `public/illustrations/mindcare-mascot.svg` so we never 404 on a missing PNG logo.
 */
export default function MindCareMark({
  href,
  "aria-label": ariaLabel = "MindCare — Vidyashilp University",
  className = "",
  variant = "lg",
}: Props) {
  const isSm = variant === "sm";
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={[
        "inline-flex items-center gap-2 shrink-0 rounded-xl bg-white shadow-sm ring-1 ring-black/10 transition hover:ring-black/20",
        isSm ? "px-2 py-1" : "px-2 py-1.5",
        className,
      ].join(" ")}
    >
      <Image
        src="/illustrations/mindcare-mascot.svg"
        alt=""
        width={160}
        height={160}
        className={
          isSm
            ? "h-8 w-8 sm:h-9 sm:w-9"
            : "h-8 w-8 sm:h-10 sm:w-10 md:h-11 md:w-11"
        }
        priority={!isSm}
      />
      <span
        className={
          isSm
            ? "font-display text-base sm:text-lg font-semibold tracking-tight text-foreground pr-1"
            : "font-display text-sm sm:text-lg md:text-xl font-semibold tracking-tight text-foreground pr-1 max-w-[140px] sm:max-w-none leading-tight"
        }
      >
        MindCare
      </span>
    </Link>
  );
}
