import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Richard Diaz-Cool | Analytics Engineer",
  icons: {
    icon: "/favicon.svg",
  },
  description:
    "Analytics Engineer and full-stack developer with deep expertise in data engineering, machine learning, and modern web development. Specializing in Python, React, Apache Spark, and cloud architectures.",
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
