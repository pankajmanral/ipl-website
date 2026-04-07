import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

import { AD_CONFIG } from "@/config/ads";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "IPL 2026 Prediction AI | Advanced Cricket Analytics Dashboard",
  description: "Stay ahead of the game with our next-gen IPL 2026 AI prediction model. Real-time match insights, player form analysis, and winning probabilities.",
  keywords: "IPL 2026, Cricket Predictions, AI Match Winner, IPL Analytics, Cricket Stats",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CONFIG.publisherId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
