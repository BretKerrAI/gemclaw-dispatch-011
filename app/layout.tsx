import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0B0B0D",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://dispatch-011.gemclaw.click"),
  title: "The library that contains every book · Dispatch 011 · GemClaw",
  description:
    "A Borgesian Choose Your Own Adventure generator. Five questions in, an infinite library out.",
  openGraph: {
    type: "website",
    siteName: "GemClaw · Dispatch",
    title: "The library that contains every book · Dispatch 011",
    description: "Five questions in, an infinite library out.",
    url: "https://dispatch-011.gemclaw.click/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "The library that contains every book · Dispatch 011",
    description: "A Borgesian Choose Your Own Adventure generator.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
