import type { Metadata, Viewport } from "next";
import { Newsreader, Source_Sans_3, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const source = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-source",
  display: "swap",
});
const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tileboard — What’s due today",
  description:
    "Cool letterpress checklist: see what’s due in this house today, press the check to complete. Optional AI room plan. Local-first.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Tileboard" },
};

export const viewport: Viewport = {
  themeColor: "#3d4f63",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${newsreader.variable} ${source.variable} ${plex.variable}`}>
        {children}
      </body>
    </html>
  );
}
