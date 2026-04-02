import type { Metadata } from "next";
import { Outfit, JetBrains_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Austin Crinklaw",
  description:
    "Lead engineer bridging software development and bioinformatics in biotech R&D.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable} ${dmSans.variable}`}
    >
      <body className="bg-[#13151a] text-gray-300 antialiased">
        {children}
      </body>
    </html>
  );
}
