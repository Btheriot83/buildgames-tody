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
  title: "Tileboard — Today chores that feel done",
  description:
    "Household Today list with a physical complete stamp. Optional AI chore plan from a room description. Local-first.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Tileboard" },
};

export const viewport: Viewport = {
  themeColor: "#3d7a7a",
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
