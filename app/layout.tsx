import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Austin Crinklaw",
  description:
    "Lead R&D systems engineer building lab data systems, AI discovery tools and pipelines for drug discovery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plex.variable}>
      <body className="bg-bench text-ink antialiased">{children}</body>
    </html>
  );
}
