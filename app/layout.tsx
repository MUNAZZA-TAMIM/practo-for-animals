import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const frauncesItalic = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces-italic",
  display: "swap",
  style: "italic",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Practo for Animals — better care starts with a clearer path",
    template: "%s · Practo for Animals",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "animal care",
    "veterinary directory",
    "pet care",
    "AI education",
    "veterinary AI",
    "content studio",
    "animal health",
  ],
  authors: [{ name: "Practo for Animals concept" }],
  creator: "Practo for Animals concept",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Practo for Animals — better care starts with a clearer path",
    description: siteConfig.description,
    images: [
      {
        url: "/images/hero-dog.jpg",
        width: 1200,
        height: 1600,
        alt: "Golden retriever holding a yellow tulip",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Practo for Animals",
    description: siteConfig.description,
    images: ["/images/hero-dog.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "animal care",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FCF8EF",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body
        className={`${fraunces.variable} ${frauncesItalic.variable} ${manrope.variable} min-h-dvh antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
