import React from "react";
import type { Metadata, Viewport } from "next";
import {
  plusJakarta,
  ibmPlexArabic,
  amiri,
  bodyFont,
  displayFont,
  arabicFont,
} from "@/lib/fonts";
import "./globals.css";
import "../styles/animations.css";
import "../styles/islamic-patterns.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://tajwedo.com"),
  applicationName: "Tajwedo Institute",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
  other: {
    "color-scheme": "light only",
  },
  manifest: "/Tajwedo-Public-Assets/favicon-for-app/manifest.json",
  icons: {
    icon: [
      { url: "/Tajwedo-Public-Assets/favicon-for-app/favicon.ico", sizes: "any" },
      { url: "/Tajwedo-Public-Assets/favicon-for-app/icon1.png", type: "image/png" },
      { url: "/Tajwedo-Public-Assets/favicon-for-app/icon0.svg", type: "image/svg+xml" },
    ],
    shortcut: [{ url: "/Tajwedo-Public-Assets/favicon-for-app/favicon.ico" }],
    apple: [
      {
        url: "/Tajwedo-Public-Assets/favicon-for-app/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Tajwedo Institute",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#0D4F4F",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      style={{ colorScheme: "light only" }}
      className={cn(
        plusJakarta.variable,
        ibmPlexArabic.variable,
        amiri.variable,
        bodyFont.variable,
        displayFont.variable,
        arabicFont.variable,
        geist.variable,
        "font-sans"
      )}
    >
      <head>
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light" />
        {/* Synchronous GTM DataLayer Initialization */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
              });
            `,
          }}
        />
        <script
          async
          src="https://www.googletagmanager.com/gtm.js?id=GTM-P5JSLSHS"
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-white text-gray-900"
        style={{
          fontFamily: "var(--font-body, var(--font-sans))",
          colorScheme: "light only",
          backgroundColor: "#ffffff",
        }}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P5JSLSHS"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}