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

/** Official wordmark: `public/mindcare-logo.png` (1024×559). */
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
        "inline-flex items-center shrink-0 rounded-xl bg-white px-2 py-1 shadow-sm ring-1 ring-black/10 transition hover:ring-black/20",
        isSm ? "py-1" : "py-1.5",
        className,
      ].join(" ")}
    >
      <Image
        src="/mindcare-logo.png"
        alt=""
        width={1024}
        height={559}
        className={
          isSm
            ? "h-8 w-auto sm:h-9"
            : "h-8 w-auto sm:h-10 md:h-11"
        }
        priority={!isSm}
      />
    </Link>
  );
}
