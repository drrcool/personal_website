import type { Metadata } from "next";
import "../styles/globals.css";
import { Roboto } from "next/font/google";

import GoogleAnalytics from "@/components/analytics/google-analytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://richardcool.org"),
  title: "Richard Diaz-Cool | Analytics Engineer",
  description:
    "Analytics Engineer and full-stack developer with deep expertise in data engineering, machine learning, and modern web development. Specializing in Python, React, Apache Spark, and cloud architectures.",
  keywords: [
    "analytics engineer",
    "data engineering",
    "machine learning",
    "full-stack developer",
    "Python",
    "React",
    "Apache Spark",
    "data science",
    "web development",
  ],
  authors: [{ name: "Richard Diaz-Cool" }],
  creator: "Richard Diaz-Cool",
  publisher: "Richard Diaz-Cool",
  robots: "index, follow",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://richardcool.org",
    siteName: "Richard Diaz-Cool",
    title: "Richard Diaz-Cool | Analytics Engineer",
    description:
      "Analytics Engineer and full-stack developer with deep expertise in data engineering, machine learning, and modern web development.",
    images: [
      {
        url: "/images/profile/hero-portrait.jpg",
        width: 1200,
        height: 630,
        alt: "Richard Diaz-Cool - Analytics Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@dr_r_cool",
    creator: "@dr_r_cool",
    title: "Richard Diaz-Cool | Analytics Engineer",
    description:
      "Analytics Engineer and full-stack developer with deep expertise in data engineering, machine learning, and modern web development.",
    images: ["/images/profile/hero-portrait.jpg"],
  },
  alternates: {
    canonical: "https://richardcool.org",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#8b5cf6",
  colorScheme: "dark",
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head></head>
      <body
        className={`${roboto.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
