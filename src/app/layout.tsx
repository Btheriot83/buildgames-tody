import type { Metadata, Viewport } from "next";
import { Fraunces, Source_Sans_3, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
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
  title: "Tileboard — household chore board",
  description:
    "Personal Tody replacement: flexible chore frequency, shared history, local-first PWA.",
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
      <body className={`${fraunces.variable} ${source.variable} ${plex.variable}`}>
        {children}
      </body>
    </html>
  );
}
