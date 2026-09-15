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
  title: "Tileboard — Today chores → stamp complete",
  description:
    "Fridge magnet chore board: see what's due today, slap the magnet to stamp complete. Optional AI room plan. Local-first.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Tileboard" },
};

export const viewport: Viewport = {
  themeColor: "#d63b2c",
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
