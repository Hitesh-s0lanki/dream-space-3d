import type { Metadata } from "next";
import { Fraunces, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
// Lenis ships the `height: auto` / scroll-lock / `data-lenis-prevent` rules its
// runtime assumes are present. Smooth scrolling misbehaves without it.
import "lenis/dist/lenis.css";
import { SmoothScroll } from "@/components/providers/smooth-scroll";

// Body & UI — a crisp, neutral humanist sans.
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Headings — a warm, editorial old-style serif with optical sizing.
const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://rumiva.in";
const SITE_TITLE = "Rumiva — Interior Design + Immersive 3D";
const SITE_DESCRIPTION =
  "Rumiva brings spaces to life before they are built. See the space. Explore the possibilities. Design your version.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Rumiva",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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
      className={`${inter.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
