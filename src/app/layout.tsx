import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
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
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#8b5cf6",
  colorScheme: "dark",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                document.documentElement.className = 'dark';
                document.documentElement.style.colorScheme = 'dark';
                // Force dark mode CSS variables
                document.documentElement.style.setProperty('--background', 'oklch(0.2303 0.0125 264.2926)');
                document.documentElement.style.setProperty('--foreground', 'oklch(0.9219 0 0)');
                document.documentElement.style.setProperty('--card', 'oklch(0.321 0.0078 223.6661)');
                document.documentElement.style.setProperty('--card-foreground', 'oklch(0.9219 0 0)');
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
