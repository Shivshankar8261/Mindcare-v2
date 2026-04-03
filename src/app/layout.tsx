import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppProviders from "@/components/providers/AppProviders";
import { mindcareRootBodyClassName } from "@/lib/mindcareFonts";

export const metadata: Metadata = {
  title: "MindCare — Vidyashilp University",
  description:
    "A student emotional wellness companion: check in with your mood, access supportive resources, and build healthier habits with privacy in mind.",
  icons: {
    icon: "/illustrations/mindcare-mascot.svg",
    apple: "/illustrations/mindcare-mascot.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7FAFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={mindcareRootBodyClassName} suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
