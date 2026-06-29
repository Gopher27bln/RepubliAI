import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepubliAI – Content Repurposing Engine",
  description:
    "KI-gestütztes System zur automatischen Aufbereitung von Inhalten für alle Kanäle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-slate-50 antialiased">{children}</body>
    </html>
  );
}
