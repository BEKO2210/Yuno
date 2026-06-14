import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BottomNav } from "@/components/bottom-nav";
import { NowPlayingBar } from "@/components/now-playing-bar";
import { ScrollProgress } from "@/components/scroll-progress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yuno — Free Wallpapers, Ringtones & Notification Sounds",
  description:
    "Yuno is a free, open-source library of wallpapers, ringtones and notification sounds. Browse, preview and download — no strings attached.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://yuno-liard.vercel.app",
  ),
  openGraph: {
    title: "Yuno — Free Wallpapers, Ringtones & Notification Sounds",
    description:
      "A free, open-source library of wallpapers, ringtones and notification sounds.",
    siteName: "Yuno",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}

    >
      <body className="min-h-full flex flex-col bg-cinematic pb-[72px] md:pb-0">
        <ScrollProgress />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <NowPlayingBar />
        <BottomNav />
      </body>
    </html>
  );
}
